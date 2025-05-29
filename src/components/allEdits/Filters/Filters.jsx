import { useState } from 'react';
import './Filters.sass';

export default function Filters({
    tags,
    selectedTag,
    onSelectTag,
    totalEditsCount,
}) {
    const [showModal, setShowModal] = useState(false);
    const visibleTags = tags.slice(0, 10);

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

                {visibleTags.map(({ tag, count }) => (
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
