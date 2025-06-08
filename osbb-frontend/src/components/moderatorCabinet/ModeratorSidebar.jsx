import { Link, useLocation } from "react-router-dom";
import {
    FaUserShield,
    FaNewspaper,
    FaEnvelope,
    FaCog,
} from "react-icons/fa";
import "./styles/moderatorSidebar.css";

const ModeratorSidebar = ({ apartmentNum }) => {
    const location = useLocation().pathname;
    const isCabinet = location.startsWith("/moderator-cabinet");
    const baseRoute = isCabinet ? "/moderator-cabinet" : "";

    const isActive = (path) => location === path;

    return (
        <div className="resident-container-sidebar">
            <div className="sidebar">
                <div className="sidebar-content">
                    <h1>Панель модератора</h1>
                    <h2>Меню</h2>
                    <ul className="menu">
                        <li className={isActive(`${baseRoute}`) ? "active" : ""}>
                            <Link to={`${baseRoute}`}>
                                <FaUserShield className="icon" />
                                Модерація ОСББ
                            </Link>
                        </li>
                        <li className={isActive(`${baseRoute}/news`) ? "active" : ""}>
                            <Link to={`${baseRoute}/news`}>
                                <FaNewspaper className="icon" />
                                Новини
                            </Link>
                        </li>
                        <li className={isActive(`${baseRoute}/message`) ? "active" : ""}>
                            <Link to={`${baseRoute}/message`}>
                                <FaEnvelope className="icon" />
                                Повідомлення
                            </Link>
                        </li>
                        <li className={isActive(`${baseRoute}/settings`) ? "active" : ""}>
                            <Link to={`${baseRoute}/settings`}>
                                <FaCog className="icon" />
                                Налаштування
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="trademark">© 2025 ОСББ+. Усі права захищено.</div>
            </div>
        </div>
    );
};

export default ModeratorSidebar;
