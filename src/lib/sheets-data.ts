import { read, utils } from 'xlsx';

// URLs for all sheets
const CRM_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXRSPGFtdn38W8sxaJyDoFYCleyY4sly2hjAh7fs2sM5RmUnWeHa8QhVeVqtU3SNQVcQM0oRVId2bI/pub?output=csv';
const FINANCE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQXU9NdGeAeqvTwVljxeos8gLx0WbUUDHcfoc7VDVUW4aIfy6hbBlq9AzJT0mplMaIkfIzM2pR_qOuW/pub?output=csv';
const EXPENSES_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRu6Bw8UIeedd9ZSRbMe_D8noBeGaJ1z_fcGrANqzzna3RjR9WDxZ2Mx_PlBqXJIIw_yi9w4oD7pxGx/pub?output=csv';
const TOOLS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6ZsE7o0NUjqlUzP1E6JvRdzIOCyS60rmgO1clnZIRiv20a_gaBDSxYyVpfvCYYF37QI3cSFsvOLXS/pub?output=csv';
const AUTOMATIONS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcuSxncVMwAdmiaLssnXm5lVE9KZ7IavXC47ipjbDfyx9_pak5x4p6Pc8G4slHl3BxOFTHSIr9la10/pub?output=csv';
const KPIS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSW2rPtcxZvE3xZRrKA3qpnXOzM2EEGybnT33zxMvep8a43m1nMWKhPEk5fYwekGSxOUYRRpxBrZKZe/pub?output=csv';
const FINANCIALS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT9NnZ1V7_5j5U4w8dgs1ex5EL9Q8p--FNWrZu-MDPCgvCAaKUhH9ygSJ-HPuAjP1zVOg_MpAaZH-ws/pub?output=csv';

// Interfaces
export interface CRMRow {
    Name: string;
    Email: string;
    Empresa: string;
    Empleados: string;
    Cualificación: string;
    Proyecto: string;
    Date: string;
    Estado: string;
    [key: string]: string;
}

export interface FinanceRow {
    Fecha: string;
    'Description': string;
    'Cantidad': string;
    'Importe': string;
    'Iva': string;
    'Total': string;
    'Emisor': string;
    'Número de factura': string;
    'Cliente': string;
    'Empresa': string;
    'CIF/ NIE Cliente': string;
    'Dirección cliente': string;
    'Moneda': string;
    'Método de pago': string;
    'URL': string;
    'Pagada': string;
    [key: string]: string;
}

export interface ExpenseRow {
    Gasto_ID: string;
    Fecha: string;
    Categoria: string;
    Proveedor: string;
    Descripcion: string;
    Importe: string;
    Tipo: string;
    Pagado: string;
    Notas: string;
    [key: string]: string;
}

export interface ToolRow {
    Tool_ID: string;
    Nombre: string;
    Categoria: string;
    Plan: string;
    Coste_mensual: string;
    Coste_estimado: string;
    Uso: string;
    Estado_API: string;
    [key: string]: string;
}

export interface AutomationRow {
    Automation_ID: string;
    Cliente: string;
    Nombre: string;
    Herramienta: string;
    Estado: string;
    Impacto: string;
    Horas_ahorradas_mes: string;
    [key: string]: string;
}

export interface KPIRow {
    Categoria: string;
    KPI: string;
    Objetivo_Corto_Plazo_0_3_meses: string;
    Resultado_Actual: string;
    [key: string]: string;
}

export interface FinancialRow {
    Mes: string;
    MRR: string;
    Ingresos: string;
    Gastos: string;
    Beneficio: string;
    Clientes_activos: string;
    Deals_abiertos: string;
    [key: string]: string;
}

// Fetch Helper
async function fetchAndParse<T>(url: string): Promise<T[]> {
    try {
        const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60 seconds
        if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.statusText}`);

        const csvText = await response.text();
        const workbook = read(csvText, { type: 'string' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        return utils.sheet_to_json<T>(sheet);
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        return [];
    }
}

// Fetchers
export async function getCRMData(): Promise<CRMRow[]> {
    return fetchAndParse<CRMRow>(CRM_SHEET_URL);
}

export async function getFinanceData(): Promise<FinanceRow[]> {
    return fetchAndParse<FinanceRow>(FINANCE_SHEET_URL);
}

export async function getExpensesData(): Promise<ExpenseRow[]> {
    return fetchAndParse<ExpenseRow>(EXPENSES_SHEET_URL);
}

export async function getToolsData(): Promise<ToolRow[]> {
    return fetchAndParse<ToolRow>(TOOLS_SHEET_URL);
}

export async function getAutomationsData(): Promise<AutomationRow[]> {
    return fetchAndParse<AutomationRow>(AUTOMATIONS_SHEET_URL);
}

export async function getKPIData(): Promise<KPIRow[]> {
    return fetchAndParse<KPIRow>(KPIS_SHEET_URL);
}

export async function getFinancialsData(): Promise<FinancialRow[]> {
    return fetchAndParse<FinancialRow>(FINANCIALS_SHEET_URL);
}

export const MOCK_TASKS = [
    { id: '1', title: 'Design System Update', status: 'To Do', priority: 'High', type: 'Design' },
    { id: '2', title: 'Client Meeting - Alpha Corp', status: 'In Progress', priority: 'Medium', type: 'CRM' },
    { id: '3', title: 'Q4 Financial Report', status: 'Review', priority: 'High', type: 'Finance' },
    { id: '4', title: 'Fix Login Bug', status: 'Done', priority: 'Critical', type: 'Dev' },
];

export async function getTasksData() {
    return MOCK_TASKS;
}
