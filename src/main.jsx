import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.scss';
import './styles/index.sass';
import './styles/responsive.sass';
import App from './components/App/App';
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </StrictMode>
);
