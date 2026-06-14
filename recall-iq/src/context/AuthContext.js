"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    // const token = localStorage.getItem("token");
    useEffect(() => {
        // ensure code runs only in browser
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        console.log("token check for auth in use effect", token);

        if (token) {
            fetchUser();
        } else {
            
        }
    }, []);
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        console.log("token for auth.me", token);

        if (!token) {
            console.log("not token set loading false ");
            setInitialized(true);

            setLoading(false);
            return;
        }

        try {
            
            const res = await api.get("/auth/me");
            const data = res.data;
            console.log(" print data for auth/me", data);
            setUser(data?.user);
            
            // router.push("/Dashboard");
        } catch (err) {
            console.log("Error in auth/me", err);
            setUser(null);
        }
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, setUser, fetchUser,initialized }}>
            {children}
        </AuthContext.Provider>
    );
};
