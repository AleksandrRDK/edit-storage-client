import './Loading.sass';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <img
                className="loading-video"
                src={`${import.meta.env.BASE_URL}am-nuam-final.gif`}
                alt="Загрузка..."
            />
            <div className="loading-overlay__header">Загрузка...</div>
        </div>
    );
};

export default Loading;
