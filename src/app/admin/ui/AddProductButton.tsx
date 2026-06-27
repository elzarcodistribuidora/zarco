"use client";

import { useState } from "react";
import { AddProductModal } from "./AddProductModal";

export function AddProductButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="admin-enter rounded-xl bg-[#0A2240] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0A2240]/20 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0c2c54] hover:shadow-[#0A2240]/30 focus-visible:ring-2 focus-visible:ring-[#0A2240]/50 active:scale-[0.97] active:shadow-none"
      >
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo Producto
        </span>
      </button>

      {isOpen && <AddProductModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
