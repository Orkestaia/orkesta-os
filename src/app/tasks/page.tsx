import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { getTasksData } from "@/lib/sheets-data";

export const revalidate = 0;

export default async function TasksPage() {
    const tasks = await getTasksData();

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Task Board</h1>
                <p className="text-gray-400">Manage your project tasks (Mock Data).</p>
            </div>

            <div className="flex-1">
                <KanbanBoard initialTasks={tasks} />
            </div>
        </div>
    );
}
