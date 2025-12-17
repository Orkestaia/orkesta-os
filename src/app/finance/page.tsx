import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinanceData } from "@/lib/sheets-data";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function FinancePage() {
    const invoices = await getFinanceData();

    // Calculate total if possible
    const totalRevenue = invoices.reduce((sum, inv) => {
        // Parse "1.320 €" or similar if needed, assuming clean numbers or strings
        const amount = parseFloat(inv['Total']?.replace(/[€,]/g, '') || '0');
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Finance (Google Sheets Live)</h1>
                <p className="text-gray-400">Total Revenue Estimate: €{totalRevenue.toLocaleString()}</p>
            </div>

            <Card className="bg-card/50 border-gray-800">
                <CardHeader>
                    <CardTitle>Invoices ({invoices.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-200 uppercase bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 whitespace-nowrap">Fecha</th>
                                    <th className="px-6 py-3 whitespace-nowrap">Factura #</th>
                                    <th className="px-6 py-3 whitespace-nowrap">Cliente</th>
                                    <th className="px-6 py-3 whitespace-nowrap">Descripción</th>
                                    <th className="px-6 py-3 whitespace-nowrap">Total</th>
                                    <th className="px-6 py-3 whitespace-nowrap">Estado</th>
                                    <th className="px-6 py-3 whitespace-nowrap">PDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv: any, i: number) => (
                                    <tr key={i} className="bg-card border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">{inv['Fecha'] || '-'}</td>
                                        <td className="px-6 py-4 font-medium text-white">{inv['Número de factura'] || '-'}</td>
                                        <td className="px-6 py-4">{inv['Cliente'] || inv['Empresa'] || '-'}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={inv['Descripción']}>{inv['Descripción'] || '-'}</td>
                                        <td className="px-6 py-4 text-white font-bold">
                                            {inv['Total'] || '0 €'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={
                                                (inv['Pagada'] === 'TRUE' || inv['Pagada'] === 'Sí')
                                                    ? 'bg-green-900/30 text-green-400 border-green-900'
                                                    : 'bg-yellow-900/30 text-yellow-500 border-yellow-900'
                                            }>
                                                {(inv['Pagada'] === 'TRUE' || inv['Pagada'] === 'Sí') ? 'Paid' : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {inv['URL'] && (
                                                <a href={inv['URL']} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                                                    View
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!invoices || invoices.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center">No invoices found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
