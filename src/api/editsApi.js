// для разработки
// const API_URL = 'http://localhost:5000/api/edits';
const API_URL =
    'https://edit-storage-server-production.up.railway.app/api/edits';

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

export async function addEdit({ title, videoUrl, tags, source, rating }) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Вы не авторизованы');

    let videoId;

    if (source === 'youtube') {
        function extractYouTubeId(url) {
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname.includes('youtu.be')) {
                    return urlObj.pathname.slice(1);
                }
                if (urlObj.hostname.includes('youtube.com')) {
                    return urlObj.searchParams.get('v');
                }
                return null;
            } catch (err) {
                console.error(err);
                return null;
            }
        }

        videoId = extractYouTubeId(videoUrl);
        if (!videoId) throw new Error('Некорректная ссылка на YouTube');
    } else if (source === 'cloudinary') {
        try {
            const urlObj = new URL(videoUrl);

            // Ищем, где начинается `upload/`, и берём всё после этого
            const uploadIndex = urlObj.pathname.indexOf('/upload/');
            if (uploadIndex === -1) {
                throw new Error('Некорректная ссылка — отсутствует /upload/');
            }

            const publicIdWithExt = urlObj.pathname.slice(uploadIndex + 8); // без "/upload/"
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // убираем расширение (.mp4, .webm, .jpg...)

            videoId = publicId;
            if (!videoId)
                throw new Error('Не удалось извлечь publicId из ссылки');
        } catch (err) {
            throw new Error(
                `Некорректная ссылка на Cloudinary. Ошибка: ${err}`
            );
        }
    } else {
        throw new Error('Неизвестный источник видео');
    }

    // Получаем текущего пользователя
    const resUser = await fetch(
        // 'http://localhost:5000/api/auth/me',
        'https://edit-storage-server-production.up.railway.app/api/auth/me',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const userData = await resUser.json();
    if (!resUser.ok)
        throw new Error(userData.message || 'Ошибка получения пользователя');

    const author = userData.user.nickname;

    // Обработка тегов
    const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

    // Подготовка данных
    const newEdit = {
        title,
        author,
        video: videoId,
        tags: tagsArray,
        source,
        rating,
    };

    // Отправка запроса
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEdit),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка при добавлении эдита');

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
