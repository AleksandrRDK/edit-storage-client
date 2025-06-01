const CLOUD_NAME = 'deqk2pwfv';
const UPLOAD_PRESET = 'edit_storage';

export function getCloudinaryVideoUrl(publicId) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}.mp4`;
}

export function getCloudinaryThumbnailUrl(publicId) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_3/${publicId}.jpg`;
}

export async function uploadVideoToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', 'video');

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error?.message || 'Ошибка загрузки на Cloudinary');

    return data.secure_url;
}
