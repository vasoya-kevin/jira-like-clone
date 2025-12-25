import { createContext, useContext, useEffect, useState } from "react";
import { ApiInstance } from '@/api/api';
import * as React from 'react';

interface User {
    id: string,
    email: string,
    role: 'user' | 'admin'
}

interface authInferace {
    user: User | null,
    loading: boolean,
    login: (email: string, password: string) => void
    logout: () => void;
}

export const AuthContext = createContext<authInferace>({} as authInferace)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const response = await ApiInstance.get('/users/profile');
            setUser(response.data);
        } catch (error) {
            console.log('error: ', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await ApiInstance.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            await loadUser();
            return res.data;
        } catch (err: any) {
            throw err.response?.data?.message || "Login failed";
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
