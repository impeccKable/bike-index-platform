interface ImageModalProps {
  imageUrl: string;
  // index: number;
  handleClose: () => void;
  // handleNext: () => void;
  // handlePrev: () => void;
  // handleDelete: () => void;
}

export function ImageModal(props: ImageModalProps) {
  return (
    <div className="image-modal">
      <div className="modal">
        <div className="modal-content">
          <img src={props.imageUrl} alt={`Image $eprops.index}`} />
          <span className="modal-btn close" onClick={props.handleClose}>&#215;</span>
        </div>
      </div>
    </div>
  )
}