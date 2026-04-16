import { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [newService, setNewService] = useState({
    name: "",
    duration: "",
  });

  const [form, setForm] = useState({
    customer_name: "",
    service_id: "",
    date_time: "",
  });

  const createService = async () => {
    const res = await fetch(`${API_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": user?.role || "",
      },
      body: JSON.stringify(newService),
    });

    if (!res.ok) {
      alert("Erro ao criar serviço");
      return;
    }

    // mensagem
    alert("Serviço criado com sucesso!");
    setNewService({ name: "", duration: "" });

    loadServices();

    // fecha modal
    const modalEl = document.getElementById("serviceModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.hide();
    setTimeout(() => {
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
    }, 200);
  };

  const loadAppointments = () => {
    fetch(`${API_URL}/appointments`)
      .then((res) => res.json())
      .then(setAppointments);
  };

  const handleLogin = () => {
    const password = prompt("Digite a senha de admin:");

    if (password === "123456") {
      const userData = { role: "admin" };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      alert("Senha inválida");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const loadServices = () => {
    fetch(`${API_URL}/services`)
      .then((res) => res.json())
      .then(setServices);
  };

  useEffect(() => {
    loadServices();
    loadAppointments();
  }, []);

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Erro ao agendar");
    } else {
      setMessage("Agendamento realizado com sucesso!");

      loadAppointments();

      setForm({
        customer_name: "",
        service_id: "",
        date_time: "",
      });
    }
  };

  const deleteAppointment = async (id) => {
    if (!confirm("Deseja excluir este agendamento?")) return;

    await fetch(`${API_URL}/appointments/${id}`, {
      method: "DELETE",
    });

    loadAppointments(); // recarrega lista
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* FORM */}
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title mb-4">Novo Agendamento</h4>
              <div className="d-flex justify-content-between mb-3">
                {user ? (
                  <>
                    <span className="badge bg-success">
                      Logado como {user.role}
                    </span>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={logout}
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <button className="btn btn-dark" onClick={handleLogin}>
                    Login Admin
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome</label>{" "}
                  <span className="text-danger">*</span>
                  <input
                    className="form-control"
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <div className="mb-3">
                    <label className="form-label mb-0">Serviço</label>
                    <span className="text-danger">*</span>
                  </div>

                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={form.service_id}
                      onChange={(e) =>
                        setForm({ ...form, service_id: e.target.value })
                      }
                    >
                      <option value="">Selecione</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    {user?.role === "admin" && (
                      <button
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#serviceModal"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Data e Hora <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={form.date_time}
                    onChange={(e) =>
                      setForm({ ...form, date_time: e.target.value })
                    }
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  disabled={
                    !form.customer_name || !form.service_id || !form.date_time
                  }
                >
                  Agendar
                </button>
              </form>

              {message && (
                <div className="alert alert-info mt-3">{message}</div>
              )}
            </div>
          </div>
        </div>

        {/* LISTA */}
        <div className="col-md-7">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title mb-4">Agendamentos</h4>

              {appointments.length === 0 ? (
                <p>Nenhum agendamento ainda</p>
              ) : (
                <ul className="list-group">
                  {appointments
                    .sort(
                      (a, b) => new Date(a.date_time) - new Date(b.date_time),
                    )
                    .map((a) => (
                      <li
                        key={a.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{a.customer_name}</strong>
                          <br />
                          <small className="text-muted">
                            {a.service?.name} ({a.service?.duration} min)
                          </small>
                        </div>

                        <div>
                          <span className="badge bg-primary me-2">
                            {new Date(a.date_time).toLocaleString("pt-BR")}
                          </span>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteAppointment(a.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="modal fade" id="serviceModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Serviço</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createService();
                }}
              >
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Nome"
                    required
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Duração (min)"
                    required
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService({ ...newService, duration: e.target.value })
                    }
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
