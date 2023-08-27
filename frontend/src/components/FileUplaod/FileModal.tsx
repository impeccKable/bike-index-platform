interface FileModalProps {
	imageUrl: string;
	handleClose: () => void;
	handleNext: () => void;
	handlePrev: () => void;
	handleDelete: () => void;
	icon: string | undefined;
	fileName?: string;
}

// component for display image in a single image in a modal
// receives the imageUrl, event handler functions as props from its parent component
export function FileModal(props: FileModalProps) {

	// handler for clicking the image within the modal
	// stops the event propagation to prevent the modal from closing and opens the image in a new tab.
	function handleClickImage(event: React.MouseEvent) {
		event.stopPropagation();
		window.open(props.imageUrl, "_blank");
	}

	return (
		<div className="image-modal">
			<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
				rel="stylesheet"></link>
			{/* <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.min.js"></script> */}
			<div className="modal" onClick={props.handleClose}>
				<div className="modal-content">
					<span title="Close" className="modal-btn close" onClick={props.handleClose}>&#215;</span>
						<div>
							{props.icon !== undefined && (
								<span className="overlay-text">{props.fileName}</span>
							)}
							<img src={props.icon !== undefined ? props.icon : props.imageUrl} alt={`Image $eprops.index}`} onClick={handleClickImage} />
						</div>
				</div>
			</div>
			<div className="image-modal-btns">
				<span title="Previous" className="modal-btn prev" onClick={props.handlePrev}>&lt;</span>
				<span title="Delete" className="modal-btn delete material-icons" onClick={props.handleDelete}>delete</span>
				<span title="Next" className="modal-btn next" onClick={props.handleNext}>&gt;</span>
			</div>
		</div>
	)
}

