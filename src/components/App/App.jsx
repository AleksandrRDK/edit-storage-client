import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../../pages/main/Main';
import AllEdits from '../../pages/AllEdits/AllEdits';
import Profile from '../../pages/Profile/Profile';
import AddEditPage from '../../pages/AddEditPage/AddEditPage';
import EditPage from '../../pages/edit/EditPage/EditPage';
import ModifyEdit from '../../pages/edit/ModifyEdit/ModifyEdit';
import MyEdits from '../../pages/edit/MyEdits/MyEdits';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/edits" element={<AllEdits />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-edit" element={<AddEditPage />} />
                <Route path="/edit/:id" element={<EditPage />} />
                <Route path="/edit/:id/modify" element={<ModifyEdit />} />
                <Route path="/my-edits" element={<MyEdits />} />
            </Routes>
        </Router>
    );
}

export default App;
