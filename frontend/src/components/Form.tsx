import React from 'react'
import { useState } from 'react'

interface FormProps {
  children: any
  onSubmit: (e: any) => void
}
// A custom version of a form that compiles the form data into a dictionary
//   and will later handle the submission and stuff
export function Form(props: FormProps) {
  const { children, onSubmit } = props
  const [data, setData] = useState({})

  function handleSubmit(e: any) {
    e.preventDefault()
    e.dataDict = data
    onSubmit(e)
  }
  function handleChange(e: React.FormEvent) {
    setData({ ...data, [e.target.name]: e.target.value, })
  }
  function renderChildren() {
    return React.Children.map(children, (child: any) => {
      if (!React.isValidElement(child)) { return null }
      return React.cloneElement(child, { onChange: handleChange });
    });
  }
  return <form className="Form" onSubmit={handleSubmit}>{renderChildren()}</form>
}

// This provides functionality to have multiple values for a single 'field'
//   returns the multiple values as a csv (as the event.target.value)
interface MultiFieldProps extends React.HTMLElement {
  label: string
  name: string
  component: typeof FormInput
  onChange?: (e: any) => void
}
export function MultiField(props: MultiFieldProps) {
  const { label, name, component: Component, onChange, ...rest } = props
  const [values, setValues] = useState([""])
  function handleInput(e: any, idx: number) {
    let newValues = [...values]
    newValues[idx] = e.target.value
    updateValues(newValues)
  }
  function addField(idx: number) {
    let newValues = [...values]
    newValues.splice(idx + 1, 0, "") // insert a new empty field
    updateValues(newValues)
  }
  function removeField(idx: number) {
    let newValues = [...values]
    newValues.splice(idx, 1)
    if (values.length === 0) {
      newValues = [""]
    }
    updateValues(newValues)
  }
  function updateValues(newValues: string[]) {
    setValues(newValues)
    let newValuesCSV = newValues.map(field => {
      if (field.includes(',')) {
        return `"${field}"` // quote the field
      }
      return field
    }).join(",")
    if (onChange) {
      onChange({ target: { name, value: newValuesCSV } })
    }
  }
  return (
    <div className='formGroup'>
      <label>{label}</label>
      <ol>
        {values.map((value, idx) => (
          <li key={idx == 0 ? name : name + idx}>
            <Component
              name={idx == 0 ? name : name + idx}
              value={value}
              onChange={(e: any) => handleInput(e, idx)}
              {...rest}
            />
            <button type="button" onClick={() => addField(idx)}>+</button>
            <button type="button" onClick={() => removeField(idx)}>-</button>
          </li>
        ))}
      </ol>
    </div>
  )
}

interface FormButtonProps extends React.HTMLButtonElement {
  name: string
  [key: string]: any
}
export function FormButton(props: FormButtonProps) {
  return <button {...props} />
}

interface FormInputProps extends React.HTMLInputElement {
  name: string
  label?: string
  type?: string
  [key: string]: any
}
export function FormInput(props: FormInputProps) {
  const { label, type = 'text', ...rest } = props
  if (label === undefined) { return <input type={type} {...rest} /> }
  return <div className='formGroup'>
    <label>{label}</label> <input type={type} {...rest} />
  </div>
}

interface FormSelectProps extends React.HTMLSelectElement {
  label: string
  name: string
}
export function FormSelect(props: FormSelectProps) {
  const { label, ...rest } = props
  return (
    <div className='formGroup'>
      <label>{label}</label>
      <select {...rest} />
    </div>
  )
}

interface FormTextAreaProps extends React.HTMLTextAreaElement {
  label: string
  name: string
}
export function FormTextArea(props: FormTextAreaProps) {
  const { label, ...rest } = props
  return (
    <div className='formGroup'>
      <label>{label}</label>
      <textarea {...props} />
    </div>
  )
}





// This is a version of FormInput that handles its own state
// interface FormInputProps extends React.HTMLInputElement {
//   name: string
//   label?: string
//   type?: string
//   [key: string]: any
// }
// export function FormInput(props: FormInputProps) {
//   const { label, onChange, value: valueStart, type = 'text', ...rest } = props
//   const [value, setValue] = useState(valueStart || '')
//   function handleChange(e: React.ChangeEvent) {
//     setValue(e.target.value)
//     if (onChange) { onChange(e) }
//   }
//   const inp = <input type={type} value={value} onChange={handleChange} {...rest} />
//   if (label === undefined) { return inp }
//   return <div className='formGroup'>
//     <label>{label}</label> {inp}
//   </div>
// }

// Different buttons
            // {/* <button type="button" onClick={() => removeField(idx)} disabled={values.length === 1}>-</button> */}
            // {/* {(idx === 0 || idx === values.length - 1) && (
            //   <div>
            //     <button type="button" onClick={addField}>+</button>
            //     <button type="button" onClick={removeField} disabled={values.length === 1}>-</button>
            //   </div>
            // )} */}