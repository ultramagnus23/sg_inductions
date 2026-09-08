export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface TimeSlot {
  day: Day;
  start: string; // "HH:MM" 24-hour
  end: string; // "HH:MM" 24-hour
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  department: string;
  location: string;
  description: string;
  credits?: number | null;
  timeSlots: TimeSlot[];
  hasSaturday: boolean;
}

export interface ScheduledCourse extends Course {
  color: string;
}

export interface TimetableDraft {
  id: string;
  name: string;
  courses: ScheduledCourse[];
  createdAt: string;
  updatedAt: string;
}

export const DAYS: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const DAYS_WITH_SATURDAY: Day[] = [...DAYS, "Saturday"];

export const COURSE_COLORS = [
  "#0e4d3f", // brand green
  "#b8560f", // brand rust
  "#2a5d8f", // blue
  "#8a5a9e", // violet
  "#a3873f", // ochre
  "#3f7d6e", // teal
  "#9e4a4a", // brick
  "#4a6741", // olive
] as const;

// Grid renders from 8:30 to 21:30
export const GRID_START_MIN = 8 * 60 + 30;
export const GRID_END_MIN = 21 * 60 + 30;
