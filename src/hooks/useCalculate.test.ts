import { renderHook, act } from '@testing-library/react-hooks';
import { useCalculate } from './useCalculate';



describe('useCalculate hook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    expect(result.current.xCurrent).toBe(0);
    expect(result.current.yCurrent).toBe(0);
    expect(result.current.steps).toEqual([]);
    expect(result.current.instructions).toEqual([]);
  });

  it('should generate instructions', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    expect(result.current.instructions).not.toEqual([]);
  });

  it('should fill X jar', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillX());
    expect(result.current.xCurrent).toBe(3);
    expect(result.current.steps).toEqual(['Filled X']);
  });

  it('should fill Y jar', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillY());
    expect(result.current.yCurrent).toBe(5);
    expect(result.current.steps).toEqual(['Filled Y']);
  });

  it('should empty X jar', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillX());
    act(() => result.current.emptyX());
    expect(result.current.xCurrent).toBe(0);
    expect(result.current.steps).toEqual(['Filled X', 'Emptied X']);
  });

  it('should empty Y jar', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillY());
    act(() => result.current.emptyY());
    expect(result.current.yCurrent).toBe(0);
    expect(result.current.steps).toEqual(['Filled Y', 'Emptied Y']);
  });

  it('should pour X to Y', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillX());
    act(() => result.current.pourXtoY());
    expect(result.current.xCurrent).toBe(0);
    expect(result.current.yCurrent).toBe(3);
    expect(result.current.steps).toEqual(['Filled X', 'Poured 3 from X to Y']);
  });

  it('should pour Y to X', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillY());
    act(() => result.current.pourYtoX());
    expect(result.current.xCurrent).toBe(3);
    expect(result.current.yCurrent).toBe(2);
    expect(result.current.steps).toEqual(['Filled Y', 'Poured 3 from Y to X']);
  });

  it('should check and advance instruction', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillX());
    act(() => result.current.checkAndAdvanceInstruction());
    expect(result.current.currentInstructionIndex).toBe(1);
  });

  it('should be complete', () => {
    const { result } = renderHook(() => useCalculate(3, 5, 4));
    act(() => result.current.fillX());
    act(() => result.current.pourXtoY());
    expect(result.current.isComplete).toBe(true);
  });
});
