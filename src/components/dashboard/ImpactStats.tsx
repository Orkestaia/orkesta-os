import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Zap, CheckCircle } from "lucide-react";

interface ImpactStatsProps {
    data: any[];
}

export function ImpactStats({ data }: ImpactStatsProps) {
    const totalHoursSaved = data.reduce((sum, item) => {
        return sum + parseFloat(item.Horas_ahorradas_mes || '0');
    }, 0);

    const activeAutomations = data.filter(item => item.Estado === 'Activo').length;
    const highImpactCount = data.filter(item => item.Impacto === 'Alto').length;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Hours Saved / Month</CardTitle>
                    <Clock className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{totalHoursSaved}h</div>
                    <p className="text-xs text-gray-400">Equivalent to {(totalHoursSaved / 160).toFixed(1)} FTEs</p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Automations</CardTitle>
                    <Zap className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{activeAutomations}</div>
                    <p className="text-xs text-gray-400">Across {data.length} clients</p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">High Impact Flows</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{highImpactCount}</div>
                    <p className="text-xs text-gray-400">Critical business processes</p>
                </CardContent>
            </Card>
        </div>
    );
}
