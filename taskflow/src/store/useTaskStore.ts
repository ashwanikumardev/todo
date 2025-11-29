import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Project, Tag, FilterOptions, ViewType } from '@/types';

interface TaskStore {
    // State
    tasks: Task[];
    projects: Project[];
    tags: Tag[];
    currentView: ViewType;
    selectedTaskId: string | null;
    selectedProjectId: string | null;
    filters: FilterOptions;
    isQuickAddOpen: boolean;
    isSidebarOpen: boolean;

    // Task Actions
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskComplete: (id: string) => void;
    reorderTasks: (taskIds: string[]) => void;

    // Project Actions
    addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    // Tag Actions
    addTag: (tag: Omit<Tag, 'id'>) => void;
    deleteTag: (id: string) => void;

    // UI Actions
    setCurrentView: (view: ViewType) => void;
    setSelectedTask: (id: string | null) => void;
    setSelectedProject: (id: string | null) => void;
    setFilters: (filters: FilterOptions) => void;
    toggleQuickAdd: () => void;
    toggleSidebar: () => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            // Initial State
            tasks: [],
            projects: [
                {
                    id: '1',
                    user_id: 'user1',
                    title: 'Personal',
                    color: '#6366f1',
                    icon: '🏠',
                    is_shared: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: '2',
                    user_id: 'user1',
                    title: 'Work',
                    color: '#14b8a6',
                    icon: '💼',
                    is_shared: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            tags: [
                { id: '1', user_id: 'user1', name: 'Important', color: '#ef4444' },
                { id: '2', user_id: 'user1', name: 'Urgent', color: '#f59e0b' },
                { id: '3', user_id: 'user1', name: 'Later', color: '#3b82f6' },
            ],
            currentView: 'inbox',
            selectedTaskId: null,
            selectedProjectId: null,
            filters: {},
            isQuickAddOpen: false,
            isSidebarOpen: true,

            // Task Actions
            addTask: (taskData) => {
                const newTask: Task = {
                    ...taskData,
                    id: `task-${Date.now()}`,
                    created_at: new Date(),
                    updated_at: new Date(),
                    tags: taskData.tags || [],
                    subtasks: taskData.subtasks || [],
                };
                set((state) => ({ tasks: [...state.tasks, newTask] }));
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? { ...task, ...updates, updated_at: new Date() }
                            : task
                    ),
                }));
            },

            deleteTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                    selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
                }));
            },

            toggleTaskComplete: (id) => {
                const task = get().tasks.find((t) => t.id === id);
                if (!task) return;

                const newStatus: 'completed' | 'todo' =
                    task.status === 'completed' ? 'todo' : 'completed';
                const completed_at = newStatus === 'completed' ? new Date() : undefined;

                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id
                            ? {
                                ...t,
                                status: newStatus,
                                completed_at,
                                updated_at: new Date(),
                            }
                            : t
                    ),
                }));
            },

            reorderTasks: (taskIds) => {
                set((state) => {
                    const taskMap = new Map(state.tasks.map((t) => [t.id, t]));
                    const reorderedTasks = taskIds
                        .map((id, index) => {
                            const task = taskMap.get(id);
                            return task ? { ...task, order_index: index } : null;
                        })
                        .filter((t): t is Task => t !== null);

                    const remainingTasks = state.tasks.filter(
                        (t) => !taskIds.includes(t.id)
                    );

                    return { tasks: [...reorderedTasks, ...remainingTasks] };
                });
            },

            // Project Actions
            addProject: (projectData) => {
                const newProject: Project = {
                    ...projectData,
                    id: `project-${Date.now()}`,
                    created_at: new Date(),
                    updated_at: new Date(),
                };
                set((state) => ({ projects: [...state.projects, newProject] }));
            },

            updateProject: (id, updates) => {
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.id === id
                            ? { ...project, ...updates, updated_at: new Date() }
                            : project
                    ),
                }));
            },

            deleteProject: (id) => {
                set((state) => ({
                    projects: state.projects.filter((project) => project.id !== id),
                    tasks: state.tasks.filter((task) => task.project_id !== id),
                    selectedProjectId:
                        state.selectedProjectId === id ? null : state.selectedProjectId,
                }));
            },

            // Tag Actions
            addTag: (tagData) => {
                const newTag: Tag = {
                    ...tagData,
                    id: `tag-${Date.now()}`,
                };
                set((state) => ({ tags: [...state.tags, newTag] }));
            },

            deleteTag: (id) => {
                set((state) => ({
                    tags: state.tags.filter((tag) => tag.id !== id),
                    tasks: state.tasks.map((task) => ({
                        ...task,
                        tags: task.tags.filter((tag) => tag.id !== id),
                    })),
                }));
            },

            // UI Actions
            setCurrentView: (view) => set({ currentView: view }),
            setSelectedTask: (id) => set({ selectedTaskId: id }),
            setSelectedProject: (id) => set({ selectedProjectId: id }),
            setFilters: (filters) => set({ filters }),
            toggleQuickAdd: () => set((state) => ({ isQuickAddOpen: !state.isQuickAddOpen })),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        }),
        {
            name: 'taskflow-storage',
        }
    )
);
