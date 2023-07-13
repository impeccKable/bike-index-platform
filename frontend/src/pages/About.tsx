import Navbar from '../components/Navbar';
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";

export default function About() {
	if (useRecoilValue(debugState) == true) { console.log("About"); }
	return <div className="about-page">
		<Navbar />
		<main>
			<h1>About</h1>
			<p>This is a demo of the Bike Index Platform website.</p>
		</main>
	</div>
}
