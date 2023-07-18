import Navbar from '../components/Navbar';
import axios from "axios";
import { useEffect, useState } from 'react';
import { httpClient } from '../services/HttpClient';

export default function Stats() {
	const [stats, setStats] = useState({});
	const config = {
		headers: {
			"Content-type": "application/json",
			// "Access-Control-Allow-Origin": "http://localhost:3000",
		},
	};

	useEffect(() => {
		const getStats = async () => {
			const response = await httpClient.get("/stats");
			return response.data;
		}
		getStats().then(setStats);
	}, []);

	return <div className="stats-page">
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
