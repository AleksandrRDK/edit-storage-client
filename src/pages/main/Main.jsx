import { useEffect, useState } from 'react';

import Sidebar from '../../components/Sidebar/Sidebar';
import EditOfTheDay from '../../components/main/EditOfTheDay/EditOfTheDay';
import RandomEditsList from '../../components/main/RandomEditsList/RandomEditsList';
import { getMe } from '../../api/authApi';

import './Main.sass';

export default function Main() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        getMe()
            .then((data) => setCurrentUser(data.user))
            .catch((err) => {
                console.error('Ошибка получения пользователя:', err);
                localStorage.removeItem('token');
            });
    }, []);

    return (
        <div className="main-page">
            <Sidebar />
            <main className="main-content">
                <EditOfTheDay />
                <RandomEditsList currentUser={currentUser} />
            </main>
        </div>
    );
}
