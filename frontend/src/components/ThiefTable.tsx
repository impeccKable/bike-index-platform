import React from "react";
import { Thief } from "../pages/ThiefList.tsx";

interface ThiefTableProps extends React.HTMLInputElement {
	thiefs: Array<Thief>;
}

export default function ThiefTable(props: ThiefTableProps) {
	return (
		<div className="container thief-table-div">
			<table className="thief-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Address</th>
					</tr>
				</thead>
				<tbody>
					{props.thiefs.map((thief) => {
						return (
							<tr
								key={thief.thiefId}
								className="tr-link"
								onClick={
								() => window.location.href = `/thiefEdit?thiefId=${thief.thiefId}`
							}>
								<td>{thief.thiefId}</td>
								<td>{thief.name.join(", ")}</td>
								<td>{thief.phone.join(", ")}</td>
								<td>{thief.email.join(", ")}</td>
								<td>{thief.address}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
