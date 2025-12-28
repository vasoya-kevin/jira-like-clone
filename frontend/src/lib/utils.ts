import type { TicketFilters } from "@/context/TicketContext"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const userRole = ['user', 'admin']

export const ticketStatus = {
  'to do': "To Do",
  'in_progress': 'in progress',
  'done': 'Done',
}

export const convertDate = (dueDate: string) => {
  const date = new Date(dueDate)

  return date.toLocaleDateString()
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