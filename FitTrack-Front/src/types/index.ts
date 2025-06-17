// Auth types
export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string | null;
  user: User | null;
}

// Physical metrics types
export interface PhysicalMetrics {
  age: number;
  gender: string;
  weight_kg: number;
  height_cm: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  bmi?: number;
}

// Fitness goal types
export interface FitnessGoal {
  id: string;
  goal_description: string;
  target_date: string;
  completed?: boolean;
  progress?: number;
}

// Chat message types
export interface ChatMessage {
  id: string;
  question?: string;
  answer?: string;
  timestamp: Date;
}