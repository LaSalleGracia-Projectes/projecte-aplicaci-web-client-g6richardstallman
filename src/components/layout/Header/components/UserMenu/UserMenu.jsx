import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import Dropdown from "../../../../ui/Dropdown/Dropdown";
import "./UserMenu.css";

const UserMenu = ({ user, onLogout }) => {
  const router = useRouter();

  const userOptions = useMemo(
    () => [
      {
        label: (
          <div className="dropdown-item">
            <FaUser className="dropdown-icon" />
            <span>Mi Perfil</span>
          </div>
        ),
        value: "profile",
        onClick: () => router.push("/profile"),
      },
      {
        label: (
          <div className="dropdown-item">
            <FaSignOutAlt className="dropdown-icon" />
            <span>Cerrar Sesión</span>
          </div>
        ),
        value: "logout",
        onClick: onLogout,
      },
    ],
    [router, onLogout]
  );

  return (
    <div className="user-menu">
      <Dropdown
        trigger={
          <div className="user-trigger icon-only">
            {user?.foto_perfil ? (
              <Image
                src={user.foto_perfil}
                alt={user.nombre || "Usuario"}
                width={40}
                height={40}
                className="user-avatar"
              />
            ) : (
              <FaUserCircle className="user-icon" />
            )}
          </div>
        }
        options={userOptions}
        className="user-dropdown"
        menuClassName="user-dropdown-menu"
        triggerClassName="transparent-trigger"
      >
        {userOptions.map((option) => (
          <button
            key={option.value}
            className="user-dropdown-item"
            onClick={option.onClick}
          >
            {option.label}
          </button>
        ))}
      </Dropdown>
    </div>
  );
};

export default React.memo(UserMenu);
