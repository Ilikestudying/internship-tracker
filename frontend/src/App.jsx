import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://internship-tracker-production-d24d.up.railway.app";

function App() {
  const [internships, setInternships] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [darkMode, setDarkMode] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");

  function fetchInternships() {
    fetch(`${API_URL}/internships`)
      .then((response) => response.json())
      .then((data) => setInternships(data))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchInternships();
  }, []);

  function addInternship(event) {
    event.preventDefault();

    fetch(`${API_URL}/internships`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company, role, status }),
    })
      .then((response) => response.json())
      .then(() => {
        setCompany("");
        setRole("");
        setStatus("Applied");
        fetchInternships();
      })
      .catch((error) => console.error(error));
  }

  function deleteInternship(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this internship?"
    );

    if (!confirmed) return;

    fetch(`${API_URL}/internships/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => fetchInternships())
      .catch((error) => console.error(error));
  }

  function updateStatus(internship, newStatus) {
    fetch(`${API_URL}/internships/${internship.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: internship.company,
        role: internship.role,
        status: newStatus,
      }),
    })
      .then((response) => response.json())
      .then(() => fetchInternships())
      .catch((error) => console.error(error));
  }

  function startEditing(internship) {
    setEditingId(internship.id);
    setEditCompany(internship.company);
    setEditRole(internship.role);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditCompany("");
    setEditRole("");
  }

  function saveEdit(internship) {
    fetch(`${API_URL}/internships/${internship.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: editCompany,
        role: editRole,
        status: internship.status,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setEditingId(null);
        setEditCompany("");
        setEditRole("");
        fetchInternships();
      })
      .catch((error) => console.error(error));
  }

  function getStatusBadgeClass(status) {
    if (status === "Applied") return "badge applied";
    if (status === "Interview") return "badge interview";
    if (status === "Offer") return "badge offer";
    if (status === "Rejected") return "badge rejected";
    return "badge";
  }

  const total = internships.length;
  const applied = internships.filter((item) => item.status === "Applied").length;
  const interview = internships.filter(
    (item) => item.status === "Interview"
  ).length;
  const rejected = internships.filter(
    (item) => item.status === "Rejected"
  ).length;
  const offer = internships.filter((item) => item.status === "Offer").length;

  const filteredInternships = internships
    .filter((internship) => {
      const matchesSearch =
        internship.company.toLowerCase().includes(search.toLowerCase()) ||
        internship.role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || internship.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "CompanyAZ") return a.company.localeCompare(b.company);
      if (sortBy === "CompanyZA") return b.company.localeCompare(a.company);
      if (sortBy === "StatusAZ") return a.status.localeCompare(b.status);
      return b.id - a.id;
    });

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <h1 className="title">Internship Tracker</h1>
      <p className="subtitle">
        Track applications, interviews, rejections, and offers.
      </p>

      <button className="button" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="dashboard">
        <div className="card">
          <h3>Total</h3>
          <h2>{total}</h2>
        </div>

        <div className="card">
          <h3>Applied</h3>
          <h2>{applied}</h2>
        </div>

        <div className="card">
          <h3>Interviews</h3>
          <h2>{interview}</h2>
        </div>

        <div className="card">
          <h3>Offers</h3>
          <h2>{offer}</h2>
        </div>

        <div className="card">
          <h3>Rejected</h3>
          <h2>{rejected}</h2>
        </div>
      </div>

      <div className="section">
        <h2>Add Internship</h2>

        <form onSubmit={addInternship} className="form-row">
          <input
            className="input"
            type="text"
            placeholder="Company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />

          <input
            className="input"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />

          <select
            className="input"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <button className="button" type="submit">
            Add
          </button>
        </form>
      </div>

      <div className="section">
        <h2>Applications</h2>

        <div className="toolbar">
          <input
            className="input search-input"
            type="text"
            placeholder="Search internships..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="input"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="input"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="Newest">Newest First</option>
            <option value="CompanyAZ">Company A-Z</option>
            <option value="CompanyZA">Company Z-A</option>
            <option value="StatusAZ">Status A-Z</option>
          </select>
        </div>

        {internships.length === 0 ? (
          <p>No internships found.</p>
        ) : filteredInternships.length === 0 ? (
          <p>No matching internships found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInternships.map((internship) => (
                <tr key={internship.id}>
                  <td>{internship.id}</td>

                  <td>
                    {editingId === internship.id ? (
                      <input
                        className="input"
                        value={editCompany}
                        onChange={(event) => setEditCompany(event.target.value)}
                      />
                    ) : (
                      internship.company
                    )}
                  </td>

                  <td>
                    {editingId === internship.id ? (
                      <input
                        className="input"
                        value={editRole}
                        onChange={(event) => setEditRole(event.target.value)}
                      />
                    ) : (
                      internship.role
                    )}
                  </td>

                  <td>
                    <span className={getStatusBadgeClass(internship.status)}>
                      {internship.status}
                    </span>
                  </td>

                  <td>
                    <select
                      className="input"
                      value={internship.status}
                      onChange={(event) =>
                        updateStatus(internship, event.target.value)
                      }
                    >
                      <option>Applied</option>
                      <option>Interview</option>
                      <option>Rejected</option>
                      <option>Offer</option>
                    </select>
                  </td>

                  <td>
                    {editingId === internship.id ? (
                      <>
                        <button
                          className="save-button"
                          onClick={() => saveEdit(internship)}
                        >
                          Save
                        </button>

                        <button
                          className="cancel-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => startEditing(internship)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => deleteInternship(internship.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer className="footer">
        <p>
          Created by Pushkar •
          <a
            href="https://github.com/Ilikestudying/internship-tracker"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;