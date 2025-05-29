import './SearchBar.sass';

export default function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Поиск по названию, автору или тегу..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
}
