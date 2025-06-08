import React, {useEffect, useState} from "react";
import {Outlet, useOutletContext} from "react-router-dom";
import "../components/accountantСabinet/styles/housesSection.css";
import AccountantSidebar from "../components/accountantСabinet/AccountantSidebar.jsx";
import Topbar from "../components/accountantСabinet/Topbar.jsx";
import {getOSBBsByUserId} from "../api/osbbApi.jsx";

const AccountantCabinetPage = () => {
    const { userId } = useOutletContext();
    const [osbbId, setOsbbId] = useState(null);
    const [osbbName, setOsbbName] = useState(null);
    useEffect(() => {
        const fetchOSBB = async () => {
            try {
                const data = await getOSBBsByUserId(userId);
                console.log('userId from OutletContext:', userId);
                setOsbbId(data[0]?.id);
                setOsbbName(data[0]?.name);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOSBB();

    }, [userId]);

    return (
        <div className="dashboard">
            <AccountantSidebar osbbName={osbbName} />
            <div className="main-content">
                <Topbar />
                <Outlet context={{ osbbId, userId }} />
            </div>
        </div>
    );
};

export default AccountantCabinetPage;
