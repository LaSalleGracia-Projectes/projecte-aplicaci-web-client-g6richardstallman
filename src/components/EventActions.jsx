import { useRouter } from 'next/router';
import { FaEnvelope } from 'react-icons/fa';

const EventActions = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/email-management/" + eventId)}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
    >
      <FaEnvelope />
      <span>Gestionar emails</span>
    </button>
  );
};

export default EventActions; 