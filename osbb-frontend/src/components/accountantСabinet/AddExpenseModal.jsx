import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { createExpense, updateExpense } from "../../api/expenseApi.jsx";
import { enqueueSnackbar } from "notistack";

const AddExpenseModal = ({ isOpen, onClose, onExpenseAdded, expenseData, editedExpenseId, osbbId }) => {
    const [formData, setFormData] = useState({
        osbbId: osbbId,
        expenseType: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        if (expenseData) {
            setFormData({
                osbbId: expenseData.osbbId,
                expenseType: expenseData.expenseType || "",
                description: expenseData.description || "",
                amount: expenseData.amount || "",
                date: expenseData.date ? new Date(expenseData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            });
        } else {
            setFormData({
                osbbId: osbbId,
                expenseType: "",
                description: "",
                amount: "",
                date: new Date().toISOString().split("T")[0],
            });
        }
    }, [expenseData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.expenseType || !formData.amount || !formData.date) {
            enqueueSnackbar("Всі поля є обов'язковими.", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
            return;
        }

        if (formData.amount <= 0) {
            enqueueSnackbar("Сума витрати повинна бути більше нуля.", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
            return;
        }

        try {
            if (editedExpenseId) {
                await updateExpense(editedExpenseId, formData);
                enqueueSnackbar("Витрату успішно оновлено.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
            } else {
                await createExpense(formData);
                enqueueSnackbar("Витрату успішно додано.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
                clearData();
            }
            onExpenseAdded();
        } catch (err) {
            enqueueSnackbar("Помилка при збереженні витрати: " + err, { variant: 'error', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        }
    };

    const clearData = () => {
        setFormData({
            osbbId: osbbId,
            expenseType: "",
            description: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
        });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="add-expense-modal" overlayClassName="overlay">
            <h2 className="expense-modal-title">{editedExpenseId ? "Редагувати витрату" : "Додати нову витрату"}</h2>
            <div className="modal-wrapper">
                <form onSubmit={handleSubmit}>
                    <label>
                        Тип витрати:
                        <input type="text" name="expenseType" value={formData.expenseType} onChange={handleChange}
                               required/>
                    </label>

                    <label>
                        Опис:
                        <textarea name="description" value={formData.description} onChange={handleChange}/>
                    </label>

                    <label>
                        Сума (грн):
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0.01"
                               step="0.01" required/>
                    </label>

                    <label>
                        Дата:
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required/>
                    </label>

                    <div className="modal-actions">
                        <button type="submit">{editedExpenseId ? "Зберегти зміни" : "Додати"}</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Закрити</button>
                    </div>
                </form>
            </div>
            <div className="form-bottom"></div>
        </Modal>
    );
};

export default AddExpenseModal;
