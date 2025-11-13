import React from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { UserCircle2 } from "lucide-react";

interface ChatWindowProps {
  chatId: number | null;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <UserCircle2 size={64} className="text-gray-400 mb-3" />
        <p className="text-lg font-medium">Selecciona un chat para comenzar</p>
      </div>
    );
  }

  const messages = [
    { id: 1, sender: "Jhon", text: "Hola equipo, ¿cómo va todo?", fromMe: false },
    { id: 2, sender: "Tú", text: "Todo bien 😄", fromMe: true },
    { id: 3, sender: "Juan", text: "Estoy revisando el backend", fromMe: false },
    { id: 4, sender: "Tú", text: "Perfecto, yo avanzo con el frontend", fromMe: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-200">
      {/* Encabezado del chat */}
      <div className="p-4 border-b bg-white shadow-sm flex items-center gap-3">
        <UserCircle2 className="text-gray-400" size={32} />
        <h2 className="font-semibold text-gray-700">Chat #{chatId}</h2>
      </div>

      {/* Área de mensajes con fondo e imagen */}
<div className="relative flex-1 overflow-y-auto p-4 space-y-3">
  {/* Imagen de fondo */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-40"
    style={{ backgroundImage: "url('/src/assets/fondo-chat.jpg')" }}
  ></div>

  {/* Contenido encima */}
  <div className="relative z-10">
    {messages.map((msg) => (
      <MessageBubble key={msg.id} message={msg} />
    ))}
  </div>
</div>


      {/* Caja de texto */}
      <div className="p-3 border-t bg-white">
        <MessageInput />
      </div>
    </div>
  );
}
