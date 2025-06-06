// для разработки
const BASE_URL = 'http://localhost:5000/api/comments';
// const BASE_URL =
//     'https://edit-storage-server-production.up.railway.app/api/comments';

export async function getCommentsByEditId(editId) {
    const res = await fetch(`${BASE_URL}/${editId}`);
    if (!res.ok) throw new Error('Не удалось получить комментарии');
    return res.json();
}

export async function addComment({ editId, text }) {
    const token = localStorage.getItem('token');

    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ editId, text }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response body:', errorText);
        throw new Error('Не удалось добавить комментарий');
    }

    const data = await res.json();

    return data;
}

export async function updateComment({ commentId, text }) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error('Не удалось обновить комментарий');
    return res.json();
}

export async function deleteComment({ commentId }) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('Не удалось удалить комментарий');
    return res.json();
}
