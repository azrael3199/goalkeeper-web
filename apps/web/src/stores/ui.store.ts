import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type CalendarView = "week" | "day" | "month";
type TaskColorMode = "goal" | "priority" | "status";

interface UIStore {
  theme: Theme;
  calendarView: CalendarView;
  taskColorMode: TaskColorMode;
  notificationCount: number;
  setTheme: (t: Theme) => void;
  setCalendarView: (v: CalendarView) => void;
  setTaskColorMode: (m: TaskColorMode) => void;
  setNotificationCount: (n: number) => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  }
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "system",
      calendarView: "week",
      taskColorMode: "priority",
      notificationCount: 0,
      setTheme: (t) => {
        set({ theme: t });
        applyTheme(t);
      },
      setCalendarView: (v) => set({ calendarView: v }),
      setTaskColorMode: (m) => set({ taskColorMode: m }),
      setNotificationCount: (n) => set({ notificationCount: n }),
    }),
    {
      name: "gk-ui-prefs",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

// Watch system preference changes
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const { theme } = useUIStore.getState();
      if (theme === "system") applyTheme("system");
    });
}
