// BotID (Vercel) — lado cliente. Next 15.3+ carga este archivo solo, en todas
// las páginas, así que basta con declarar aquí las rutas a proteger.
//
// Solo se protege /api/quote: es el único endpoint público (sin sesión) que
// además escribe con service-role. El resto de /api/* ya exige sesión o rol
// admin, y el abuso volumétrico lo cubren las reglas de rate limit del WAF.
//
// OJO: NO se protege /api/order aunque también sea un POST de negocio — los
// pedidos se mandan desde /catalogo con sesión iniciada, y un falso positivo
// ahí le tumbaría el pedido a un cliente real.
import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    // Lo llaman ContactForm.tsx (/contacto) y GuideAccordion.tsx
    // (/guias-de-negocio).
    { path: "/api/quote", method: "POST" },
  ],
});
