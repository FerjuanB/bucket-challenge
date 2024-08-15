import { useEffect, useMemo, useState } from "react"

interface Step {
    action: string;
    x: number;
    y: number;
}


export const useCalculate = (xJar: number, yJar: number, target: number) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const solve = () => {
      const calculatedSteps: Step[] = [];
      let xJarAmount = 0;
      let yJarAmount = 0;

      const addStep = (action: string, xJarAmount: number, yJarAmount: number) => {
        calculatedSteps.push({ action, x: xJarAmount, y: yJarAmount });
      };

      const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
      };

      if (target % gcd(xJar, yJar) !== 0) {
        addStep("Impossible to reach target", xJarAmount, yJarAmount);
        setSteps(calculatedSteps);
        return;
      }

      const tryFillFirst = (firstJar: number, secondJar: number, isXFirst: boolean) => {
        let first = 0, second = 0;
        while (first !== target && second !== target) {
          if (first === 0) {
            first = firstJar;
            addStep(isXFirst ? "Fill X" : "Fill Y", isXFirst ? first : xJarAmount, isXFirst ? yJarAmount : first);
          } else if (second === secondJar) {
            second = 0;
            addStep(isXFirst ? "Drain Y" : "Drain X", isXFirst ? first : second, isXFirst ? second : first);
          } else {
            const transferAmount = Math.min(first, secondJar - second);
            first -= transferAmount;
            second += transferAmount;
            addStep(isXFirst ? "Transfer X to Y" : "Transfer Y to X", isXFirst ? first : second, isXFirst ? second : first);
          }
          if (first === target || second === target) break;
          if (calculatedSteps.length > 1000) {
            addStep("Too many steps, possibly no solution", first, second);
            break;
          }
        }
      };

      // Try filling X first
      tryFillFirst(xJar, yJar, true);

      // If filling X first didn't work, try filling Y first
      if (calculatedSteps[calculatedSteps.length - 1].action !== "Impossible to reach target" && 
          calculatedSteps[calculatedSteps.length - 1].x !== target && 
          calculatedSteps[calculatedSteps.length - 1].y !== target) {
        calculatedSteps.length = 0; // Clear steps
        tryFillFirst(yJar, xJar, false);
      }

      setSteps(calculatedSteps);
    };

    solve();
  }, [xJar, yJar, target]);
const calculateTotalWaterUsed = (steps: Step[]): number => {
  return steps.reduce((total, step) => {
    if (step.action === "Fill X") total += step.x;
    if (step.action === "Fill Y") total += step.y;
    return total;
  }, 0);}
  
  const nextStep = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const currentStep = useMemo(() => steps[currentStepIndex], [currentStepIndex, steps]);

  

  return { steps, currentStep, nextStep, previousStep,currentStepIndex,calculateTotalWaterUsed };
};
