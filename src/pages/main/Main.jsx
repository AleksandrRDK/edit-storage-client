import Sidebar from '../../components/Sidebar/Sidebar';
import EditOfTheDay from '../../components/main/EditOfTheDay/EditOfTheDay';
import RandomEditsList from '../../components/main/RandomEditsList/RandomEditsList';
import Loading from '../../components/Loading/Loading';

import { useUser } from '../../context/UserContext';

import './Main.sass';

export default function Main() {
    const { user, loading } = useUser();

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="main-page">
            <Sidebar />
            <main className="main-content">
                <EditOfTheDay currentUser={user} />
                <RandomEditsList currentUser={user} />
            </main>
        </div>
    );
}
