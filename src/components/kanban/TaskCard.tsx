
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
}

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { ...task } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 hover:cursor-grab active:cursor-grabbing">
            <Card className="bg-card border-gray-800 hover:border-cyan-500/50 transition-colors">
                <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium text-white line-clamp-2 leading-tight">
                            {task.title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    {task.description && (
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 bg-gray-800 text-gray-300">
                            {task.priority || "Medium"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
