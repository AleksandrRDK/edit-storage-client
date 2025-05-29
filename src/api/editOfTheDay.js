export async function fetchEditOfTheDay() {
    const res = await fetch('http://localhost:5000/api/edit-of-the-day');
    if (!res.ok) {
        throw new Error('Не удалось загрузить эдит дня');
    }
    const data = await res.json();
    return data;
}
