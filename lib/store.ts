export interface UserConfig {
  programId: string;
  startDate: string; // ISO date "YYYY-MM-DD"
}

export interface SetLog {
  completed: boolean;
  weight: number | null;
  notes: string;
}

// key: "YYYY-MM-DD" -> exerciseIndex -> SetLog
export type DailyLog = Record<number, SetLog>;
export type AllLogs = Record<string, DailyLog>;

const CONFIG_KEY = 'liftlog_config';
const LOGS_KEY = 'liftlog_logs';

export function getConfig(): UserConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CONFIG_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveConfig(config: UserConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getLogs(): AllLogs {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(LOGS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveLogs(logs: AllLogs): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getDateLog(date: string): DailyLog {
  const logs = getLogs();
  return logs[date] || {};
}

export function updateSetLog(date: string, exerciseIndex: number, update: Partial<SetLog>): void {
  const logs = getLogs();
  if (!logs[date]) logs[date] = {};
  if (!logs[date][exerciseIndex]) {
    logs[date][exerciseIndex] = { completed: false, weight: null, notes: '' };
  }
  logs[date][exerciseIndex] = { ...logs[date][exerciseIndex], ...update };
  saveLogs(logs);
}

// Calculate which week/day based on start date
export function getCurrentSession(startDate: string): { week: number; day: number; sessionKey: string } | null {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;

  const totalDaysPerWeek = 4;
  const totalWeeks = 12;
  const totalDays = totalDaysPerWeek * totalWeeks;

  if (diffDays >= totalDays) return null; // Program complete

  const week = Math.floor(diffDays / totalDaysPerWeek) + 1;
  const day = (diffDays % totalDaysPerWeek) + 1;

  return { week, day, sessionKey: `W${week}D${day}` };
}

export function getSessionForDate(startDate: string, date: string): { week: number; day: number; sessionKey: string } | null {
  const start = new Date(startDate);
  const target = new Date(date);
  start.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;

  const totalDaysPerWeek = 4;
  const totalWeeks = 12;
  const totalDays = totalDaysPerWeek * totalWeeks;
  if (diffDays >= totalDays) return null;

  const week = Math.floor(diffDays / totalDaysPerWeek) + 1;
  const day = (diffDays % totalDaysPerWeek) + 1;

  return { week, day, sessionKey: `W${week}D${day}` };
}

export function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isSessionComplete(date: string, totalExercises: number): boolean {
  const log = getDateLog(date);
  if (totalExercises === 0) return false;
  return Object.values(log).filter(s => s.completed).length >= totalExercises;
}
