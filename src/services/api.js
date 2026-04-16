const API_URL = "http://127.0.0.1:8000/api";

export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);
  return res.json();
};

export const createAppointment = async (data) => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  if (!res.ok) throw json;

  return json;
};