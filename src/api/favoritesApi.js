// для разработки
// const API_BASE = 'http://localhost:5000/api/users/favorites';
const API_BASE =
    'https://edit-storage-server-production.up.railway.app/api/users/favorites';

export async function addFavorite(editId, token) {
    const res = await fetch(`${API_BASE}/${editId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Ошибка добавления в избранное');
    }
    return res.json();
}

export async function removeFavorite(editId, token) {
    const res = await fetch(`${API_BASE}/${editId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Ошибка удаления из избранного');
    }
    return res.json();
}

export async function getFavorites(token, page = 1, limit = 20) {
    const res = await fetch(`${API_BASE}?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Ошибка загрузки избранного');
    }
    return res.json();
}

export async function checkIsFavorite(editId, token) {
    const res = await fetch(`${API_BASE}/check/${editId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error('Ошибка проверки избранного');
    }
    const data = await res.json();
    return data.isFavorite;
}
