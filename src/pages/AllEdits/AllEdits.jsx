import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchBar from '../../components/allEdits/SearchBar/SearchBar';
import Filters from '../../components/allEdits/Filters/Filters';
import EditsList from '../../components/allEdits/EditsList/EditsList';
import Loading from '../../components/Loading/Loading';
import { fetchFilteredEdits } from '../../api/filteredEdits';
import { fetchTagsAndTotal } from '../../api/tagsApi';

import './AllEdits.sass';

export default function AllEdits() {
    const [edits, setEdits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allTagsData, setAllTagsData] = useState({ total: 0, tags: [] });
    const [topTags, setTopTags] = useState([]);

    const limit = 8;

    useEffect(() => {
        fetchTagsAndTotal()
            .then(({ total, tags }) => {
                setAllTagsData({ total, tags });
                setTopTags(tags.slice(0, 3));
                setTotal(total);
            })
            .catch((err) => console.error('Ошибка загрузки тегов:', err));
    }, []);

    // Первоначальная загрузка
    useEffect(() => {
        loadEdits(true);
    }, []);

    // Загрузка при изменении фильтров
    useEffect(() => {
        loadEdits(true);
    }, [searchTerm, selectedTag, selectedRating]);

    function loadEdits(initial = false) {
        if (initial) {
            setSkip(0);
            setLoading(true);
        }

        fetchFilteredEdits({
            search: searchTerm,
            tag: selectedTag,
            rating: selectedRating,
            skip: initial ? 0 : skip,
            limit,
        })
            .then(({ edits: newEdits, total }) => {
                const updatedEdits = initial
                    ? newEdits
                    : [...edits, ...newEdits];

                setEdits(updatedEdits);
                setTotal(total);

                setSkip((prev) => (initial ? limit : prev + limit));
            })
            .catch((err) => console.error('Ошибка при загрузке эдитов:', err))
            .finally(() => {
                if (initial) setLoading(false);
            });
    }

    return (
        <main className="all-edits-wrapper">
            <Sidebar />
            <div className="all-edits-page">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {loading ? (
                    <Loading />
                ) : (
                    <Filters
                        tags={allTagsData.tags}
                        selectedTag={selectedTag}
                        onSelectTag={setSelectedTag}
                        selectedRating={selectedRating}
                        onSelectRating={setSelectedRating}
                        totalEditsCount={allTagsData.total}
                        topTags={topTags}
                    />
                )}

                <EditsList edits={edits} loading={loading} />

                {!loading && edits.length < total && (
                    <button
                        className="load-more-btn"
                        onClick={() => loadEdits()}
                    >
                        Загрузить ещё
                    </button>
                )}
            </div>
        </main>
    );
}
