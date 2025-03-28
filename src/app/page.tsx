"use client"
import React from "react";
import Image from "next/image";
import { getwmmessage } from "@/services/getwmmessage";

interface Message {
  date: string;
  text: string;
}

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    getwmmessage().then((data) => {
      const transformedMessages = data.map((obj) => {
        const [[date, text]] = Object.entries(obj);
        return { date, text };
      });
      setMessages(transformedMessages);
    });
  }, []);



  return (
    <div className="">
      <span className="pt-2 w-full mx-auto inline-flex items-center justify-center gap-4">
        <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="hidden sm:block"
            priority
        />
        <h1 className="text-center sm:text-3xl font-bold text-gray-800">TCID Online Schedule</h1>
      </span>
      <div className="m-4">       
        <div className="grid justify-center">
        <h1 className="mt-4 mb-1 text-center text-yellow-950">Watermaster Messages</h1>
        <ul className="grid gap-2">
          {messages.map((message, index) => (
            <li key={index} className="max-w-[50rem] p-8 rounded-md bg-gray-700/90 font-semibold">
              <p className="-mt-4 text-gray-400 text-center">{message.date}</p>
              <h1 className="text-2xl text-amber-200 whitespace-pre-wrap">{message.text}</h1>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}
