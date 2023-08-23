import { useAuth } from "../services/AuthProvider";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";
import { httpClient } from "../services/HttpClient";

export function AuthProtected({ children }: any) {
	const { user, loading }: any = useAuth();
	let response = null;

	useEffect(() => {
		httpClient.post("/token").then((res) => {
			response = res;
			console.log(response);
			//Possibly change to !==200
			if (response.status === 404) {
				<Navigate to="/logout" replace />;
			}
		}).catch((err: any) => { console.log(err); }
		);
		console.log(user);
	}, [loading]);

	if (!loading && !user) {
		return <Navigate to="/" replace />;
	} else if (loading) {
		return <div>Loading...</div>;
	}

	return children;
};
