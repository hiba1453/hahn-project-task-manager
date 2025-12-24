// src/api/endpoints.ts
import { api } from './client';
import type { AuthResponse, Page, Project, ProjectProgress, Task } from './types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function register(email: string, password: string, fullName: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { email, password, fullName });
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects');
  return data;
}

export async function getProjectsPaged(page = 0, size = 8): Promise<Page<Project>> {
  const { data } = await api.get<Page<Project>>('/projects/paged', {
    params: { page, size }
  });
  return data;
}

export async function createProject(payload: { title: string; description?: string }): Promise<Project> {
  const { data } = await api.post<Project>('/projects', payload);
  return data;
}

export async function getProject(projectId: number): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${projectId}`);
  return data;
}

export async function updateProject(
  projectId: number,
  payload: { title: string; description?: string | null }
): Promise<Project> {
  const { data } = await api.put<Project>(`/projects/${projectId}`, payload);
  return data;
}

export async function deleteProject(projectId: number): Promise<void> {
  await api.delete(`/projects/${projectId}`);
}

export async function getTasks(projectId: number): Promise<Task[]> {
  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`);
  return data;
}

export async function addTask(
  projectId: number,
  payload: { title: string; description?: string | null; dueDate?: string | null }
): Promise<Task> {
  const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, payload);
  return data;
}

export async function updateTask(
  projectId: number,
  taskId: number,
  payload: { title: string; description?: string | null; dueDate?: string | null }
): Promise<Task> {
  const { data } = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, payload);
  return data;
}

export async function toggleTask(projectId: number, taskId: number): Promise<Task> {
  const { data } = await api.patch<Task>(`/projects/${projectId}/tasks/${taskId}/toggle`);
  return data;
}

export async function deleteTask(projectId: number, taskId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
}

export function calcProgressFromTasks(tasks: Task[]): ProjectProgress {
  const total = tasks.length;
  const done = tasks.filter((t) => !!t.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pct };
}

/**
 * Always returns { total, done, pct } to match your UI.
 * If /progress exists, we map whatever it returns.
 * Otherwise we compute from /tasks (same logic as ProjectPage).
 */
export async function getProgress(projectId: number): Promise<ProjectProgress> {
  try {
    const { data } = await api.get<any>(`/projects/${projectId}/progress`);

    // Support multiple backend response shapes safely
    const total = Number(data?.total ?? data?.totalTasks ?? data?.total_tasks ?? 0) || 0;
    const done = Number(data?.done ?? data?.completedTasks ?? data?.completed_tasks ?? 0) || 0;

    const pctRaw = data?.pct ?? data?.progressPercentage ?? data?.completionPercentage;
    const pct =
      pctRaw != null
        ? Math.max(0, Math.min(100, Number(pctRaw)))
        : total === 0
          ? 0
          : Math.round((done / total) * 100);

    return { total, done, pct };
  } catch {
    const tasks = await getTasks(projectId);
    return calcProgressFromTasks(tasks);
  }
}

// Aliases for backward compatibility
export const getMyProjects = getProjects;
export const getProjectProgressSafe = getProgress;
