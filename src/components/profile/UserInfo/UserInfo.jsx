import './UserInfo.sass';
import { useNavigate } from 'react-router-dom';

export default function UserInfo({ user, onChangePassword, onLogout }) {
    const formattedDate = new Date(user.createdAt).toLocaleDateString('ru-RU');
    const navigate = useNavigate();

    return (
        <div className="user-info">
            <h2>Профиль</h2>
            <div className="field">
                <span>Email:</span>
                <span>{user.email}</span>
            </div>
            <div className="field">
                <span>Никнейм:</span>
                <span>{user.nickname}</span>
            </div>
            <div className="field">
                <span>Дата регистрации:</span>
                <span>{formattedDate}</span>
            </div>
            <div className="user-info__btn__wrapper">
                <button
                    className="change-password-btn"
                    onClick={onChangePassword}
                >
                    Изменить пароль
                </button>
                <button className="logout-button" onClick={onLogout}>
                    Выйти
                </button>
            </div>
            <button
                className="add-edit-button"
                onClick={() => navigate('/add-edit')}
            >
                + Добавить эдит
            </button>
        </div>
    );
}
