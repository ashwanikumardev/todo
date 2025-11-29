'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Hash, Flag, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';
import type { Priority } from '@/types';

export function QuickAdd() {
    const { isQuickAddOpen, toggleQuickAdd, addTask, projects, tags } = useTaskStore();
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState<Priority>('medium');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isQuickAddOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isQuickAddOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleQuickAdd();
            }
            if (e.key === 'Escape' && isQuickAddOpen) {
                toggleQuickAdd();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isQuickAddOpen, toggleQuickAdd]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title: title.trim(),
            priority,
            status: 'todo',
            order_index: 0,
            created_by: 'user1',
            due_at: dueDate || undefined,
            project_id: selectedProject || undefined,
            tags: tags.filter((t) => selectedTags.includes(t.id)),
            subtasks: [],
        });

        setTitle('');
        setDueDate(null);
        setPriority('medium');
        setSelectedTags([]);
        setSelectedProject('');
        toggleQuickAdd();
    };

    return (
        <>
            <button
                onClick={toggleQuickAdd}
                className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50"
            >
                <Plus className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isQuickAddOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleQuickAdd}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
                        >
                            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                                <form onSubmit={handleSubmit}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="w-full px-6 py-4 text-lg bg-transparent border-b border-border focus:outline-none placeholder:text-muted-foreground"
                                    />

                                    <div className="p-4 flex items-center gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            <button
                                                type="button"
                                                className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Flag className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Hash className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!title.trim()}
                                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
