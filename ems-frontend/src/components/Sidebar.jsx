
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  BriefcaseBusiness
} from 'lucide-react';

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <BriefcaseBusiness size={25} />
        </div>
        <div>
          <h2>EMS Pro</h2>
          <span>Management Suite</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu">
        <p className="sidebar-heading">MAIN MENU</p>

        <nav>
          <ul>
            <li className="active">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </li>

            <li>
              <Users size={20} />
              <span>Employees</span>
            </li>

            <li>
              <Building2 size={20} />
              <span>Departments</span>
            </li>

            <li>
              <BarChart3 size={20} />
              <span>Reports</span>
            </li>

          </ul>
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="sidebar-bottom">
        <p className="sidebar-heading">PREFERENCES</p>

        <nav>
          <ul>
            <li>
              <Settings size={20} />
              <span>Settings</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-icon">✦</div>
        <div>
          <strong>EMS Pro</strong>
          <span>Employee Management</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
