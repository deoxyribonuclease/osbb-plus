import React, { useState } from "react";
import Modal from "react-modal";
import { createRepairApplication } from "../../api/repairApplicationApi.jsx";
import { enqueueSnackbar } from "notistack";
import {useOutletContext} from "react-router-dom";

const AddRepairApplicationModal = ({ isOpen, onClose, onApplicationAdded }) => {

    const { apartmentId } = useOutletContext();
    const [formData, setFormData] = useState({
        apartmentId: apartmentId,
        title: "",
        description: "",
        image: null,
        status: "pending",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            enqueueSnackbar("Заголовок та опис є обов'язковими полями", {
                variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            return;
        }
        console.log(formData)

        try {
            await createRepairApplication(formData);
            enqueueSnackbar("Заявку успішно додано.", {
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            clearData();
            onApplicationAdded();
            onClose();
        } catch (err) {
            enqueueSnackbar("Помилка при створенні заявки: " + err, {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    const clearData = () => {
        setFormData({
            apartmentId: apartmentId,
            title: "",
            description: "",
            image: null,
            status: "pending",
        });
    };

    const handleImageAdd = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const encodedImage = await encodeToBase64(file);
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
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="add-application-modal"
            overlayClassName="overlay"
            ariaHideApp={false}
        >
            <h2 className="add-build-title">Додати нову заявку</h2>
            <div className="modal-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-layout">
                        <div className="left-column">
                            <label>
                                Заголовок:
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Введіть заголовок заявки"
                                />
                            </label>

                            <label>
                                Опис:
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="textarea-input"
                                    placeholder="Опишіть проблему детально..."
                                    rows={5}
                                />
                            </label>
                        </div>

                        <div className="right-column">
                            <label>
                                Зображення (опціонально):
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageAdd}
                                />
                            </label>
                            {formData.image && (
                                <div style={{
                                    marginTop: "10px",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                    <img src={formData.image} alt="Repair issue" className="preview-image"/>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        style={{marginTop: "5px", padding: "5px", width: "auto"}}
                                        onClick={() => setFormData(prev => ({...prev, image: null}))}
                                    >
                                        Видалити зображення
                                    </button>
                                </div>


                            )}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="button">
                            Додати
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

export default AddRepairApplicationModal;