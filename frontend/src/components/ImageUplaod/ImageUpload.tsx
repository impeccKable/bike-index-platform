import { useEffect, useState } from 'react';
import { Thumbnail } from './Thumbnail';

interface FileUploadProps {
	label: string;
	imageFiles: (File | string)[];
	newImages: (File | string)[];
	setNewImages: (newImages: (File | string)[]) => void;
	deletedImages: (File | string)[];
	setDeletedImages: (deletedImages: (File | string)[]) => void;
}

export function ImageUpload(props: FileUploadProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<(File | string)[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [currentViewing, setCurrentViewing] = useState<File | string | null>(null); 
	const maxSize = 1024 * 1024 * 25;
	const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

	function handleAddButton() {
		setIsModalOpen(true);
		setErrorMessage(null);
		setSelectedFile(null);
	}

	function handleSelectFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		setErrorMessage(null);
		if (event.target.files) {
			const file = event.target.files[0];

			if (!fileTypes.includes(file.type)) {
				setErrorMessage("Invalid file type");
			} else if (!(file.size <= maxSize)) {
				setErrorMessage("File size is too large");
			} else {
				setSelectedFile(file);
			}
		}
	}

	function handleNext(index: number) {
		const next = (index + 1) % uploadedFiles.length;
		setCurrentViewing(uploadedFiles[next]);
	}

	function handlePrev(index: number) {
		const prev = (index - 1 + uploadedFiles.length) % uploadedFiles.length;
		setCurrentViewing(uploadedFiles[prev]);
	}

	function handleUpload() {
		if (selectedFile) {
			setUploadedFiles(prevFiles => [...prevFiles, selectedFile]);
			props.setNewImages([...props.newImages, selectedFile]);
			setIsModalOpen(false);
		}
	}

	function handleDelete(index: number) {
		setUploadedFiles(prevFiles => {
			const deletedFile = prevFiles[index];
			const newFileList = [...prevFiles];
			newFileList.splice(index, 1);

			if (props.newImages.includes(deletedFile)) {
				props.setNewImages(props.newImages.filter(file => file !== deletedFile));
			} else {
				props.setDeletedImages([...props.deletedImages, deletedFile]);
			}

			return newFileList;
		});
		setCurrentViewing(null);
	}

	useEffect(() => {
		setUploadedFiles(props.imageFiles);
	}, [props.imageFiles]);

	return (
		<>
			<label>{props.label}</label>
			<div className="upload-file-field">
				{uploadedFiles.map((item, index) => ( <Thumbnail key={index} file={item} index={index} handleNext={() => handleNext(index)}
					handlePrev={() => handlePrev(index)} handleDelete={() => handleDelete(index)} currentViewing={currentViewing} setCurrentViewing={setCurrentViewing} /> ))}
				<button className={`file-upload-btn ${uploadedFiles.length > 0 ? 'expanded' : ''}`} type="button" onClick={handleAddButton}>
					＋
				</button>
			</div>

			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="modal-btn close" onClick={() => setIsModalOpen(false)}>&#215;</span>
						<input type="file" className="file-name" onChange={handleSelectFileChange} />
						<span className="error-message">{errorMessage}</span>
						<button type="button" className="confirm" disabled={!!errorMessage || !selectedFile} onClick={handleUpload}>Upload</button>
					</div>
				</div>
			)}
		</>
	);
}