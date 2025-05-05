import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { authStore } from "../../../store/authStore";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useRef } from "react";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
const GoogleAuth = () => {
	const { googleLogin } = authStore();
	const ref = useRef();
	const navigate = useNavigate();
	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				console.log("📢 [GoogleAuth.jsx:18]", tokenResponse);
				await googleLogin(tokenResponse.access_token);
				navigate("/");
			} catch (error) {
				console.error("Google login error:", error);
			}
		},
		onError: () => {
			console.log("Login Failed");
		},
	});
	return (
		<Col>
			<GoogleOAuthProvider clientId={clientId}>
				<button
					className="btn btn-outline-secondary  w-100 text-center p-0 my-1"
					style={{ height: "40px" }}
					onClick={() => {
						return login();
					}}
				>
					<FaGoogle size={20} />
				</button>
			</GoogleOAuthProvider>
		</Col>
	);
};
export default GoogleAuth;
