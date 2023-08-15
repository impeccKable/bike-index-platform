import { useState, useEffect } from 'react';
import React, { Children } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";

// A custom version of a form that compiles the form data into a dictionary
//   and will later handle the submission and stuff
interface FormProps {
	children: any;
	onSubmit: (e: any) => void;
}
export function Form(props: FormProps) {
	if (useRecoilValue(debugState) == true) {
		console.log("Form");
	}
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
			return React.cloneElement(child, {
				onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
					handleChange(event);
					if (child.props.onChange) {
						child.props.onChange(event);
					}
				}
			});
		});
	}
	return (
		<form onSubmit={handleSubmit}>
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
	if (useRecoilValue(debugState) == true) {
		console.log("MultiField");
	}
	const { label, name, component: Component, onChange, disableSubmit, ...rest } = props;
	const [values, setValues] = useState(['']);
	const [collapsed, setCollapsed] = useState(false);
	let parentSubmitDisabled = true;

	useEffect(() => {
		if (rest.data) {
			setValues(rest.data);
		}
	}, [rest.data]);

	function DisableParentSubmit (state: boolean) {
		if (disableSubmit) {
			disableSubmit(state);
			parentSubmitDisabled = false;
		}
	}

	function handleInput(e: any, idx: number) {
		e.target.className += `${e.target.className} red-bordered`;
		let newValues = [...values];
		newValues[idx] = e.target.value;
		updateValues(newValues);
		DisableParentSubmit(false);
	}
	function addField(idx: number) {
		let newValues = [...values];
		newValues.splice(idx + 1, 0, ''); // insert a new empty field
		setCollapsed(newValues.length > 7);
		updateValues(newValues);
	}

	function removeField(idx: number) {
		let newValues = [...values];
		newValues.splice(idx, 1);
		if (newValues.length === 0) {
			newValues = [''];
		}
		updateValues(newValues);
		DisableParentSubmit(false);
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
		<>
			<label>{label}</label>
			<ol className='multi-field'>
				{collapsed ? 
				<>
				<li><button hidden={values.length < 3} id="ExpBtn" type="button" onClick={()=>{setCollapsed(!collapsed)}}>Expand</button></li>
				<li key={name}>
						<Component
							name={name}
							value={values[0]}
							onChange={(e: any) => handleInput(e, 0)}
							{...rest}
						/>
						<button type="button" onClick={() => addField(0)}>＋</button>
						<button type="button" onClick={() => removeField(0)}>－</button>
				</li>
				<li>{values.length > 1 ? <>• • •</> : <></>}</li>
				</>
				:
				<>
				<button hidden={values.length < 3} id="ClpBtn" type="button"  onClick={()=>{setCollapsed(!collapsed)}}>Collapse</button>
				{values.map((value: string, idx: number) => (
					<li key={idx == 0 ? name : name + idx}>
						<Component
							name={idx == 0 ? name : name + idx}
							value={value}
							onChange={(e: any) => handleInput(e, idx)}
							{...rest}
						/>
						<button type="button" onClick={() => addField(idx)}>＋</button>
						<button type="button" onClick={() => removeField(idx)}>－</button>
					</li>
				))}
				</>}
			</ol>
		</>
	);
}

interface FormButtonProps extends React.HTMLButtonElement {
	disabled?: boolean;
	onClick?: (e: any) => void;
	[key: string]: any;
}
export function FormButton(props: FormButtonProps) {
	const { disabled, onClick, ...rest } = props;
	if (props.disabled) {
		return <button {...rest} disabled />;
	}
	return <button {...props} />;
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
			<>
				<label {...(labelProps || {})}>{label}</label> {ret}
			</>
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
	const navigate = useNavigate();
	return <button {...rest} onClick={
		() => navigate((to === 'back') ? -1 : to)
	} />
}
