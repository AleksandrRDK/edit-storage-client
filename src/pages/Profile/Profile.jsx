import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import LoginForm from '../../components/profile/LoginForm/LoginForm';
import UserInfo from '../../components/profile/UserInfo/UserInfo';
import FavoritesSection from '../../components/profile/FavoritesSection/FavoritesSection';
import ChangePasswordModal from '../../components/profile/UserInfo/ChangePasswordModal/ChangePasswordModal';
import Loading from '../../components/Loading/Loading';
import { changePassword, getMe } from '../../api/authApi';

import './Profile.sass';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        getMe()
            .then((data) => {
                setUser(data.user);
            })
            .catch((err) => {
                console.error('Ошибка при получении пользователя:', err);
                if (err.message === 'Не удалось получить пользователя') {
                    localStorage.removeItem('token');
                }
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!user || !user.favorites?.length) {
            setFavorites([]);
            return;
        }

        setLoading(true);

        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(
                    // 'http://localhost:5000/api/users/favorites',
                    'https://edit-storage-server-production.up.railway.app/api/users/favorites',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error('Не удалось загрузить избранные эдиты');
                }

                const data = await res.json();
                setFavorites(data.edits);
            } catch (err) {
                console.error(err.message);
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    function handleChangePassword() {
        setShowChangeModal(true);
    }

    function handlePasswordChange({ oldPassword, newPassword }) {
        changePassword(oldPassword, newPassword)
            .then(() => {
                setSuccessMsg('Пароль успешно изменён');
                setError(null);
                setShowChangeModal(false);
            })
            .catch((err) => {
                setError(err.message || 'Ошибка при смене пароля');
                setSuccessMsg(null);
            });
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setUser(null);
        setFavorites([]);
        setError(null);
        setSuccessMsg(null);
        setShowChangeModal(false);
        navigate('/profile');
    }

    if (loading) {
        return (
            <main className="profile-page">
                <Sidebar />
                <div className="profile-page-wrapper">
                    <Loading />
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <Sidebar />
            <div className="profile-page-wrapper">
                {!user ? (
                    <LoginForm onLogin={setUser} />
                ) : (
                    <>
                        {error && <div className="message error">{error}</div>}
                        {successMsg && (
                            <div className="message success">{successMsg}</div>
                        )}

                        <div className="profile-header">
                            <UserInfo
                                user={user}
                                onChangePassword={handleChangePassword}
                                onLogout={handleLogout}
                            />
                        </div>

                        {showChangeModal && (
                            <ChangePasswordModal
                                onClose={() => setShowChangeModal(false)}
                                onSubmit={handlePasswordChange}
                            />
                        )}

                        <hr className="section-divider" />
                        <FavoritesSection
                            favorites={favorites}
                            currentUser={user}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
