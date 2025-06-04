import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '../api/authApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                setUser(null);
                return;
            }

            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                console.error(
                    'Ошибка при получении пользователя:',
                    err.message
                );
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
