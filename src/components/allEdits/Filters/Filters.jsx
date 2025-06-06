import { useState } from 'react';
import './Filters.sass';

export default function Filters({
    tags,
    selectedTag,
    onSelectTag,
    selectedRating,
    onSelectRating,
    totalEditsCount,
    topTags = [],
}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="filters">
            <h4>Фильтры по тегам</h4>
            <div className="tags-list">
                <button
                    className={`tag-btn ${
                        selectedTag === null ? 'active' : ''
                    }`}
                    onClick={() => onSelectTag(null)}
                    aria-label="Сбросить фильтр"
                >
                    Все ({totalEditsCount})
                </button>

                {/* Три популярных тега рядом */}
                {topTags.map(({ tag, count }) => (
                    <button
                        key={tag}
                        className={`tag-btn ${
                            selectedTag === tag ? 'active' : ''
                        }`}
                        onClick={() => onSelectTag(tag)}
                    >
                        #{tag} ({count})
                    </button>
                ))}

                <button
                    className="filter-icon-btn"
                    onClick={() => setShowModal(true)}
                    aria-label="Открыть все фильтры"
                >
                    🔍
                </button>
            </div>
            <h4>Фильтры по оценке</h4>
            <div className="ratings-list">
                <button
                    className={`rating-btn ${
                        selectedRating === null ? 'active' : ''
                    }`}
                    onClick={() => onSelectRating(null)}
                >
                    Все
                </button>
                {[...Array(12).keys()].map((rating) => (
                    <button
                        key={rating}
                        className={`rating-btn ${
                            selectedRating === rating ? 'active' : ''
                        }`}
                        onClick={() => onSelectRating(rating)}
                    >
                        {rating}
                    </button>
                ))}
            </div>

            {showModal && (
                <div
                    className="filter-modal"
                    onClick={() => setShowModal(false)}
                >
                    <div className="filter-modal-content">
                        <button
                            className="close-btn"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                        <h4>Все теги</h4>
                        <div className="tags-list">
                            <button
                                className={`tag-btn ${
                                    selectedTag === null ? 'active' : ''
                                }`}
                                onClick={() => {
                                    onSelectTag(null);
                                    setShowModal(false);
                                }}
                            >
                                Все ({totalEditsCount})
                            </button>
                            {tags.map(({ tag, count }) => (
                                <button
                                    key={tag}
                                    className={`tag-btn ${
                                        selectedTag === tag ? 'active' : ''
                                    }`}
                                    onClick={() => {
                                        onSelectTag(tag);
                                        setShowModal(false);
                                    }}
                                >
                                    #{tag} ({count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
