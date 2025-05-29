import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { addEdit } from '../../api/editsApi';
import './AddEditPage.sass';

export default function AddEditPage() {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addEdit({ title, videoUrl, tags });
            setMessage({ type: 'success', text: 'Эдит успешно добавлен!' });
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    }

    function handleGoBack() {
        navigate(-1);
    }

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
                        <input
                            type="text"
                            placeholder="Название"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input
                            type="url"
                            placeholder="YouTube ссылка"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Теги (через запятую)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loading small />
                            ) : (
                                'Опубликовать эдит'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
