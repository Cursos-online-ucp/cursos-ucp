import React, { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    alert(`Mensaje enviado: ${text}`);
    setText("");
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
     <button
        onClick={handleSend}
        className="btn-send px-4 py-2 rounded-full transition-colors duration-200"
      >
        Enviar
    </button>

    </div>
  );
}
