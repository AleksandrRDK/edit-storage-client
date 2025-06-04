import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import LoginForm from '../../components/profile/LoginForm/LoginForm';
import UserInfo from '../../components/profile/UserInfo/UserInfo';
import FavoritesSection from '../../components/profile/FavoritesSection/FavoritesSection';
import ChangePasswordModal from '../../components/profile/UserInfo/ChangePasswordModal/ChangePasswordModal';
import Loading from '../../components/Loading/Loading';
import { changePassword } from '../../api/authApi';
import { useUser } from '../../context/UserContext';

import './Profile.sass';

export default function Profile() {
    const [favorites, setFavorites] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();

    const { user, setUser, loading } = useUser();

    useEffect(() => {
        if (!user || !user.favorites?.length) {
            setFavorites([]);
            return;
        }

        setFavoritesLoading(true);

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
                setFavoritesLoading(false);
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

    if (loading || favoritesLoading) {
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
