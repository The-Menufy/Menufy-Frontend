import { Container } from "react-bootstrap";
const Terms = () => {
	return (
		<Container className="p-5 terms-container">
			<h1 className="text-primary text-center border-bottom bosrder-primary border-bottom-4 pb-5 mb-4">
				Restaurant Terms and Conditions
			</h1>
			<p className="mb-4">
				Welcome to our restaurant. By accessing our website and using our services,
				you agree to the following terms and conditions:
			</p>
			<div className="terms-section mb-4">
				<h4 className="text-primary">1. General</h4>
				<p>
					These terms and conditions govern your use of our website and services. By
					using our website, you accept these terms in full.
				</p>
			</div>
			<div className="terms-section mb-4">
				<h4 className="text-primary">2. Reservations</h4>
				<p>
					Reservations can be made through our website or by calling our restaurant.
					We reserve the right to cancel or modify reservations at any time.
				</p>
			</div>
			<div className="terms-section mb-4">
				<h4 className="text-primary">3. Payments</h4>
				<p>
					All payments must be made in full at the time of service. We accept various
					forms of payment including credit cards and cash.
				</p>
			</div>
			<div className="terms-section mb-4">
				<h4 className="text-primary">4. Cancellations</h4>
				<p>
					If you need to cancel your reservation, please do so at least 24 hours in
					advance. Failure to cancel in a timely manner may result in a cancellation
					fee.
				</p>
			</div>
			<div className="terms-section mb-4">
				<h4 className="text-primary">5. Liability</h4>
				<p>
					We are not responsible for any loss or damage that may occur while using
					our services. Use our services at your own risk.
				</p>
			</div>
			<div className="terms-section mb-4">
				<h4 className="text-primary">6. Changes to Terms</h4>
				<p>
					We reserve the right to update these terms and conditions at any time.
					Please check this page regularly for updates.
				</p>
			</div>
			<div className="terms-section mb-4">
				<h4 className="text-primary">7. Contact Us</h4>
				<p>
					If you have any questions about these terms and conditions, please contact
					us at [contact information].
				</p>
			</div>
		</Container>
	);
};
export default Terms;
