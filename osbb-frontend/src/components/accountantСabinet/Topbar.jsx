import React from "react";

import "./styles/topbar.css";

const Topbar = () => {
    return (
        <div className="topbar">
            <div><span style={{color: "#005081"}}>ОСББ</span>
                <span style={{color: "#638e32"}}>+ </span></div>
            <a href="/" className="logout-button">На головну</a>
        </div>
    );
};

export default Topbar;
