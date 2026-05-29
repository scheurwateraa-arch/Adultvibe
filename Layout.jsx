import Chat from './pages/Chat';
import Conversations from './pages/Conversations';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Likes from './pages/Likes';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Search from './pages/Search';
import SetupProfile from './pages/SetupProfile';
import Swipe from './pages/Swipe';
import ViewProfile from './pages/ViewProfile';
import Visitors from './pages/Visitors';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Chat": Chat,
    "Conversations": Conversations,
    "Dashboard": Dashboard,
    "Home": Home,
    "Likes": Likes,
    "Matches": Matches,
    "Profile": Profile,
    "Search": Search,
    "SetupProfile": SetupProfile,
    "Swipe": Swipe,
    "ViewProfile": ViewProfile,
    "Visitors": Visitors,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};