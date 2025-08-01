const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/reservations`;


export async function fetchAllReservations() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener reservaciones');
  return res.json();
}
