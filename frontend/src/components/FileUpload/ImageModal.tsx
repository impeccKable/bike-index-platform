interface ImageModalProps {
	imageUrl: string;
	index: number;
	handleClose: () => void;
	handleNext: (index: number) => void;
	handlePrev: (index: number) => void;
	// handleDelete: () => void;
}

export function ImageModal(props: ImageModalProps) {
	function handleClickImage() {
		window.open(props.imageUrl, '_blank');
	}

	function handleOnClickNext(event: React.MouseEvent) {
		event.stopPropagation();
		props.handleNext(props.index);
	}

	function handleOnClickPrev(event: React.MouseEvent) {
		event.stopPropagation();
		props.handlePrev(props.index);
	}
	return (
		<div className="image-modal">
			<div className="modal">
				<div className="modal-content">
					<span className="modal-btn close" onClick={props.handleClose}>
						&#215;
					</span>
					<img
						src={props.imageUrl}
						alt={`Image $eprops.index}`}
						onClick={handleClickImage}
					/>
				</div>
			</div>
			<div className="image-modal-btns">
				<span className="modal-btn prev" onClick={handleOnClickPrev}>
					&lt;
				</span>
				<span className="modal-btn next" onClick={handleOnClickNext}>
					&gt;
				</span>
			</div>
		</div>
	);
}
