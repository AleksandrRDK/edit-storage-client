import { Link } from 'react-router-dom';
import { getCloudinaryThumbnailUrl } from '../../../utils/cloudinaryUtils';
import { getYouTubeThumbnailUrl } from '../../../utils/youtubeUtils';
import './EditCard.sass';

export default function EditCard({ edit }) {
    const previewUrl =
        edit.source === 'cloudinary'
            ? getCloudinaryThumbnailUrl(edit.video)
            : getYouTubeThumbnailUrl(edit.video);

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
                <div className="edit-rating">
                    <span className="rating-number">{edit.rating} / 11</span>
                    <div className="rating-bar-wrapper">
                        <div
                            className="rating-bar"
                            style={{
                                width: `${(edit.rating / 11) * 100}%`,
                            }}
                        />
                    </div>
                </div>
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
