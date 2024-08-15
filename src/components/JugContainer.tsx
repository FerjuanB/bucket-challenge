import { useMemo, useState } from "react";
import { useCalculate } from "../hooks/useCalculate";
import { JugSolution } from "./JugSolution";

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
          <JugSolution 
            currentStep={currentStep}
            nextStep={nextStep}
            previousStep={previousStep}
            currentStepIndex={currentStepIndex}
            steps={steps}
            calculateTotalWaterUsed={calculateTotalWaterUsed}
            validatedValues={validatedValues}
            jugCalc={jugCalc}/>
        )}
      </div>
    </form>
    
  );
};
