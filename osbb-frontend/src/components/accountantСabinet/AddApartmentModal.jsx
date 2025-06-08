import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { createApartment, updateApartment, createResidentAccount } from "../../api/apartmentApi.jsx";
import { FaSyncAlt } from "react-icons/fa";
import {deleteUser} from "../../api/userApi.jsx";
import {enqueueSnackbar} from "notistack";

const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const generateLogin = (apartmentNumber) => `кв${apartmentNumber}`;

const AddApartmentModal = ({ isOpen, onClose, onApartmentAdded, houseId, apartmentData, editedApartmentId }) => {
    const [formData, setFormData] = useState({
        houseId: houseId,
        number: "",
        area: "",
        roomNum: "",
    });

    const [generateAccount, setGenerateAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(generatePassword());
    const [login, setLogin] = useState("");
    const [hasAccount, setHasAccount] = useState(false);

    useEffect(() => {
        if (apartmentData) {
            setFormData({
                houseId: apartmentData.houseId,
                number: apartmentData.number,
                area: apartmentData.area,
                roomNum: apartmentData.roomNum,
            });

            if (generateAccount) {
                setLogin(generateLogin(apartmentData.number));
            }
        } else {
            setFormData({
                houseId: houseId,
                number: "",
                area: "",
                roomNum: "",
            });
            setLogin("");
        }
        setGenerateAccount(false);
        setEmail("");
        setPassword(generatePassword());
    }, [apartmentData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "number" && generateAccount) {
            setLogin(generateLogin(value));
        }
    };

    const handleCheckboxChange = () => {
        const newGenerateAccount = !generateAccount;
        setGenerateAccount(newGenerateAccount);

        if (newGenerateAccount && formData.number) {
            setLogin(generateLogin(formData.number));
        } else {
            setLogin("");
        }

        setPassword(generatePassword());
    };

    const regeneratePassword = () => {
        setPassword(generatePassword());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.number || !formData.area || !formData.roomNum) {
            enqueueSnackbar("Всі поля є обов'язковими.", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
            return;
        }

        try {
            let apartment;

            if (editedApartmentId) {
                apartment = await updateApartment(editedApartmentId, formData);
                enqueueSnackbar('Квартиру успішно редаговано.', { variant: 'success',
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right'} });
            } else {
                apartment = await createApartment(formData);
                enqueueSnackbar('Квартиру успішно створено.', { variant: 'success',
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right'} });
            }

            if (generateAccount) {
                await createResidentAccount(apartment.id, { login, email, password });
                setHasAccount(false);
                setGenerateAccount(false);
            }

            onApartmentAdded();
            clearData();
        } catch (err) {
            enqueueSnackbar('Помилка' + err, { variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right'} });
        }
    };


    useEffect(() => {
        if (apartmentData) {
            setHasAccount(!!apartmentData.userId);
        } else {
            setHasAccount(false);
        }
    }, [apartmentData]);

    const handleDeactivateAccount = async () => {
        try {
            if (apartmentData && apartmentData.userId) {
                await deleteUser(apartmentData.userId);
                setHasAccount(false);
                onApartmentAdded();
                enqueueSnackbar('Аккаунт деактивовано.', { variant: 'success',
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right'} });
            }
        } catch (error) {
            enqueueSnackbar("Не вдалося деактивувати акаунт"+ error, { variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right'} });
        }
    };

    const clearData = () => {
        setFormData({
            houseId: houseId,
            number: "",
            area: "",
            roomNum: "",
        });
        setLogin("");
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="add-apartment-modal" overlayClassName="overlay">
            <h2 className="add-apartment-title">
                {editedApartmentId ? "Редагувати квартиру" : "Додати нову квартиру"}
            </h2>
            <div className="modal-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-layout">
                        <label>
                            Номер квартири:
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                required
                                placeholder="Введіть номер квартири"
                            />
                        </label>
                        <label>
                            Площа (м²):
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                                placeholder="Площа квартири"
                            />
                        </label>
                        <label>
                            Кількість кімнат:
                            <input
                                type="number"
                                name="roomNum"
                                value={formData.roomNum}
                                onChange={handleChange}
                                required
                                placeholder="Кількість кімнат"
                            />
                        </label>


                            {hasAccount ? (
                                    <label className="checkbox-label">
                                    <button type="button" onClick={handleDeactivateAccount} className="deactivate-button">
                                        Деактивувати кабінет користувача
                                    </button>
                                    </label>
                            ) : (
                                <label className="checkbox-label">
                                    Створити кабінет користувача?
                                    <input type="checkbox" checked={generateAccount} onChange={handleCheckboxChange}/>
                                </label>

                            )}


                        {generateAccount && (
                            <>
                                <label>
                                    Логін:
                                    <input type="text" value={login} />
                                </label>
                                <label>
                                    Пошта:
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Введіть пошту"
                                    />
                                </label>
                                <label className="password-field">
                                    Пароль:
                                    <div className="password-container">
                                        <input type="text" value={password} readOnly />
                                        <button type="button" onClick={regeneratePassword} className="regen-button">
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                </label>
                            </>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="button">
                            {editedApartmentId ? "Редагувати" : "Додати"}
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                clearData();
                                onClose();
                            }}
                        >
                            Закрити
                        </button>
                    </div>
                </form>
            </div>
            <div className="form-bottom"></div>
        </Modal>
    );
};

export default AddApartmentModal;
