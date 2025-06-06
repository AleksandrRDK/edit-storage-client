import './UserInfo.sass';

export default function UserInfo({ user, onChangePassword, onLogout }) {
    const formattedDate = new Date(user.createdAt).toLocaleDateString('ru-RU');

    return (
        <div className="user-info">
            <h2>Профиль</h2>
            <div className="field">
                <span>Роль:</span>
                <span className={`role role--${user.role}`}>{user.role}</span>
            </div>
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
                <button className="btn" onClick={onChangePassword}>
                    Изменить пароль
                </button>
                <button className="btn" onClick={onLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
}
