import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Dubaji Ingatlanos",
  description: "Dubai ingatlan befektetési asszisztens",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body style={{ margin: 0, padding: 0, background: "#ffffff", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
