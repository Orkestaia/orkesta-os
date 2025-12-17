
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function TasksPage() {
    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true }); // We might add position logic later

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Task Board</h1>
                <p className="text-gray-400">Manage your project tasks.</p>
            </div>

            <div className="flex-1">
                <KanbanBoard initialTasks={tasks || []} />
            </div>
        </div>
    );
}
