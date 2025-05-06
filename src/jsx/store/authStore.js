import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
import { getDeviceInfo } from "../utils/deviceInfo";

export const authStore = create(
  persist(
    devtools(
      (set) => ({
        currentUser: {},
        profile: {
          tab: "About",
        },
        setActiveTab: (tab) => {
          set(
            produce((state) => {
              state.profile.tab = tab;
            })
          );
        },
        updateProfile: async (token, userData) => {
          try {
            console.log(userData);
            const { data: dataResto } = await apiRequest.put(
              "/restaurant/" + userData.restaurant._id,
              userData.restaurant,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const { data } = await apiRequest.put("/auth/profile", userData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            set(
              produce((state) => {
                state.currentUser.user = data.data;
              })
            );
          } catch (error) {
            console.error(error);
          }
        },
        updatePassword: async (token, passwordData) => {
          try {
            console.log("Sending password update request:", passwordData);
            const { data: dataPassword } = await apiRequest.put(
              "/auth/profile/password",
              passwordData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return { success: true, message: "Password updated successfully" };
          } catch (error) {
            console.error("Password update error:", error);
            console.error("Error response:", error.response?.data); // Ajout pour voir l'erreur du serveur
            return {
              success: false,
              error: error.response?.data?.message || error.message,
            };
          }
        },
        login: async (userdata) => {
          userdata.deviceId = getDeviceInfo();
          const res = await apiRequest.post("/auth/login/email", userdata);
          set(
            produce((state) => {
              if (res.data.data) state.currentUser = res.data.data;
            })
          );
        },
        verifyDevice: (userData) => {
          localStorage.setItem("token", userData.token);
          set(
            produce((state) => {
              state.currentUser = userData;
            })
          );
        },
        signup: async () => {},
        logout: () => {
          localStorage.clear();
          sessionStorage.clear();
          set({ currentUser: null });
        },
        googleLogin: async (tokenId) => {
          const deviceId = getDeviceInfo();
          console.log("📢 [authStore.js:72]", tokenId);
          const res = await apiRequest.post("/auth/login/google", {
            tokenId,
            deviceId,
          });
          console.log("📢 [authStore.js:74]", res);
          set(
            produce((state) => {
              state.currentUser = res.data.data;
            })
          );
        },
        loginFacebook: async (accessToken) => {
          const deviceId = getDeviceInfo();
          console.log("📢 [authStore.js:72]", accessToken);
          const res = await apiRequest.post("/auth/login/facebook", {
            accessToken,
            deviceId,
          });
          console.log("📢 [authStore.js:74]", res);
          set(
            produce((state) => {
              state.currentUser = res.data.data;
            })
          );
        },
        getProfile: async (token) => {
          try {
            const res = await apiRequest.get(`/auth/login/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(
              "🔍 ~ devtools() callback ~ src/jsx/store/authStore.js:101 ~ res:",
              res.data
            );
            return res.data.data;
          } catch (error) {
            console.error("Device verification check failed:", error);
            return false;
          }
        },
      }),
      {
        name: "auth-storage", // unique name for localStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentUser: state.currentUser,
          // Add other states you want to persist
        }),
      }
    )
  )
);
