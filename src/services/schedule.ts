// @/services/schedule.ts
import { ScheduleRow } from '@/lib/types';

export async function submitSchedule(data: ScheduleRow[]): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error submitting schedule:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getSchedules(location?: string): Promise<ScheduleRow[]> {
  try {
    const url = location ? `/api/schedule?district=${encodeURIComponent(location)}` : '/api/schedule';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.schedules; // Expecting { schedules: ScheduleRow[], count: number }
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error; // Re-throw to handle in the component
  }
}