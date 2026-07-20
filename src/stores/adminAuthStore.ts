import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, AdminRole } from '@/types';
import { adminLogin as supabaseAdminLogin } from '@/lib/api';

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<AdminUser | null>;
  logout: () => void;
  canManageUsers: () => boolean;
  canManageProducts: () => boolean;
  canManageOrders: () => boolean;
  canConfirmPayments: () => boolean;
  canUpdateShipping: () => boolean;
  canViewProofImages: () => boolean;
}

function checkRole(
  role: AdminRole | undefined,
  allowed: AdminRole[]
): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      loginError: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, loginError: null });

        try {
          const dbAdmin = await supabaseAdminLogin(email, password);

          if (!dbAdmin) {
            set({ isLoading: false, loginError: 'Invalid email or password' });
            return null;
          }

          const admin: AdminUser = {
            id: dbAdmin.id,
            name: dbAdmin.name,
            email: dbAdmin.email,
            role: dbAdmin.role as AdminRole,
            active: dbAdmin.active,
          };

          set({ admin, isAuthenticated: true, isLoading: false, loginError: null });
          return admin;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An error occurred while logging in';
          set({ isLoading: false, loginError: message });
          return null;
        }
      },

      logout: () => {
        set({ admin: null, isAuthenticated: false, loginError: null });
      },

      canManageUsers: () => {
        return checkRole(get().admin?.role, ['OWNER']);
      },

      canManageProducts: () => {
        return checkRole(get().admin?.role, ['OWNER', 'STAFF']);
      },

      canManageOrders: () => {
        return checkRole(get().admin?.role, ['OWNER', 'STAFF', 'DELIVERY_COORDINATOR']);
      },

      canConfirmPayments: () => {
        return checkRole(get().admin?.role, ['OWNER', 'STAFF']);
      },

      canUpdateShipping: () => {
        return checkRole(get().admin?.role, ['OWNER', 'STAFF', 'DELIVERY_COORDINATOR']);
      },

      canViewProofImages: () => {
        return checkRole(get().admin?.role, ['OWNER', 'STAFF']);
      },
    }),
    {
      name: 'sett-el-hetta-admin-auth',
    }
  )
);