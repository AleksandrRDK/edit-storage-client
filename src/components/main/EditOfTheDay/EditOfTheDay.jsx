import { useEffect, useState } from 'react';
import { fetchEditOfTheDay } from '../../../api/editOfTheDay';
import {
    addFavorite,
    removeFavorite,
    checkIsFavorite,
} from '../../../api/favoritesApi';
import {
    getCloudinaryVideoUrl,
    getCloudinaryThumbnailUrl,
} from '../../../utils/cloudinaryUtils';
import { getYouTubeEmbedUrl } from '../../../utils/youtubeUtils';
import Loading from '../../Loading/Loading';
import CommentSection from '../../CommentSection/CommentSection';
import './EditOfTheDay.sass';

export default function EditOfTheDay({ currentUser }) {
    const [edit, setEdit] = useState(null);
    const [isFavorite, setIsFavorite] = useState(null);
    const [loadingFav, setLoadingFav] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        async function loadData() {
            try {
                const edit = await fetchEditOfTheDay();
                setEdit(edit);

                if (token) {
                    const favStatus = await checkIsFavorite(edit._id, token);
                    setIsFavorite(favStatus);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();
    }, [token]);

    const toggleFavorite = async () => {
        if (!token) {
            setError('Пожалуйста, войдите, чтобы использовать избранное.');
            return;
        }
        setLoadingFav(true);
        setError(null);
        try {
            if (isFavorite) {
                await removeFavorite(edit._id, token);
                setIsFavorite(false);
            } else {
                await addFavorite(edit._id, token);
                setIsFavorite(true);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoadingFav(false);
        }
    };

    if (!edit) return <Loading />;

    return (
        <div className="edit-of-the-day">
            <h2>Рандомный эдит дня</h2>
            <div className="content-row">
                <div className="edit-info">
                    <div className="tags">
                        {edit.tags.map((tag, i) => (
                            <span key={i}>#{tag}</span>
                        ))}
                    </div>

                    <div className="rating-display">
                        <span className="rating-number">
                            {edit.rating} / 10
                        </span>
                        <div className="rating-bar-wrapper">
                            <div
                                className="rating-bar"
                                style={{
                                    width: `${(edit.rating / 11) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                    {isFavorite !== null && (
                        <button
                            className="fav-button"
                            onClick={toggleFavorite}
                            disabled={loadingFav}
                        >
                            {isFavorite ? '❤️ В избранном' : '♡ В избранное'}
                        </button>
                    )}
                    <div className="meta">
                        <span className="author">Автор: @{edit.author}</span>
                        <span className="date">
                            Добавлено: {edit.createdAt}
                        </span>
                        <CommentSection editId={edit._id} user={currentUser} />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="video-container">
                    {edit.source === 'youtube' ? (
                        <iframe
                            src={getYouTubeEmbedUrl(edit.video)}
                            title="Edit of the Day"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            controls
                            poster={getCloudinaryThumbnailUrl(edit.video)}
                        >
                            <source
                                src={getCloudinaryVideoUrl(edit.video)}
                                type="video/mp4"
                            />
                            Ваш браузер не поддерживает видео.
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
}
