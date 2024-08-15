
export type JugProps ={
    jugName:string
}
export const Jug = ({jugName} : JugProps) => {
  return (
    <div>
        <label htmlFor={jugName}>{jugName}</label>
        <input type="number" id={jugName}  />
    </div>
  )
}