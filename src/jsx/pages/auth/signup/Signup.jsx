import { Link } from "react-router-dom";
import logo from "../../../../assets/images/logo.png";
import loginBg from "../../../../assets/images/login/bg-1.jpeg";
import { SignupForm } from "./components/Wizard";
// Validation Schema
export function Signup() {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center min-vh-100 p-2 lg-p-4">
			<div className="container w-100 md-m-auto mx-2">
				<div className="row g-0 align-items-center rounded-3 shadow-lg">
					<img
						src={loginBg}
						alt="Background"
						className="d-md-none d-block col-12 rounded-top "
						style={{
							objectPosition: "bottom",
							maxHeight: "200px",
							objectFit: "cover",
						}}
					/>
					{/* Left Column: Form */}
					<div className="col-lg-6 col-md-7 d-flex align-items-center p-4">
						<div className="w-100">
							{/* Logo */}
							<img
								src={logo}
								alt="Menufy Logo"
								className="mb-3 w-50 mx-auto d-block"
							/>
							{/* Sign Up Prompt */}
							<p className="text-center text-muted mb-4">
								Have An Account Already?{" "}
								<Link className="text-primary" to="/login">
									Login
								</Link>
							</p>
							{/* Signup Form */}
							<SignupForm />
						</div>
					</div>
					{/* Right Column: Background */}
					<img
						src={loginBg}
						alt="Background"
						style={{ minHeight: "580px", objectFit: "cover" }}
						className="d-none d-md-block col-lg-6 col-md-5 rounded-end h-25 order-last md:h-100 object-cover aspect-16/9 object-bottom md:object-center"
					/>
					{/* <div className="col-lg-6 col-md-5 d-none d-md-block h-100">
					</div> */}
				</div>
			</div>
		</div>
	);
}
