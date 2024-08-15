import { useState } from "react";
import { JugSolution } from "./JugSolution";

export const JugContainer = () => {
  const [jugSizes, setJugSizes] = useState({ xjug: 0, yjug: 0, zjug: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gameStarted, setGameStarted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    let error = "";
    if (value === "") {
      error = "This field is required";
    } else if (isNaN(numValue) || numValue <= 0 || !Number.isInteger(numValue)) {
      error = "The value must be an integer greater than 0";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    setJugSizes(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jugSizes.zjug > Math.max(jugSizes.xjug, jugSizes.yjug)) {
      setErrors(prev => ({ ...prev, zjug: "Target cannot be greater than the larger jug" }));
      return;
    }
    setGameStarted(true);
  };

  const resetGame = () => {
    setJugSizes({ xjug: 0, yjug: 0, zjug: 0 });
    setErrors({});
    setGameStarted(false);
  };

  const isValid = Object.values(errors).every(error => error === "") && 
                  Object.values(jugSizes).every(value => value > 0);

  return (
    <div>
      {!gameStarted ? (
        <form onSubmit={handleSubmit} className="form">
          <h3>Insert a quantity in each JUG and <span>It will tell you the instructions</span></h3>
          <div>
            {["xjug", "yjug", "zjug"].map((jug) => (
              <div key={jug}>
                <label htmlFor={jug}>{jug.charAt(0).toUpperCase()} - jug</label>
                <input
                  type="number"
                  name={jug}
                  id={jug}
                  onChange={handleChange}
                  value={jugSizes[jug as keyof typeof jugSizes] || ""}
                />
                {errors[jug as keyof typeof errors] && <p className="error">{errors[jug as keyof typeof errors]}</p>}
              </div>
            ))}
          </div>
          <button type="submit" disabled={!isValid}>Start Game</button>
        </form>
      ) : (
        <>
          <JugSolution xJar={jugSizes.xjug} yJar={jugSizes.yjug} target={jugSizes.zjug} />
          <button onClick={resetGame}>Reset Game</button>
        </>
      )}
    </div>
  );
};