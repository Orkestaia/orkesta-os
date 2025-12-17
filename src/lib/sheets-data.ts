import { read, utils } from 'xlsx';

const CRM_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXRSPGFtdn38W8sxaJyDoFYCleyY4sly2hjAh7fs2sM5RmUnWeHa8QhVeVqtU3SNQVcQM0oRVId2bI/pub?output=csv';
const FINANCE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQXU9NdGeAeqvTwVljxeos8gLx0WbUUDHcfoc7VDVUW4aIfy6hbBlq9AzJT0mplMaIkfIzM2pR_qOuW/pub?output=csv';

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
    'Descripción': string;
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

export async function getCRMData(): Promise<CRMRow[]> {
    return fetchAndParse<CRMRow>(CRM_SHEET_URL);
}

export async function getFinanceData(): Promise<FinanceRow[]> {
    return fetchAndParse<FinanceRow>(FINANCE_SHEET_URL);
}
