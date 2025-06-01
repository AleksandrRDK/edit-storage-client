import { useEffect, useState } from 'react';
import { fetchRandomEdits } from '../../../api/editsApi';
import { addFavorite, removeFavorite } from '../../../api/favoritesApi';
import EditModal from '../../../components/EditModal/EditModal';
import Loading from '../../Loading/Loading';
import { getCloudinaryThumbnailUrl } from '../../../utils/cloudinaryUtils';
import { getYouTubeThumbnailUrl } from '../../../utils/youtubeUtils';
import './RandomEditsList.sass';

export default function RandomEditsList({ currentUser }) {
    const [edits, setEdits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEdit, setSelectedEdit] = useState(null);

    useEffect(() => {
        fetchRandomEdits()
            .then((data) => setEdits(data))
            .catch((err) => console.error('Ошибка при загрузке эдитов:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleCloseModal = () => {
        setSelectedEdit(null);
    };

    const handleToggleFavorite = async (editId, add) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !currentUser) return;

            if (add) {
                await addFavorite(editId, token);
            } else {
                await removeFavorite(editId, token);
            }

            setEdits((prev) =>
                prev.map((edit) =>
                    edit._id === editId
                        ? {
                              ...edit,
                              favorites: add
                                  ? [...(edit.favorites || []), currentUser.id]
                                  : (edit.favorites || []).filter(
                                        (id) => id !== currentUser.id
                                    ),
                          }
                        : edit
                )
            );

            setSelectedEdit((prev) =>
                prev && prev._id === editId
                    ? {
                          ...prev,
                          favorites: add
                              ? [...(prev.favorites || []), currentUser.id]
                              : (prev.favorites || []).filter(
                                    (id) => id !== currentUser.id
                                ),
                      }
                    : prev
            );
        } catch (err) {
            console.error('Ошибка избранного:', err.message);
        }
    };

    const getThumbnailUrl = (edit) => {
        if (edit.source === 'youtube') {
            return getYouTubeThumbnailUrl(edit.video, 'hqdefault');
        }
        if (edit.source === 'cloudinary') {
            return getCloudinaryThumbnailUrl(edit.video);
        }
        return ''; // fallback если источник неизвестен
    };

    return (
        <section className="random-edits-list">
            <h3>Рандомные эдиты</h3>
            {loading ? (
                <Loading />
            ) : edits.length === 0 ? (
                <p className="no-edits">Эдитов пока нет</p>
            ) : (
                <div className="cards-container">
                    {edits.map((edit) => (
                        <div
                            key={edit._id}
                            className="edit-card"
                            title={edit.title}
                            style={{
                                backgroundImage: `url(${getThumbnailUrl(
                                    edit
                                )})`,
                                cursor: 'pointer',
                            }}
                            onClick={() => setSelectedEdit(edit)}
                        />
                    ))}
                </div>
            )}

            {selectedEdit && (
                <EditModal
                    edit={selectedEdit}
                    currentUser={currentUser}
                    onClose={handleCloseModal}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        </section>
    );
}
