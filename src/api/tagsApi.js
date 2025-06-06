// для разработки
const API_BASE = 'http://localhost:5000/api/tags';
// const API_BASE =
//     'https://edit-storage-server-production.up.railway.app/api/tags';

export async function fetchTagsAndTotal() {
    const response = await fetch(`${API_BASE}`);
    if (!response.ok) throw new Error('Ошибка при загрузке тегов');
    return response.json();
}
