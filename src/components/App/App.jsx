import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../../pages/main/Main';
import AllEdits from '../../pages/AllEdits/AllEdits';
import Profile from '../../pages/Profile/Profile';
import AddEditPage from '../../pages/AddEditPage/AddEditPage';
import EditPage from '../../pages/EditPage/EditPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/edits" element={<AllEdits />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-edit" element={<AddEditPage />} />
                <Route path="/edit/:id" element={<EditPage />} />
            </Routes>
        </Router>
    );
}

export default App;
