import "./globals.css";

export const metadata = {
  title: "Eventflix",
  description: "Encuentra y gestiona eventos fácilmente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}