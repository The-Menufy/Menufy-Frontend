import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
export const signupStore = create(
	devtools((set) => ({
		currentUser: {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "Test@123",
			phone: 5141234567,
			address: "123 Main St, Montreal, QC",
			birthday: "1990-01-15",
		},
		step: 1,
		setCurrentUser: (user) =>
			set(
				produce((state) => {
					state.currentUser = { ...state.currentUser, ...user };
				})
			),
		setStep: (step) => set({ step }),
		signup: async (data) => {
			const res = await apiRequest.post("/auth/signup", data);
			if (res.status === 201) {
				console.log("🚀 [signupStore.js:25]", res.data);
			}
		},
	}))
);
