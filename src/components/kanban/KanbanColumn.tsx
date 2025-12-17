
"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
    id: string;
    title: string;
    tasks: any[];
}

export function KanbanColumn({ id, title, tasks }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col bg-gray-900/30 rounded-lg p-2 min-w-[280px] w-full border border-gray-800/50">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-sm text-gray-300">{title}</h3>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>

            <div ref={setNodeRef} className="flex-1 min-h-[500px]">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="h-full border-2 border-dashed border-gray-800/50 rounded-lg flex items-center justify-center m-2">
                            <p className="text-xs text-gray-600">Drop here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
