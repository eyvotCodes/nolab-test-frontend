import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { DateTime } from 'luxon';
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

      <DataTable value={reservations} paginator rows={10} stripedRows>
        <Column field="id" header="ID" sortable hidden />
        <Column field="start_time" header="Inicio" sortable body={(row) => DateTime.fromISO(row.start_time).toFormat('yyyy-MM-dd HH:mm')} />
        <Column field="end_time" header="Fin" sortable body={(row) => DateTime.fromISO(row.end_time).toFormat('yyyy-MM-dd HH:mm')} />
        <Column field="timezone" header="Zona Horaria" sortable />
        <Column field="room" header="Sala" sortable />
        <Column field="capacity" header="Participantes" sortable />
        <Column field="projector_required" sortable header="Proyector" body={row => (row.projector_required ? 'Sí' : 'No')} />
        <Column field="priority" header="Prioridad" sortable />
      </DataTable>
    </div>
  );

}
