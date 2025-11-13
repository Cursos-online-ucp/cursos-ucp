import { useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  // Estado que guarda el chat seleccionado
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  return (
    <div className="h-screen w-screen flex bg-gray-200 text-gray-800 overflow-hidden">
      {/* Panel izquierdo: lista de chats */}
      <ChatList onSelectChat={(id) => setSelectedChat(id)} />

      {/* Panel derecho: ventana del chat seleccionado */}
      <ChatWindow chatId={selectedChat} />
    </div>
  );
}
