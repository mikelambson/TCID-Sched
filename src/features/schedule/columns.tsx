"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ScheduleItem } from "@/features/schedule/types"

export const columns: ColumnDef<ScheduleItem>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "canal",
    header: "Canal",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
]
