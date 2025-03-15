import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Añadir Asistentes",
      path: "/addAssistantsPage",
      icon: FaUserPlus,
    },
  ];

  return (
    <div className="w-64 bg-white p-4 space-y-4">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link 
              href={item.path === "/addAssistantsPage" ? "/add-assistants" : item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.path ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              <item.icon className={pathname === item.path ? "text-white" : "text-gray-600"} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar; 