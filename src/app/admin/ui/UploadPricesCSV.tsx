"use client";

import { useState, useRef } from "react";

export function UploadPricesCSV() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      
      // Basic CSV parsing
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        alert("El archivo parece estar vacío o no tiene encabezados.");
        return;
      }

      // Read headers and find indices
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      let codeIdx = headers.findIndex(h => h.includes('codigo') || h.includes('código') || h.includes('clave') || h.includes('sku') || h.includes('articulo'));
      let priceIdx = headers.findIndex(h => h.includes('precio') || h.includes('costo') || h.includes('final'));

      if (codeIdx === -1 || priceIdx === -1) {
        if (headers.length >= 2) {
            codeIdx = 0;
            priceIdx = 1;
        } else {
            alert("No se detectaron las columnas de 'código' y 'precio'. Asegúrate de que el CSV tenga los títulos correctos en la primera fila.");
            return;
        }
      }

      const updates = [];
      for (let i = 1; i < lines.length; i++) {
        // Split handling simple commas (no quotes handling for complex fields for now, as codes and prices shouldn't contain commas)
        const columns = lines[i].split(',').map(c => c.trim().replace(/['"]/g, ''));
        if (columns.length <= Math.max(codeIdx, priceIdx)) continue;
        
        const rawCode = columns[codeIdx];
        if (!rawCode) continue;
        
        const formattedCode = rawCode.startsWith('ZRC-') ? rawCode : `ZRC-${rawCode}`;
        
        const priceStr = columns[priceIdx].replace(/[^0-9.]/g, ''); 
        const price = parseFloat(priceStr);
        if (isNaN(price)) continue;
        
        updates.push({ codigo: formattedCode, precio: price });
      }

      if (updates.length === 0) {
        alert("No se encontraron datos válidos para actualizar.");
        return;
      }

      const res = await fetch('/api/admin/sync-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      const result = await res.json();
      if (res.ok) {
        // La ruta ya distingue "escrito de verdad" de "no afectó ninguna fila"
        // (código inexistente o RLS bloqueando), así que lo reportamos tal cual
        // en vez de cantar éxito siempre.
        let msg = `Se actualizaron ${result.processedCount} productos.`;
        if (result.failedCount > 0) {
          msg += `\n\n${result.failedCount} no se pudieron actualizar`;
          if (result.failedCodigos?.length) {
            msg += ` (revisa que el código exista): ${result.failedCodigos.join(', ')}`;
            if (result.failedCount > result.failedCodigos.length) msg += '…';
          }
        }
        alert(msg);
        window.location.reload();
      } else {
        alert(`Error: ${result.error || 'Ocurrió un problema al sincronizar.'}`);
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el archivo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="admin-enter rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-600/30 focus-visible:ring-2 focus-visible:ring-emerald-600/50 active:scale-[0.97] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {isUploading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          )}
          {isUploading ? "Sincronizando..." : "Sincronizar CSV"}
        </span>
      </button>
    </>
  );
}
