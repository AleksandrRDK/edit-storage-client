import { useState } from 'react';
import Loading from '../../../Loading/Loading';
import './ChangePasswordModal.sass';

export default function ChangePasswordModal({ onClose, onSubmit }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (
            !currentPassword.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim()
        ) {
            setError('Заполните все поля');
            return;
        }

        if (newPassword.length < 6) {
            setError('Новый пароль должен содержать минимум 6 символов');
            return;
        }

        if (currentPassword === newPassword) {
            setError('Новый пароль должен отличаться от текущего');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await onSubmit({ oldPassword: currentPassword, newPassword });
        } catch (err) {
            setError(err.message || 'Ошибка при смене пароля');
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        if (loading) return; // блокируем закрытие при загрузке
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Смена пароля</h3>
                {loading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Текущий пароль"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Новый пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Повторите новый пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        <div className="modal-buttons">
                            <button type="submit">Сменить</button>
                            <button type="button" onClick={handleClose}>
                                Отмена
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
