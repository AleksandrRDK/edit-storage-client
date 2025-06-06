import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addEdit } from '../../api/editsApi';

import Loading from '../../components/Loading/Loading';
import Sidebar from '../../components/Sidebar/Sidebar';
import RatingSelector from '../../components/RatingSelector/RatingSelector';

import { useUser } from '../../context/UserContext';

import './AddEditPage.sass';

export default function AddEditPage() {
    const { user, loading } = useUser();
    const [source, setSource] = useState('youtube');
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || title.length < 3) {
            setMessage({
                type: 'error',
                text: 'Введите корректное название (минимум 3 символа)',
            });
            return;
        }

        if (!rating || rating < 1 || rating > 11) {
            setMessage({ type: 'error', text: 'Поставьте оценку видео' });
            return;
        }

        if (tags.trim()) {
            const tagArray = tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            if (tagArray.length > 10) {
                setMessage({
                    type: 'error',
                    text: 'Можно указать максимум 10 тегов',
                });
                return;
            }

            const invalidTag = tagArray.find((tag) => tag.length > 20);
            if (invalidTag) {
                setMessage({
                    type: 'error',
                    text: `Тег "${invalidTag}" слишком длинный (макс. 20 символов)`,
                });
                return;
            }
        }

        if (source === 'youtube') {
            const isYoutubeLink =
                /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(videoUrl);
            if (!videoUrl || !isYoutubeLink) {
                setMessage({
                    type: 'error',
                    text: 'Введите корректную ссылку на YouTube',
                });
                return;
            }
        } else if (source === 'cloudinary') {
            if (!videoFile) {
                setMessage({ type: 'error', text: 'Загрузите видеофайл' });
                return;
            }

            if (!videoFile.type.startsWith('video/')) {
                setMessage({ type: 'error', text: 'Файл должен быть видео' });
                return;
            }

            const maxSize = 100 * 1024 * 1024; // 100MB
            if (videoFile.size > maxSize) {
                setMessage({
                    type: 'error',
                    text: 'Файл слишком большой (макс. 100MB)',
                });
                return;
            }
        }

        setIsLoading(true);

        try {
            await addEdit({
                title,
                videoUrl,
                videoFile,
                tags,
                source,
                rating,
            });

            setMessage({ type: 'success', text: 'Эдит успешно добавлен!' });

            setTitle('');
            setVideoUrl('');
            setTags('');
            setSource('youtube');
            setVideoFile(null);
            setRating(0);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    }

    function handleGoBack() {
        navigate(-1);
    }

    if (loading) {
        return <Loading />;
    }

    // Если пользователь не залогинен — можно показать форму логина или редирект
    if (!user) {
        return (
            <main className="add-edit-page-wrapper">
                <Sidebar />
                <div className="add-edit-form-shield">
                    <div className="void__field"></div>
                    <div className="add-edit-form">
                        <p>
                            Пожалуйста, войдите в систему, чтобы добавить эдит.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const isAdmin = user.role === 'admin';

    return (
        <main className="add-edit-page-wrapper">
            <Sidebar />
            <div className="add-edit-form-shield">
                <div className="add-edit-form">
                    <button className="back-button" onClick={handleGoBack}>
                        ← Назад
                    </button>
                    <h2>Добавить эдит</h2>

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                        >
                            <option value="youtube">YouTube</option>
                            <option value="cloudinary">Cloudinary</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Название"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        {source === 'youtube' ? (
                            <input
                                type="url"
                                placeholder="Ссылка на YouTube"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                required
                            />
                        ) : (
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setVideoFile(e.target.files[0])
                                }
                                required
                            />
                        )}

                        <div className="tag-hint">
                            ❗ Пишите теги с умом, например:{' '}
                            <b>аниме, наруто, экшен</b>
                        </div>

                        <input
                            type="text"
                            placeholder="Теги (через запятую)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />

                        <label>Оценка видео</label>
                        <RatingSelector
                            value={rating}
                            onChange={setRating}
                            isAdmin={isAdmin}
                        />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Loading /> : 'Опубликовать эдит'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
