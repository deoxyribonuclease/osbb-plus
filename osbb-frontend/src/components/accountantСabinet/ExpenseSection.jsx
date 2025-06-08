import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import Table from "../layout/Table.jsx";
import "./styles/expenseSection.css";
import { getExpensesByOsbbId, deleteExpense } from "../../api/expenseApi.jsx";
import { enqueueSnackbar } from "notistack";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as BarChartTooltip,
    Legend as BarChartLegend
} from "recharts";
import AddExpenseModal from "./AddExpenseModal.jsx";
import {useOutletContext} from "react-router-dom";


const ExpenseSection = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedExpense, setEditedExpense] = useState(null);
    const { osbbId } = useOutletContext();

    useEffect(() => {
        fetchExpenses();
    }, [osbbId]);

    const fetchExpenses = async () => {
        try {
            const expensesData = await getExpensesByOsbbId(osbbId);
            setExpenses(expensesData);
        } catch (error) {
            console.error("Помилка завантаження витрат:", error);
        }
    };

    const handleDeleteExpenses = async () => {
        try {
            setIsModalOpen(false);
            setEditedExpense(null);
            const expenseIdsToDelete = Object.keys(selectedExpenses);
            if (expenseIdsToDelete.length === 0) {
                alert("Будь ласка, виберіть витрати для видалення.");
                return;
            }
            for (const expenseId of expenseIdsToDelete) {
                await deleteExpense(expenseId);
            }
            setSelectedExpenses({});
            fetchExpenses();
            enqueueSnackbar("Витрати успішно видалено", { variant: "success" });
        } catch (error) {
            console.error("Помилка видалення витрат:", error);
        }
    };

    const handleRowSelect = (expense) => {
        const newSelectedExpenses = { ...selectedExpenses };
        if (newSelectedExpenses[expense.id]) {
            delete newSelectedExpenses[expense.id];
        } else {
            newSelectedExpenses[expense.id] = expense;
        }
        setSelectedExpenses(newSelectedExpenses);
    };

    const openModal = (expense = null) => {
        setEditedExpense(expense);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditedExpense(null);
    };

    const prepareChartData = () => {
        const groupedData = expenses.reduce((acc, expense) => {
            acc[expense.expenseType] = (acc[expense.expenseType] || 0) + expense.amount;
            return acc;
        }, {});

        return Object.keys(groupedData).map((key) => ({
            expenseType: key,
            amount: groupedData[key],
        }));
    };

    const COLORS = [
        "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666", "#4CAF50", "#D81B60"
    ];

    const handleEditExpenses = (expense) => {
        if (editedExpense && editedExpense.id === expense.id) {
            setEditedExpense(null);
            setIsModalOpen(false);
        } else {
            setEditedExpense(expense);
            setIsModalOpen(true);
        }
    };

    const CustomLegend = () => (
        <div style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>
            Витрати
        </div>
    );

    return (
        <div className="expense-container">
            <div className="expense-page">
                <div className="left-table">
                    <h2 className="table-title">Витрати ОСББ</h2>
                    <div className="button-section">
                        <button
                            className="add-button" onClick={() => openModal()}
                        >
                            <FaPlus className="icon" /> Додати витрату
                        </button>
                        <button
                            onClick={handleDeleteExpenses}
                            className="delete-button"
                            disabled={Object.keys(selectedExpenses).length === 0}
                        >
                            <FaTrash className="icon" /> Видалити обрані витрати
                        </button>
                    </div>
                    <Table
                        rowsPerPage={19}
                        columns={[
                            { key: "expenseType", label: "Тип витрати" },
                            { key: "description", label: "Опис" },
                            { key: "amount", label: "Сума", render: (row) => `${row.amount?.toFixed(2)} грн` },
                            { key: "date", label: "Дата", render: (row) => new Date(row.date).toLocaleDateString() }
                        ]}
                        data={expenses}
                        selectedRows={selectedExpenses}
                        setSelectedRows={setSelectedExpenses}
                        onRowSelect={handleRowSelect}
                        onRowClick={handleEditExpenses}
                        editedRowId={editedExpense?.id}
                    />
                </div>

                <div className="right-table">
                    <h2 className="table-title">Деталі витрат</h2>
                    <div className="charts-container">
                        <div className="chart-item">
                            <h3>Розподіл витрат</h3>
                            <ResponsiveContainer width="100%" height="120%">
                                <PieChart>
                                    <Pie data={prepareChartData()} dataKey="amount" nameKey="expenseType"
                                         outerRadius={100} label>
                                        {prepareChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <CustomLegend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-item" style={{marginTop:"28px"}}>
                            <h3>Розподіл витрат</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={prepareChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="expenseType" />
                                    <YAxis />
                                    <BarChartTooltip />
                                    <BarChartLegend />
                                    <Bar dataKey="amount" name="Сума" fill="#8884d8" />

                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="form-bottom"></div>
                </div>
            </div>
            <AddExpenseModal isOpen={isModalOpen} osbbId={osbbId} onClose={closeModal} onExpenseAdded={fetchExpenses} expenseData={editedExpense} editedExpenseId={editedExpense?.id} />
        </div>
    );
};

export default ExpenseSection;
