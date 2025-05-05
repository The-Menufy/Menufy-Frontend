import { Fragment } from "react";
//import Multistep from "react-multistep";
import { Stepper, Step } from "react-form-stepper";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { signupStore } from "../../../../store/signupStore";
export const SignupForm = () => {
	const { step } = signupStore();
	const StepsAvailable = [<StepOne />, <StepTwo />, <StepThree />, <StepFour />];
	return (
		<Fragment>
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="">
						<div className="card-body">
							<div className="form-wizard ">
								<Stepper className="nav-wizard" activeStep={step - 1} label={false}>
									<Step className="nav-link" />
									<Step className="nav-link" />
									<Step className="nav-link" />
									<Step className="nav-link" />
								</Stepper>
								{StepsAvailable[step - 1]}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
