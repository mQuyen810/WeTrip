"use client";

import { Session, User } from "@supabase/supabase-js";
import createClient from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Profile } from "@/types";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    signOut: async () => { }
})
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data, error } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

      if (error) {
        console.error(
          "Error fetching profile:",
          error
        );
        
        setProfile(null);
        return;
      }
      setProfile(data);
    },[supabase]
  );

  const initialize = useCallback(
    async () => {
      try {
        setLoading(true);

        const { data: { session },} = await supabase.auth.getSession();

        setSession(session);

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [supabase, fetchProfile]
  );

  useEffect(() => {
    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (!currentUser) {
          setProfile(null);

          setLoading(false);

          return;
        }

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          await fetchProfile(currentUser.id);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, fetchProfile, supabase]);

  async function signOut() {
    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setProfile(null);
  }

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}