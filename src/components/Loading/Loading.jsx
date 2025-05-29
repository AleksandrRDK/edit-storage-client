import './Loading.sass';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <video className="loading-video" autoPlay loop muted playsInline>
                <source src="/am-nyam-loading.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            <div className="loading-overlay__header">Загрузка...</div>
        </div>
    );
};

export default Loading;
