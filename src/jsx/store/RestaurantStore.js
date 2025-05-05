import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/restaurant";

const useRestaurantStore = create((set) => ({
  restaurants: [],

  fetchRestaurants: async () => {
    try {
      const { data } = await axios.get(API_URL);
      set({ restaurants: data.data }); // Supposant que la réponse est { success: true, data: [...] }
    } catch (error) {
      console.error("Erreur fetchRestaurants:", error.message);
    }
  },

  addRestaurant: async (restaurantData) => {
    try {
      const { data } = await axios.post(API_URL, restaurantData);
      set((state) => ({
        restaurants: [...state.restaurants, data.data],
      }));
      return true;
    } catch (error) {
      console.error("Erreur addRestaurant:", error.message);
      return false;
    }
  },

  updateRestaurant: async (id, restaurantData) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, restaurantData);
      set((state) => ({
        restaurants: state.restaurants.map((restaurant) =>
          restaurant._id === id ? data.data : restaurant
        ),
      }));
      return true;
    } catch (error) {
      console.error("Erreur updateRestaurant:", error.message);
      return false;
    }
  },

  deleteRestaurant: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        restaurants: state.restaurants.filter((restaurant) => restaurant._id !== id),
      }));
      return true;
    } catch (error) {
      console.error("Erreur deleteRestaurant:", error.message);
      return false;
    }
  },
}));

export default useRestaurantStore;