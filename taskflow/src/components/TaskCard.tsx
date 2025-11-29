'use client';

import { motion } from 'framer-motion';
import { Calendar, Check, Circle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';

interface TaskCardProps {
    task: Task;
    index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
    const { toggleTaskComplete, setSelectedTask } = useTaskStore();

    const isOverdue = task.due_at && isPast(new Date(task.due_at)) && !isToday(new Date(task.due_at)) && task.status !== 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'group flex items-start gap-3 p-4 rounded-lg border border-border bg-card',
                'hover:border-muted-foreground/20 transition-colors cursor-pointer',
                task.status === 'completed' && 'opacity-50'
            )}
            onClick={() => setSelectedTask(task.id)}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id);
                }}
                className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border border-muted-foreground/40 flex items-center justify-center transition-colors",
                    task.status === 'completed'
                        ? "bg-primary border-primary text-primary-foreground"
                        : "hover:border-primary"
                )}
            >
                {task.status === 'completed' && <Check className="w-3 h-3" />}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-4">
                    <span className={cn(
                        "text-sm font-medium leading-tight",
                        task.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                        {task.title}
                    </span>
                </div>

                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                    {task.due_at && (
                        <div className={cn(
                            "flex items-center gap-1.5 text-xs",
                            isOverdue ? "text-destructive" : "text-muted-foreground"
                        )}>
                            <Calendar className="w-3 h-3" />
                            <span>{format(new Date(task.due_at), 'MMM d')}</span>
                        </div>
                    )}

                    {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-2">
                            {task.tags.map(tag => (
                                <span key={tag.id} className="text-xs text-muted-foreground">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={cn(
                "w-1.5 h-1.5 rounded-full mt-1.5",
                task.priority === 'high' ? "bg-destructive" :
                    task.priority === 'medium' ? "bg-orange-400" :
                        "bg-transparent"
            )} />
        </motion.div>
    );
}
