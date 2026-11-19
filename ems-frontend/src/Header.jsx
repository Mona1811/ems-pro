
import {
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

function Header() {
  return (
    <header className="header">

      <div className="header-left">
        <h2>Welcome to EMS Pro 👋</h2>
        <p>Here's what's happening with your workforce today.</p>
      </div>

      <div className="header-right">

        <div className="header-search">
          <Search size={18} />
          <span>Employee Management</span>
        </div>

        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">

          <div className="admin-avatar">A</div>

          <div className="admin-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <ChevronDown size={17} className="profile-chevron" />

        </div>

      </div>

    </header>
  );
}

export default Header;
