import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaHome,
    FaBuilding,
    FaKey,
    FaEnvelope,
    FaFileInvoiceDollar,
    FaLightbulb,
    FaTools,
    FaCog,
    FaChevronDown
} from "react-icons/fa";
import "./styles/residentSidebar.css";

const ResidentSidebar = ({apartmentNum}) => {
    const [isOpenCabinet, setIsOpenCabinet] = useState(true);
    const location = useLocation().pathname;

    const isCabinet = location.startsWith("/resident-cabinet");
    const baseRoute = isCabinet ? "/resident-cabinet" : "";

    const isActive = (path) => location === path;

    return (
        <div className="resident-container-sidebar">
            <div className="sidebar">
                <div className="sidebar-content">
                    <h1>Кв. №{apartmentNum}</h1>
                    <h2>Меню</h2>
                    <ul className="menu">
                        <li className={isActive(`${baseRoute}`) ? "active" : ""}>
                            <Link to={`${baseRoute}`}>
                                <FaHome className="icon"/>
                                Про ОСББ
                            </Link>
                        </li>
                        <li className={isActive(`${baseRoute}/house-info`) ? "active" : ""}>
                            <Link to={`${baseRoute}/house-info`}>
                                <FaBuilding className="icon"/>
                                Інформація про будинок
                            </Link>
                        </li>
                        <li className="parent">
                            <button className="dropdown-btn" onClick={() => setIsOpenCabinet(!isOpenCabinet)}>
                                <FaKey className="icon"/>
                                Особистий кабінет
                                <FaChevronDown className={`chevron ${isOpenCabinet ? "rotate" : ""}`}/>
                            </button>
                            {isOpenCabinet && (
                                <div className="sub-li">
                                    <ul className="submenu">
                                        <li className={isActive(`${baseRoute}/notifications`) ? "active" : ""}>
                                            <Link to={`${baseRoute}/notifications`}>
                                                <FaEnvelope className="icon"/>
                                                Повідомлення
                                            </Link>
                                        </li>
                                        <li className={isActive(`${baseRoute}/payment-history`) ? "active" : ""}>
                                            <Link to={`${baseRoute}/payment-history`}>
                                                <FaFileInvoiceDollar className="icon"/>
                                                Історія платежів
                                            </Link>
                                        </li>
                                        <li className={isActive(`${baseRoute}/utilities`) ? "active" : ""}>
                                            <Link to={`${baseRoute}/utilities`}>
                                                <FaLightbulb className="icon"/>
                                                Комунальні послуги
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li className={isActive(`${baseRoute}/repair-requests`) ? "active" : ""}>
                            <Link to={`${baseRoute}/repair-requests`}>
                                <FaTools className="icon"/>
                                Заявки на ремонт
                            </Link>
                        </li>
                        <li className={isActive(`${baseRoute}/settings`) ? "active" : ""}>
                            <Link to={`${baseRoute}/settings`}>
                                <FaCog className="icon"/>
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

export default ResidentSidebar;
