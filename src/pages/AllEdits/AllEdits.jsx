import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchBar from '../../components/allEdits/SearchBar/SearchBar';
import Filters from '../../components/allEdits/Filters/Filters';
import EditsList from '../../components/allEdits/EditsList/EditsList';
import { fetchPaginatedEdits } from '../../api/editsApi';
import Loading from '../../components/Loading/Loading';

import './AllEdits.sass';

export default function AllEdits() {
    const [edits, setEdits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [tags, setTags] = useState([]);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    useEffect(() => {
        loadMoreEdits(true);
    }, []);

    function loadMoreEdits(initial = false) {
        if (initial) setLoading(true);

        fetchPaginatedEdits(initial ? 0 : skip, limit)
            .then(({ edits: newEdits, total }) => {
                const updatedEdits = initial
                    ? newEdits
                    : [...edits, ...newEdits];
                setEdits(updatedEdits);
                setTotal(total);

                const allTags = updatedEdits.flatMap((edit) => edit.tags || []);
                const tagCounts = allTags.reduce((acc, tag) => {
                    acc[tag] = (acc[tag] || 0) + 1;
                    return acc;
                }, {});
                const tagList = Object.entries(tagCounts).map(
                    ([tag, count]) => ({ tag, count })
                );
                setTags(tagList);

                setSkip((prev) => (initial ? limit : prev + limit));
            })
            .catch((err) => console.error('Ошибка при загрузке эдитов:', err))
            .finally(() => {
                if (initial) setLoading(false);
            });
    }

    const filteredEdits = edits.filter((edit) => {
        const matchesTag = selectedTag
            ? edit.tags?.includes(selectedTag)
            : true;
        const lower = searchTerm.toLowerCase();
        const matchesSearch = lower
            ? edit.title.toLowerCase().includes(lower) ||
              edit.author?.toLowerCase().includes(lower) ||
              edit.tags?.some((t) => t.toLowerCase().includes(lower))
            : true;
        return matchesTag && matchesSearch;
    });

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
                        tags={tags}
                        selectedTag={selectedTag}
                        onSelectTag={setSelectedTag}
                        totalEditsCount={filteredEdits.length}
                    />
                )}
                <EditsList edits={filteredEdits} loading={loading} />
                {!loading && edits.length < total && (
                    <button
                        className="load-more-btn"
                        onClick={() => loadMoreEdits()}
                    >
                        Загрузить ещё
                    </button>
                )}
            </div>
        </main>
    );
}
