import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signupStore } from "../../../../store/signupStore";
import { Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
const StepOne = () => {
	const { setStep, setCurrentUser, currentUser } = signupStore();
	// Define the validation schema using Yup
	const schema = yup.object().shape({
		firstName: yup.string().required("First Name is required"),
		lastName: yup.string().required("Last Name is required"),
		email: yup
			.string()
			.email("Invalid email format")
			.required("Email is required"),
	});
	// Initialize useForm with the resolver and default values
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,
		},
	});
	// Handle form submission
	const onSubmit = (data) => {
		console.log(data);
		setCurrentUser(data);
		setStep(2);
	};
	return (
		<section>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					{/* First Name Field */}
					<div className="col-lg-6 mb-2">
						<div className="form-group mb-3">
							<label className="form-label">
								First Name <span className="required">*</span>
							</label>
							<input
								type="text"
								{...register("firstName")}
								className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
								placeholder="Parsley"
							/>
							{errors.firstName && (
								<div className="invalid-feedback">{errors.firstName.message}</div>
							)}
						</div>
					</div>
					{/* Last Name Field */}
					<div className="col-lg-6 mb-2">
						<div className="form-group mb-3">
							<label className="form-label">
								Last Name <span className="required">*</span>
							</label>
							<input
								type="text"
								{...register("lastName")}
								className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
								placeholder="Montana"
							/>
							{errors.lastName && (
								<div className="invalid-feedback">{errors.lastName.message}</div>
							)}
						</div>
					</div>
					{/* Email Field */}
					<div className="col mb-2">
						<div className="form-group mb-3">
							<label className="form-label">
								Email Address <span className="required">*</span>
							</label>
							<input
								type="email"
								{...register("email")}
								className={`form-control ${errors.email ? "is-invalid" : ""}`}
								placeholder="example@example.com"
							/>
							{errors.email && (
								<div className="invalid-feedback">{errors.email.message}</div>
							)}
						</div>
					</div>
				</div>
				{/* Submit Button */}
				<Row sm={3} className="gap-2 justify-content-end">
					<button type="submit" className="btn btn-primary">
						<FaArrowRight size={20} />
					</button>
				</Row>
			</form>
		</section>
	);
};
export default StepOne;
