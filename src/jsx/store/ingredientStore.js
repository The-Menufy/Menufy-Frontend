import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL + "/ingredient";
const useIngredientStore = create(
	devtools((set, get) => ({
		ingredients: [],
		filteredIngredients: [],
		filterCriteria: {
			search: "",
			type: "",
			availability: "all",
			minPrice: "",
			maxPrice: "",
		},
		setFilterCriteria: (criteria) => {
			set((state) => ({
				filterCriteria: { ...state.filterCriteria, ...criteria },
			}));
			get().applyFilters();
		},
		resetFilters: () => {
			set((state) => ({
				filterCriteria: {
					search: "",
					type: "",
					availability: "all",
					minPrice: "",
					maxPrice: "",
				},
				filteredIngredients: state.ingredients,
			}));
		},
		applyFilters: () => {
			const { ingredients, filterCriteria } = get();
			let filtered = [...ingredients];
			// Search filter (name and type)
			if (filterCriteria.search) {
				const searchLower = filterCriteria.search.toLowerCase();
				filtered = filtered.filter(
					(ing) =>
						ing.libelle.toLowerCase().includes(searchLower) ||
						ing.type.toLowerCase().includes(searchLower)
				);
			}
			// Type filter
			if (filterCriteria.type) {
				filtered = filtered.filter(
					(ing) => ing.type.toLowerCase() === filterCriteria.type.toLowerCase()
				);
			}
			// Availability filter
			if (filterCriteria.availability !== "all") {
				const isAvailable = filterCriteria.availability === "available";
				filtered = filtered.filter((ing) => ing.disponibility === isAvailable);
			}
			// Price range filter
			if (filterCriteria.minPrice !== "") {
				filtered = filtered.filter(
					(ing) => ing.price >= Number(filterCriteria.minPrice)
				);
			}
			if (filterCriteria.maxPrice !== "") {
				filtered = filtered.filter(
					(ing) => ing.price <= Number(filterCriteria.maxPrice)
				);
			}
			set({ filteredIngredients: filtered });
		},
		// Modify fetchIngredients to initialize filteredIngredients
		fetchIngredients: async () => {
			try {
				const { data } = await axios.get(API_URL);
				set({
					ingredients: data.data,
					filteredIngredients: data.data,
				});
			} catch (error) {
				console.error("Error fetching ingredients:", error.message);
			}
		},
		getIngredientById: async (id) => {
			try {
				const { data } = await axios.get(`${API_URL}/${id}`);
				return data.data;
			} catch (error) {
				console.error("Error fetching ingredient:", error.message);
				return null;
			}
		},
		addIngredient: async (ingredientData) => {
			try {
				const { data } = await axios.post(API_URL, ingredientData);
				set((state) => {
					const newIngredients = [...state.ingredients, data.data];
					return {
						ingredients: newIngredients,
						filteredIngredients: newIngredients,
					};
				});
				get().applyFilters(); // Reapply filters after adding
				return true;
			} catch (error) {
				console.error("Error adding ingredient:", error.message);
				return false;
			}
		},
		updateIngredient: async (id, ingredientData) => {
			try {
				// Ensure numeric values before sending to API
				const dataToSend = {
					...ingredientData,
					quantity: parseInt(ingredientData.quantity),
					price: parseFloat(ingredientData.price),
					maxQty: parseInt(ingredientData.maxQty),
					minQty: parseInt(ingredientData.minQty)
				};
				
				const { data } = await axios.put(`${API_URL}/${id}`, dataToSend);
				
				set((state) => {
					const updatedIngredients = state.ingredients.map((ingredient) =>
						ingredient._id === id ? data.data : ingredient
					);
					return {
						ingredients: updatedIngredients,
						filteredIngredients: updatedIngredients,
					};
				});
				get().applyFilters();
				return true;
			} catch (error) {
				console.error("Error updating ingredient:", error.message);
				return false;
			}
		},
		deleteIngredient: async (id) => {
			try {
				await axios.delete(`${API_URL}/${id}`);
				set((state) => {
					const remainingIngredients = state.ingredients.filter(
						(ingredient) => ingredient._id !== id
					);
					return {
						ingredients: remainingIngredients,
						filteredIngredients: remainingIngredients,
					};
				});
				get().applyFilters(); // Reapply filters after deleting
				return true;
			} catch (error) {
				console.error("Error deleting ingredient:", error.message);
				return false;
			}
		},
		increaseQuantity: async (id, amount) => {
			try {
				const { data } = await axios.patch(`${API_URL}/${id}/increase`, { amount });
				set((state) => ({
					ingredients: state.ingredients.map((ingredient) =>
						ingredient._id === id ? data.data : ingredient
					),
				}));
				return true;
			} catch (error) {
				console.error("Error increasing quantity:", error.message);
				return false;
			}
		},
		decreaseQuantity: async (id, amount) => {
			try {
				const { data } = await axios.patch(`${API_URL}/${id}/decrease`, { amount });
				set((state) => ({
					ingredients: state.ingredients.map((ingredient) =>
						ingredient._id === id ? data.data : ingredient
					),
				}));
				return true;
			} catch (error) {
				console.error("Error decreasing quantity:", error.message);
				return false;
			}
		},
	}))
);
export default useIngredientStore;
