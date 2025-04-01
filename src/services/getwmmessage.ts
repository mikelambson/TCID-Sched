import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ Get all messages
export function useWmessages() {
  return useQuery({
    queryKey: ['wmessages'],
    queryFn: async () => {
        const res = await fetch('/api/wmessages');
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        return data.messages ?? []; // fallback in case it's empty
      },
  });
}

// ✅ Create a new message (no userId anymore)
export function useCreateWmessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { message: string }) => {
      const res = await fetch('/api/wmessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create message');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wmessages'] }),
  });
}

// ✅ Update a message (either message or active)
export function useUpdateWmessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      message?: string;
      active?: boolean;
    }) => {
      const res = await fetch(`/api/wmessages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update message');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wmessages'] }),
  });
}

// ✅ Delete a message by ID
export function useDeleteWmessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/wmessages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete message');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wmessages'] }),
  });
}

