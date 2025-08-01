import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { fetchAllReservations } from '../services/reservationsApiService';


export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();


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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Reservaciones</h2>
        <Button
          label="Nueva reservación"
          icon="pi pi-plus"
          onClick={() => navigate('/new')}
        />
      </div>

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
