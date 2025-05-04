'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

export default function AdminDashboard() {
  // Define API base URL with fallback for missing env variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();
  
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/admin-login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Verificación fallida');
      }
      
      const data = await response.json();
      
      if (data.role !== 'admin') {
        router.push('/auth/admin-login');
        return;
      }
      
      setIsAdmin(true);
      loadData();
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/auth/admin-login');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchUsers();
      await fetchEvents();
    } catch (err) {
      setError('Error cargando los datos. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    
    const data = await response.json();
    setUsers(data.users);
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/eventos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener eventos');
    }
    
    const data = await response.json();
    setEvents(data.eventos);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/admin-login');
      }
    }
  };

  const openUserModal = (user) => {
    setCurrentUser({...user});
    setShowUserModal(true);
  };

  const openPasswordModal = (user) => {
    setCurrentUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const openDeleteConfirmModal = (user) => {
    setCurrentUser(user);
    setShowDeleteConfirmModal(true);
  };

  const openEventModal = (event) => {
    setCurrentEvent({...event});
    setShowEventModal(true);
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setModalError('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${currentUser.idUser}`,
        {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(currentUser)
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el usuario');
      }
      
      setShowUserModal(false);
      showSuccessMessage('Usuario actualizado correctamente');
      fetchUsers();
    } catch (err) {
      setModalError(err.message || 'Error al actualizar el usuario');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setModalError('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${currentUser.idUser}/password`,
        {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ new_password: newPassword })
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }
      
      setShowPasswordModal(false);
      showSuccessMessage('Contraseña actualizada correctamente');
    } catch (err) {
      setModalError(err.message || 'Error al cambiar la contraseña');
    }
  };

  const handleDeleteUser = async () => {
    setModalError('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${currentUser.idUser}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar el usuario');
      }
      
      setShowDeleteConfirmModal(false);
      showSuccessMessage('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      setModalError(err.message || 'Error al eliminar el usuario');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/admin/eventos/${eventId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar el evento');
      }
      
      showSuccessMessage('Evento eliminado correctamente');
      fetchEvents();
    } catch (err) {
      setError(err.message || 'Error al eliminar el evento');
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const filteredUsers = users.filter(user => 
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event => 
    event.nombreEvento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return <div className="admin-loading">Verificando autenticación...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h1>EventFlix Admin</h1>
        <nav>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Usuarios
          </button>
          <button 
            className={activeTab === 'events' ? 'active' : ''} 
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-alt"></i> Eventos
          </button>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar sesión
        </button>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <h2>{activeTab === 'users' ? 'Gestión de Usuarios' : 'Gestión de Eventos'}</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'users' ? 'usuarios' : 'eventos'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="refresh-button" onClick={loadData}>
            <i className="fas fa-sync-alt"></i> Actualizar
          </button>
        </div>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {error && (
          <div className="error-message">{error}</div>
        )}

        {isLoading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <div className="admin-panel">
            {activeTab === 'users' && (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.idUser}>
                        <td>{user.idUser}</td>
                        <td>{`${user.nombre} ${user.apellido1} ${user.apellido2 || ''}`}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="actions">
                          <button onClick={() => openUserModal(user)} title="Editar">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => openPasswordModal(user)} title="Cambiar contraseña">
                            <i className="fas fa-key"></i>
                          </button>
                          <button onClick={() => openDeleteConfirmModal(user)} title="Eliminar">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'events' && (
              <div className="events-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Organizador</th>
                      <th>Fecha</th>
                      <th>Categoría</th>
                      <th>Entradas vendidas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map(event => (
                      <tr key={event.idEvento}>
                        <td>{event.idEvento}</td>
                        <td>{event.nombreEvento}</td>
                        <td>{event.organizador ? `${event.organizador.nombre} ${event.organizador.apellido1}` : 'N/A'}</td>
                        <td>{new Date(event.fechaEvento).toLocaleDateString()}</td>
                        <td>{event.categoria}</td>
                        <td>
                          {event.tiposEntrada.reduce((sum, tipo) => sum + (tipo.entradas_vendidas || 0), 0)}
                        </td>
                        <td className="actions">
                          <button onClick={() => openEventModal(event)} title="Ver detalles">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.idEvento)} 
                            title="Eliminar"
                            disabled={event.tiposEntrada.some(tipo => tipo.entradas_vendidas > 0)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {showUserModal && currentUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar Usuario</h3>
            {modalError && <div className="modal-error">{modalError}</div>}
            <form onSubmit={handleUserUpdate}>
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  value={currentUser.nombre || ''} 
                  onChange={(e) => setCurrentUser({...currentUser, nombre: e.target.value})} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Primer Apellido</label>
                <input 
                  type="text" 
                  value={currentUser.apellido1 || ''} 
                  onChange={(e) => setCurrentUser({...currentUser, apellido1: e.target.value})} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Segundo Apellido</label>
                <input 
                  type="text" 
                  value={currentUser.apellido2 || ''} 
                  onChange={(e) => setCurrentUser({...currentUser, apellido2: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={currentUser.email || ''} 
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select 
                  value={currentUser.role} 
                  onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="organizador">Organizador</option>
                  <option value="participante">Participante</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Guardar</button>
                <button type="button" onClick={() => setShowUserModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && currentUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Cambiar Contraseña</h3>
            <p>Usuario: {currentUser.email}</p>
            {modalError && <div className="modal-error">{modalError}</div>}
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required
                  minLength="8"
                  placeholder="Mínimo 8 caracteres con mayúsculas, minúsculas y números"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Cambiar</button>
                <button type="button" onClick={() => setShowPasswordModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && currentUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar al usuario {currentUser.nombre} {currentUser.apellido1}?</p>
            {modalError && <div className="modal-error">{modalError}</div>}
            <div className="modal-actions">
              <button onClick={handleDeleteUser} className="btn-danger">Eliminar</button>
              <button onClick={() => setShowDeleteConfirmModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showEventModal && currentEvent && (
        <div className="modal-backdrop">
          <div className="modal wide">
            <h3>Detalles del Evento</h3>
            <div className="event-detail">
              <div className="event-info">
                <p><strong>ID:</strong> {currentEvent.idEvento}</p>
                <p><strong>Nombre:</strong> {currentEvent.nombreEvento}</p>
                <p><strong>Descripción:</strong> {currentEvent.descripcion}</p>
                <p><strong>Fecha:</strong> {new Date(currentEvent.fechaEvento).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {currentEvent.hora}</p>
                <p><strong>Ubicación:</strong> {currentEvent.ubicacion}</p>
                <p><strong>Categoría:</strong> {currentEvent.categoria}</p>
                <p><strong>Tipo:</strong> {currentEvent.es_online ? 'Online' : 'Presencial'}</p>
                {currentEvent.es_online && (
                  <p><strong>Enlace:</strong> {currentEvent.enlace_streaming}</p>
                )}
                <p><strong>Organizador:</strong> {currentEvent.organizador?.nombre} {currentEvent.organizador?.apellido1}</p>
              </div>
              
              <div className="event-tickets">
                <h4>Tipos de Entradas</h4>
                <ul>
                  {currentEvent.tiposEntrada?.map((tipo) => (
                    <li key={tipo.idTipoEntrada}>
                      <p><strong>{tipo.nombre}</strong> - {tipo.precio}€</p>
                      <p>Disponibles: {tipo.es_ilimitado ? 'Ilimitadas' : `${tipo.cantidad_disponible - tipo.entradas_vendidas} de ${tipo.cantidad_disponible}`}</p>
                      <p>Vendidas: {tipo.entradas_vendidas}</p>
                      <p>Estado: {tipo.activo ? 'Activo' : 'Inactivo'}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              {currentEvent.imagen && (
                <div className="event-image">
                  <img src={currentEvent.imagen} alt={currentEvent.nombreEvento} />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEventModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
