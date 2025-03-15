"use client";

import { AuthProvider } from '../contexts/AuthContext';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      {/* Contenido principal */}
      <main className="flex-1">{children}</main>
    </AuthProvider>
  );
} 