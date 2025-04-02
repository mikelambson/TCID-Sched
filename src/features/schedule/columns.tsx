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
    filterFn: (row, columnId, filterValue) => {
      // Implement your custom filter logic here
      return String(row.getValue(columnId)).startsWith(String(filterValue));
    },
  },
  {
    accessorKey: "mainLateral",
    header: "Lateral - Takeout",
    filterFn: (row, columnId, filterValue) => {
      const isNumeric = !isNaN(Number(filterValue.charAt(0)));
      if (!isNumeric) {
        return String(row.getValue(columnId)).toLowerCase().startsWith(String(filterValue).toLowerCase());
      }
      return true; // Don’t filter mainLateral if input is numeric
    },
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