// для разработки
const API_BASE = 'http://localhost:5000/api/edits/search';
// const API_BASE =
//     'https://edit-storage-server-production.up.railway.app/api/edits/search';

export async function fetchFilteredEdits({
    search = '',
    tag = null,
    rating = null,
    skip = 0,
    limit = 8,
}) {
    const params = new URLSearchParams({ search, tag, rating, skip, limit });
    const res = await fetch(`${API_BASE}?${params.toString()}`);
    if (!res.ok) throw new Error('Ошибка при загрузке отфильтрованных эдитов');
    return res.json();
}
