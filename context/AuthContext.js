import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NEXT_URL } from '@/config/index';
import { defaultConfig } from 'next/dist/server/config-shared';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    //Register user
    const register = async (user) => {
        //fetch frontend api page (api/account/register) <- this route will act as a bridge for security
        const res = await fetch(`${NEXT_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await res.json();

        if (res.ok) {
            setUser(data.user);

            router.push(`/account/dashboard`); //redirect user to dashboard once loggedIn
        } else {
            toast.error(data.message, {
                type: 'error',
                theme: 'colored',
            });
        }
    };

    //Login user
    const login = async ({ email: identifier, password }) => {
        //fetch frontend api page (api/account/login) <- this route will act as a bridge for security
        const res = await fetch(`${NEXT_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier,
                password,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setUser(data.user);

            router.push(`/account/dashboard`); //redirect user to dashboard once loggedIn
        } else {
            toast.error(data.message, {
                type: 'error',
                theme: 'colored',
            });
        }
    };

    //Logout user
    //fetch from frontend site /api/account/logout
    const logout = async () => {
        const res = await fetch(`${NEXT_URL}/api/logout`, {
            method: 'POST',
        });

        if (res.ok) {
            //remove user obj if logout req is successful
            setUser(null);
            //redirect to homepage
            router.push('/');
        }
    };

    //Check if user in logged in
    //this will hit the /api/account/user route on the frontend side
    const checkUserLoggedIn = async (user) => {
        const res = await fetch(`${NEXT_URL}/api/user`);
        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
        } else {
            setUser(null);
        }
    };

    return <AuthContext.Provider value={{ user, error, register, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
