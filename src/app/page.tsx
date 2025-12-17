import {
  getFinancialsData,
  getExpensesData,
  getAutomationsData,
  getKPIData
} from "@/lib/sheets-data";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { ExpensesPieChart } from "@/components/dashboard/ExpensesPieChart";
import { ImpactStats } from "@/components/dashboard/ImpactStats";
import { KPIProgress } from "@/components/dashboard/KPIProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch all data in parallel
  const [financials, expenses, automations, kpis] = await Promise.all([
    getFinancialsData(),
    getExpensesData(),
    getAutomationsData(),
    getKPIData()
  ]);

  // Calculate high-level metrics from the latest month (last row of financials usually)
  const currentMonth = financials[financials.length - 1] || {};
  const previousMonth = financials[financials.length - 2] || {};

  const mrr = currentMonth.MRR || '0';
  const benefit = currentMonth.Beneficio || '0';

  // Calculate benefit growth
  const benefitNum = parseFloat(benefit.replace(/[€,]/g, ''));
  const prevBenefitNum = parseFloat((previousMonth.Beneficio || '0').replace(/[€,]/g, ''));
  const growth = prevBenefitNum ? ((benefitNum - prevBenefitNum) / prevBenefitNum) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">Central Command</h1>
        <p className="text-gray-400">Real-time operational intelligence.</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{mrr}</div>
            <p className="text-xs text-gray-400 mt-1">Target: €6,000</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Net Profit (Monthly)</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{benefit}</div>
            <div className={`flex items-center text-xs mt-1 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {growth >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {Math.abs(growth).toFixed(1)}% vs last month
            </div>
          </CardContent>
        </Card>

        {/* Impact Stats embedded directly or via component if complex */}
        <div className="col-span-2">
          <ImpactStats data={automations} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">

        {/* Financial Trends (Wide) */}
        <div className="col-span-4 md:col-span-5 space-y-6">
          <FinancialChart data={financials} />

          <div className="grid gap-6 md:grid-cols-2">
            <ExpensesPieChart data={expenses} />
            {/* Placeholder for another chart or deeper dive */}
            <Card className="bg-card/50 border-gray-800">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {automations.slice(0, 5).map((auto, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white">{auto.Nombre}</p>
                        <p className="text-xs text-gray-500">{auto.Cliente} • {auto.Herramienta}</p>
                      </div>
                      <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded">
                        {auto.Horas_ahorradas_mes}h saved
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* KPIs Sidebar (Narrow) */}
        <div className="col-span-3 md:col-span-2">
          <KPIProgress data={kpis} />
        </div>
      </div>
    </div>
  );
}
