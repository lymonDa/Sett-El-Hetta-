import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface CustomerAuthState {
  session: Session | null;
  user: User | null;
  customer: CustomerInfo | null;
  isLoading: boolean;
  isInitialized: boolean;
  authError: string | null;
  signUp: (name: string, phone: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => () => void;
  clearError: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      customer: null,
      isLoading: false,
      isInitialized: false,
      authError: null,

      initialize: () => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session?.user) {
              set({ session, user: session.user, isInitialized: true });
              supabase
                .from('customers')
                .select('id, name, phone, email')
                .eq('user_id', session.user.id)
                .maybeSingle()
                .then(({ data }) => {
                  if (data) {
                    set({ customer: data as CustomerInfo });
                  }
                });
            } else {
              set({ session: null, user: null, customer: null, isInitialized: true });
            }
          }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            set({ session, user: session.user, isInitialized: true });
            supabase
              .from('customers')
              .select('id, name, phone, email')
              .eq('user_id', session.user.id)
              .maybeSingle()
              .then(({ data }) => {
                if (data) {
                  set({ customer: data as CustomerInfo });
                }
              });
          } else {
            set({ isInitialized: true });
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      },

      signUp: async (name: string, phone: string, email: string, password: string) => {
        set({ isLoading: true, authError: null });

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone },
          },
        });

        if (authError || !authData.user) {
          set({
            isLoading: false,
            authError: authError?.message || 'An error occurred while creating the account',
          });
          return false;
        }

        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            name,
            phone,
            email,
            user_id: authData.user.id,
          });

        if (customerError) {
          set({
            isLoading: false,
            authError: 'Account created but an error occurred while saving your data. Please contact us.',
          });
          return false;
        }

        if (authData.session) {
          set({
            session: authData.session,
            user: authData.user,
            customer: { id: '', name, phone, email },
            isLoading: false,
            authError: null,
          });
        } else {
          set({ isLoading: false, authError: null });
        }

        return true;
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, authError: null });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          set({
            isLoading: false,
            authError: error?.message || 'Invalid email or password',
          });
          return false;
        }

        const { data: customerData } = await supabase
          .from('customers')
          .select('id, name, phone, email')
          .eq('user_id', data.user.id)
          .maybeSingle();

        set({
          session: data.session,
          user: data.user,
          customer: customerData as CustomerInfo | null,
          isLoading: false,
          authError: null,
        });

        return true;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, customer: null });
      },

      clearError: () => set({ authError: null }),
    }),
    {
      name: 'sett-el-hetta-customer-auth',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        customer: state.customer,
      }),
    }
  )
);