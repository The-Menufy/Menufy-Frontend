import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/superadmins";

const useAdminStore = create((set) => ({
  admins: [],

  fetchAdmins: async () => {
    try {
      const { data } = await axios.get(API_URL);
      set({ admins: data.data.filter((admin) => !admin.archived) });
    } catch (error) {
      console.error("Erreur fetchAdmins:", error.message);
    }
  },
  fetchAdminsArchived: async () => {
    try {
      const { data } = await axios.get(API_URL);
      set({ admins: data.data.filter((admin) => admin.archived) });
    } catch (error) {
      console.error("Erreur fetchAdmins:", error.message);
    }
  },
  addAdmin: async (adminData) => {
    try {
      const { data } = await axios.post(API_URL, adminData);
      set((state) => ({
        admins: [...state.admins, data.data],
      }));
      return true;
    } catch (error) {
      console.error("Erreur addAdmin:", error.message);
      return false;
    }
  },
  updateAdmin: async (id, adminData) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, adminData);
      set((state) => ({
        admins: state.admins.map((admin) => (admin._id === id ? data.data : admin)),
      }));
      return true;
    } catch (error) {
      console.error("Erreur updateAdmin:", error.message);
      return false;
    }
  },
  archiveAdmin: async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/archive`);
      set((state) => ({
        admins: state.admins.filter((admin) => admin._id !== id), // 🔥 Supprimer directement l'admin de la liste
      }));
      return true;
    } catch (error) {
      console.error("Erreur archiveAdmin:", error.message);
      return false;
    }
  },
  
  deleteAdmin: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/delete`); // Updated endpoint
      set((state) => ({
        admins: state.admins.filter((admin) => admin._id !== id),
      }));
      return true;
    } catch (error) {
      console.error("Erreur deleteAdmin:", error.response?.data || error.message);
      return false;
    }
  },
  toggleBlock: async (id, currentBlocked) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, { blocked: !currentBlocked });
      set((state) => ({
        admins: state.admins.map((admin) => (admin._id === id ? data : admin)),
      }));
      return true;
    } catch (error) {
      console.error("Erreur toggleBlock:", error.message);
      return false;
    }
  },
}));

export default useAdminStore;