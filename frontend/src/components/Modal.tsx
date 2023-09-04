interface ModalProps extends React.HTMLInputElement {
	classNames: React.HtmlElement;
	bodyText: string;
	submitEvent: (e: any) => void;
	// usestate setter for showing/not showing modal
	showModal: (e: any) => void;
	header?: string;
	btnLabel?: string;
	Id?: string;
 }

export default function Modal(props: ModalProps) {
	const {btnLabel = 'Submit', header='', submitEvent, showModal} = props;

	return (
		<div id={props.Id ? props.Id : ''} className={`${props.classNames} modal`}>
			<div className="modal-content">
				<div className="modal-header">
					<span className="close" onClick={()=>{showModal(false)}}>&times;</span>
					<h3>{header}</h3>
				</div>
				<div className="modal-body">
					<p>{props.bodyText}</p>
				</div>
				<div className="modal-footer">
					<button onClick={()=>{showModal(false)}}>Cancel</button>
					<button className="modal-btn" onClick={submitEvent}>{btnLabel}</button>
				</div>
			</div>
		</div>
	);
}
