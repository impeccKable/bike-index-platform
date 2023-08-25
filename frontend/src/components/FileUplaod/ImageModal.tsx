interface ImageModalProps {
	imageUrl: string;
	handleClose: () => void;
	handleNext: () => void;
	handlePrev: () => void;
	handleDelete: () => void;
}

// component for display image in a single image in a modal
// receives the imageUrl, event handler functions as props from its parent component
export function ImageModal(props: ImageModalProps) {

	// handler for clicking the image within the modal
	// stops the event propagation to prevent the modal from closing and opens the image in a new tab.
	function handleClickImage(event: React.MouseEvent) {
		event.stopPropagation();
		window.open(props.imageUrl, "_blank");
	}

	return (
		<div className="image-modal">
			<div className="modal" onClick={props.handleClose}>
				<div className="modal-content">
					<span className="modal-btn close" onClick={props.handleClose}>&#215;</span>
					<img src={props.imageUrl} alt={`Image $eprops.index}`} onClick={handleClickImage} />
				</div>
			</div>
			<div className="image-modal-btns">
				<span className="modal-btn prev" onClick={props.handlePrev}>&lt;</span>
				<span className="modal-btn delete" onClick={props.handleDelete}>&#x1F5D1;</span>
				<span className="modal-btn next" onClick={props.handleNext}>&gt;</span>
			</div>
		</div>
	)
}

