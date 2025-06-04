import { useEffect, useState } from 'react';
import {
    getCommentsByEditId,
    addComment,
    updateComment,
    deleteComment,
} from '../../api/commentsApi';
import Loading from '../Loading/Loading';
import './CommentSection.sass';

export default function CommentSection({ editId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchComments() {
            setLoading(true);
            try {
                const data = await getCommentsByEditId(editId);
                setComments(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchComments();
    }, [editId]);

    async function handleAddComment() {
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const comment = await addComment({
                editId,
                text: newComment,
            });
            setComments([comment, ...comments]);
            setNewComment('');
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        setLoading(true);
        try {
            await deleteComment({ commentId: id });
            setComments(comments.filter((c) => c._id !== id));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate() {
        setLoading(true);
        try {
            const updated = await updateComment({
                commentId: editingId,
                text: editText,
            });
            setComments(
                comments.map((c) => (c._id === editingId ? updated : c))
            );
            setEditingId(null);
            setEditText('');
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="comment-section">
            <h3>Комментарии</h3>

            {error && <p className="error">{error}</p>}

            {user && (
                <div className="new-comment">
                    <textarea
                        placeholder="Оставьте комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Добавить</button>
                </div>
            )}

            <div className="comments-list">
                {comments.map((comment) => (
                    <div className="comment-card" key={comment._id}>
                        <div className="info">
                            <strong>
                                {comment.author?.nickname || 'Пользователь'}
                            </strong>
                            <span>
                                {new Date(comment.createdAt).toLocaleString()}
                            </span>
                        </div>

                        {editingId === comment._id ? (
                            <>
                                <textarea
                                    value={editText}
                                    onChange={(e) =>
                                        setEditText(e.target.value)
                                    }
                                />
                                <div className="actions">
                                    <button onClick={handleUpdate}>
                                        Сохранить
                                    </button>
                                    <button onClick={() => setEditingId(null)}>
                                        Отмена
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{comment.text}</p>
                                {comment.author?._id === user?._id && (
                                    <div className="actions">
                                        <button
                                            onClick={() => {
                                                setEditingId(comment._id);
                                                setEditText(comment.text);
                                            }}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(comment._id)
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
