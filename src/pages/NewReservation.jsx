import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { fetchTimezones, fetchPriorities, createReservation } from '../services/reservationsApiService';

export default function NewReservation() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [timezones, setTimezones] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [form, setForm] = useState({
    startTime: null,
    endTime: null,
    timezone: 'America/Mexico_City',
    priority: 'normal',
    projectorRequired: false,
    capacity: 1,
  });

  useEffect(() => {
    fetchTimezones().then(setTimezones);
    fetchPriorities().then(setPriorities);
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createReservation(form);
      toast.current.show({ severity: 'success', summary: 'Reservación creada', life: 3000 });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
        toast.current.show({
            sticky: true,
            closable: true,
            severity: 'info',
            content: (
                <div style={{ textAlign: 'left' }}>
                    <strong>Se encontraron los siguientes errores:</strong>
                    <ul className="">
                    {err.message.split(',').map((e, i) => (
                        <li key={i}>{e}</li>
                    ))}
                    </ul>
                </div>
            )
        });
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Toast ref={toast} />
      <h2 className="text-2xl mb-4">Nueva reservación</h2>

      <div className="grid gap-4">
        <div>
          <label>Inicio</label>
          <Calendar
            value={form.startTime}
            onChange={(e) => handleChange('startTime', e.value)}
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
          />
        </div>

        <div>
          <label>Fin</label>
          <Calendar
            value={form.endTime}
            onChange={(e) => handleChange('endTime', e.value)}
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
          />
        </div>

        <div>
          <label>Zona horaria</label>
          <Dropdown
            value={form.timezone}
            options={timezones}
            onChange={(e) => handleChange('timezone', e.value)}
            placeholder="Selecciona una zona"
          />
        </div>

        <div>
          <label>Prioridad</label>
          <Dropdown
            value={form.priority}
            options={priorities}
            onChange={(e) => handleChange('priority', e.value)}
            placeholder="Selecciona prioridad"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            inputId="projector"
            checked={form.projectorRequired}
            onChange={(e) => handleChange('projectorRequired', e.checked)}
          />
          <label htmlFor="projector">Requiere proyector</label>
        </div>

        <div>
          <label>Capacidad</label>
          <InputNumber
            value={form.capacity}
            onValueChange={(e) => handleChange('capacity', e.value)}
            min={1}
            max={8}
          />
        </div>

        <div className="text-right">
          <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
