import { useState, useEffect, useRef } from 'react';
import './RatingSelector.sass';

export default function RatingSelector({ value, onChange, isAdmin }) {
    const buttons = [];
    for (let i = 0; i <= 11; i++) {
        buttons.push(i);
    }

    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipTimeoutRef = useRef(null);

    function handleClick(num) {
        if (num === 11 && !isAdmin) {
            setShowTooltip(true);

            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = setTimeout(() => {
                setShowTooltip(false);
            }, 7000);
        } else {
            onChange(num);
            setShowTooltip(false);
        }
    }

    // Очистка таймаута при размонтировании
    useEffect(() => {
        return () => clearTimeout(tooltipTimeoutRef.current);
    }, []);

    return (
        <div className="rating-selector">
            {buttons.map((num) => {
                const isDisabled = num === 11 && !isAdmin;
                return (
                    <button
                        key={num}
                        type="button"
                        className={`rating-button ${
                            value === num ? 'active' : ''
                        } ${isDisabled ? 'disabled-admin' : ''}`}
                        onClick={() => handleClick(num)}
                        aria-label={`Оценка ${num}`}
                    >
                        {num}
                    </button>
                );
            })}
            {showTooltip && (
                <div className="tooltip">
                    Оценка 11 доступна только для админов
                </div>
            )}
        </div>
    );
}
