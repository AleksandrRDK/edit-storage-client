import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkIsFavorite } from '../../api/favoritesApi';
import './EditModal.sass';

export default function EditModal({
    edit,
    currentUser,
    onClose,
    onToggleFavorite,
}) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(true);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (!currentUser) {
                setLoadingFavorite(false);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const isFav = await checkIsFavorite(edit._id, token);
                setIsFavorite(isFav);
            } catch (err) {
                console.error('Ошибка при проверке избранного:', err);
            } finally {
                setLoadingFavorite(false);
            }
        };

        fetchFavoriteStatus();
    }, [edit._id, currentUser]);

    const handleFavoriteClick = () => {
        if (!currentUser) {
            alert('Авторизуйтесь, чтобы добавлять в избранное');
            return;
        }
        const newState = !isFavorite;
        setIsFavorite(newState);
        onToggleFavorite(edit._id, newState);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    return (
        <div className="edit-modal-backdrop" onClick={onClose}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    ×
                </button>

                <h3 className="edit-title">{edit.title}</h3>
                <p className="edit-author">Автор: {edit.author}</p>

                <div className="edit-video-wrapper">
                    <iframe
                        width="100%"
                        height="250"
                        src={`https://www.youtube.com/embed/${edit.video}`}
                        title={edit.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                <p className="edit-date">
                    Создан: {formatDate(edit.createdAt)}
                </p>

                <div className="edit-tags">
                    {edit.tags.map((tag, i) => (
                        <span key={i} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>

                <button
                    className={`favorite-btn ${
                        !currentUser
                            ? 'disabled'
                            : isFavorite
                            ? 'favorited'
                            : ''
                    }`}
                    onClick={handleFavoriteClick}
                    disabled={!currentUser || loadingFavorite}
                >
                    {!currentUser
                        ? 'Войдите, чтобы добавить'
                        : isFavorite
                        ? 'Убрать из избранного'
                        : 'Добавить в избранное'}
                </button>

                <Link to={`/edit/${edit._id}`} className="details-btn">
                    Перейти на страницу эдита
                </Link>
            </div>
        </div>
    );
}
