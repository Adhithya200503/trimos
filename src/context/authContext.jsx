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
            let themeMode = localStorage.getItem("theme");
            if(!themeMode){
                localStorage.setItem("theme","LightMode");
                themeMode = "LightMode";
            }
            setTheme(themeMode);
            
            // Apply theme to HTML tag for DaisyUI and Tailwind
            const isDark = themeMode === "DarkMode";
            document.documentElement.setAttribute('data-theme', isDark ? "dark" : "light");
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
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
        const newTheme = theme === "LightMode" ? "DarkMode" : "LightMode";
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
        
        // Apply theme to HTML tag for DaisyUI and Tailwind
        const isDark = newTheme === "DarkMode";
        document.documentElement.setAttribute('data-theme', isDark ? "dark" : "light");
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }
    return (
        <AuthContext.Provider value={{ setUser, user, loading, logout , toggleTheme , theme}}>
            {children}
        </AuthContext.Provider>
    )
}
