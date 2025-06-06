import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.sass';

export default function Sidebar() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="hamburger__wrapper">
                <button
                    className="hamburger"
                    onClick={() => setOpen(!open)}
                    aria-label="Меню"
                >
                    <span className={open ? 'line open' : 'line'} />
                    <span className={open ? 'line open' : 'line'} />
                    <span className={open ? 'line open' : 'line'} />
                </button>
            </div>
            <aside className={`sidebar ${open ? 'open' : ''}`}>
                <nav className="nav">
                    <h1 className="logo">EditStorage</h1>
                    <ul className="nav-list">
                        <li>
                            <Link
                                to="/"
                                className={
                                    location.pathname === '/' ? 'active' : ''
                                }
                                onClick={() => setOpen(false)}
                            >
                                Сегодня
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/edits"
                                className={
                                    location.pathname === '/edits'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setOpen(false)}
                            >
                                Все эдиты
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/my-edits"
                                className={
                                    location.pathname === '/my-edits'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setOpen(false)}
                            >
                                Мои эдиты
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/add-edit"
                                className={
                                    location.pathname === '/add-edit'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setOpen(false)}
                            >
                                + Добавить эдит
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/profile"
                                className={
                                    location.pathname === '/profile'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setOpen(false)}
                            >
                                Профиль
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}
