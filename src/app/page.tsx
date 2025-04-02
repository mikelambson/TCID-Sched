'use client';

import Image from "next/image";
import { useWmessages } from '@/services/getwmmessage';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
  id: string;
  message: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const { data: messages, isLoading, isError } = useWmessages();

  return (
    <div>
      <span className="pt-2 w-full mx-auto inline-flex items-center justify-center gap-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="hidden sm:block"
          priority
        />
        <h1 className="text-center sm:text-3xl font-bold text-gray-800">
          TCID Online Schedule
        </h1>
      </span>

      <div className="m-4">
        <div className="grid justify-center">
          <h1 className="mt-4 mb-1 text-center text-yellow-950">Watermaster Messages</h1>

          {isLoading && <p className="text-center text-muted-foreground">Loading messages...</p>}
          {isError && <p className="text-center text-red-500">Error loading messages.</p>}

          {messages?.filter((msg: Message) => msg.active).length === 0 && (
            <p className="text-center text-muted-foreground italic">No active messages.</p>
          )}

          <ul className="grid gap-4 max-w-2xl">
            {messages
              ?.filter((msg: Message) => msg.active)
              .sort(
              (a: Message, b: Message) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .map((msg: Message) => (
              <Card key={msg.id} className="bg-gray-700/90 text-amber-200">
                <CardContent className="p-6 space-y-2">
                <p className="text-sm text-gray-400 text-center">
                  {new Date(msg.createdAt).toLocaleDateString('en-GB')}
                </p>
                <h2 className="text-xl font-semibold whitespace-pre-wrap">
                  {msg.message.replace(/\\n/g, '\n')}
                </h2>
                </CardContent>
              </Card>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
