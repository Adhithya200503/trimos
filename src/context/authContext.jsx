import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

import { createContext } from "react";



export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-user`);
                setUser(res.data.userData);
            } catch (err) {
                console.error("Auth fetch failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
        }
    };
    return (
        <AuthContext.Provider value={{ setUser, user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
