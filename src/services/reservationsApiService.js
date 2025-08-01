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

export async function createReservation(data) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const contentType = res.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || 'Error al crear reservación');
    } else {
      const fallbackText = await res.text();
      throw new Error(`Error ${res.status}: ${fallbackText}`);
    }
  }

  return await res.json(); // suponiendo que el backend devuelve la reservación creada
}
