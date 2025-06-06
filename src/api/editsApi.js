// для разработки
const API_URL = 'http://localhost:5000/api/edits';
// const API_URL =
//     'https://edit-storage-server-production.up.railway.app/api/edits';

export async function fetchEdits() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка при получении Эдитов');
    return res.json();
}

// пока что не используется
// export async function fetchRandomEdit() {
//     const res = await fetch(`${API_URL}/random`);
//     if (!res.ok) throw new Error('Не удалось получить случайный эдит');
//     return res.json();
// }

export async function fetchRandomEdits() {
    const res = await fetch(`${API_URL}/random-many`);
    if (!res.ok) throw new Error('Не удалось получить случайные эдиты');
    return res.json();
}

export async function fetchPaginatedEdits(skip = 0, limit = 10) {
    const res = await fetch(`${API_URL}/paginated?skip=${skip}&limit=${limit}`);
    if (!res.ok) throw new Error('Ошибка при получении постраничных эдитов');
    return res.json();
}

export async function addEdit({
    title,
    videoUrl,
    videoFile,
    tags,
    source,
    rating,
}) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Вы не авторизованы');

    const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

    // YouTube: отправляем JSON
    if (source === 'youtube') {
        function extractYouTubeId(url) {
            try {
                const urlObj = new URL(url);

                // youtu.be/VIDEO_ID
                if (urlObj.hostname.includes('youtu.be')) {
                    return urlObj.pathname.slice(1);
                }

                // youtube.com/watch?v=VIDEO_ID
                if (urlObj.hostname.includes('youtube.com')) {
                    const v = urlObj.searchParams.get('v');
                    if (v) return v;

                    // youtube.com/shorts/VIDEO_ID
                    const match = urlObj.pathname.match(
                        /\/shorts\/([a-zA-Z0-9_-]{11})/
                    );
                    if (match) return match[1];

                    // youtube.com/embed/VIDEO_ID
                    const embed = urlObj.pathname.match(
                        /\/embed\/([a-zA-Z0-9_-]{11})/
                    );
                    if (embed) return embed[1];
                }

                return null;
            } catch (err) {
                console.error(err);
                return null;
            }
        }

        const videoId = extractYouTubeId(videoUrl);
        if (!videoId) throw new Error('Некорректная ссылка на YouTube');

        const newEdit = {
            title,
            video: videoId,
            tags: tagsArray,
            source,
            rating,
        };

        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newEdit),
        });

        const data = await res.json();
        if (!res.ok)
            throw new Error(data.message || 'Ошибка при добавлении эдита');
        return data;
    }

    // Cloudinary: отправляем FormData
    if (source === 'cloudinary') {
        if (!videoFile) throw new Error('Выберите видеофайл');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('source', source);
        formData.append('rating', rating);
        formData.append('tags', JSON.stringify(tagsArray));
        formData.append('videoFile', videoFile); // ключ должен совпадать с multer `.single('videoFile')`

        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                // 'Content-Type' НЕ УКАЗЫВАЕМ — browser сам установит `multipart/form-data`
            },
            body: formData,
        });

        const data = await res.json();
        if (!res.ok)
            throw new Error(data.message || 'Ошибка при загрузке видео');

        return data;
    }

    throw new Error('Неизвестный источник видео');
}

export async function updateEdit(id, updatedData) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Вы не авторизованы');

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Ошибка при обновлении эдита');
    }

    return data;
}

export async function deleteEdit(id) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Вы не авторизованы');

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Ошибка при удалении эдита');
    }

    return data;
}

export async function fetchEditById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка загрузки эдита');
    }
    return res.json();
}

export async function fetchMyEdits() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Вы не авторизованы');
    }

    try {
        const res = await fetch(`${API_URL}/my`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error(
                'Ошибка в ответе сервера:',
                data.message || data.error || 'Неизвестная ошибка'
            );
            throw new Error(
                data.message ||
                    data.error ||
                    'Ошибка при получении ваших эдитов'
            );
        }

        return data;
    } catch (err) {
        console.error('Ошибка при выполнении fetchMyEdits:', err);
        throw err;
    }
}
