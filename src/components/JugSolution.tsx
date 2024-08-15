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

      <h4>Current State</h4>
      <p>Jug X: {xCurrent} / {xJar} gallons</p>
      <p>Jug Y: {yCurrent} / {yJar} gallons</p>
      <p>Target: {target} gallons</p>

      <h4>Current Instruction:</h4>
      <p className="instruction">{getCurrentInstruction() || "Challenge complete!"}</p>

      <div className="buttons">

        <button className=" sol" onClick={fillX} disabled={xCurrent === xJar}>Fill X</button>
        <button className=" sol" onClick={fillY} disabled={yCurrent === yJar}>Fill Y</button>
        <button className=" sol" onClick={emptyX} disabled={xCurrent === 0}>Empty X</button>
        <button className=" sol" onClick={emptyY} disabled={yCurrent === 0}>Empty Y</button>
        <button className=" sol" onClick={pourXtoY} disabled={xCurrent === 0 || yCurrent === yJar}>Pour X to Y</button>
        <button className=" sol" onClick={pourYtoX} disabled={yCurrent === 0 || xCurrent === xJar}>Pour Y to X</button>
      
      </div>
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