
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable static caching for live data

async function getDashboardData() {
  // 1. Total Revenue (Paid Invoices)
  const { data: paidInvoices } = await supabase
    .from('invoices')
    .select('total')
    .eq('status', 'Paid');

  const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

  // 2. Pipeline Value (Deals not Won/Lost)
  const { data: deals } = await supabase
    .from('deals')
    .select('value, status');

  const pipelineValue = deals
    ?.filter(d => !['Won', 'Lost'].includes(d.status || ''))
    .reduce((sum, d) => sum + (d.value || 0), 0) || 0;

  // 3. Active Clients
  const { count: clientCount } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: true });

  // 4. Deals by Stage
  const stageCounts: Record<string, number> = {};
  deals?.forEach(deal => {
    const stage = deal.status || 'Unknown';
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });

  return {
    totalRevenue: totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
    pipelineValue: pipelineValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
    activeClients: clientCount || 0,
    dealCount: deals?.length || 0,
    stageCounts
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back to Orkesta OS.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalRevenue}</div>
            <p className="text-xs text-green-500 font-medium">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pipeline Value</CardTitle>
            <Briefcase className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.pipelineValue}</div>
            <p className="text-xs text-gray-400">{data.dealCount} Total Deals</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.activeClients}</div>
            <p className="text-xs text-gray-400">2 Onboarding</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white text-green-400">+€4,300</div>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/50 border-gray-800 min-h-[300px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Loading live data from Supabase...</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-card/50 border-gray-800 min-h-[300px]">
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.stageCounts).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{stage}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${(count / (data.dealCount || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                </div>
              ))}
              {data.dealCount === 0 && <p className="text-gray-500 text-sm">No deals found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
