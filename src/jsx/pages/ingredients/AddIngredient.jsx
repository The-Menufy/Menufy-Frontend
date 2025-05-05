import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useIngredientStore from "../../store/ingredientStore";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addIngredientSchema } from "./validators/addIngredient";
const AddIngredient = () => {
	const navigate = useNavigate();
	const { addIngredient } = useIngredientStore();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(addIngredientSchema),
		mode: "onChange",
		defaultValues: {
			libelle: "",
			type: "",
			quantity: 0,
			unit: "",
			price: 0,
			disponibility: true,
			maxQty: 0,
			minQty: 0,
		},
	});
	const onSubmit = async (data) => {
		const success = await addIngredient(data);
		if (success) {
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "Ingredient added successfully",
			});
			navigate("/ingredients");
		} else {
			Swal.fire({
				icon: "error",
				title: "Error!",
				text: "Failed to add ingredient",
			});
		}
	};
	return (
		<Card>
			<Card.Header>
				<Card.Title>Add New Ingredient</Card.Title>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Form.Group className="mb-3">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							{...register("libelle")}
							isInvalid={!!errors.libelle}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.libelle?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Type</Form.Label>
						<Form.Control
							type="text"
							{...register("type")}
							isInvalid={!!errors.type}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.type?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Quantity</Form.Label>
						<Form.Control
							type="number"
							{...register("quantity")}
							isInvalid={!!errors.quantity}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.quantity?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Unit</Form.Label>
						<Form.Control
							type="text"
							{...register("unit")}
							isInvalid={!!errors.unit}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.unit?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Price</Form.Label>
						<Form.Control
							type="number"
							step="0.01"
							{...register("price")}
							isInvalid={!!errors.price}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.price?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Maximum Quantity</Form.Label>
						<Form.Control
							type="number"
							{...register("maxQty")}
							isInvalid={!!errors.maxQty}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.maxQty?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Minimum Quantity</Form.Label>
						<Form.Control
							type="number"
							{...register("minQty")}
							isInvalid={!!errors.minQty}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.minQty?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							label="Available"
							{...register("disponibility")}
						/>
					</Form.Group>
					<div className="d-flex gap-2">
						<Button variant="primary" type="submit">
							Add Ingredient
						</Button>
						<Button
							variant="secondary"
							type="button"
							onClick={() => navigate("/ingredients")}
						>
							Cancel
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
export default AddIngredient;
