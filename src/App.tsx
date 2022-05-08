import React from 'react';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTimer={1500}
        shortRestTime={300}
        longRestTime={900}
        cycles={4}
      />
    </div>
  );
}

export default App;
