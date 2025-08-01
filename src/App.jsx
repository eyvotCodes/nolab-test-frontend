import './App.css'
import { Routes, Route } from 'react-router-dom';
import ReservationsList from './pages/ReservationsList';


function App() {

  return (
    <Routes>
      <Route path="/" element={<ReservationsList />} />
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );

}

export default App;
