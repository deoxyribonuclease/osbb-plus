import React, { useState, useEffect } from "react";
import { getOSBBbyResidentId } from "../../api/osbbApi.jsx";
import { FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaRegFileAlt } from "react-icons/fa";
import "./styles/osbbInfoSection.css";
import MapComponent from "../layout/MapComponent.jsx";
import { enqueueSnackbar } from "notistack";
import {useOutletContext} from "react-router-dom";

const OSBBinfoSection = () => {
    const [osbbData, setOsbbData] = useState(null);
    const { userId } = useOutletContext();

    useEffect(() => {
        const fetchOSBBData = async () => {
            try {
                const data = await getOSBBbyResidentId( userId );
                setOsbbData(data);
            } catch (error) {
                enqueueSnackbar("Помилка при отриманні даних ОСББ:" + error, {
                    variant: "error",
                    autoHideDuration: 2000,
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        };

        fetchOSBBData();
    }, [userId]);

    if (!osbbData) {
        return <p>Завантаження...</p>;
    }

    return (
        <div className="osbbsection-info-container">
            <h1 className="osbb-title">🏢 Інформація про ОСББ</h1>
            <div className="content">
                <div className="left-column">
                    <div className="card">
                        <InfoField icon={<FaBuilding className="icon-inline"/>} label="Назва" value={osbbData.name} />
                        <InfoField icon={<FaMapMarkerAlt className="icon-inline"/>} label="Адреса" value={osbbData.address} />
                        <InfoField icon={<FaPhoneAlt className="icon-inline"/>} label="Контакт" value={osbbData.contact} />
                        <InfoField icon={<FaRegFileAlt className="icon-inline"/>} label="Опис" value={osbbData.details || "Інформації немає"} />
                    </div>
                </div>

                <div className="right-column">
                    <MapComponent address={osbbData.address} isEditing={false} />
                </div>
            </div>
            <div className="osbb-bottom"></div>
        </div>
    );
};

const InfoField = ({ icon, label, value }) => (
    <div className="field">
        <strong>
            <span className="icon-inline">{icon}</span>
            {label}
        </strong>
        <span>{value}</span>
    </div>
);

export default OSBBinfoSection;
