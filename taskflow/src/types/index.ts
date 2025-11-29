// Core Types for TaskFlow Application

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    settings: UserSettings;
    created_at: Date;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailDigest: boolean;
    defaultView: 'inbox' | 'today' | 'upcoming';
}

export interface Project {
    id: string;
    user_id: string;
    title: string;
    color: string;
    icon?: string;
    is_shared: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Task {
    id: string;
    project_id?: string;
    title: string;
    description?: string;
    due_at?: Date;
    priority: Priority;
    status: TaskStatus;
    order_index: number;
    recurrence_rule?: string;
    created_by: string;
    assigned_to?: string;
    completed_at?: Date;
    created_at: Date;
    updated_at: Date;
    tags: Tag[];
    subtasks: Subtask[];
}

export interface Subtask {
    id: string;
    task_id: string;
    title: string;
    is_done: boolean;
    order_index: number;
}

export interface Tag {
    id: string;
    user_id: string;
    name: string;
    color: string;
}

export interface Comment {
    id: string;
    task_id: string;
    user_id: string;
    body: string;
    created_at: Date;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'reminder' | 'assignment' | 'comment' | 'share';
    payload: Record<string, unknown>;
    delivered: boolean;
    read: boolean;
    created_at: Date;
}

// View Types
export type ViewType = 'inbox' | 'today' | 'upcoming' | 'project' | 'calendar';

export interface FilterOptions {
    priority?: Priority[];
    status?: TaskStatus[];
    tags?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    search?: string;
}
