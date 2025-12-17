
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Initialize Supabase with Service Role Key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase URL or Service Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedData() {
    console.log("🚀 Starting Data Seed Process...");

    // Paths to Excel Files
    const crmPath = path.resolve(__dirname, '../../ANTIGRAVITY_ORKESTA-20251217T151055Z-3-001/ANTIGRAVITY_ORKESTA/CRM_2026/CRM_2026_Dashboard.xlsx');
    const invoicesPath = path.resolve(__dirname, '../../ANTIGRAVITY_ORKESTA-20251217T151055Z-3-001/ANTIGRAVITY_ORKESTA/FACTURACIÓN_2026/Copia de Facturas_Orkesta.xlsx');

    // --- 1. Process CRM (Clients, Leads, Deals) ---
    if (fs.existsSync(crmPath)) {
        console.log("📄 Reading CRM File...");
        const workbook = XLSX.readFile(crmPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        console.log(`   Found ${rawData.length} rows in CRM.`);

        for (const row of rawData) {
            // Extract Company Name (Client)
            const companyName = row['Empresa'] || row['Company'] || 'Unknown Client';

            // Select or Create Client
            let client;
            const { data: existingClient } = await supabase
                .from('clients')
                .select('id, name')
                .eq('name', companyName)
                .single();

            if (existingClient) {
                client = existingClient;
            } else {
                const { data: newClient, error: createError } = await supabase
                    .from('clients')
                    .insert({ name: companyName, employees_range: row['Empleados'] })
                    .select()
                    .single();

                if (createError) {
                    console.error(`   ❌ Error creating client ${companyName}:`, createError.message);
                    continue;
                }
                client = newClient;
            }

            // Proceed to Leads

            // Upsert Lead/Contact
            if (row['Email']) {
                const { error: leadError } = await supabase
                    .from('leads')
                    .upsert({
                        email: row['Email'],
                        contact_name: row['Name'] || row['Nombre'],
                        client_id: client.id,
                        qualification: row['Cualificación'],
                        status: row['Estado'],
                        source_date: parseDate(row['Date'])
                    }, { onConflict: 'email' });

                if (leadError) console.error(`   ❌ Error upserting lead ${row['Email']}:`, leadError.message);
            }

            // Upsert Deal (Project)
            if (row['Proyecto']) {
                const { error: dealError } = await supabase
                    .from('deals')
                    .upsert({
                        name: row['Proyecto'],
                        client_id: client.id,
                        status: mapDealStatus(row['Estado']), // Map 'Lead' status to Deal stage if needed
                        // value: Try to parse if there's a value column?? No explicit value col in headers shown earlier, check row['Estimado'] if exists
                    });

                if (dealError) console.error(`   ❌ Error upserting deal ${row['Proyecto']}:`, dealError.message);
            }
        }
        console.log("✅ CRM Data Processed.");
    } else {
        console.warn("⚠️ CRM File not found at:", crmPath);
    }

    // --- 2. Process Invoices ---
    if (fs.existsSync(invoicesPath)) {
        console.log("📄 Reading Invoices File...");
        const workbook = XLSX.readFile(invoicesPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        console.log(`   Found ${rawData.length} rows in Invoices.`);

        for (const row of rawData) {
            const invoiceNum = row['Número de factura'] || row['Invoice Number'];
            if (!invoiceNum) continue;

            // Try to find client by name
            let clientId = null;
            const clientName = row['Cliente'] || row['Empresa'];

            if (clientName) {
                const { data: client } = await supabase.from('clients').select('id').eq('name', clientName).single();
                if (client) clientId = client.id;
                else {
                    // Create client if not exists from invoice
                    const { data: newClient } = await supabase.from('clients').insert({ name: clientName }).select().single();
                    if (newClient) clientId = newClient.id;
                }
            }

            const { error: invError } = await supabase
                .from('invoices')
                .upsert({
                    invoice_number: invoiceNum,
                    client_id: clientId,
                    issue_date: parseDate(row['Fecha']),
                    description: row['Descripción'],
                    amount: typeof row['Importe'] === 'number' ? row['Importe'] : 0,
                    vat: typeof row['Iva'] === 'number' ? row['Iva'] : 0,
                    total: typeof row['Total'] === 'number' ? row['Total'] : 0,
                    status: row['Pagada'] === 'SI' || row['Pagada'] === true ? 'Paid' : 'Sent',
                    pdf_url: row['URL']
                }, { onConflict: 'invoice_number' });

            if (invError) console.error(`   ❌ Error upserting invoice ${invoiceNum}:`, invError.message);
        }
        console.log("✅ Invoices Data Processed.");
    } else {
        console.warn("⚠️ Invoices File not found at:", invoicesPath);
    }

    console.log("🎉 Seeding Completed!");
}

function parseDate(raw) {
    if (!raw) return null;
    if (raw instanceof Date) return raw.toISOString();
    // Helper if excel returns serial number
    if (typeof raw === 'number') {
        return new Date(Math.round((raw - 25569) * 86400 * 1000)).toISOString();
    }
    return new Date(raw).toISOString();
}

function mapDealStatus(status) {
    if (!status) return 'Discovery';
    const s = status.toLowerCase();
    if (s.includes('won') || s.includes('ganad')) return 'Won';
    if (s.includes('lost') || s.includes('perdid')) return 'Lost';
    if (s.includes('negotiation') || s.includes('negoci')) return 'Negotiation';
    return 'Discovery';
}

seedData();
