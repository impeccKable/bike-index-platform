interface ImageModalProps {
  imageUrl: string;
  // index: number;
  handleClose: () => void;
  // handleNext: () => void;
  // handlePrev: () => void;
  // handleDelete: () => void;
}

export function ImageModal(props: ImageModalProps) {

  function handleClickImage() {
    window.open(props.imageUrl, "_blank");
  }

  return (
    <div className="image-modal">
      <div className="modal">
        <div className="modal-content">
          <span className="modal-btn close" onClick={props.handleClose}>&#215;</span>
          <img src={props.imageUrl} alt={`Image $eprops.index}`} onClick={handleClickImage} />
        </div>
      </div>
    </div>
  )
}