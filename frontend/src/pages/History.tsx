import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar"
import { httpClient } from "../services/HttpClient"
import DebugLogs from "../services/DebugLogs"
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import LinkTable from '../components/LinkTable';
import { useLocation } from 'react-router-dom';

type History = {
	history_id: number;
	datetime: Date;
	user_name: string;
	action: string;
	changed_thief_id: number | null;
	changed_user_uid: string | null;
	data_type: string;
	data: string;
}

const header = {
	'ID': {},
	'Time': {},
	'User': { maxWidth: "6rem", minWidth: "6rem" },
	'Action': { maxWidth: "3rem", minWidth: "3rem" },
	'Changed Thief': { maxWidth: "4rem", minWidth: "4rem" },
	'Changed User': { maxWidth: "4rem", minWidth: "4rem" },
	'Type': { maxWidth: "4rem", minWidth: "4rem" },
	'Data': {},
}

export default function History() {
	const [history, setHistory] = useState<History[]>([]);
	const [page, setpage] = useState(1);
	const [id, setId] = useState<string | null>(null);
	const [pagemeta, setpagemeta] = useState({ totalRows: 0, totalPages: 0 });
	const debug = useRecoilValue(debugState);
	const location = useLocation();


	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const id = queryParams.get('thiefId');
		setId(id);
		console.log('id', id)

		let url;
		if (id !== null) {
			url = `/history?thiefId=${id}&page=${page}`;
		} else {
			url = `/history?thiefId=&page=${page}`;
		}

		httpClient.get(url)
			.then(res => {
				setHistory(res.data);
				DebugLogs('Hisotry get response', res.data, debug);
				const historyList: Array<History> = res.data.data.map((history: History) => {
					return {
						historyId: history.history_id,
						datetime: history.datetime,
						user: history.user_name,
						action: history.action,
						changed_thief: history.changed_thief_id,
						changed_user: history.changed_user_uid,
						type: history.data_type,
						data: history.data,
					}
				});
				setHistory(historyList);
				setpagemeta(res.data.meta);
			})
			.catch((err: any) => {
				DebugLogs('History get error', err, debug);
			});
	}, [page, id]);

	return (
		<div className="formal history-page">
			<Navbar />
			<main>
				<h1>History Log</h1>
				<LinkTable header={header} data={history} pagemeta={pagemeta} page={page} setpage={setpage} noNavigate={true} linkBase=''></LinkTable>
			</main>
		</div>
	)
}