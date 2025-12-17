"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpensesPieChartProps {
    data: any[];
}

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ExpensesPieChart({ data }: ExpensesPieChartProps) {
    // Aggregate by Category
    const categoryData: Record<string, number> = {};
    data.forEach(item => {
        if (!item.Categoria) return;
        const amount = parseFloat(item.Importe?.replace(/[€,]/g, '') || '0');
        categoryData[item.Categoria] = (categoryData[item.Categoria] || 0) + amount;
    });

    const chartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    return (
        <Card className="bg-card/50 border-gray-800">
            <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `€${value.toFixed(2)}`}
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
