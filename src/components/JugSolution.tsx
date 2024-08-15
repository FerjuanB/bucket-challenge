
import { Step } from "../types";

type JugSolutionProps = {
    currentStep: Step | undefined;
    nextStep: () => void;
    previousStep: () => void;
    currentStepIndex: number;
    steps: Step[];
    calculateTotalWaterUsed: (steps: Step[]) => number;
    validatedValues: Record<string, number>;
    jugCalc: Record<string, number>;
  }

export const JugSolution = ({currentStep,nextStep,previousStep,currentStepIndex,steps,calculateTotalWaterUsed,validatedValues,jugCalc}: JugSolutionProps) => {
     
      
  return (
<>
            <h3>Step: {currentStep?.action}</h3>
            <p>Jug X: {currentStep?.x ?? 0} gallons</p>
            <p>Jug Y: {currentStep?.y ?? 0} gallons</p>
            <p>Total steps: {steps.length}</p>
            <p>Total water used: {calculateTotalWaterUsed(steps)} gallons</p>

            {/* Botones para navegar entre los pasos */}
            <button type="button" onClick={previousStep} disabled={currentStepIndex === 0}>
              Previous
            </button>
            <button type="button" onClick={nextStep} disabled={currentStepIndex === (steps.length - 1)}>
              Next
            </button>

            {/* Visualización gráfica simple */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
              <div>
                <div style={{ width: '50px', height: '100px', border: '1px solid black', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(currentStep?.x ?? 0) / jugCalc.xJug * 100}%`, backgroundColor: 'blue' }}></div>
                </div>
                <p>Jug X</p>
              </div>
              <div>
                <div style={{ width: '50px', height: '100px', border: '1px solid black', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(currentStep?.y ?? 0) / jugCalc.yJug * 100}%`, backgroundColor: 'blue' }}></div>
                </div>
                <p>Jug Y</p>
              </div>
            </div>
          </>  )
}