import React from 'react';
import { Calendar } from './components/Calendar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Calendario Laboral
        </h1>
        <Calendar />
      </div>
    </div>
  );
}

export default App;