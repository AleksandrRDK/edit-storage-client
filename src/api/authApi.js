//для разработки
const API_URL = 'http://localhost:5000/api/auth';
// const API_URL =
//     'https://edit-storage-server-production.up.railway.app/api/auth';

export async function registerUser(data) {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok)
        throw new Error((await res.json()).message || 'Ошибка регистрации');
    return res.json();
}

export async function loginUser(data) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error((await res.json()).message || 'Ошибка входа');
    return res.json();
}

export async function getMe() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('Не удалось получить пользователя');
    return res.json();
}

export async function changePassword(oldPassword, newPassword) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!res.ok)
        throw new Error(
            (await res.json()).message || 'Ошибка при смене пароля'
        );

    return res.json();
}
