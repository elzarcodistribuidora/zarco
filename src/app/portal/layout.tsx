import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${inter.variable} font-sans`}>{children}</div>;
}
