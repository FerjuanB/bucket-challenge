import { useState, useEffect, useCallback } from "react";

export const useCalculate = (xJar: number, yJar: number, target: number) => {
  const [xCurrent, setXCurrent] = useState(0);
  const [yCurrent, setYCurrent] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const generateInstructions = () => {  
      const newInstructions: string[] = [];
      let x = 0, y = 0;
      
      while (x !== target && y !== target) {
        if (x === 0) {
          newInstructions.push(`Fill jug X (${xJar} gallons)`);
          x = xJar;
        } else if (y === yJar) {
          newInstructions.push(`Empty jug Y`);
          y = 0;
        } else {
          const pour = Math.min(x, yJar - y);
          newInstructions.push(`Pour ${pour} gallons from X to Y`);
          x -= pour;
          y += pour;
        }
      }
      setInstructions(newInstructions);
    };

    generateInstructions();
  }, [xJar, yJar, target]);

  const getCurrentInstruction = useCallback(() => instructions[currentInstructionIndex], [instructions, currentInstructionIndex]);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const checkAndAdvanceInstruction = useCallback(() => {
    const currentInstruction = getCurrentInstruction();
    if (
      (currentInstruction?.includes("Fill jug X") && xCurrent === xJar) ||
      (currentInstruction?.includes("Empty jug Y") && yCurrent === 0) ||
      (currentInstruction?.includes("Pour") && 
       xCurrent === xJar - parseInt(currentInstruction.split(' ')[1]) &&
       yCurrent === parseInt(currentInstruction.split(' ')[1]))
    ) {
      setCurrentInstructionIndex(prev => {
        console.log("Advancing to next instruction:", prev + 1);
        return prev + 1;
      });
      forceUpdate();
    }
  }, [xCurrent, yCurrent, xJar, yJar, getCurrentInstruction, forceUpdate]);
  
  const fillX = useCallback(() => {
    if (xCurrent < xJar) {
      setXCurrent(xJar);
      setSteps(prev => [...prev, "Filled X"]);
      checkAndAdvanceInstruction();
    }
  }, [xCurrent, xJar, checkAndAdvanceInstruction]);

  const fillY = useCallback(() => {
    if (yCurrent < yJar) {
      setYCurrent(yJar);
      setSteps(prev => [...prev, "Filled Y"]);
      checkAndAdvanceInstruction();
    }
  }, [yCurrent, yJar, checkAndAdvanceInstruction]);

  const emptyX = useCallback(() => {
    if (xCurrent > 0) {
      setXCurrent(0);
      setSteps(prev => [...prev, "Emptied X"]);
      checkAndAdvanceInstruction();
    }
  }, [xCurrent, checkAndAdvanceInstruction]);

  const emptyY = useCallback(() => {
    if (yCurrent > 0) {
      setYCurrent(0);
      setSteps(prev => [...prev, "Emptied Y"]);
      checkAndAdvanceInstruction();
    }
  }, [yCurrent, checkAndAdvanceInstruction]);

  const pourXtoY = useCallback(() => {
    if (xCurrent > 0 && yCurrent < yJar) {
      const amount = Math.min(xCurrent, yJar - yCurrent);
      setXCurrent(prev => prev - amount);
      setYCurrent(prev => prev + amount);
      setSteps(prev => [...prev, `Poured ${amount} from X to Y`]);
      checkAndAdvanceInstruction();
    }
  }, [xCurrent, yCurrent, yJar, checkAndAdvanceInstruction]);

  const pourYtoX = useCallback(() => {
    if (yCurrent > 0 && xCurrent < xJar) {
      const amount = Math.min(yCurrent, xJar - xCurrent);
      setYCurrent(prev => prev - amount);
      setXCurrent(prev => prev + amount);
      setSteps(prev => [...prev, `Poured ${amount} from Y to X`]);
      checkAndAdvanceInstruction();
    }
  }, [yCurrent, xCurrent, xJar, checkAndAdvanceInstruction]);

  const isComplete = xCurrent === target || yCurrent === target;

  return {
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
    updateTrigger,
    checkAndAdvanceInstruction

  };
};