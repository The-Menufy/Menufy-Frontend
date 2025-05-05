import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Row } from "react-bootstrap";
import { signupStore } from "../../../../store/signupStore";
const StepThree = () => {
	const { setStep, step, setCurrentUser, currentUser } = signupStore();
	// Define the validation schema using Yup
	const schema = yup.object().shape({
		password: yup
			.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
	});
	// Initialize useForm with the resolver and default values
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			password: currentUser.password,
			confirmPassword: "",
		},
	});
	// State to manage password visibility
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	// Handle form submission
	const onSubmit = (data) => {
		console.log(data);
		delete data.confirmPassword;
		setCurrentUser(data);
		setStep(4);
	};
	return (
		<section>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					{/* Password Field */}
					<div className="col-12 mb-2">
						<div className="form-group mb-3">
							<label className="form-label">
								Password <span className="required">*</span>
							</label>
							<div className="input-group">
								<input
									type={showPassword ? "text" : "password"}
									{...register("password")}
									className={`form-control ${errors.password ? "is-invalid" : ""}`}
									placeholder="Enter your password"
								/>
								<button
									type="button"
									className="btn btn-primary bg-none"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							{errors.password && (
								<div className="text-danger fs-13 my-2">{errors.password.message}</div>
							)}
						</div>
					</div>
					{/* Confirm Password Field */}
					<div className="col-12 mb-2">
						<div className="form-group mb-3">
							<label className="form-label">
								Confirm Password <span className="required">*</span>
							</label>
							<div className="input-group">
								<input
									type={showConfirmPassword ? "text" : "password"}
									{...register("confirmPassword")}
									className={`form-control ${
										errors.confirmPassword ? "is-invalid" : ""
									}`}
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									className="btn btn-primary bg-none"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							{errors.confirmPassword && (
								<div className="text-danger fs-13 my-2">
									{errors.confirmPassword.message}
								</div>
							)}
						</div>
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
						<FaArrowRight size={20} />
					</button>
				</Row>
			</form>
		</section>
	);
};
export default StepThree;
