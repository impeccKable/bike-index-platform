interface FileUploadProps {
	label: string;
}

export function FileUpload(props: FileUploadProps) {
	return (
		<>
			<label>{props.label}</label>
			<button type="button">＋</button>
		</>
	);
}
