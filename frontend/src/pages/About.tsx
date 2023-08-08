import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { httpClient } from '../services/HttpClient';
import { debugState } from '../services/Recoil';
import { useRecoilValue } from 'recoil';
import DebugLogs from '../services/DebugLogs';
import TextWindow from '../components/TextWindow';

export default function About() {
	const [stats, setStats]: any = useState({});
	const debug = useRecoilValue(debugState);
	let pageName = "About";

	useEffect(() => {
		DebugLogs('About Component', '', debug)
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

	return <div className="formal about-page">
		<Navbar />
		<main>
			<h1>{pageName}</h1>
			<TextWindow pageName={pageName}/>
			<p>This is a demo of the Bike Index Platform website.</p>
			<br />
			<h3>Database totals:</h3>
			<table>
				<tbody>
					<tr><td>Users    </td><td>{stats.users    }</td></tr>
					<tr><td>Urls     </td><td>{stats.urls     }</td></tr>
					<tr><td>Phones   </td><td>{stats.phones   }</td></tr>
					<tr><td>Emails   </td><td>{stats.emails   }</td></tr>
					<tr><td>Addresses</td><td>{stats.addresses}</td></tr>
					<tr><td>Names    </td><td>{stats.names    }</td></tr>
				</tbody>
			</table>
		</main>
	</div>
}
