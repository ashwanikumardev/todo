'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskCard } from '@/components/TaskCard';
import { Sidebar } from '@/components/Sidebar';
import { QuickAdd } from '@/components/QuickAdd';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Dashboard() {
  const { tasks, currentView, filters } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let filtered = tasks;

    switch (currentView) {
      case 'inbox':
        filtered = filtered.filter((t) => !t.project_id && t.status !== 'completed');
        break;
      case 'today':
        filtered = filtered.filter(
          (t) =>
            t.due_at &&
            new Date(t.due_at) >= today &&
            new Date(t.due_at) < tomorrow &&
            t.status !== 'completed'
        );
        break;
      case 'upcoming':
        filtered = filtered.filter(
          (t) =>
            t.due_at &&
            new Date(t.due_at) >= tomorrow &&
            t.status !== 'completed'
        );
        break;
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => {
      if (a.order_index !== b.order_index) return a.order_index - b.order_index;
      if (a.due_at && b.due_at) return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      return 0;
    });
  }, [tasks, currentView, filters, searchQuery]);

  const viewTitle = {
    inbox: 'Inbox',
    today: 'Today',
    upcoming: 'Upcoming',
    project: 'Project',
    calendar: 'Calendar',
  }[currentView];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-border/40">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{viewTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-secondary/50 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all w-64"
              />
            </div>
            <button className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-muted-foreground"
                >
                  <p>No tasks found.</p>
                </motion.div>
              ) : (
                filteredTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <QuickAdd />
    </div>
  );
}
