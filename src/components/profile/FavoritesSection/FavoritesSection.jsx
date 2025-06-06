import { useState, useMemo } from 'react';
import EditModal from '../../EditModal/EditModal';
import { addFavorite, removeFavorite } from '../../../api/favoritesApi';
import { getCloudinaryThumbnailUrl } from '../../../utils/cloudinaryUtils';
import { getYouTubeThumbnailUrl } from '../../../utils/youtubeUtils';
import './FavoritesSection.sass';

export default function FavoritesSection({
    total,
    favorites,
    currentUser,
    onLoadMore,
    hasMore,
}) {
    const [sortBy, setSortBy] = useState('date');
    const [selectedEdit, setSelectedEdit] = useState(null);

    // Топ-3 тега по частоте встречаемости
    const topTags = useMemo(() => {
        const tagCounts = favorites
            .flatMap((edit) => edit.tags)
            .reduce((acc, tag) => {
                acc[tag] = (acc[tag] || 0) + 1;
                return acc;
            }, {});

        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([tag]) => tag);
    }, [favorites]);

    // Сортировка
    const sortedFavorites = useMemo(() => {
        const arr = [...favorites];
        if (sortBy === 'date') {
            return arr.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }
        if (sortBy === 'title') {
            return arr.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sortBy === 'author') {
            return arr.sort((a, b) => a.author.localeCompare(b.author));
        }
        return arr;
    }, [favorites, sortBy]);

    // Функция для получения url превьюшки с учётом источника видео
    const getThumbnailUrl = (edit) =>
        edit.source === 'cloudinary'
            ? getCloudinaryThumbnailUrl(edit.video)
            : getYouTubeThumbnailUrl(edit.video);

    // Форматирование даты
    const formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

            // Обновляем только выбранный эдит в модальном окне, если он открыт
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

    return (
        <div className="favorites-section">
            <div className="favorites-header">
                <div className="favorites-section__header__wrapper">
                    <h3>Избранные эдиты</h3>
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="date">По дате</option>
                    <option value="title">По названию</option>
                    <option value="author">По автору</option>
                </select>
            </div>

            <div className="stats">
                <span className="total">Всего: {total}</span>
                <div className="top-tag">
                    Топ теги:
                    <div className="tags-list">
                        {topTags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="favorites-list">
                {sortedFavorites.map((edit) => (
                    <div
                        key={edit._id}
                        className="edit-card"
                        onClick={() => setSelectedEdit(edit)}
                        title={edit.title}
                    >
                        <div className="image-wrapper">
                            <img
                                src={getThumbnailUrl(edit)}
                                alt={`Превью ${edit.title}`}
                            />
                        </div>
                        <div className="info">
                            <h4>{edit.title}</h4>
                            <p>{edit.author || 'аноним'}</p>
                            <span>{formatDate(edit.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button className="load-more-btn" onClick={onLoadMore}>
                    Загрузить ещё
                </button>
            )}

            {selectedEdit && (
                <EditModal
                    edit={selectedEdit}
                    currentUser={currentUser}
                    onClose={() => setSelectedEdit(null)}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        </div>
    );
}
