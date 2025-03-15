import { useRouter } from 'next/navigation';

const EventHeader = () => {
  const router = useRouter();
  const isOrganizer = true; // Replace with actual logic to determine if the user is an organizer
  const eventId = 'someEventId'; // Replace with actual event ID

  return (
    <div>
      {isOrganizer ? (
        <button 
          onClick={() => router.push(`/event/${eventId}/sales`)}
          className="px-4 py-2 bg-black text-white rounded-full"
        >
          Ver ventas
        </button>
      ) : (
        <button 
          onClick={() => router.push(`/orders`)}
          className="px-4 py-2 bg-black text-white rounded-full"
        >
          Mis tickets
        </button>
      )}
    </div>
  );
};

export default EventHeader; 