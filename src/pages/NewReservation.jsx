import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DateTime } from 'luxon';

import { fetchTimezones, fetchPriorities, createReservation } from '../services/reservationsApiService';


export default function NewReservation() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [timezones, setTimezones] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [form, setForm] = useState({
    startTime: getNextQuarterHour(),
    endTime: null,
    duration: null,
    timezone: 'America/Mexico_City',
    priority: 'normal',
    projectorRequired: false,
    capacity: 1
  });

  const DURATIONS = [
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '45m', value: 45 },
    { label: '1h', value: 60 },
    { label: '1h 15m', value: 75 },
    { label: '1h 30m', value: 90 },
    { label: '1h 45m', value: 105 },
    { label: '2h', value: 120 },
    { label: '2h 15m', value: 135 },
  ];


  useEffect(() => {
    fetchTimezones().then(setTimezones);
    fetchPriorities().then(setPriorities);
  }, []);


  const handleChange = (key, value) => {
    let newForm = { ...form, [key]: value };

    if (key === 'duration' && form.startTime) {
      const end = DateTime.fromJSDate(form.startTime).plus({ minutes: value }).toJSDate();
      newForm.endTime = end;
    }

    if (key === 'startTime' && form.duration) {
      const end = DateTime.fromJSDate(value).plus({ minutes: form.duration }).toJSDate();
      newForm.endTime = end;
    }

    setForm(newForm);
  };

  const handleSubmit = async () => {
    try {
      await createReservation(form);
      toast.current.show({ severity: 'success', summary: 'Reservación creada', life: 3000 });
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      toast.current.clear();
      toast.current.show({
        sticky: true,
        closable: true,
        severity: 'info',
        content: (
          <div style={{ textAlign: 'left' }}>
            <strong>Se encontraron los siguientes errores:</strong>
            <ul>
              {err.message.split(',').map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )
      });
    }
  };

  function getNextQuarterHour() {
    const now = DateTime.local().plus({ minutes: 1 });
    const minute = now.minute;
    const rounded = Math.ceil(minute / 15) * 15;
    return now.set({ minute: rounded % 60, second: 0, millisecond: 0 }).plus({ hours: rounded >= 60 ? 1 : 0 }).toJSDate();
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Toast ref={toast} />
      <h2 className="text-2xl mb-4">Nueva reservación</h2>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
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
            <label>Duración</label>
            <Dropdown
              value={form.duration}
              options={DURATIONS}
              onChange={(e) => handleChange('duration', e.value)}
              placeholder="Selecciona duración"
            />
          </div>
        </div>

        <div>
        <label>Fin</label>
        <Calendar
            value={form.endTime}
            onChange={(e) => handleChange('endTime', e.value)}
            disabled={false}
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
            max={9}
            showButtons
          />
        </div>

        <div className="text-right">
          <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );

}
