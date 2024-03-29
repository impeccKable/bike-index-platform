import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigateBtn } from './NavigateBtn';

interface LinkTableProps extends React.HTMLInputElement {
	header: any;
	data: Array<any>;
	linkBase: string; // e.g. '/thief?thiefId='
	[key: string]: any;
}

export default function LinkTable(props: LinkTableProps) {
	const navigate = useNavigate();
	const { header, data, linkBase, ...rest } = props;
	const styles: any = Object.values(header);
	const idName = data.length > 0 ? Object.keys(data[0])[0] : ''; // e.g. 'thiefId'

	return (
		<div>
			<table className="link-table">
				<thead>
					<tr>
						{Object.keys(header).map((colName: any, idx) => {
							return <th
								key={colName}
								style={styles[idx]}
							>{colName}</th>;
						})}
					</tr>
				</thead>
				<tbody>
					{data.map((row) => {
						return (
							<tr
								key={row[idName]}
								className={`tr-link ${props.noNavigate ? "no-link" : ""}`} // (so header row is not included)
								{...(props.noNavigate ? {} : {
									onClick: () => navigate(`${linkBase}${row[idName]}`)
								})}
							>
								{Object.values(row).map((cell: any, idx) => {
									if (Array.isArray(cell)) {
										cell = cell.join(', ');
									}
									return <td
										key={Object.keys(row)[idx]}
										style={styles[idx]}
									>{cell?.toString() ?? ''}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<NavigateBtn
				total={props.pagemeta.totalRows}
				currentPage={props.page}
				setpage={(props.setpage)}
				totalPages={props.pagemeta.totalPages}
			/>
		</div>
	);
}
