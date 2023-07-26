import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { httpClient } from '../services/HttpClient';
import { debugState } from '../services/Recoil';
import { useRecoilValue } from 'recoil';
import DebugLogs from '../services/DebugLogs';

export default function Stats() {
	const [stats, setStats]: any = useState({});
	const debug = useRecoilValue(debugState)

	useEffect(() => {
		DebugLogs('Stats Component', '', debug)
		const getStats = async () => {
			const response = await httpClient.get("/stats");
			return response.data;
		}
		getStats().then(setStats);
	}, []);

	useEffect(() => {
		if (Object.keys(stats).length > 0) {
			DebugLogs('Stats', stats, debug)
		}
	}, [stats, debug])

	return <div className="formal stats-page">
		<Navbar />
		<main>
			<h1>Stats</h1>
			<>
				<h3>Total number of rows for each table:</h3>
				<table>
					<p>Users:     {stats.users}</p>
					<p>Urls:      {stats.urls}</p>
					<p>Phones:    {stats.phones}</p>
					<p>Emails:    {stats.emails}</p>
					<p>Addresses: {stats.addresses}</p>
					<p>Names:     {stats.names}</p>
				</table>
			</>
		</main>
	</div>
}
