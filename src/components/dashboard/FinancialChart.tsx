"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialChartProps {
    data: any[];
}

export function FinancialChart({ data }: FinancialChartProps) {
    // Transform data strings (e.g. "5000 €") to numbers if necessary
    const chartData = data.map(item => ({
        name: item.Mes,
        Ingresos: parseFloat(item.Ingresos?.replace(/[€,]/g, '') || '0'),
        Gastos: parseFloat(item.Gastos?.replace(/[€,]/g, '') || '0'),
        Beneficio: parseFloat(item.Beneficio?.replace(/[€,]/g, '') || '0'),
    })).filter(item => item.name); // Filter out empty rows

    return (
        <Card className="bg-card/50 border-gray-800">
            <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `€${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Beneficio" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
