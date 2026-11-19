
import { useEffect, useState } from 'react';

import {
  Users,
  Building2,
  Wallet,
  IndianRupee,
  CheckCircle2,
  Clock,
  UserX,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ListChecks
} from 'lucide-react';

const API_URL = 'http://localhost:8080/api/employees';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    salary: '',
    status: 'Active'
  });

  // Fetch employees
  useEffect(() => {
    let ignore = false;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch employees.');
        }

        const data = await response.json();

        if (!ignore) {
          setEmployees(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      ignore = true;
    };
  }, []);

  // Department list
  const departments = [
    ...new Set(
      employees.map((employee) => employee.department)
    )
  ].sort();

  // Search and department filtering
  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      employee.name.toLowerCase().includes(search) ||
      employee.email.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search);

    const matchesDepartment =
      departmentFilter === 'All' ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Dashboard statistics
  const totalEmployees = employees.length;
  const departmentCount = departments.length;

  const totalSalary = employees.reduce(
    (total, employee) => total + Number(employee.salary),
    0
  );

  const averageSalary = totalEmployees
    ? totalSalary / totalEmployees
    : 0;

  // Employee status statistics
  const activeEmployees = employees.filter(
    (employee) => (employee.status || 'Active') === 'Active'
  ).length;

  const employeesOnLeave = employees.filter(
    (employee) => employee.status === 'On Leave'
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === 'Inactive'
  ).length;

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: ''
    }));
  };

  // Validate employee form
  const validateForm = () => {
    const errors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const department = formData.department.trim();
    const salary = Number(formData.salary);

    if (!name) {
      errors.name = 'Employee name is required.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!department) {
      errors.department = 'Department is required.';
    }

    if (!formData.salary.trim()) {
      errors.salary = 'Salary is required.';
    } else if (!Number.isFinite(salary) || salary <= 0) {
      errors.salary = 'Salary must be greater than zero.';
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      salary: '',
      status: 'Active'
    });

    setFieldErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  // Add or update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const employeeData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      salary: Number(formData.salary),
      status: formData.status
    };

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(employeeData)
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Unable to save employee.');
      }

      const savedEmployee = await response.json();

      if (isEditing) {
        setEmployees((previousEmployees) =>
          previousEmployees.map((employee) =>
            employee.id === editingId ? savedEmployee : employee
          )
        );

        setSelectedEmployee((previousEmployee) =>
          previousEmployee?.id === editingId
            ? savedEmployee
            : previousEmployee
        );
      } else {
        setEmployees((previousEmployees) => [
          ...previousEmployees,
          savedEmployee
        ]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // View employee details
  const handleView = (employee) => {
    setSelectedEmployee(employee);
  };

  // Edit employee
  const handleEdit = (employee) => {
    setSelectedEmployee(null);

    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: employee.salary.toString(),
      status: employee.status || 'Active'
    });

    setFieldErrors({});
    setEditingId(employee.id);
    setShowForm(true);
    setError('');
  };

  // Delete employee
  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setError('');

    try {
      const response = await fetch(
        `${API_URL}/${employee.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Unable to delete employee.');
      }

      if (selectedEmployee?.id === employee.id) {
        setSelectedEmployee(null);
      }

      setEmployees((previousEmployees) =>
        previousEmployees.filter(
          (item) => item.id !== employee.id
        )
      );

      if (editingId === employee.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard">

      <h1>Dashboard Overview</h1>

      {/* Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={25} />
          </div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <h2>{totalEmployees}</h2>
            <p>Registered employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Building2 size={25} />
          </div>
          <div className="stat-content">
            <h3>Departments</h3>
            <h2>{departmentCount}</h2>
            <p>Active departments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={25} />
          </div>
          <div className="stat-content">
            <h3>Average Salary</h3>
            <h2>
              ₹{averageSalary.toLocaleString('en-IN', {
                maximumFractionDigits: 2
              })}
            </h2>
            <p>Average employee salary</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <IndianRupee size={25} />
          </div>
          <div className="stat-content">
            <h3>Total Payroll</h3>
            <h2>₹{totalSalary.toLocaleString('en-IN')}</h2>
            <p>Total salary expenditure</p>
          </div>
        </div>

      </div>

      {/* Employee Status Summary */}
      <div className="status-stats-container">

        <div className="status-stat-card active-stat">
          <div className="status-icon active-icon">
            <CheckCircle2 size={27} />
          </div>
          <div className="status-content">
            <h3>Active Employees</h3>
            <h2>{activeEmployees}</h2>
            <p>Currently working</p>
          </div>
        </div>

        <div className="status-stat-card leave-stat">
          <div className="status-icon leave-icon">
            <Clock size={27} />
          </div>
          <div className="status-content">
            <h3>On Leave</h3>
            <h2>{employeesOnLeave}</h2>
            <p>Currently on leave</p>
          </div>
        </div>

        <div className="status-stat-card inactive-stat">
          <div className="status-icon inactive-icon">
            <UserX size={27} />
          </div>
          <div className="status-content">
            <h3>Inactive Employees</h3>
            <h2>{inactiveEmployees}</h2>
            <p>Not currently active</p>
          </div>
        </div>

      </div>

      {/* General error */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Employee Details */}
      {selectedEmployee && (
        <div className="employee-details">

          <h2>Employee Details</h2>

          <div className="employee-detail-item">
            <strong>Employee ID</strong>
            <span>{selectedEmployee.id}</span>
          </div>

          <div className="employee-detail-item">
            <strong>Name</strong>
            <span>{selectedEmployee.name}</span>
          </div>

          <div className="employee-detail-item">
            <strong>Email</strong>
            <span>{selectedEmployee.email}</span>
          </div>

          <div className="employee-detail-item">
            <strong>Department</strong>
            <span>{selectedEmployee.department}</span>
          </div>

          <div className="employee-detail-item">
            <strong>Salary</strong>
            <span>
              ₹{Number(selectedEmployee.salary).toLocaleString('en-IN')}
            </span>
          </div>

          <button onClick={() => setSelectedEmployee(null)}>
            Close
          </button>

        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="recent-employees employee-form-section">

          <h2>
            {editingId !== null ? 'Edit Employee' : 'Add New Employee'}
          </h2>

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-field">
              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={formData.name}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name && (
                <small className="field-error">
                  {fieldErrors.name}
                </small>
              )}
            </div>

            <div className="form-field">
              <input
                type="email"
                name="email"
                placeholder="Employee Email"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && (
                <small className="field-error">
                  {fieldErrors.email}
                </small>
              )}
            </div>

            <div className="form-field">
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleInputChange}
                aria-invalid={Boolean(fieldErrors.department)}
              />
              {fieldErrors.department && (
                <small className="field-error">
                  {fieldErrors.department}
                </small>
              )}
            </div>

            <div className="form-field">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-field">
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                aria-invalid={Boolean(fieldErrors.salary)}
              />
              {fieldErrors.salary && (
                <small className="field-error">
                  {fieldErrors.salary}
                </small>
              )}
            </div>

            <button type="submit">
              {editingId !== null ? 'Update Employee' : 'Save Employee'}
            </button>

            <button type="button" onClick={resetForm}>
              Cancel
            </button>

          </form>
        </div>
      )}

      {/* Employee Table */}
      <div className="recent-employees">

        <div className="section-header">

          <h2>Recent Employees</h2>

          <div className="employee-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>

            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <button
            className="add-employee-button"
            onClick={() => {
              resetForm();
              setError('');
              setShowForm(true);
            }}
          >
            <Plus size={18} />
            Add Employee
          </button>

        </div>

        <div className="employee-table-wrapper">
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="7">Loading employees...</td>
                </tr>
              ) : filteredEmployees.length > 0 ? (

                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>#{employee.id}</td>

                    <td className="employee-name-cell">
                      {employee.name}
                    </td>

                    <td>{employee.email}</td>
                    <td>{employee.department}</td>

                    <td>
                      <span
                        className={`status ${(employee.status || 'Active')
                          .toLowerCase()
                          .replace(' ', '-')}`}
                      >
                        {employee.status || 'Active'}
                      </span>
                    </td>

                    <td className="salary-cell">
                      ₹{Number(employee.salary).toLocaleString('en-IN')}
                    </td>

                    <td>
                      <div className="employee-action-buttons">

                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(employee)}
                          aria-label={`View ${employee.name}`}
                          title="View"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(employee)}
                          aria-label={`Edit ${employee.name}`}
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(employee)}
                          aria-label={`Delete ${employee.name}`}
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan="7">
                    {error
                      ? 'Unable to load employees.'
                      : 'No employees found.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>

      {/* Department Overview and Quick Actions */}
      <div className="overview-grid">

        {/* Department Overview */}
        <div className="overview-card">

          <div className="overview-title">
            <div className="overview-title-icon department-title-icon">
              <Building2 size={22} />
            </div>

            <div>
              <h2>Department Overview</h2>
              <p className="overview-subtitle">
                Employee distribution by department
              </p>
            </div>
          </div>

          {departments.length > 0 ? (
            departments.map((department, index) => {
              const count = employees.filter(
                (employee) => employee.department === department
              ).length;

              const percentage = employees.length > 0
                ? (count / employees.length) * 100
                : 0;

              return (
                <div className="department-item" key={department}>

                  <div className="department-info">
                    <div className="department-name">
                      <span
                        className={`department-dot department-dot-${index % 4}`}
                      />
                      <span>{department}</span>
                    </div>

                    <strong>{count} Employees</strong>
                  </div>

                  <div className="department-progress">
                    <div
                      className={`department-progress-fill progress-color-${index % 4}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="department-percentage">
                    {percentage.toFixed(1)}% of workforce
                  </p>

                </div>
              );
            })
          ) : (
            <p>No departments available.</p>
          )}

        </div>

        {/* Quick Actions */}
        <div className="overview-card quick-actions-card">

          <div className="overview-title">
            <div className="overview-title-icon quick-title-icon">
              <ListChecks size={22} />
            </div>

            <div>
              <h2>Quick Actions</h2>
              <p className="overview-subtitle">
                Common employee management tasks
              </p>
            </div>
          </div>

          <button
            className="quick-action-button premium-add-action"
            onClick={() => {
              resetForm();
              setError('');
              setShowForm(true);
            }}
          >
            <span className="quick-action-icon add-action-icon">
              <Plus size={22} />
            </span>

            <span className="quick-action-text">
              <strong>Add New Employee</strong>
              <small>Create a new employee record</small>
            </span>
          </button>

          <button
            className="quick-action-button secondary-action premium-view-action"
            onClick={() => {
              setSearchTerm('');
              setDepartmentFilter('All');
              setSelectedEmployee(null);
            }}
          >
            <span className="quick-action-icon view-action-icon">
              <Users size={22} />
            </span>

            <span className="quick-action-text">
              <strong>View All Employees</strong>
              <small>Explore your employee directory</small>
            </span>
          </button>

        </div>

      </div>

      {/* Dashboard Footer */}
      <footer className="dashboard-footer">

        <div className="footer-left">
          <strong>EMS Pro</strong>
          <span>Employee Management System</span>
        </div>

        <div className="footer-center">
          Built with React &amp; Spring Boot
        </div>

        <div className="footer-right">
          <span className="system-status-dot"></span>
          System Operational
        </div>

      </footer>

    </div>
  );
}

export default Dashboard;
