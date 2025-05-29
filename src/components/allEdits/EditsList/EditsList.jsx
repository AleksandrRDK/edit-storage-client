import EditCard from '../EditCard/EditCard';
import Loading from '../../Loading/Loading';
import './EditsList.sass';

export default function EditsList({ edits, loading }) {
    if (loading) {
        return <Loading />;
    }
    return (
        <div className="all-edits-list">
            {edits.length === 0 ? (
                <p className="no-results">Нет эдитов по вашему запросу.</p>
            ) : (
                edits.map((edit) =>
                    edit ? <EditCard key={edit._id} edit={edit} /> : null
                )
            )}
        </div>
    );
}
