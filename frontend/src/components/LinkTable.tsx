import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LinkTableProps extends React.HTMLInputElement {
	header: any;
	data: Array<any>;
	linkBase: string; // e.g. '/thiefEdit?thiefId='
	[key: string]: any;
}

export default function LinkTable(props: LinkTableProps) {
	const navigate = useNavigate();
	const { header, data, linkBase, ...rest } = props;
	const widths = Object.values(header).map((val: any) => `${val}px`);
	const idName = data.length > 0 ? Object.keys(data[0])[0] : ''; // e.g. 'thiefId'

	return (
		<table className="link-table" {...rest}>
			<thead>
				<tr>
					{Object.keys(header).map((colName: any, idx) => {
						return <th
							key={colName}
							style={{
								minWidth: widths[idx],
								maxWidth: widths[idx]
							}}
						>{colName}</th>;
					})}
				</tr>
			</thead>
			<tbody>
				{data.map((row) => {
					return (
						<tr
							key={row[idName]}
							className="tr-link"
							onClick={() =>
								navigate(`${linkBase}${row[idName]}`)
							}
						>
							{Object.values(row).map((cell: any, idx) => {
								if (Array.isArray(cell)) {
									cell = cell.join(', ');
								}
								return <td
									key={Object.keys(row)[idx]}
									style={{
										minWidth: widths[idx],
										maxWidth: widths[idx]
									}}
								>{cell}</td>;
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
