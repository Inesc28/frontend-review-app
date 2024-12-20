import { create } from "zustand";
import axios from "axios";
import { z } from "zod";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

interface AuthStore {
  token: string | null;
  authenticated: boolean;
  isLoading: boolean;
  login: (loginData: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: null,
      authenticated: false,
      isLoading: false,
      login: async ({ username, password }) => {
        set((state) => ({
          ...state,
          isLoading: true,
        }));

        let success = true;

        try {
          const data = await axios.post(`${process.env.API_URL}/auth/login`, {
            username,
            password,
          });

          const result = z
            .object({
              token: z.string(),
            })
            .parse(data.data);

          set({
            token: result.token,
            authenticated: true,
          });
        } catch (error) {
          console.log("login error", error);

          set({
            token: null,
            authenticated: false,
          });

          success = false;
        }

        set((state) => ({
          ...state,
          isLoading: false,
        }));

        return success;
      },
      logout: () => {
        set({
          token: null,
          authenticated: false,
        });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => {
        return {
          getItem: SecureStore.getItem,
          setItem: SecureStore.setItem,
          removeItem: (name: string) => SecureStore.deleteItemAsync(name),
        } satisfies StateStorage;
      }),
    },
  ),
);
