
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const revalidate = 0;

async function getCRMData() {
    const { data: clients } = await supabase.from('clients').select('*').order('name');
    const { data: leads } = await supabase.from('leads').select('*, clients(name)').order('created_at', { ascending: false });
    return { clients, leads };
}

// Simple Table Component
function DataTable({ headers, data, renderRow }: any) {
    if (!data || data.length === 0) return <div className="p-4 text-gray-500">No data found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-200 uppercase bg-gray-800/50">
                    <tr>
                        {headers.map((h: string) => <th key={h} className="px-6 py-3">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: any, i: number) => (
                        <tr key={row.id || i} className="bg-card border-b border-gray-800 hover:bg-gray-800/50">
                            {renderRow(row)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function CRMPage() {
    const { clients, leads } = await getCRMData();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">CRM</h1>

            <Tabs defaultValue="clients" className="w-full">
                <TabsList className="bg-gray-800/50 border-gray-800">
                    <TabsTrigger value="clients">Clients ({clients?.length || 0})</TabsTrigger>
                    <TabsTrigger value="leads">Leads ({leads?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="clients">
                    <Card className="bg-card/50 border-gray-800">
                        <CardHeader>
                            <CardTitle>All Clients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                headers={['Company', 'Employees', 'Tax ID', 'Status']}
                                data={clients}
                                renderRow={(c: any) => (
                                    <>
                                        <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                                        <td className="px-6 py-4">{c.employees_range || '-'}</td>
                                        <td className="px-6 py-4">{c.tax_id || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">Active</span>
                                        </td>
                                    </>
                                )}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leads">
                    <Card className="bg-card/50 border-gray-800">
                        <CardHeader>
                            <CardTitle>Recent Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                headers={['Name', 'Email', 'Company', 'Status', 'Date']}
                                data={leads}
                                renderRow={(l: any) => (
                                    <>
                                        <td className="px-6 py-4 font-medium text-white">{l.contact_name || 'N/A'}</td>
                                        <td className="px-6 py-4">{l.email || '-'}</td>
                                        <td className="px-6 py-4">{l.clients?.name || '-'}</td>
                                        <td className="px-6 py-4">{l.status || 'New'}</td>
                                        <td className="px-6 py-4">{l.source_date ? new Date(l.source_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
