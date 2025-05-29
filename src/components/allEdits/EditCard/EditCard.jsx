import { Link } from 'react-router-dom';
import './EditCard.sass';

export default function EditCard({ edit }) {
    const previewUrl = `https://img.youtube.com/vi/${edit.video}/hqdefault.jpg`;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <Link
            to={`/edit/${edit._id}`}
            className="all-edit-card"
            title={edit.title}
        >
            <img src={previewUrl} alt={`Превью ${edit.title}`} />
            <div className="card-info">
                <h5 className="edit-title">{edit.title}</h5>
                <div className="edit-meta">
                    <span className="edit-author">
                        @{edit.author || 'аноним'}
                    </span>
                    <span className="edit-date">
                        {formatDate(edit.createdAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
