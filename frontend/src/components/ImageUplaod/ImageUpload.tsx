import { useState } from 'react';
import { Thumbnail } from './Thumbnail';

interface FileUploadProps {
	label: string;
	renderImageFiles: (File | string)[];
	setRenderImageFiles: (iamges: (File | string)[]) => void;
	newImages: (File | string)[];
	setNewImages: (newImages: (File | string)[]) => void;
	deletedImages: (File | string)[];
	setDeletedImages: (deletedImages: (File | string)[]) => void;
}

function extractObjectKeyForS3Deletion(url: string): string {
	const urlObj = new URL(url);
	return urlObj.pathname.substring(1);

}

// responsible for the image uploading functionality
// displays a file input for selecting files, an upload button, and a list of thumbnail images
// also takes care of displaying the ImageModal when a thumbnail is clicked
export function ImageUpload(props: FileUploadProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [currentViewing, setCurrentViewing] = useState<File | string | null>(null); 
	const maxSize = 1024 * 1024 * 25;
	const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

	// handler for the Add button
  // opens the modal and resets the errorMessage and selectedFile state variables
	function handleAddButton() {
		setIsModalOpen(true);
		setErrorMessage(null);
		setSelectedFile(null);
	}

	// handler for the file input change event
  // checks the file type and size and updates the errorMessage and selectedFile state variables accordingly
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

	// handlers for the Next and Previous buttons in the ImageModal
  // call setCurrentViewing with the next or previous file
	function handleNext(index: number) {
		const next = (index + 1) % props.renderImageFiles.length;
		setCurrentViewing(props.renderImageFiles[next]);
	}
	function handlePrev(index: number) {
		const prev = (index - 1 + props.renderImageFiles.length) % props.renderImageFiles.length;
		setCurrentViewing(props.renderImageFiles[prev]);
	}

	// adds the selectedFile to the newImages and renderImageFiles arrays in the parent component
	function handleUpload() {
		if (selectedFile) {
			props.setRenderImageFiles([...props.renderImageFiles, selectedFile]);
			props.setNewImages([...props.newImages, selectedFile]);
			setIsModalOpen(false);
		}
	}

	// removes the file from the renderImageFiles and newImages arrays in the parent component
  // if the deleted file was not newly added, adds it to the deletedImages array
	function handleDelete(index: number) {
		const deletedFile = props.renderImageFiles[index];
		const newFileList = [...props.renderImageFiles];
		newFileList.splice(index, 1);

		if (props.newImages.includes(deletedFile)) {
			props.setNewImages(props.newImages.filter(file => file !== deletedFile));
		} else {
			props.setDeletedImages([...props.deletedImages, extractObjectKeyForS3Deletion(deletedFile as string)]);
		}

		props.setRenderImageFiles(newFileList);

		setCurrentViewing(null);
	}

	return (
		<>
			<label>{props.label}</label>
			<div className="upload-file-field">
				{props.renderImageFiles.map((item, index) => ( <Thumbnail key={index} file={item} index={index} handleNext={() => handleNext(index)}
					handlePrev={() => handlePrev(index)} handleDelete={() => handleDelete(index)} currentViewing={currentViewing} setCurrentViewing={setCurrentViewing} /> ))}
				<button className={`file-upload-btn ${props.renderImageFiles.length > 0 ? 'expanded' : ''}`} type="button" onClick={handleAddButton}>
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