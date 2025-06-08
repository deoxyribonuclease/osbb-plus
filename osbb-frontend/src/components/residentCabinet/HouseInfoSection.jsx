import React, { useState, useEffect } from "react";
import { getHousebyResidentId } from "../../api/houseApi.jsx";
import "./styles/houseInfoSection.css";
import MapComponent from "../layout/MapComponent.jsx";
import { enqueueSnackbar } from "notistack";
import { FaMapMarkerAlt, FaDoorOpen, FaBuilding, FaHome, FaThLarge, FaRulerCombined } from "react-icons/fa";
import {useOutletContext} from "react-router-dom";
import HousePlaceholder from "../../assets/house-placeholder.jpg"

const HouseInfoSection = () => {
    const [houseData, setHouseData] = useState(null);
    const { userId } = useOutletContext();

    useEffect(() => {
        const fetchHouseData = async () => {
            try {
                const data = await getHousebyResidentId(userId);
                setHouseData(data);
            } catch (error) {
                enqueueSnackbar(`Помилка при отриманні даних будинку: ${error}`, {
                    variant: "error",
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            }
        };

        fetchHouseData();
    }, [userId]);

    if (!houseData) return <p>Завантаження...</p>;

    const apartment = houseData.Apartments[0];

    return (
        <div className="house-section-info-container">
            <h1 className="house-title">🏠 Інформація про Будинок та Квартиру</h1>
            <div className="content">
                <div className="left-column">
                    <strong>Зображення будинку</strong>
                    {houseData.image && (
                        <img src={houseData.image || HousePlaceholder} alt="Будинок" className="osbb-image"/>
                    )}
                    <div >
                        <strong>
                            <span className="icon-inline"><FaMapMarkerAlt className="icon-inline"/></span>
                            Адреса будинку
                        </strong>
                        <span>{houseData.address}</span>
                    </div>
                    <div className="card">
                        <InfoField icon={<FaDoorOpen className="icon-inline"/>} label="Кількість під'їздів"
                                   value={houseData.entNum}/>
                        <InfoField icon={<FaBuilding className="icon-inline"/>} label="Кількість поверхів"
                                   value={houseData.floorNum}/>
                        <InfoField icon={<FaHome className="icon-inline"/>} label="Номер вашої квартири"
                                   value={apartment.number}/>
                        <InfoField icon={<FaThLarge className="icon-inline"/>} label="Кількість кімнат"
                                   value={apartment.roomNum}/>
                        <InfoField icon={<FaRulerCombined className="icon-inline"/>} label="Площа квартири"
                                   value={`${apartment.area} м²`}/>
                    </div>
                </div>

                <div className="right-column">
                    <MapComponent address={houseData.address} isEditing={false}/>
                </div>
            </div>
            <div className="house-bottom"></div>
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


export default HouseInfoSection;
