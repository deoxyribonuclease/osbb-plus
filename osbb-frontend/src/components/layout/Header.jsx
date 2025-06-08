import React from "react";
import "./styles/header.css"
import logo from "../../assets/logo.svg";

const Header = () => {
    return (
        <header>
            <a href="/" className="header-link">
                <img src={logo} className="logo" alt="ОСББ"/>
                <span style={{color: "#005081"}}>ОСББ</span>
                <span style={{color: "#638e32"}}>+ </span>
                <span className="separate">Керуємо будинком, дружимо з мешканцями</span>
            </a>

            <nav>
                <ul className="header-link">
                    <li><a href="/">Головна</a></li>
                    <li><a href="/news">Новини</a></li>
                    <li><a href="#contact">Контакти</a></li>
                    <a href="/login" className="login-button">Увійти</a>
                </ul>
            </nav>

        </header>
    );
};

export default Header;
