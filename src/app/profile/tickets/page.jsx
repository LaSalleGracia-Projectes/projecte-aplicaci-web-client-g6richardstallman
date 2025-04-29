"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyPurchases } from "../../../services/profile.service";
import { getStoredUser } from "../../../utils/user";

export default function TicketsPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check user role
        const user = getStoredUser();
        if (!user || user.role !== "participante") {
          router.replace("/profile");
          return;
        }

        setLoading(true);
        const result = await getMyPurchases();
        if (result.compras) {
          setPurchases(result.compras);
        }
      } catch (error) {
        console.error("Error loading purchases:", error);
        setError("Error al cargar tus entradas compradas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div>Cargando entradas...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Mis Entradas</h1>
      
      {purchases.length > 0 ? (
        <div>
          <ul>
            {purchases.map(purchase => (
              <li key={purchase.idVentaEntrada} style={{ marginBottom: 15, padding: 10, border: "1px solid #ddd", borderRadius: 5 }}>
                <div><strong>{purchase.entrada?.evento?.nombreEvento}</strong></div>
                <div>Fecha: {purchase.entrada?.evento?.fechaEvento}</div>
                <div>Hora: {purchase.entrada?.evento?.hora}</div>
                <div>Tipo de entrada: {purchase.entrada?.tipoEntrada?.nombre}</div>
                <div>Precio: €{purchase.precio}</div>
                <div>Estado de pago: {purchase.estado_pago}</div>
                <div>Fecha de compra: {new Date(purchase.fecha_compra).toLocaleDateString()}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => router.push(`/compras/${purchase.idVentaEntrada}`)}>
                    Ver Detalles
                  </button>
                  <button onClick={() => router.push(`/compras/${purchase.idVentaEntrada}/factura`)}>
                    Ver Factura
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No has comprado entradas. Explora eventos disponibles para comprar entradas.</div>
      )}
    </div>
  );
}
