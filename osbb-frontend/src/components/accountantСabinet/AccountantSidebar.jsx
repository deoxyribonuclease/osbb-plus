import React, { useState } from "react";
import {Link, useLocation, useOutletContext} from "react-router-dom";
import {
    FaHome,
    FaBuilding,
    FaKey,
    FaUsers,
    FaCog,
    FaChevronDown,
    FaChartPie,
    FaExclamationCircle,
    FaHistory,
    FaWallet, FaTools, FaTachometerAlt, FaEnvelope
} from "react-icons/fa";
import "./styles/accountantSidebar.css";

const AccountantSidebar = ( {osbbName}) => {
    const [isOpenBuild, setisOpenBuild] = useState(true);
    const [isOpenMoney, setisOpenMoney] = useState(true);
    const location = useLocation().pathname;

    const isCabinet = location.startsWith("/accountant-cabinet");
    const baseRoute = isCabinet ? "/accountant-cabinet" : "";
    const isActive = (path) => location === path ;



    return (
        <div className="container-sidebar">
            <div className="sidebar">
                <div className="sidebar-content">
                    <h1>{osbbName || 'Назва ОСББ не визначена'}</h1>
                    <h2>Меню</h2>
                    <ul className="menu">
                        <li className={isActive(`${baseRoute}`) ? "active" : ""}>
                            <Link to={`${baseRoute}`}>
                                <FaHome className="icon"/>
                                Про ОСББ
                            </Link>
                        </li>
                        <li className="parent">
                            <button className="dropdown-btn" onClick={() => setisOpenBuild(!isOpenBuild)}>
                                <FaKey className="icon"/>
                                Управління будинками
                                <FaChevronDown className={`chevron ${isOpenBuild ? "rotate" : ""}`}/>
                            </button>
                            {isOpenBuild && (
                                <ul className="submenu">
                                    <li className={isActive(`${baseRoute}/houses`) ? "active" : ""}>
                                        <Link to={`${baseRoute}/houses`}>
                                            <FaBuilding className="icon"/>
                                            Будинки
                                        </Link>
                                    </li>
                                    <li className={isActive(`${baseRoute}/apartments`) ? "active" : ""}>
                                        <Link to={`${baseRoute}/apartments`}>
                                            <FaHome className="icon"/>
                                            Квартири
                                        </Link>
                                    </li>
                                    <li className={isActive(`${baseRoute}/residents`) ? "active" : ""}>
                                        <Link to={`${baseRoute}/residents`}>
                                            <FaUsers className="icon"/>
                                            Мешканці
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className={isActive(`${baseRoute}/meter`) ? "active" : ""}>
                            <Link to={`${baseRoute}/meter`}>
                                <FaTachometerAlt className="icon"/>
                                Комунальні послуги
                            </Link>
                        </li>
                        <li className="parent">
                            <button className="dropdown-btn" onClick={() => setisOpenMoney(!isOpenMoney)}>
                                <FaWallet className="icon"/>
                                Фінансовий контроль
                                <FaChevronDown className={`chevron ${isOpenMoney ? "rotate" : ""}`}/>
                            </button>
                            {isOpenMoney && (
                                <div className="sub-li">
                                    <ul className="submenu">
                                        <li className={isActive(`${baseRoute}/paymenthistory`) ? "active" : ""}>
                                            <Link to={`${baseRoute}/paymenthistory`}>
                                                <FaHistory className="icon"/>
                                                Історія оплат
                                            </Link>
                                        </li>
                                        <li className={isActive(`${baseRoute}/debts`) ? "active" : ""}>
                                            <Link to={`${baseRoute}/debts`}>
                                                <FaExclamationCircle className="icon"/>
                                                Заборгованості
                                            </Link>
                                        </li>
                                        <li className={isActive(`${baseRoute}/expenses`) ? "active" : ""}>
                                            <Link to={`${baseRoute}/expenses`}>
                                                <FaChartPie className="icon"/>
                                                Облік витрат
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
                        <li className={isActive(`${baseRoute}/notifications`) ? "active" : ""}>
                            <Link to={`${baseRoute}/notifications`}>
                                <FaEnvelope className="icon"/>
                                Повідомлення
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

export default AccountantSidebar;
