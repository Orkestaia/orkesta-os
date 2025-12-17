import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCRMData } from "@/lib/sheets-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const revalidate = 0;

// Simple Table Component
function DataTable({ headers, data, renderRow }: any) {
    if (!data || data.length === 0) return <div className="p-4 text-gray-500">No data found in Google Sheets.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-200 uppercase bg-gray-800/50">
                    <tr>
                        {headers.map((h: string) => <th key={h} className="px-6 py-3 whitespace-nowrap">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: any, i: number) => (
                        <tr key={i} className="bg-card border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            {renderRow(row)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function CRMPage() {
    const data = await getCRMData();

    // Filter logic if needed, or separate into tabs if the user had distinct sheets. 
    // The CSV provided seems to mix Leads/Clients or just be one list. 
    // Based on headers (Name, Email, Empresa, Empleados...) it looks like a unified view or primarily Leads with company info.
    // We will show all data in one table for now since there's only one CSV for CRM.

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">CRM (Google Sheets Live)</h1>

            <Card className="bg-card/50 border-gray-800">
                <CardHeader>
                    <CardTitle>All Records ({data.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        headers={['Name', 'Email', 'Empresa', 'Empleados', 'Cualificación', 'Proyecto', 'Date', 'Estado']}
                        data={data}
                        renderRow={(row: any) => (
                            <>
                                <td className="px-6 py-4 font-medium text-white">{row.Name || '-'}</td>
                                <td className="px-6 py-4">{row.Email || '-'}</td>
                                <td className="px-6 py-4">{row.Empresa || '-'}</td>
                                <td className="px-6 py-4">{row['Empleados'] || '-'}</td>
                                <td className="px-6 py-4">{row['Cualificación'] || '-'}</td>
                                <td className="px-6 py-4 text-cyan-500">{row.Proyecto || '-'}</td>
                                <td className="px-6 py-4">{row.Date || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${row.Estado === 'Cualificado' ? 'bg-green-900/30 text-green-400' :
                                            row.Estado === 'Contactado' ? 'bg-blue-900/30 text-blue-400' :
                                                'bg-gray-800 text-gray-400'
                                        }`}>
                                        {row.Estado || 'Unknown'}
                                    </span>
                                </td>
                            </>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
