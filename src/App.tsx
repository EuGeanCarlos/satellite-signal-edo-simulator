import {
  useState,
} from 'react';

import Dashboard
  from './components/layout/Dashboard';

import type {
  SimulationField,
  SimulationInputs,
} from './types/simulation';

import './App.css';

const DEFAULT_SIMULATION:
  SimulationInputs = {
    initialPower: 100,
    referenceDistance: 500,
    finalDistance: 2000,
    attenuationCoefficient: 2,
    numericalStep: 10,
  };

function App() {
  /*
   * inputs:
   * valores que estão sendo editados.
   */
  const [
    inputs,
    setInputs,
  ] =
    useState<SimulationInputs>(
      DEFAULT_SIMULATION,
    );

  /*
   * simulationInputs:
   * último conjunto de parâmetros
   * realmente executado.
   */
  const [
    simulationInputs,
    setSimulationInputs,
  ] =
    useState<SimulationInputs>(
      DEFAULT_SIMULATION,
    );

  function handleInputChange(
    field: SimulationField,
    value: number,
  ) {
    setInputs(
      (
        currentInputs,
      ) => ({
        ...currentInputs,
        [field]: value,
      }),
    );
  }

  function handleSimulate() {
    setSimulationInputs({
      ...inputs,
    });
  }

  function handleReset() {
    setInputs(
      DEFAULT_SIMULATION,
    );

    setSimulationInputs(
      DEFAULT_SIMULATION,
    );
  }

  return (
    <Dashboard
      inputs={inputs}
      simulationInputs={
        simulationInputs
      }
      onInputChange={
        handleInputChange
      }
      onSimulate={
        handleSimulate
      }
      onReset={
        handleReset
      }
    />
  );
}

export default App;