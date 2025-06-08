import React, { useState, useEffect } from "react";
import { getOSBBById, updateOSBB } from "../../api/osbbApi.jsx";
import { FaQuestionCircle } from "react-icons/fa";
import "./styles/osbbSection.css";
import MapComponent from "../layout/MapComponent.jsx";
import {enqueueSnackbar} from "notistack";
import Loader from "../layout/Loader.jsx";
import {useOutletContext} from "react-router-dom";

const OBBSection = () => {
    const [osbbData, setOsbbData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const { osbbId } = useOutletContext();

    useEffect(() => {
        if (!osbbId) return;
        let isMounted = true;
        const fetchOSBBData = async () => {
            try {
                const data = await getOSBBById(osbbId);
                if (isMounted) {
                    setOsbbData(data);
                    setFormData(data);
                }
            } catch (error) {
                enqueueSnackbar("Помилка при отриманні даних ОСББ: " + error, {
                    variant: 'error',
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        };

        fetchOSBBData();

        return () => { isMounted = false; }
    }, [osbbId]);


    useEffect(() => {
        if (!isEditing) {
            setFormData(osbbData);
        }
    }, [isEditing, osbbData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedData = await updateOSBB(osbbId, formData);
            setOsbbData(updatedData);
            setIsEditing(false);
            enqueueSnackbar("ОСББ успішно оновлено.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        } catch (error) {
            enqueueSnackbar("Помилка при оновленні ОСББ:" + error, { variant: 'error', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        }
    };

    const handleAddressSelect = (newAddress) => {
        setFormData((prev) => ({ ...prev, address: newAddress }));
    };

    if (!osbbData) {
        return <Loader/>;
    }

    return (
        <div className="osbbsection-container">
            <h1 className="osbb-title">{isEditing ? "Редагувати ОСББ" : "Інформація про ОСББ"}</h1>
            <div className="content">
                <div className="left-column">
                    <div className="card">
                        <div className="field">
                            <strong>Назва</strong>
                            {isEditing ? (
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                       className="input"/>
                            ) : (
                                <span>{osbbData.name}</span>
                            )}
                        </div>
                        <div className="field">
                            <strong>Адреса <span className="red-star">*</span></strong>
                            {isEditing ? (
                                <textarea name="address" value={formData.address} onChange={handleInputChange}
                                          className="textarea-input"/>
                            ) : (
                                <span>{osbbData.address}</span>
                            )}
                        </div>
                        <div className="field">
                            <strong>Контакт <span className="red-star">**</span></strong>
                            {isEditing ? (
                                <input type="text" name="contact" value={formData.contact} onChange={handleInputChange}
                                       className="input"/>
                            ) : (
                                <span>{osbbData.contact}</span>
                            )}
                        </div>
                        <div className="field">
                            <strong>Опис</strong>
                            {isEditing ? (
                                <textarea name="details" value={formData.details} onChange={handleInputChange}
                                          className="textarea-input"/>
                            ) : (
                                <span>{osbbData.details || "Інформаціє немає"}</span>
                            )}
                        </div>
                        <div className="field">
                            <strong>Статус <span className="red-star">***</span></strong>
                            <span
                                className={osbbData.status === 'Unverified' ? 'red' : 'green'}>{osbbData.status}</span>
                        </div>
                        <div className="buttons">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="button">Зберегти</button>
                                    <button onClick={() => setIsEditing(false)}
                                            className="button cancel-button">Скасувати
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="button">Редагувати</button>
                            )}
                        </div>
                        <FaQuestionCircle className="icon"/>
                        <div className="field-description">
                            <p><span className="red-star">* </span>
                                Ви можете обрати адресу на мапі натисканням лівої кнопки миші під час редагування. Якщо
                                адреса
                                неправильна, її можна виправити вручну. Виправлені вручну дані можуть некоректно
                                відображатися на мапі.
                            </p>
                            <p><span className="red-star">** </span>
                                Ці контактні дані будуть відображатися в кабінеті мешканця, за ними мешканці зможуть
                                зв'язатися напряму.
                            </p>
                            <p><span className="red-star">*** </span>
                                Відображає поточний стан ОСББ: Unverified — не підтверджений, Verified — підтверджений.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="right-column">
                    <MapComponent address={formData.address} onAddressSelect={handleAddressSelect}
                                  isEditing={isEditing}/>
                </div>
            </div>
            <div className="osbb-bottom"></div>
        </div>
    );
};

export default OBBSection;
