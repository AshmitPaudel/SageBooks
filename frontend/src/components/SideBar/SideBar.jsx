import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideBar.css';
import AdminSignOut from '../AdminSignOut'; 

const Sidebar = () => {
  const location = useLocation(); 

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <nav className="admin-nav">
          <ul>
            <li className={`nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/manage-orders' ? 'active' : ''}`}>
              <Link to="/admin/manage-orders">Manage Orders</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/manage-books' ? 'active' : ''}`}>
              <Link to="/admin/manage-books">Manage Books</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/admin/manage-users' ? 'active' : ''}`}>
              <Link to="/admin/manage-users">Manage Users</Link>
            </li>
          </ul>
        </nav>
        
        {/*  AdminSignOut  */}
        <AdminSignOut className="admin-logout-btn">
          <img src="/icons/logout.png" alt="Logout" className="logout-icon" />
          Log Out
        </AdminSignOut>
      </div>
    </aside>
  );
};

export default Sidebar;
