import { getToken, removeToken, saveToken } from "@/lib/auth";
import { api } from "@/lib/axios";
import { User, UserRole } from "@food-delivery/types";
import React, { createContext, useContext, useEffect } from "react";


interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<string | void>;
    register: (data: RegisterData) => Promise<string | void>;
    logout: () => Promise<string | void>;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        checkExistingSession();
    }, []);

    async function checkExistingSession() {
        try {
            setIsLoading(true);
            const token = await getToken();
            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data);
            }
        } catch (error) {
            console.log('Check existing session error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            await saveToken(response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    async function register(data: RegisterData) {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/register', data);
            setUser(response.data.user);
            await saveToken(response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    async function logout() {
        try {
            setIsLoading(true);
            await removeToken();
            setUser(null);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}