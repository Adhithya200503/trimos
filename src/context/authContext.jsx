import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

import { createContext } from "react";



export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme , setTheme] = useState("LightMode");

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

        const getTheme = ()=>{
            const themeMode = localStorage.getItem("theme");
            if(!theme){
                localStorage.setItem("theme","LightMode");
            }
            setTheme(themeMode);
        }

        getTheme();
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

    const toggleTheme = ()=>{
        localStorage.setItem("theme",theme=="LightMode"?"DarkMode":"LightMode")
        setTheme(theme=="LightMode"?"DarkMode":"LightMode");
        
    }
    return (
        <AuthContext.Provider value={{ setUser, user, loading, logout , toggleTheme , theme}}>
            {children}
        </AuthContext.Provider>
    )
}
