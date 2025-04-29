"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyEvents, deleteEvent } from "../../../services/profile.service";
import { getStoredUser } from "../../../utils/user";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check user role
        const user = getStoredUser();
        if (!user || user.role !== "organizador") {
          router.replace("/profile");
          return;
        }

        setLoading(true);
        const result = await getMyEvents();
        if (result.eventos) {
          setEvents(result.eventos);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Error al cargar tus eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDeleteEvent = async (eventId) => {
    if (confirm("¿Estás seguro que deseas eliminar este evento?")) {
      try {
        const result = await deleteEvent(eventId);
        if (result.status === "success") {
          setEvents(events.filter(event => event.idEvento !== eventId));
        } else {
          alert(result.message || "Error al eliminar el evento");
        }
      } catch (err) {
        console.error("Error deleting event:", err);
        alert("Error al eliminar el evento");
      }
    }
  };

  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Mis Eventos</h1>
      
      <button 
        onClick={() => router.push("/events/create")}
        style={{ marginBottom: 20 }}
      >
        Crear Nuevo Evento
      </button>
      
      {events.length > 0 ? (
        <div>
          <ul>
            {events.map(event => (
              <li key={event.idEvento} style={{ marginBottom: 15, padding: 10, border: "1px solid #ddd", borderRadius: 5 }}>
                <div><strong>{event.nombreEvento}</strong></div>
                <div>Fecha: {event.fechaEvento}</div>
                <div>Hora: {event.hora}</div>
                <div>Ubicación: {event.ubicacion}</div>
                <div>Categoría: {event.categoria}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => router.push(`/events/${event.idEvento}/edit`)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteEvent(event.idEvento)}>
                    Eliminar
                  </button>
                  <button onClick={() => router.push(`/events/${event.idEvento}`)}>
                    Ver
                  </button>
                  <button onClick={() => router.push(`/events/${event.idEvento}/manage-tickets`)}>
                    Gestionar Entradas
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No has creado eventos aún. ¡Crea tu primer evento!</div>
      )}
    </div>
  );
}
