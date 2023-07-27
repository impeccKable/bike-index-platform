import { useState } from 'react';

interface FileUploadProps {
	label: string;
}

export function FileUpload(props: FileUploadProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<label>{props.label}</label>
			<button className="file-upload-btn" type="button" onClick={() => setIsModalOpen(true)}>
				＋
			</button>

			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
						<input type="file" />
					</div>
				</div>
			)}
		</>
	);
}
