import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {createHouse, updateHouse} from "../../api/houseApi.jsx";
import MapComponent from "../layout/MapComponent.jsx";
import {enqueueSnackbar} from "notistack";

const AddHouseModal = ({ isOpen, onClose, onHouseAdded, houseData, editedHouseId, osbbId  }) => {
    const [formData, setFormData] = useState({
        osbbId: osbbId,
        address: "",
        entNum: "",
        floorNum: "",
        appartNum: "",
        image: null,
    });
    const [pendingImages, setPendingImages] = useState([]);

    useEffect(() => {
        if (houseData) {
            setFormData({
                osbbId: houseData.osbbId,
                address: houseData.address || "",
                entNum: houseData.entNum || "",
                floorNum: houseData.floorNum || "",
                appartNum: houseData.appartNum || "",
                image: houseData.image || null,
            });
        } else {
            setFormData({
                osbbId: osbbId,
                address: "",
                entNum: "",
                floorNum: "",
                appartNum: "",
                image: null,
            });
        }
    }, [houseData, isOpen, osbbId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddressSelect = (newAddress) => {
        setFormData((prev) => ({ ...prev, address: newAddress }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!formData.address || !formData.entNum || !formData.floorNum || !formData.appartNum) {
            enqueueSnackbar("Всі поля, крім зображення, є обов'язковими", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
            return;
        }

        if (formData.entNum <= 0 || formData.floorNum <= 0 || formData.appartNum <= 0) {
            enqueueSnackbar("Значення повинні бути більше нуля ", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
            return;
        }

        try {
            if (editedHouseId) {
                await updateHouse(editedHouseId, formData);
                enqueueSnackbar("Будинок успішно оновлено.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
            } else {
                await createHouse(formData);
                enqueueSnackbar("Будинок успішно додано.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
                clearData();
            }
            onHouseAdded();
        } catch (err) {
            enqueueSnackbar("Помилка при створенні будинку: " + err, { variant: 'error', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        }
    };

    const clearData = () => {
        setPendingImages(null);
        setFormData({
            osbbId: osbbId ,
            address: "",
            entNum: "",
            floorNum: "",
            appartNum: "",
            image: null,
        });
    };

    const handleImageAdd = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const encodedImage = await encodeToBase64(file);
            setPendingImages([encodedImage]);
            setFormData(prevState => ({
                ...prevState,
                image: encodedImage
            }));
        }
    };

    const encodeToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="add-house-modal" overlayClassName="overlay">
            <h2 className="add-build-title"> {editedHouseId ? 'Редагувати обраний будинок' : 'Додати новий будинок'}</h2>
            <div className="modal-wrapper">

                <label>
                    Адреса:
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="textarea-input"
                        placeholder="Введіть адресу будинку або оберіть на мапі..."
                    />
                </label>

                {isOpen && (
                    <MapComponent address={formData.address} onAddressSelect={handleAddressSelect} isEditing={true}/>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-layout">
                        <div className="left-column">
                            <label>
                                Кількість під'їздів:
                                <input
                                    type="number"
                                    name="entNum"
                                    value={formData.entNum}
                                    onChange={handleChange}
                                    onInput={(e) => e.target.value = Math.max(1, e.target.value)}
                                    min="1"
                                    required
                                    placeholder="0"
                                />
                            </label>
                            <label>
                                Кількість поверхів:
                                <input
                                    type="number"
                                    name="floorNum"
                                    value={formData.floorNum}
                                    onChange={handleChange}
                                    onInput={(e) => e.target.value = Math.max(1, e.target.value)}
                                    min="1"
                                    required
                                    placeholder="0"
                                />
                            </label>
                            <label>
                                Кількість квартир:
                                <input
                                    type="number"
                                    name="appartNum"
                                    value={formData.appartNum}
                                    onChange={handleChange}
                                    onInput={(e) => e.target.value = Math.max(1, e.target.value)}
                                    min="1"
                                    required
                                    placeholder="0"
                                />
                            </label>
                        </div>

                        <div className="right-column">
                            <label>
                                Зображення(опціонально):
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageAdd}
                                />
                            </label>
                            {formData.image && <img src={formData.image} alt="House" className="preview-image"/>}

                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="button">
                            {editedHouseId ? 'Редагувати' : 'Додати'}
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

export default AddHouseModal;
