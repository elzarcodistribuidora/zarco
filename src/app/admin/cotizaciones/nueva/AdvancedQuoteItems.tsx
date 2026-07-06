"use client";

import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import { useBuilderContext } from "@flouviahq/elements/react";

export function AdvancedQuoteItems() {
  const {
    items,
    setItems,
    updateItem,
    removeItem,
    products,
    ivaIncluido,
    setIvaIncluido,
    t
  } = useBuilderContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = (products || []).filter((p: any) => {
    if (!searchQuery) return false;
    const q = searchQuery.toLowerCase();
    const name = (p.nombre_web || p.nombre || "").toLowerCase();
    const code = (p.codigo || "").toLowerCase();
    return name.includes(q) || code.includes(q);
  }).slice(0, 15); // limit to top 15 results

  const handleSelectProduct = (product: any) => {
    const newItem = {
      descripcion: product.nombre_web || product.nombre,
      cantidad: 1,
      precio_unitario: product.precio_final || product.precio || 0,
      codigo: product.codigo,
      categoria: product.categoria,
      marca: product.marca
    };

    // If there is a single empty item, replace it. Otherwise, append.
    if (items.length === 1 && !items[0].descripcion) {
      setItems([newItem]);
    } else {
      setItems([...items, newItem]);
    }
    
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-lg text-[#0A2240]">Partidas de la Cotización</h3>
          <p className="text-sm text-slate-500 mt-1">Busca e inserta productos rápidamente</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            Precios incluyen IVA
          </span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={ivaIncluido}
              onChange={(e) => setIvaIncluido(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${ivaIncluido ? 'bg-[#A81200]' : 'bg-slate-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${ivaIncluido ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* Advanced Search Spotlight */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center w-full">
          <svg className="absolute left-4 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base text-[#0A2240] placeholder-slate-400 shadow-sm transition-all focus:border-[#A81200] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A81200]"
            placeholder="Buscar por nombre, código o SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          {/* Keyboard shortcut hint */}
          <div className="absolute right-4 hidden sm:flex items-center gap-1">
            <kbd className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-sans font-semibold text-slate-400 shadow-sm">⌘</kbd>
            <kbd className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-sans font-semibold text-slate-400 shadow-sm">K</kbd>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && searchQuery && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {filteredProducts.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto p-2">
                {filteredProducts.map((product: any, idx: number) => (
                  <li 
                    key={idx}
                    onClick={() => handleSelectProduct(product)}
                    className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-semibold text-[#0A2240] group-hover:text-[#A81200] transition-colors">
                        {product.nombre_web || product.nombre}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        {product.codigo && <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{product.codigo}</span>}
                        {product.marca && <span>• {product.marca}</span>}
                        {product.categoria && <span>• {product.categoria}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-bold text-[#0A2240]">
                        ${Number(product.precio_final || product.precio || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Precio Unit.</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">No se encontraron productos para "{searchQuery}"</p>
                <p className="text-xs text-slate-400 mt-1">Intenta con otro término o código.</p>
                
                {/* Fallback to add custom line */}
                <button 
                  onClick={() => handleSelectProduct({ nombre_web: searchQuery, precio_final: 0 })}
                  className="mt-4 text-sm font-bold text-[#A81200] hover:text-red-700 transition-colors"
                >
                  + Agregar como partida libre
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Items Table / List */}
      <div className="flex flex-col gap-3 mt-4">
        {items.map((item: any, index: number) => {
          // Si el item es el inicial vacío, no mostrarlo tan prominente o mostrar placeholder
          if (items.length === 1 && !item.descripcion) {
             return (
               <div key={index} className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 mb-4">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                   </svg>
                 </div>
                 <h4 className="text-sm font-bold text-[#0A2240]">No hay partidas</h4>
                 <p className="text-xs text-slate-500 max-w-sm mt-2">Usa el buscador de arriba para encontrar y agregar productos a tu cotización.</p>
               </div>
             );
          }

          const subtotalLine = Number(item.cantidad) * Number(item.precio_unitario);

          return (
            <div 
              key={index} 
              className="group relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-[#A81200]/30 hover:shadow-md"
            >
              {/* Info Column */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <input
                  type="text"
                  className="w-full font-bold text-[#0A2240] text-base border-none p-0 focus:ring-0 focus:outline-none bg-transparent placeholder-slate-400"
                  placeholder="Descripción del producto..."
                  value={item.descripcion}
                  onChange={(e) => updateItem(index, { descripcion: e.target.value })}
                />
                <div className="flex items-center gap-2 text-xs">
                  {item.codigo ? (
                    <span className="font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{item.codigo}</span>
                  ) : (
                    <span className="font-sans font-medium text-slate-400 italic">Partida Libre</span>
                  )}
                  {item.categoria && <span className="text-slate-400">• {item.categoria}</span>}
                </div>
              </div>

              {/* Controls Column */}
              <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                
                {/* Quantity Stepper */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cant.</label>
                  <div className="flex items-center h-10 rounded-lg border border-slate-200 bg-slate-50">
                    <button 
                      type="button"
                      onClick={() => updateItem(index, { cantidad: Math.max(1, Number(item.cantidad) - 1) })}
                      className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-[#A81200] hover:bg-slate-100 rounded-l-lg transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                    </button>
                    <input 
                      type="number"
                      min="1"
                      className="w-12 h-full text-center font-semibold text-[#0A2240] bg-transparent border-none p-0 focus:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                      value={item.cantidad}
                      onChange={(e) => updateItem(index, { cantidad: Number(e.target.value) || 1 })}
                    />
                    <button 
                      type="button"
                      onClick={() => updateItem(index, { cantidad: Number(item.cantidad) + 1 })}
                      className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-[#A81200] hover:bg-slate-100 rounded-r-lg transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">P. Unitario</label>
                  <div className="relative h-10 w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input 
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full h-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-sm font-semibold text-[#0A2240] transition-colors focus:border-[#A81200] focus:ring-1 focus:ring-[#A81200] focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                      value={item.precio_unitario}
                      onChange={(e) => updateItem(index, { precio_unitario: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex flex-col gap-1 min-w-[90px] text-right">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtotal</label>
                  <div className="flex items-center justify-end h-10">
                    <span className="font-bold text-[#0A2240] text-lg">
                      ${subtotalLine.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  type="button"
                  onClick={() => removeItem(index)}
                  className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 sm:group-hover:opacity-100 focus:opacity-100 sm:-mr-2"
                  title="Eliminar partida"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
