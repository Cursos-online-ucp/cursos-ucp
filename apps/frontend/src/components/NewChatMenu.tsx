import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

type NewType = "chat" | "group" | "forum";

interface Props {
  onCreate?: (type: NewType) => void;
}

export default function NewChatMenu({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    if (open) firstButtonRef.current?.focus();
  }, [open]);

  function select(type: NewType) {
    setOpen(false);
    onCreate?.(type);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Crear"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md transition-colors duration-200 text-white btn-create focus:outline-none"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Crear nuevo"
          className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50"
        >
          <div className="py-1">
            <button
              ref={firstButtonRef}
              role="menuitem"
              onClick={() => select("chat")}
              className="w-full text-left px-4 py-2 menu-item focus:outline-none"
            >
              Nuevo chat
            </button>

            <button
              role="menuitem"
              onClick={() => select("group")}
              className="w-full text-left px-4 py-2 menu-item focus:outline-none"
            >
              Nuevo grupo
            </button>

            <button
              role="menuitem"
              onClick={() => select("forum")}
              className="w-full text-left px-4 py-2 menu-item focus:outline-none"
            >
              Nuevo foro
            </button>

            <div className="mt-2 px-3">
              <button
                onClick={() => setOpen(false)}
                className="w-full px-2 py-1 rounded text-sm bg-secondary text-white hover:opacity-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
