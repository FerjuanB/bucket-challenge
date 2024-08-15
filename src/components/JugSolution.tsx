import { FC, useEffect } from "react";
import { useCalculate } from "../hooks/useCalculate";

type JugSolutionProps = {
  xJar: number;
  yJar: number;
  target: number;
}

export const JugSolution: FC<JugSolutionProps> = ({ xJar, yJar, target }) => {
  const { 
    xCurrent, 
    yCurrent, 
    steps, 
    fillX, 
    fillY, 
    emptyX, 
    emptyY, 
    pourXtoY, 
    pourYtoX, 
    isComplete, 
    getCurrentInstruction,
    currentInstructionIndex,
    instructions,
    updateTrigger
  } = useCalculate(xJar, yJar, target);

  // Usar updateTrigger en el renderizado para forzar la actualización
  useEffect(() => {
    // Este efecto se ejecutará cada vez que updateTrigger cambie
  }, [updateTrigger]);

  return (
    <>  
    <div className="solution">
      <div>

      <h3>Current State</h3>
      <p>Jug X: {xCurrent} / {xJar} gallons</p>
      <p>Jug Y: {yCurrent} / {yJar} gallons</p>
      <p>Target: {target} gallons</p>

      <h4>Current Instruction:</h4>
      <p>{getCurrentInstruction() || "Challenge complete!"}</p>

      
        <button onClick={fillX} disabled={xCurrent === xJar}>Fill X</button>
        <button onClick={fillY} disabled={yCurrent === yJar}>Fill Y</button>
        <button onClick={emptyX} disabled={xCurrent === 0}>Empty X</button>
        <button onClick={emptyY} disabled={yCurrent === 0}>Empty Y</button>
        <button onClick={pourXtoY} disabled={xCurrent === 0 || yCurrent === yJar}>Pour X to Y</button>
        <button onClick={pourYtoX} disabled={yCurrent === 0 || xCurrent === xJar}>Pour Y to X</button>
      
      </div>
          <div>
          <h4>Steps taken: {currentInstructionIndex} / {instructions.length}</h4>
               <ol>
                 {steps.map((step, index) => (
                   <li key={index}>{step}</li>
                  ))}
               </ol>
          </div>
    </div>
      {isComplete && <h3 className="success">Congratulations! You've reached the target!</h3>}
                  </>
  );
};