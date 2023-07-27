interface FileUploadProps {
	label: string;
}

export function FileUpload(props: FileUploadProps) {
	return (
		<>
			<label>{props.label}</label>
			<button className="file-upload-btn" type="button">
				＋
			</button>
		</>
	);
}
