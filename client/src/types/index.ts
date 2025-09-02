// Core types for the Clarity application based on version-3 manifest

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  metric_type: 'Percentage' | 'Numeric' | 'Checklist';
  current_progress: number;
  target_progress: number;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  sub_tasks?: SubTask[];
}

export interface SubTask {
  id: string;
  goal_id: string;
  title: string;
  is_completed: boolean;
}

export interface ProgressHistory {
  id: string;
  goal_id: string;
  value: number;
  notes?: string;
  created_at: string;
}

export interface GoalCreate {
  title: string;
  description?: string;
  target_date?: string;
  metric_type: 'Percentage' | 'Numeric' | 'Checklist';
  target_progress: number;
}

export interface GoalUpdate {
  title?: string;
  description?: string;
  target_date?: string;
  metric_type?: 'Percentage' | 'Numeric' | 'Checklist';
  target_progress?: number;
  status?: 'active' | 'completed' | 'archived';
}

export interface ProgressUpdate {
  goal_id: string;
  new_progress_value: number;
}

export interface AIExtractedGoal {
  title: string;
  description: string;
  metric_type: 'Percentage' | 'Numeric' | 'Checklist';
  target_progress: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Form validation schemas
export interface GoalFormData {
  title: string;
  description: string;
  target_date: string;
  metric_type: 'Percentage' | 'Numeric' | 'Checklist';
  target_progress: number;
}

export interface ProgressFormData {
  text: string;
}

// UI State types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'goal' | 'progress' | 'delete' | 'disambiguation';
  data?: any;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Navigation types
export type AppRoute = '/' | '/goals' | '/analytics' | '/settings';

export interface NavigationItem {
  path: AppRoute;
  label: string;
  icon: string;
  requiresAuth: boolean;
}
