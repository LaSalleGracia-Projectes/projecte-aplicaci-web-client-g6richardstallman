"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFavoriteEvents } from "../../../services/profile.service";
import { getStoredUser } from "../../../utils/user";

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteEvents, setFavoriteEvents] = useState([]);
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
        const result = await getFavoriteEvents();
        if (result.favoritos) {
          setFavoriteEvents(result.favoritos);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        setError("Error al cargar tus eventos favoritos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div>Cargando favoritos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Mis Eventos Favoritos</h1>
      
      {favoriteEvents.length > 0 ? (
        <div>
          <ul>
            {favoriteEvents.map(fav => (
              <li key={fav.idFavorito} style={{ marginBottom: 15, padding: 10, border: "1px solid #ddd", borderRadius: 5 }}>
                <div><strong>{fav.evento.nombreEvento}</strong></div>
                <div>Fecha: {fav.evento.fechaEvento}</div>
                <div>Categoría: {fav.evento.categoria}</div>
                <div>Ubicación: {fav.evento.ubicacion}</div>
                <button 
                  onClick={() => router.push(`/eventos/${fav.evento.idEvento}`)}
                  style={{ marginTop: 8 }}
                >
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No tienes eventos favoritos. Explora eventos y guarda tus favoritos para verlos aquí.</div>
      )}
    </div>
  );
}
