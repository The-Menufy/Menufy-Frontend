import { create } from "zustand";

const useAuthStore = create((set) => ({
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
  goSteps: 0,
  isAuthenticated: !!localStorage.getItem("token"), 

  setEmail: (email) => set({ email }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setGoSteps: (goSteps) => set({ goSteps }),

  setAuthenticated: (token) => {
    localStorage.setItem("token", token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
