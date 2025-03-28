"use client"
import { OrderTable } from "@/features/schedule/ordertable";
import { getSchedule } from "@/services/getschedule";

interface ScheduleProps {
    location: string;
}

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table"; // Adjust the import path if necessary

const Schedule = (props: ScheduleProps) => {
    const [schedule, setSchedule] = useState<{ columns: ColumnDef<{ orderId: number; customerName: string; orderDate: string; total: number; }, unknown>[]; data: { orderId: number; customerName: string; orderDate: string; total: number; }[] } | null>(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            const data = await getSchedule();
            setSchedule({
                ...data,
                columns: data.columns.map((col: { Header: string; accessor: string }) => ({
                    header: col.Header,
                    accessorKey: col.accessor,
                })),
            });
        };
        fetchSchedule();
    }, []);

    if (!schedule) {
        return <div>Loading...</div>;
    }

    return ( 
        <div className="my-4 grid gap-4 p-2">
            <h1>{props.location}</h1>
            <OrderTable 
                location={props.location}
            />
        </div>
     );
}
 
export default Schedule;