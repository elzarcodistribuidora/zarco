import { redirect } from "next/navigation";

// El portal es la página /perfil de Webflow (con su diseño y su login modal).
// /portal queda como redirección por compatibilidad.
export default function Portal() {
  redirect("/perfil");
}
