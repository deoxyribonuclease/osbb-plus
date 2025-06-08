import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { createResident, updateResident } from "../../api/residentApi.jsx";
import {enqueueSnackbar} from "notistack";


const AddResidentModal = ({ isOpen, onClose, onResidentAdded, apartmentId, residentData, editedResidentId }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        birthDate: "",
        passportData: "",
        taxNum: "",
        apartmentId: apartmentId
    });
    useEffect(() => {
        if (residentData) {
            const formattedBirthDate = residentData.birthDate
                ? new Date(residentData.birthDate).toISOString().split('T')[0]
                : "";

            setFormData({
                fullname: residentData.fullname,
                birthDate: formattedBirthDate,
                passportData: residentData.passportData,
                taxNum: residentData.taxNum,
                apartmentId: residentData.apartmentId
            });
        } else {
            setFormData({
                fullname: "",
                birthDate: "",
                passportData: "",
                taxNum: "",
                apartmentId: apartmentId
            });
        }
    }, [residentData, isOpen]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullname || !formData.birthDate || !formData.passportData || !formData.taxNum) {
            enqueueSnackbar("Всі поля є обов'язковими", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
            return;
        }

        try {
            if (editedResidentId) {
                await updateResident(editedResidentId, formData);
                enqueueSnackbar("Мешканця успішно оновлено.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
            } else {
                await createResident(formData);
                enqueueSnackbar("Мешканця успішно додано.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
            }

            onResidentAdded();
        } catch (err) {
            enqueueSnackbar("Помилка при обробці мешканця:"+ err, { variant: 'error', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        }
    };

    const clearData = () => {
        setFormData({
            fullname: "",
            birthDate: "",
            passportData: "",
            taxNum: "",
            apartmentId: apartmentId
        });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="add-resident-modal" overlayClassName="overlay">
            <h2 className="add-resident-title">
                {editedResidentId ? "Редагувати мешканця" : "Додати нового мешканця"}
            </h2>
            <div className="modal-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-layout">
                        <label>
                            ПІБ:
                            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                                   required/>
                        </label>
                        <label>
                            Дата народження:
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                                   required/>
                        </label>
                        <label>
                            Паспортні дані:
                            <input type="text" name="passportData" value={formData.passportData} onChange={handleChange}
                                   required/>
                        </label>
                        <label>
                            РНОКПП:
                            <input type="text" name="taxNum" value={formData.taxNum} onChange={handleChange} required/>
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="button">
                            {editedResidentId ? "Редагувати" : "Додати"}
                        </button>
                        <button type="button" className="cancel-button" onClick={() => {
                            clearData();
                            onClose();
                        }}>
                            Закрити
                        </button>
                    </div>
                </form>
            </div>
            <div className="form-bottom"></div>
        </Modal>
    );
};

export default AddResidentModal;
