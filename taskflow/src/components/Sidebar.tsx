'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Inbox,
    Calendar,
    CalendarDays,
    Plus,
    Hash,
    Settings,
    Menu,
    X,
    Layout,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskStore } from '@/store/useTaskStore';
import type { ViewType } from '@/types';

const views = [
    { id: 'inbox' as ViewType, label: 'Inbox', icon: Inbox },
    { id: 'today' as ViewType, label: 'Today', icon: Calendar },
    { id: 'upcoming' as ViewType, label: 'Upcoming', icon: CalendarDays },
];

export function Sidebar() {
    const {
        currentView,
        setCurrentView,
        projects,
        tags,
        isSidebarOpen,
        toggleSidebar,
        tasks,
    } = useTaskStore();

    const getTaskCount = (view: ViewType) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        switch (view) {
            case 'inbox':
                return tasks.filter((t) => !t.project_id && t.status !== 'completed').length;
            case 'today':
                return tasks.filter(
                    (t) =>
                        t.due_at &&
                        new Date(t.due_at) >= today &&
                        new Date(t.due_at) < tomorrow &&
                        t.status !== 'completed'
                ).length;
            case 'upcoming':
                return tasks.filter(
                    (t) =>
                        t.due_at &&
                        new Date(t.due_at) >= tomorrow &&
                        t.status !== 'completed'
                ).length;
            default:
                return 0;
        }
    };

    const getProjectTaskCount = (projectId: string) => {
        return tasks.filter((t) => t.project_id === projectId && t.status !== 'completed').length;
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md shadow-sm"
            >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={cn(
                            'fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-muted/30 border-r border-border',
                            'flex flex-col z-40'
                        )}
                    >
                        {/* Header */}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    <Layout className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <h1 className="text-lg font-semibold tracking-tight">
                                    TaskFlow
                                </h1>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar">
                            {/* Main Views */}
                            <div className="space-y-1">
                                {views.map((view) => {
                                    const count = getTaskCount(view.id);
                                    const isActive = currentView === view.id;

                                    return (
                                        <button
                                            key={view.id}
                                            onClick={() => setCurrentView(view.id)}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-secondary text-secondary-foreground'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                            )}
                                        >
                                            <view.icon className="w-4 h-4" />
                                            <span className="flex-1 text-left">{view.label}</span>
                                            {count > 0 && (
                                                <span className="text-xs text-muted-foreground">{count}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Projects */}
                            <div>
                                <div className="flex items-center justify-between mb-2 px-3">
                                    <h3 className="text-xs font-medium text-muted-foreground">
                                        Projects
                                    </h3>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {projects.map((project) => {
                                        const count = getProjectTaskCount(project.id);
                                        return (
                                            <button
                                                key={project.id}
                                                onClick={() => setCurrentView('project')}
                                                className={cn(
                                                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                                                    'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                                )}
                                            >
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                                                <span className="flex-1 text-left truncate">{project.title}</span>
                                                {count > 0 && (
                                                    <span className="text-xs text-muted-foreground">{count}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <div className="flex items-center justify-between mb-2 px-3">
                                    <h3 className="text-xs font-medium text-muted-foreground">
                                        Tags
                                    </h3>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                        >
                                            <Hash className="w-3.5 h-3.5" />
                                            <span className="flex-1 text-left truncate">{tag.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border">
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
