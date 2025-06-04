import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEditById, updateEdit, deleteEdit } from '../../../api/editsApi';
import RatingSelector from '../../../components/RatingSelector/RatingSelector';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Loading from '../../../components/Loading/Loading';
import { useUser } from '../../../context/UserContext';

import './ModifyEdit.sass';

export default function ModifyEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();

    const [edit, setEdit] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        rating: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 👈 модалка

    useEffect(() => {
        async function loadEdit() {
            try {
                const data = await fetchEditById(id);
                setEdit(data);
                setFormData({
                    title: data.title,
                    tags: data.tags.join(', '),
                    rating: data.rating,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadEdit();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = {
                title: formData.title,
                tags: formData.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                rating: formData.rating,
            };
            await updateEdit(id, updated);
            navigate(`/edit/${id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteEdit(id);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading || userLoading) return <Loading />;
    if (error) return <div className="modify-edit error">Ошибка: {error}</div>;
    if (!edit) return null;

    const isAdmin = user?.role === 'admin';

    return (
        <main className="add-edit-page-wrapper">
            <Sidebar />
            <div className="add-edit-form-shield">
                <div className="add-edit-form modify-edit">
                    <button
                        className="delete-icon"
                        onClick={() => setShowDeleteModal(true)}
                        title="Удалить эдит"
                    >
                        🗑️
                    </button>

                    <h2>Редактирование эдита</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Название"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="tags"
                            placeholder="Теги (через запятую)"
                            value={formData.tags}
                            onChange={handleChange}
                        />

                        <label>Оценка видео</label>
                        <RatingSelector
                            value={formData.rating}
                            onChange={(val) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    rating: val,
                                }))
                            }
                            isAdmin={isAdmin}
                        />

                        {error && <div className="message error">{error}</div>}

                        <div className="buttons">
                            <button type="submit" className="save">
                                Сохранить
                            </button>
                            <button
                                className="cancel-button"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Отменить
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <p>Вы точно хотите удалить эдит?</p>
                        <div className="modal-buttons">
                            <button className="confirm" onClick={confirmDelete}>
                                удалить
                            </button>
                            <button
                                className="cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
