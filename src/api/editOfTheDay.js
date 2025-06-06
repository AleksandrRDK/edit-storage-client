// для разработки
const API_URL = 'http://localhost:5000/api';
// const API_URL = 'https://edit-storage-server-production.up.railway.app/api';

export async function fetchEditOfTheDay() {
    const res = await fetch(`${API_URL}/edit-of-the-day`);
    if (!res.ok) {
        throw new Error('Не удалось загрузить эдит дня');
    }
    const data = await res.json();
    return data;
}
