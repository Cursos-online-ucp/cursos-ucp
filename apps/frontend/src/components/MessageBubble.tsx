import React from "react";

interface MessageProps {
  message: {
    id: number;
    sender: string;
    text: string;
    fromMe: boolean;
  };
}

export default function MessageBubble({ message }: MessageProps) {
  return (
    <div
      className={`flex ${
        message.fromMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-lg shadow text-sm max-w-xs ${
          message.fromMe
            ? "bg-[rgb(0,128,78)] text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {!message.fromMe && (
          <p className="font-semibold text-xs text-gray-500 mb-1">
            {message.sender}
          </p>
        )}
        <p>{message.text}</p>
      </div>
    </div>
  );
}
