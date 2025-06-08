import React, {useEffect, useState} from "react";
import {Outlet, useOutletContext} from "react-router-dom";
import "../components/accountantСabinet/styles/housesSection.css";
import AccountantSidebar from "../components/accountantСabinet/AccountantSidebar.jsx";
import Topbar from "../components/accountantСabinet/Topbar.jsx";
import ResidentSidebar from "../components/residentCabinet/ResidentSidebar.jsx";
import {getApartmentByResidentId} from "../api/apartmentApi.jsx";

const ResidentCabinetPage = () => {

    const [apartmentId, setApartmentId] = useState(null);
    const [apartmentNum, setApartmentNum] = useState(null);
    const { userId } = useOutletContext();

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                const data = await getApartmentByResidentId(userId);
                setApartmentId(data[0]?.id);
                setApartmentNum(data[0]?.number)
            } catch (err) {
                console.error(err);
            }
        };
        fetchApartment();
    }, [userId]);

    return (
        <div className="dashboard">
            <ResidentSidebar apartmentNum={apartmentNum}/>
            <div className="main-content">
                <Topbar/>
                <Outlet context={{ apartmentId, userId  }}/>
            </div>
        </div>
    );
};

export default ResidentCabinetPage;
