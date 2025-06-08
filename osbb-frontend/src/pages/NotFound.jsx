import React from "react";
import { Link } from "react-router-dom";
import "./styles/notfound.css";

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-text">Упс! Сторінку не знайдено.</p>
            <Link to="/" className="not-found-button">На головну</Link>
        </div>
    );
};

export default NotFound;
