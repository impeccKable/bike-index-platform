import { useState, useEffect } from 'react';
import React, { Children } from 'react';
import { Link } from 'react-router-dom';

// A custom version of a form that compiles the form data into a dictionary
//   and will later handle the submission and stuff
interface FormProps {
	children: any;
	onSubmit: (e: any) => void;
}
export function Form(props: FormProps) {
	const { children, onSubmit } = props;
	const [data, setData] = useState({});

	function handleSubmit(e: any) {
		e.preventDefault();
		e.dataDict = data;
		onSubmit(e);
	}
	function handleChange(e: React.FormEvent) {
		setData({ ...data, [e.target.name]: e.target.value });
	}
	function renderChildren() {
		return React.Children.map(children, (child: any) => {
			if (!React.isValidElement(child)) {
				return null;
			}
			return React.cloneElement(child, { onChange: handleChange });
		});
	}
	return (
		<form className="Form" onSubmit={handleSubmit}>
			{renderChildren()}
		</form>
	);
}

// This provides functionality to have multiple values for a single 'field'
//	 returns the multiple values as a csv (as the event.target.value)
interface MultiFieldProps extends React.HTMLElement {
	label: string;
	name: string;
	component: typeof FormInput;
	onChange?: (e: any) => void;
	[key: string]: any;
}
export function MultiField(props: MultiFieldProps) {
	const { label, name, component: Component, onChange, ...rest } = props;

	// array 1
	const [values, setValues] = useState(['']);

	if (rest.data) {
		useEffect(() => {
			setValues(rest.data);
		}, []);
	}

	function handleInput(e: any, idx: number) {
		let newValues = [...values];
		newValues[idx] = e.target.value;
		updateValues(newValues);
	}
	function addField(idx: number) {
		let newValues = [...values];
		newValues.splice(idx + 1, 0, ''); // insert a new empty field
		updateValues(newValues);
	}

	function removeField(idx: number) {
		let newValues = [...values];
		newValues.splice(idx, 1);
		if (newValues.length === 0) {
			newValues = [''];
		}
		updateValues(newValues);
	}
	function updateValues(newValues: string[]) {
		setValues(newValues);
		let newValuesCSV = newValues
			.map((field) => {
				if (field.includes(',')) {
					return `"${field}"`; // quote the field
				}
				return field;
			})
			.join(',');
		if (onChange) {
			onChange({ target: { name, value: newValuesCSV } });
		}
	}
	return (
		<div className="form-group">
			<label>{label}</label>
			<ol>
				{values.map((value: string, idx: number) => (
					<li key={idx == 0 ? name : name + idx}>
						<Component
							name={idx == 0 ? name : name + idx}
							value={value}
							onChange={(e: any) => handleInput(e, idx)}
							{...rest}
						/>
						<button type="button" onClick={() => addField(idx)}>
							+
						</button>
						<button type="button" onClick={() => removeField(idx)}>
							-
						</button>
					</li>
				))}
			</ol>
		</div>
	);
}

interface FormButtonProps extends React.HTMLButtonElement {
	[key: string]: any;
}
export function FormButton(props: FormButtonProps) {
	return (
		<div className="btn-div">
			<button
				className={props.type === 'submit' ? 'btn-submit' : ''}
				{...props}
			/>
		</div>
	);
}

interface FormInputProps extends React.HTMLInputElement {
	name: string;
	label?: string;
	labelProps?: React.HTMLElement;
	type?: string;
	[key: string]: any;
}
export function FormInput(props: FormInputProps) {
	const { label, labelProps, type = 'text', ...rest } = props;
	let ret = null;
	switch (type) {
		case 'select':
			ret = <select {...rest} />;
			break;
		case 'textarea':
			ret = <textarea {...rest} />;
			break;
		case 'phone':
			ret = <input type="tel" {...rest} />;
			break;
		default:
			ret = <input type={type} {...rest} />;
	}
	if (label) {
		return (
			<div className="form-group">
				<label {...(labelProps || {})}>{label}</label> {ret}
			</div>
		);
	}
	return ret;
}

interface InfoProps extends React.HTMLElement {
	[key: string]: any;
}
export function Info(props: InfoProps) {
	return <div className="info" {...props}></div>;
}

interface LinkButtonProps extends React.HTMLButtonElement {
	to: string;
	[key: string]: any;
}
export function LinkButton(props: LinkButtonProps) {
	const { to, ...rest } = props;
	return (
		<div className="btn-div">
			<Link to={to}>
				<button {...rest} />
			</Link>
		</div>
	);
}
