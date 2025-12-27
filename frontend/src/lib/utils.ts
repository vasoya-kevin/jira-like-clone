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
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

export const taskStatusStyle: any = {
  "to do": "bg-stone-400",
  "in_progress": "bg-sky-600",
  "done": "bg-emerald-500"
}

export const commonBadgeStyle = 'mx-auto flex w-fit items-center gap-1 rounded-sm px-3 py-1 text-xs font-medium'