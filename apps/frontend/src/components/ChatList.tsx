import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import NewChatMenu from "./NewChatMenu";
import { createChatMock } from "../services/chatApi";
import type { Chat } from "../services/chatApi";

interface ChatListProps {
  onSelectChat: (id: number) => void;
}

const initialChats: Chat[] = [
  { id: 1, name: "Proyecto - Chat Grupo 3", lastMessage: "Hola equipo 🚀", type: "chat", createdAt: new Date().toISOString() },
  { id: 2, name: "Privado con Juan", lastMessage: "¿Listo el componente?", type: "chat", createdAt: new Date().toISOString() },
  { id: 3, name: "Instructor Hernán", lastMessage: "Nos vemos el jueves", type: "chat", createdAt: new Date().toISOString() },
];

export default function ChatList({ onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats);

  async function handleCreate(type: "chat" | "group" | "forum") {
    const name = window.prompt(type === "chat" ? "Nombre del nuevo chat:" : type === "group" ? "Nombre del nuevo grupo:" : "Nombre del nuevo foro:");
    if (!name) return;
    try {
      const chat = await createChatMock({ name, type });
      setChats((prev) => [ { ...chat, lastMessage: "" }, ...prev ]);
    } catch (err) {
      console.error("Error creando mock chat", err);
    }
  }

  return (
    <div className="w-80 bg-white border-r h-full flex flex-col">
      {/* Encabezado */}
      <div className="p-4 border-b flex justify-between items-center bg-primary text-white">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <MessageCircle size={22} /> Chats
        </h2>
        <NewChatMenu onCreate={handleCreate} />
      </div>

      {/* Buscador */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2 bg-white border rounded-full px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar chat..."
            className="w-full text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="p-3 hover:bg-blue-50 cursor-pointer border-b transition"
          >
            <p className="font-medium text-gray-800">{chat.name}</p>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
