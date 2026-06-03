import "./marketing.css";
import SmoothScroll from "./SmoothScroll";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Fuente Inter (la del sitio original) + CSS compartido de Webflow */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap"
      />
      <link rel="stylesheet" href="/assets/webflow-shared.css" />
      {/* Scroll suave en todo el sitio. El preloader vive solo en las
          páginas que cargan datos (catálogo y portal). */}
      <SmoothScroll />
      {children}
    </>
  );
}
