import { useState } from 'react';

import Dashboard from './components/layout/Dashboard';

import type {
  SimulationField,
  SimulationInputs,
} from './types/simulation';

import './App.css';

const DEFAULT_SIMULATION: SimulationInputs = {
  initialPower: 100,
  referenceDistance: 500,
  finalDistance: 2000,
  attenuationCoefficient: 2,
  numericalStep: 10,
};

function App() {
  const [inputs, setInputs] =
    useState<SimulationInputs>(DEFAULT_SIMULATION);

  function handleInputChange(
    field: SimulationField,
    value: number,
  ) {
    setInputs((currentInputs) => ({
      ...currentInputs,
      [field]: value,
    }));
  }

  function handleReset() {
    setInputs(DEFAULT_SIMULATION);
  }

  return (
    <Dashboard
      inputs={inputs}
      onInputChange={handleInputChange}
      onReset={handleReset}
    />
  );
}

export default App;