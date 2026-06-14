export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  members: TeamMember[];
  _count?: { members: number; projects: number };
}

export interface TeamMember {
  id: string;
  role: Role;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

export type Role = 'ADMIN' | 'MANAGER' | 'DEVELOPER';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  teamId: string;
  _count?: { tasks: number };
}

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  position: number;
  projectId: string;
  assigneeId?: string;
  assignee?: Pick<User, 'id' | 'name' | 'avatar'>;
  creator?: Pick<User, 'id' | 'name'>;
  _count?: { comments: number };
}

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  task?: { id: string; title: string };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface DashboardStats {
  tasksByStatus: { status: TaskStatus; count: number }[];
  completedThisWeek: number;
  overdueTasksCount: number;
  teamsCount: number;
  recentActivity: Task[];
}
