import "./globals.css";
import "./layout.css";
import { NotificationProvider } from "../context/NotificationContext";

export const metadata = {
  title: "Eventflix",
  description: "Encuentra y gestiona eventos fácilmente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
