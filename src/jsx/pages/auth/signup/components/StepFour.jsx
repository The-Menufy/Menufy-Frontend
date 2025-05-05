import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import { signupStore } from "../../../../store/signupStore";
import { useNavigate } from "react-router-dom";
const StepFour = () => {
	const { setStep, step, currentUser, signup } = signupStore();
	const [recaptcha, setRecaptcha] = useState(null);
	const navigate = useNavigate();
	const onSubmit = async (e) => {
		try {
			e.preventDefault();
			if (!recaptcha && step === 4) {
				throw new Error("Please verify you are not a robot");
			}
			console.log("📢 [StepFour.jsx:20]", currentUser);
			await signup(currentUser);
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "You have successfully signed up",
			});
			setTimeout(() => {
				navigate("/login");
			}, 1000);
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: error.message,
			});
		}
	};
	useEffect(() => {}, [step]);
	return (
		<section>
			<form onSubmit={onSubmit}>
				<div className="row">
					{/* Password Field */}
					<div className="col-12 mb-3 ">
						<ReCAPTCHA
							sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
							onChange={(value) => setRecaptcha(value)}
							size="normal"
						/>
					</div>
				</div>
				{/* Submit Button */}
				<Row sm={3} className="gap-2 justify-content-between">
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={() => setStep(step - 1)}
					>
						<FaArrowLeft size={20} />
					</button>
					<button type="submit" className="btn btn-primary">
						<FaCheck size={20} />
					</button>
				</Row>
			</form>
		</section>
	);
};
export default StepFour;
