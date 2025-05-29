import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.scss';
import './styles/index.sass';
import './styles/responsive.sass';
import App from './components/App/App';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
