
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

async function getFinanceData() {
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*, clients(name)')
        .order('issue_date', { ascending: false });
    return { invoices };
}

export default async function FinancePage() {
    const { invoices } = await getFinanceData();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Finance</h1>
                <p className="text-gray-400">Track invoices and expenses.</p>
            </div>

            <Card className="bg-card/50 border-gray-800">
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-200 uppercase bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Invoice #</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices?.map((inv: any) => (
                                    <tr key={inv.id} className="bg-card border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{inv.invoice_number}</td>
                                        <td className="px-6 py-4">{inv.clients?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-white">
                                            {inv.total?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={inv.status === 'Paid' ? 'secondary' : 'default'} className={inv.status === 'Paid' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'}>
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {inv.pdf_url && (
                                                <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                                                    View PDF
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!invoices || invoices.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center">No invoices found.</td>
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
