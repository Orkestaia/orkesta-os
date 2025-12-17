import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface KPIProgressProps {
    data: any[];
}

export function KPIProgress({ data }: KPIProgressProps) {
    // Helper to parse "20-25%" or "500-1000" to a single target number (taking the upper bound for safety)
    const parseTarget = (str: string) => {
        if (!str) return 0;
        // Extract numbers
        const nums = str.match(/\d+/g)?.map(Number) || [0];
        return Math.max(...nums);
    };

    const parseActual = (str: string) => {
        if (!str) return 0;
        return parseFloat(str.replace(/[^0-9.]/g, '') || '0');
    };

    return (
        <Card className="bg-card/50 border-gray-800 h-full">
            <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {data.slice(0, 6).map((kpi, i) => { // Show top 6 to fit nicely
                    if (!kpi.KPI) return null;
                    const target = parseTarget(kpi.Objetivo_Corto_Plazo_0_3_meses);
                    const actual = parseActual(kpi.Resultado_Actual);
                    const progress = target > 0 ? (actual / target) * 100 : 0;

                    return (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-200 truncate max-w-[200px]" title={kpi.KPI}>
                                    {kpi.KPI}
                                </span>
                                <span className="text-gray-400">
                                    {kpi.Resultado_Actual || '0'} / {kpi.Objetivo_Corto_Plazo_0_3_meses}
                                </span>
                            </div>
                            <Progress value={Math.min(progress, 100)} className="h-2 bg-gray-800" indicatorClassName="bg-cyan-500" />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
