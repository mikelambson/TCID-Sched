"use client";

import { useEffect, useState } from "react";
import { OrderTable } from "@/features/schedule/ordertable";
import { getSchedules } from "@/services/schedule";
import { ScheduleRow } from "@/lib/types";

interface ScheduleProps {
  location: string;
}

const Schedule = (props: ScheduleProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await getSchedules(props.location.toUpperCase());
        setScheduleData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [props.location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!scheduleData) {
    return <div>No data available</div>;
  }

  return (
    <div className="my-4 grid gap-4 p-2">
      <h1>{props.location}</h1>
      <OrderTable location={props.location} data={scheduleData} />
    </div>
  );
};

export default Schedule;