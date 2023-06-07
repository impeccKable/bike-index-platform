import React from "react";
import { useState, useEffect } from "react";
import { LinkButton } from "./Form";
import { Link } from "react-router-dom";
import { Thief } from "../pages/ThiefList.tsx";

interface ThiefTableProps extends React.HTMLInputElement {
	thiefs: Array<Thief>;
}

export default function ThiefTable(props: ThiefTableProps) {
	const [adminStatus, setAdminStatus] = useState(true);

	return (
		<div className="container thief-table-div">
			<table className="thief-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Address</th>
					</tr>
				</thead>
				<tbody>
					{props.thiefs.map((thief) => {
						return (
							<Link
								key={`Row${thief.thiefId}`}
								className="row-link"
								to={`/thiefEdit?thiefId=${thief.thiefId}`}
							>
								<tr key={thief.thiefId}>
									<td>{thief.name}</td>
									<td>{thief.phone}</td>
									<td>{thief.email}</td>
									<td>{thief.address}</td>
								</tr>
							</Link>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
