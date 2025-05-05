import * as yup from "yup";
export const addIngredientSchema = yup.object().shape({
	libelle: yup
		.string()
		.required("Name is required")
		.min(3, "Name must be at least 3 characters")
		.max(50, "Name must not exceed 50 characters"),
	type: yup
		.string()
		.required("Type is required")
		.min(2, "Type must be at least 2 characters"),
	quantity: yup
		.number()
		.required("Quantity is required")
		.min(0, "Quantity cannot be negative"),
	unit: yup
		.string()
		.required("Unit is required")
		.matches(/^[a-zA-Z]+$/, "Unit must contain only letters"),
	price: yup
		.number()
		.required("Price is required")
		.min(0, "Price cannot be negative")
		.test("decimal", "Price can have max 2 decimal places", (value) =>
			value ? /^\d+(\.\d{0,2})?$/.test(value.toString()) : true
		),
	maxQty: yup
		.number()
		.required("Maximum quantity is required")
		.min(0, "Maximum quantity cannot be negative"),
	minQty: yup
		.number()
		.required("Minimum quantity is required")
		.min(0, "Minimum quantity cannot be negative")
		.test(
			"min-max",
			"Minimum quantity must be less than maximum quantity",
			function (value) {
				return value <= this.parent.maxQty;
			}
		),
	disponibility: yup.boolean().default(true),
});
