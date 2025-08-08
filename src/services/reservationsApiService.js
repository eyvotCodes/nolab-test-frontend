const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/reservations`;


export async function fetchAllReservations() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener reservaciones');
  return res.json();
}

export async function fetchTimezones() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/timezones`);
  if (!res.ok) throw new Error('No se pudo cargar zonas horarias');
  return res.json();
}

export async function fetchPriorities() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/priorities`);
  if (!res.ok) throw new Error('No se pudo cargar prioridades');
  return res.json();
}

export async function fetchRooms() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rooms`);
  if (!res.ok) throw new Error('Error al obtener salas');
  return res.json();
}

export async function createReservation(data) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errs = Array.isArray(json?.errors)
      ? json.errors
      : [json?.message || `Error ${res.status}`];

    const e = new Error('ReservationError');
    e.errors = errs;
    e.status = res.status;
    throw e;
  }

  return json;
}
