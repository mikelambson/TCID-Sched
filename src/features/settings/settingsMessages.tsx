'use client';

import {
  useWmessages,
  useCreateWmessage,
  useUpdateWmessage,
  useDeleteWmessage,
} from '@/services/getwmmessage';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

// Updated Wmessage type
type Wmessage = {
  id: string;
  message: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function SettingsWmessages() {
  const { data, isLoading } = useWmessages();
  const createMsg = useCreateWmessage();
  const updateMsg = useUpdateWmessage();
  const deleteMsg = useDeleteWmessage();

  const [newMessage, setNewMessage] = useState('');

  const handleCreate = () => {
    if (newMessage) {
      createMsg.mutate({ message: newMessage });
      setNewMessage('');
    }
  };

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <Card>
      <CardContent className="space-y-6 p-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Add New Message</h2>
          <Input
            placeholder="Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleCreate}>Create</Button>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-bold">Existing Messages</h2>
          {data
            ?.slice()
            .sort(
              (a: Wmessage, b: Wmessage) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((msg: Wmessage) => (
              <div
                key={msg.id}
                className="border rounded p-4 flex flex-col gap-2 mb-4"
              >
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(msg.createdAt).toLocaleString()}
                </div>
                <Input
                  value={msg.message}
                  onChange={(e) =>
                    updateMsg.mutate({ id: msg.id, message: e.target.value })
                  }
                />
                <div className="flex items-center gap-2">
                  <span>Active:</span>
                  <Switch
                    checked={msg.active}
                    onCheckedChange={(checked) =>
                      updateMsg.mutate({ id: msg.id, active: checked })
                    }
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteMsg.mutate(msg.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
