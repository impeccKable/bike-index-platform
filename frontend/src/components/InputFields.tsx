import { useState } from 'react'

interface MultiFieldProps {
  componentType: any
  onChange: (e: any) => void
}

export function MultiField(props: MultiFieldProps) {
  const [values, setValues] = useState([""])
  const Component = props.componentType
  function handleInput(e: any, idx: number) {
    let newValues = [...values]
    newValues[idx] = e.target.value
    updateValues(newValues)
  }
  function addBox() {
    let newValues = [...values]
    newValues.push("")
    updateValues(newValues)
  }
  function removeBox() {
    if (values.length <= 1) { return }
    let newValues = [...values]
    newValues.pop()
    updateValues(newValues)
  }
  function updateValues(newValues: string[]) {
    setValues(newValues)
    props.onChange(newValues.map(field => {
      if (field.includes(',')) {
        return `"${field}"`; // wrap the field in quotes
      }
      return field;
    }).join(","))
  }
  return (
    <>
      <ul>
        {values.map((value, idx) => (
          <li key={"TextField"+idx}>
            <Component value={value} onChange={(e: any) => handleInput(e, idx)} />
            {idx === values.length - 1 && (
              <>
                <button onClick={addBox}>+</button>
                <button onClick={removeBox}>-</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

interface TextFieldProps {
  value: string
  onChange: (e: any) => void
}

export function TextField(props: TextFieldProps) {
  return <input type="text" value={props.value} onChange={props.onChange} />
}




// interface TextFieldProps {
//   onData: (data: any) => void;
// }

// export function TextField(props: TextFieldProps) {
//   const [values, setValues] = useState([""])
//   function handleInput(e: any, idx: number) {
//     let newValues = [...values]
//     newValues[idx] = e.target.value
//     updateValues(newValues)
//   }
//   function addBox() {
//     let newValues = [...values]
//     newValues.push("")
//     updateValues(newValues)
//   }
//   function removeBox() {
//     if (values.length <= 1) { return }
//     let newValues = [...values]
//     newValues.pop()
//     updateValues(newValues)
//   }
//   function updateValues(newValues: string[]) {
//     setValues(newValues)
//     props.onData(newValues.join(","))
//   }
//   return (
//     <>
//       <ul>
//         {values.map((value, idx) => (
//           <li key={"TextField" + idx}>
//             <input type="text" value={value} onChange={(e) => handleInput(e, idx)} />
//             {idx === values.length - 1 && (
//               <>
//                 <button onClick={addBox}>+</button>
//                 <button onClick={removeBox}>-</button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </>
//   )
// }
