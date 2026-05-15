"use client"

import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
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

    async function fetchProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            console.error('Error fetching profile:', error);
        } else {
            setProfile(data);
        }
    }

    async function initialize() {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
            await fetchProfile(session.user.id);
        }
        setLoading(false);
    }
    

    useEffect(() => {
        initialize();

        const {data: { subscription },} = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }

                setLoading(false);
            }
        )

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    async function signOut() {
        await supabase.auth.signOut()
    } 

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}