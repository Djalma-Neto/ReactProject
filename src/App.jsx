import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    customer_name: "",
    service_id: "",
    date_time: "",
  });

  const loadAppointments = () => {
    fetch(`${API_URL}/appointments`)
      .then((res) => res.json())
      .then(setAppointments);
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

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    className="form-control"
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Serviço</label>
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
                        {s.name} ({s.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Data e Hora</label>
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
      </div>
    </div>
  );
}

export default App;
