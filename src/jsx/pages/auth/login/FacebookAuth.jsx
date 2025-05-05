const clientId = import.meta.env.VITE_FACEBOOK_APP_ID; // Replace with your Google OAuth client ID
import FacebookLogin from "react-facebook-login";
import { FaFacebook } from "react-icons/fa";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
const FacebookAuth = () => {
	const { loginFacebook } = authStore();
	const navigate = useNavigate();
	const responseFacebook = async (response) => {
		try {
			await loginFacebook(response.accessToken);
			navigate("/");
		} catch (error) {}
	};
	return (
		<FacebookLogin
			appId={clientId}
			autoLoad={true}
			callback={responseFacebook}
			fields="name,email,picture"
			cssClass="btn btn-outline-secondary w-100 my-1  m-0"
			buttonStyle={{ height: "40px", textAlign: "center", padding: 0 }}
			textButton=""
			typeButton="button"
			icon={<FaFacebook size={20} className="mx-2" />}
		/>
	);
};
export default FacebookAuth;
