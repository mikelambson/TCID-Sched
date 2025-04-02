// @/features/schedule/columns.tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ScheduleRow } from "@/lib/types";

export const columns: ColumnDef<ScheduleRow>[] = [
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime") as string); // Convert string to Date
      const hour = startTime.getHours(); // Get hour in 24-hour format
      let timeOfDay: string;

      if (hour >= 6 && hour < 12) {
        timeOfDay = "morning";
      } else if (hour >= 12 && hour < 18) {
        timeOfDay = "afternoon";
      } else {
        timeOfDay = "night";
      }

      return `${startTime.toLocaleDateString()} ${timeOfDay}`;
    },
  },
  {
    accessorKey: "orderNumber",
    header: "Order #",
  },
  {
    accessorKey: "mainLateral",
    header: "Canal", // Assuming "mainLateral" represents the canal
  },
  {
    accessorKey: "district",
    header: "District", // Replacing "customer" with "district" (or adjust as needed)
  },
  {
    accessorKey: "cfs",
    header: "CFS",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "lineHead",
    header: "Line/Head",
  },
];