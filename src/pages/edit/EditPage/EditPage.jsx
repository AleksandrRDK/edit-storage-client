import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { fetchEditById } from '../../../api/editsApi';
import {
    removeFavorite,
    addFavorite,
    checkIsFavorite,
} from '../../../api/favoritesApi';
import Loading from '../../../components/Loading/Loading';
import CommentSection from '../../../components/CommentSection/CommentSection';
import { getYouTubeEmbedUrl } from '../../../utils/youtubeUtils';
import { getCloudinaryVideoUrl } from '../../../utils/cloudinaryUtils';
import { useUser } from '../../../context/UserContext';
import './EditPage.sass';

export default function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(null);
    const [loadingFav, setLoadingFav] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const videoRef = useRef(null);
    const { user } = useUser();

    const token = localStorage.getItem('token');

    // Форматируем дату в удобный вид
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    useEffect(() => {
        setLoading(true);
        setError(null);

        async function loadEditAndCheckFavorite() {
            try {
                const data = await fetchEditById(id);
                setEdit(data);
                setLoading(false);

                if (token) {
                    const favStatus = await checkIsFavorite(data._id, token);
                    setIsFavorite(favStatus);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        loadEditAndCheckFavorite();
    }, [id, token]);

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

    return (
        <>
            {loading && <Loading />}
            <main className="edit-detail-page">
                <Sidebar />
                <div className="edit-detail-content">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        ← Назад
                    </button>
                    {error && <p className="error">{error}</p>}
                    {edit && (
                        <article className="edit-card">
                            <h1 className="edit-title">{edit.title}</h1>
                            <div className="wrapper">
                                <p className="edit-author">
                                    Автор: <b>{edit.author || 'аноним'}</b>
                                </p>
                                <button
                                    className="loop-button"
                                    onClick={() => setIsLooping(!isLooping)}
                                >
                                    {isLooping
                                        ? '🔁 Повтор включён'
                                        : '⏹ Повтор выключен'}
                                </button>
                            </div>
                            <div className="video-wrapper">
                                {edit.source === 'cloudinary' ? (
                                    <video
                                        ref={videoRef}
                                        controls
                                        poster={getCloudinaryVideoUrl(
                                            edit.video
                                        )}
                                        onEnded={() => {
                                            if (isLooping && videoRef.current) {
                                                videoRef.current.currentTime = 0;
                                                videoRef.current.play();
                                            }
                                        }}
                                    >
                                        <source
                                            src={getCloudinaryVideoUrl(
                                                edit.video
                                            )}
                                            type="video/mp4"
                                        />
                                        Ваш браузер не поддерживает видео.
                                    </video>
                                ) : (
                                    <iframe
                                        src={getYouTubeEmbedUrl(edit.video)}
                                        allowFullScreen
                                        title={`Видео к эдиту: ${edit.title}`}
                                    />
                                )}
                            </div>
                            <p className="edit-tags">
                                Теги:{' '}
                                {edit.tags && edit.tags.length > 0
                                    ? edit.tags.map((tag, i) => (
                                          <span key={i} className="tag">
                                              #{tag}
                                          </span>
                                      ))
                                    : '— нет тегов —'}
                            </p>
                            <div className="edit-rating">
                                <span className="rating-number">
                                    {edit.rating} / 11
                                </span>
                                <div className="rating-bar-wrapper">
                                    <div
                                        className="rating-bar"
                                        style={{
                                            width: `${
                                                (edit.rating / 11) * 100
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                className="fav-button"
                                onClick={toggleFavorite}
                                disabled={loadingFav}
                            >
                                {isFavorite
                                    ? '❤️ В избранном'
                                    : '♡ В избранное'}
                            </button>
                            <CommentSection editId={edit._id} user={user} />
                            <p className="edit-meta">
                                Создан:{' '}
                                <time dateTime={edit.createdAt}>
                                    {formatDate(edit.createdAt)}
                                </time>
                            </p>
                            <p className="edit-meta">
                                Обновлён:{' '}
                                <time dateTime={edit.updatedAt}>
                                    {formatDate(edit.updatedAt)}
                                </time>
                            </p>
                            <p className="edit-meta">
                                ID эдита: <code>{edit._id}</code>
                            </p>
                        </article>
                    )}
                </div>
            </main>
        </>
    );
}
