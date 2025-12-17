
"use client";

import { useState } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { supabase } from "@/lib/supabase";

interface KanbanBoardProps {
    initialTasks: any[];
}

const COLUMNS = [
    { id: "To Do", title: "To Do" },
    { id: "In Progress", title: "In Progress" },
    { id: "Review", title: "Review" },
    { id: "Done", title: "Done" },
];

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTask, setActiveTask] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id; // Can be a task ID or a column ID

        // Find the task being dragged
        const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
        if (activeTaskIndex === -1) return;

        const currentTask = tasks[activeTaskIndex];
        let newStatus = currentTask.status;

        // Check if dropped on a column
        if (COLUMNS.some((c) => c.id === overId)) {
            newStatus = overId;
        } else {
            // Dropped on another task, find its status
            const overTask = tasks.find((t) => t.id === overId);
            if (overTask) {
                newStatus = overTask.status;
            }
        }

        if (currentTask.status !== newStatus) {
            // Optimistic update
            const updatedTasks = [...tasks];
            updatedTasks[activeTaskIndex] = { ...currentTask, status: newStatus };
            setTasks(updatedTasks);

            // Async update Supabase
            await supabase.from("tasks").update({ status: newStatus }).eq("id", activeId);
        }
    }

    function handleDragStart(event: any) {
        const task = tasks.find((t) => t.id === event.active.id);
        setActiveTask(task);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-10 overflow-x-auto">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={tasks.filter((t) => t.status === col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
