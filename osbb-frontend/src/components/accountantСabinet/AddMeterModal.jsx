import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { createMeter, updateMeter } from "../../api/meterApi.jsx";
import { getRepairApplicationsByOsbb } from "../../api/repairApplicationApi.jsx";
import { enqueueSnackbar } from "notistack";
import {useOutletContext} from "react-router-dom";
import {createPayment} from "../../api/paymentApi.jsx";

const meterTypes = ["Вода", "Газ", "Електроенергія", "Утримання будинку", "Опалення"];
const paymentTypes = ["Комунальний", "Одноразовий"];

const MeterModal = ({ isOpen, onClose, onMeterUpdated, apartmentId, meterData, editedMeterId }) => {
    const [formData, setFormData] = useState({
        apartmentId: apartmentId,
        prevIndicators: "",
        currIndicators: "",
        meterType: "",
        date: "",
        rate: "",
        paymentType: "Комунальний",
        paymentName: "",
        amountDue: "",
        repairApplicationId: null
    });
    const { osbbId } = useOutletContext();
    const [repairApplications, setRepairApplications] = useState([]);

    useEffect(() => {
        if (isOpen && osbbId) {
            const fetchRepairApplications = async () => {
                try {
                    const applications = await getRepairApplicationsByOsbb(osbbId);
                    setRepairApplications(
                        applications.filter(app => app.status === "in_progress")
                    );
                } catch (error) {
                    enqueueSnackbar('Помилка завантаження заявок на ремонт ' + error, {
                        variant: 'error',
                        autoHideDuration: 2000,
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                }
            };
            fetchRepairApplications();
        }

        if (meterData) {
            setFormData({
                apartmentId: meterData.apartmentId,
                prevIndicators: meterData.prevIndicators || "",
                currIndicators: meterData.currIndicators || "",
                meterType: meterData.meterType || "",
                date: meterData.date ? new Date(meterData.date).toISOString().split('T')[0] : "",
                rate: meterData.rate || "",
                paymentType: meterData.paymentType || "Комунальний",
                paymentName: meterData.paymentName || "",
                amountDue: meterData.amountDue || "",
                repairApplicationId: meterData.repairApplicationId || null
            });
        } else {
            setFormData({
                apartmentId: apartmentId,
                prevIndicators: "",
                currIndicators: "",
                meterType: "",
                date: "",
                rate: "",
                paymentType: "Комунальний",
                paymentName: "",
                amountDue: "",
                repairApplicationId: null
            });
        }
    }, [meterData, isOpen, osbbId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'paymentType' && value === 'Одноразовий' ? { repairApplicationId: null } : {})
        }));

        if (name === "currIndicators" && formData.prevIndicators !== "") {
            const consumption = parseFloat(value) - parseFloat(formData.prevIndicators);
            setFormData(prev => ({
                ...prev,
                consumption: consumption >= 0 ? consumption : 0
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields =
            formData.paymentType === 'Одноразовий'
                ? ['paymentName', 'amountDue']
                : ['currIndicators', 'meterType', 'date'];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0 && formData.paymentType !== 'Одноразовий') {
            enqueueSnackbar('Всі обов\'язкові поля мають бути заповнені', {
                variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
            return;
        }

        try {
            if (formData.paymentType === 'Одноразовий') {
                const meterType = formData.repairApplicationId
                    ? `Заявка №${formData.repairApplicationId} - ${repairApplications.find(app => app.id === parseInt(formData.repairApplicationId))?.title || 'Заявка'}`
                    : formData.paymentName;
                await createPayment({
                    apartmentId: formData.apartmentId,
                    sum: parseFloat(formData.amountDue),
                    meterType: meterType
                })
                enqueueSnackbar('Одноразовий платіж успішно створено.', {
                    variant: 'success',
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            } else {
                if (editedMeterId) {
                    await updateMeter(editedMeterId, formData);
                    enqueueSnackbar('Лічильник успішно оновлено.', {
                        variant: 'success',
                        autoHideDuration: 2000,
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                } else {
                    await createMeter(formData);
                    enqueueSnackbar('Лічильник успішно додано.', {
                        variant: 'success',
                        autoHideDuration: 2000,
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                }
            }
            onMeterUpdated();
            onClose();
        } catch (err) {
            enqueueSnackbar("Помилка при обробці платежу: " + err, {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        }
    };


    const clearData = () => {
        setFormData({
            apartmentId: apartmentId,
            prevIndicators: "",
            currIndicators: "",
            meterType: "",
            date: "",
            rate: "",
            paymentType: "Комунальний",
            paymentName: "",
            amountDue: "",
            repairApplicationId: null
        });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="meter-modal" overlayClassName="overlay">
            <h2 className="modal-title">
                {editedMeterId ? "Редагувати лічильник" : "Додати новий лічильник"}
            </h2>
            <div className="modal-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-layout">
                        {/* Тип платежу */}
                        <label>
                            Тип платежу:
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                            >
                                {paymentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {formData.paymentType === 'Одноразовий' ? (
                            <>
                                <label>
                                    Пов'язана заявка на ремонт:
                                    <select
                                        name="repairApplicationId"
                                        value={formData.repairApplicationId || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Оберіть заявку (необов'язково)</option>
                                        {repairApplications.map((app) => (
                                            <option key={app.id} value={app.id}>
                                                {`№${app.id} - ${app.title}`}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {!formData.repairApplicationId && (
                                    <label>
                                        Назва платежу:
                                        <input
                                            type="text"
                                            name="paymentName"
                                            value={formData.paymentName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                )}

                                <label>
                                    Сума платежу:
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="amountDue"
                                        value={formData.amountDue}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </>
                        ) : (
                            <>
                                <label>
                                    Попередні показники:
                                    <input
                                        type="number"
                                        name="prevIndicators"
                                        value={formData.prevIndicators}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Поточні показники:
                                    <input
                                        type="number"
                                        name="currIndicators"
                                        value={formData.currIndicators}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Тип лічильника:
                                    <select
                                        name="meterType"
                                        value={formData.meterType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Оберіть тип</option>
                                        {meterTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Дата:
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Тариф (необов'язково):
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="rate"
                                        value={formData.rate}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Споживання:
                                    <input
                                        type="number"
                                        value={formData.consumption || 0}
                                        disabled
                                    />
                                </label>
                            </>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="button">
                            {editedMeterId ? "Редагувати" : "Додати"}
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

export default MeterModal;