import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchAllReservations } from '../services/reservationsApiService';


export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);


  useEffect(() => {
    loadReservations();
  }, []);


  function loadReservations() {
    fetchAllReservations()
      .then(setReservations)
      .catch(err => console.error(err.message))
    ;
  }


  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Reservaciones</h2>

      <DataTable value={reservations} paginator rows={10} stripedRows responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="start_time" header="Inicio (UTC)" sortable />
        <Column field="end_time" header="Fin (UTC)" sortable />
        <Column field="priority" header="Prioridad" sortable />
        <Column field="projector_required" header="Proyector" body={row => (row.projector_required ? 'Sí' : 'No')} />
        <Column field="capacity" header="Capacidad" sortable />
        <Column field="timezone" header="Zona Horaria" />
      </DataTable>
    </div>
  );

}
