import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import LoginForm from '../../components/profile/LoginForm/LoginForm';
import UserInfo from '../../components/profile/UserInfo/UserInfo';
import FavoritesSection from '../../components/profile/FavoritesSection/FavoritesSection';
import ChangePasswordModal from '../../components/profile/UserInfo/ChangePasswordModal/ChangePasswordModal';
import Loading from '../../components/Loading/Loading';
import { changePassword } from '../../api/authApi';
import { getFavorites } from '../../api/favoritesApi';
import { useUser } from '../../context/UserContext';

import './Profile.sass';

export default function Profile() {
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [favoritesLoading, setFavoritesLoading] = useState(false);
    const [total, setTotal] = useState(null);
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
                const data = await getFavorites(token, 1);
                setFavorites(data.edits);
                setHasMore(data.hasMore);
                setTotal(data.total);
                setPage(1);
            } catch (err) {
                console.error(err.message);
                setFavorites([]);
                setHasMore(false);
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
                            total={total}
                            favorites={favorites}
                            currentUser={user}
                            onLoadMore={() => {
                                const token = localStorage.getItem('token');
                                getFavorites(token, page + 1)
                                    .then((data) => {
                                        setFavorites((prev) => [
                                            ...prev,
                                            ...data.edits,
                                        ]);
                                        setPage((prev) => prev + 1);
                                        setHasMore(data.hasMore);
                                    })
                                    .catch((err) => {
                                        console.error(
                                            'Ошибка при загрузке избранных эдитов:',
                                            err.message
                                        );
                                        setHasMore(false);
                                    });
                            }}
                            hasMore={hasMore}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
