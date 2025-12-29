import type { TicketFilters } from "@/context/TicketContext"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type AnalyticsRecord = Record<string, number>

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const userRole = ['user', 'admin']

export const ticketStatus = {
  'to do': "To Do",
  'in_progress': 'in progress',
  'done': 'Done',
}

export const priorityStyles: any = {
  HIGH: "bg-red-500 text-white",
  MEDIUM: "bg-yellow-400 text-yellow-900",
  LOW: "bg-emerald-500 text-white",
};

export const taskStatusStyle: any = {
  "to do": "bg-gray-500",
  "in_progress": "bg-sky-700",
  "done": "bg-green-700"
}

export const convertDate = (dueDate: string) => {
  const date = new Date(dueDate)

  return date.toLocaleDateString()
}

export const buildTaskQuery = (filters: TicketFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, String(value))
  })

  return params.toString()
}

export const commonBadgeStyle = 'mx-auto flex w-fit items-center gap-1 rounded-sm px-3 py-1 text-xs font-medium'

export const TicketStatus = [
  {
    label: 'To Do',
    value: 'TO DO'
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS'
  },
  {
    label: 'Done',
    value: 'DONE'
  },
]

export const TicketPriority = [
  {
    label: 'High',
    value: 'HIGH'
  },
  {
    label: 'Medium',
    value: 'MEDIUM'
  },
  {
    label: 'Low',
    value: 'LOW'
  }
]


export const buildChartData = (
  data: AnalyticsRecord | undefined,
  colorMap: Record<string, string>
) => {
  if (!data) return []

  return Object.entries(data)
    .filter(([key]) => key !== "total") // exclude totals
    .map(([key, value]) => ({
      label: key.replace("_", " "),
      value,
      fill: colorMap[key] ?? "var(--chart-1)",
    }))
}

export const ticketStatusColors: Record<string, string> = {
  DONE: "var(--chart-2)",
  "TO DO": "var(--chart-5)",
  IN_PROGRESS: "var(--chart-3)",
}

export const ticketPriorityColors: Record<string, string> = {
  HIGH: "var(--chart-1)",
  MEDIUM: "var(--chart-4)",
  LOW: "var(--chart-2)",
}