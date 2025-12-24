// src/api/types.ts

export type AuthResponse = {
  token: string;
  user?: { id: number; email: string; fullName?: string };
};

export type Project = {
  id: number;
  title: string;
  description?: string | null;
};

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  completed: boolean;
};

export type ProjectProgress = {
  total: number;
  done: number;
  pct: number; // 0..100
};

// Spring Data style page response
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 0-based
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
};
