
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  GraduationCap,
  BookOpen,
  X,
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    course: "",
  });

  const loadStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error loading students:", error);
      alert("Could not load students. Check that the backend is running.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ full_name: "", email: "", phone: "", course: "" });
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setEditingId(student.id);
    setForm({
      full_name: student.full_name,
      email: student.email,
      phone: student.phone || "",
      course: student.course,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/students/${editingId}`, form);
      } else {
        await axios.post(`${API}/students`, form);
      }

      setShowForm(false);
      loadStudents();
    } catch (error) {
      alert(error.response?.data?.detail || "Could not save student.");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`${API}/students/${id}`);
      loadStudents();
    } catch (error) {
      alert("Could not delete student.");
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.full_name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <span>EduManage</span>
        </div>

        <p className="menu-label">MAIN MENU</p>
        <div className="nav-item active">
          <Users size={19} /> Students
        </div>
        <div className="nav-item">
          <BookOpen size={19} /> Courses
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <small>Admin account</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Dashboard / Students</p>
            <h1>Student Management</h1>
            <p className="subtitle">Manage student records in one place.</p>
          </div>

          <button className="add-button" onClick={openAddForm}>
            <UserPlus size={18} /> Add Student
          </button>
        </header>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple"><Users /></div>
            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue"><GraduationCap /></div>
            <div>
              <p>Total Courses</p>
              <h2>{new Set(students.map((s) => s.course)).size}</h2>
            </div>
          </div>
        </section>

        <section className="table-card">
          <div className="table-heading">
            <div>
              <h2>All Students</h2>
              <p>View and manage registered students.</p>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>COURSE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-name">
                        <div className="student-avatar">
                          {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{student.full_name}</strong>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phone || "—"}</td>
                    <td><span className="course-tag">{student.course}</span></td>
                    <td>
                      <div className="actions">
                        <button
                          className="edit-button"
                          title="Edit"
                          onClick={() => openEditForm(student)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="delete-button"
                          title="Delete"
                          onClick={() => deleteStudent(student.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-heading">
              <div>
                <h2>{editingId ? "Edit Student" : "Add New Student"}</h2>
                <p>Enter the student's information below.</p>
              </div>
              <button className="close-button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Enter full name"
              />

              <label>Email Address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email address"
              />

              <label>Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter phone number"
              />

              <label>Course</label>
              <input
                required
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                placeholder="Enter course name"
              />

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  {editingId ? "Update Student" : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
