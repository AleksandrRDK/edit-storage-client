import { Link, useLocation } from 'react-router-dom';
import './Sidebar.sass';

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <nav className="nav">
                <h1 className="logo">EditStorage</h1>
                <ul className="nav-list">
                    <li>
                        <Link
                            to="/"
                            className={
                                location.pathname === '/' ? 'active' : ''
                            }
                        >
                            Главная
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/edits"
                            className={
                                location.pathname === '/edits' ? 'active' : ''
                            }
                        >
                            Все эдиты
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className={
                                location.pathname === '/profile' ? 'active' : ''
                            }
                        >
                            Профиль
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
