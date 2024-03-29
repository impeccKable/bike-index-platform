import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { httpClient } from '../services/HttpClient';
import { debugState } from '../services/Recoil';
import { useRecoilValue } from 'recoil';
import DebugLogs from '../services/DebugLogs';
import TextWindow from '../components/TextWindow';
import LoadingIcon from '../components/LoadingIcon';

export default function About() {
	const [stats, setStats]: any = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const debug = useRecoilValue(debugState)
	let pageName = "About";

	useEffect(() => {
		DebugLogs('About Component', '', debug)
		async function getStats() {
			const response = await httpClient.get("/stats");
			return response.data;
		}
		getStats().then((stats: any) => {
			setStats(stats)
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		if (Object.keys(stats).length > 0) {
			DebugLogs('Stats', stats, debug)
		}
	}, [stats, debug])

	return <div className="formal about-page">
		<Navbar />
		<main>
			<h1>{pageName}</h1>
			<TextWindow pageName={pageName}/>
			<br />
			<br />
			<h3>Database totals:<LoadingIcon when={isLoading} delay={1}/></h3>
			<table>
				<tbody>
					<tr><td>Users    </td><td>{stats.users    }</td></tr>
					<tr><td>Thieves  </td><td>{stats.thieves  }</td></tr>
					<tr><td>Names    </td><td>{stats.names    }</td></tr>
					<tr><td>Emails   </td><td>{stats.emails   }</td></tr>
					<tr><td>Urls     </td><td>{stats.urls     }</td></tr>
					<tr><td>Addresses</td><td>{stats.addresses}</td></tr>
					<tr><td>Phones   </td><td>{stats.phones   }</td></tr>
					<tr><td>Bike serials</td><td>{stats.bikeSerials}</td></tr>
					<tr><td>Phrases</td><td>{stats.phrases   }</td></tr>
					<tr><td>Notes</td><td>{stats.notes   }</td></tr>
				</tbody>
			</table>
		</main>
	</div>
}
