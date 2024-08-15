import { useMemo, useState } from "react";
import { useCalculate } from "../hooks/useCalculate";

export const JugContainer = () => {
  const [errors, setErrors] = useState<Record<string, string>>({
    xjug: "",
    yjug: "",
    zjug: ""
  });

  const [jugCalc, setJugCalc] = useState<Record<string, number>>({
    xjug: 0,
    yjug: 0,
    zjug: 0
  });
  
  const [validatedValues, setValidatedValues] = useState<Record<string, number> | null>(null);

  const { currentStep, nextStep, previousStep, currentStepIndex, steps, calculateTotalWaterUsed } = useCalculate(
    validatedValues?.xjug ?? 0,
    validatedValues?.yjug ?? 0,
    validatedValues?.zjug ?? 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    let error = "";
    if (value === "") {
      error = "This field is required";
    } else if (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue)) {
      error = "The value must be an integer greater than 0";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    setJugCalc(prev => ({ ...prev, [name]: numValue }));
  };

  const isValid = Object.values(errors).every(error => error === "") && 
                  Object.values(jugCalc).every(value => value !== 0);

  const resetBtn = () => {
    setJugCalc({
      xjug: 0,
      yjug: 0,
      zjug: 0
    });
    setErrors({
      xjug: "",
      yjug: "",
      zjug: ""
    });
    setValidatedValues(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const x = jugCalc.xjug ?? 0;
    const y = jugCalc.yjug ?? 0;
    const z = jugCalc.zjug ?? 0;

    const biggerJug = Math.max(x, y);

    if (z > biggerJug) {
      setErrors(prev => ({ ...prev, zjug: "Z cannot be greater than the larger jug" }));
      return;
    }

    if (z === x || z === y) {
      setValidatedValues({ xjug: x, yjug: y, zjug: z });
      return;
    }

    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    const gcdXY = gcd(x, y);

    if (z % gcdXY !== 0) {
      setErrors(prev => ({ ...prev, zjug: "Z must be achievable with X and Y" }));
      return;
    }

    setValidatedValues({ xjug: x, yjug: y, zjug: z });
  };

  const isAnyInputFilled = useMemo(() => {
    return Object.values(jugCalc).some(value => value !== 0);
  }, [jugCalc]);

  return (
    <form onSubmit={handleSubmit}>
      <h3>Insert a quantity in each JUG</h3>
      <div className="containerInput">
        {["xjug", "yjug", "zjug"].map((jug) => (
          <div key={jug}>
            <label htmlFor={jug}>{jug.charAt(0).toUpperCase()} - jug</label>
            <input
              type="text"
              name={jug}
              id={jug}
              placeholder={`Select quantity of gallons for ${jug.charAt(0).toUpperCase()} jug`}
              onChange={handleChange}
              value={jugCalc[jug as keyof typeof jugCalc] ?? 0}
            />
            {errors[jug as keyof typeof errors] && <p className="error">{errors[jug as keyof typeof errors]}</p>}
          </div>
        ))}
      </div>
      <div>
        <input type="submit" value="Calculate" disabled={!isValid} />
        <input type="button" value="Reset" onClick={resetBtn} disabled={!isAnyInputFilled} className="Reset" />
      </div>
      <div>
        {validatedValues && (
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
          </>
        )}
      </div>
    </form>
    
  );
};
