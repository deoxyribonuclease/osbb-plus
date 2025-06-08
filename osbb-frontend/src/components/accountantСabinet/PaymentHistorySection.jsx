import React, { useEffect, useState } from "react";
import {
    FaMoneyBillWave,
    FaCheck,
    FaTimes,
    FaTrash,
    FaBolt,
    FaTint,
    FaFire,
    FaHome,
    FaTemperatureLow, FaQuestionCircle
} from "react-icons/fa";
import Table from "../layout/Table.jsx";
import "./styles/paymentSection.css"
import { getHouseByOSBBId} from "../../api/houseApi.jsx";
import { getApartmentsByHouse } from "../../api/apartmentApi.jsx";
import { getPaymentsByApartmentId, deletePayment } from "../../api/paymentApi.jsx";
import { enqueueSnackbar } from "notistack";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {useOutletContext} from "react-router-dom";

const PaymentHistorySection = () => {
    const [houses, setHouses] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [selectedPayments, setSelectedPayments] = useState({});
    const { osbbId } = useOutletContext();

    useEffect(() => {
        fetchHouses();
    }, [osbbId]);

    useEffect(() => {
        if (selectedHouseId) {
            fetchApartments(selectedHouseId);
        } else {
            setApartments([]);
        }
        setSelectedApartmentId(null);
        setPaymentHistory([]);
        setSelectedPayments({});
    }, [selectedHouseId]);

    useEffect(() => {
        if (selectedApartmentId) {
            fetchPaymentHistory(selectedApartmentId);
        } else {
            setPaymentHistory([]);
        }
        setSelectedPayments({});
    }, [selectedApartmentId]);

    const fetchHouses = async () => {
        try {
            const housesData = await getHouseByOSBBId(osbbId);
            setHouses(housesData);
        } catch (error) {
            console.error("Error fetching houses:", error);
        }
    };

    const fetchApartments = async (houseId) => {
        try {
            const apartmentsData = await getApartmentsByHouse(houseId);
            setApartments(apartmentsData);
        } catch (error) {
            console.error("Error fetching apartments:", error);
        }
    };

    const fetchPaymentHistory = async (apartmentId) => {
        try {
            const historyData = await getPaymentsByApartmentId(apartmentId);
            setPaymentHistory(historyData);
        } catch (error) {
            console.error("Error fetching payment history:", error);
        }
    };

    const handleHouseChange = (event) => {
        setSelectedHouseId(event.target.value);
    };

    const handleApartmentSelect = (apartment) => {
        setSelectedApartmentId(apartment.id);
    };

    const handleDeletePayments = async () => {
        try {
            const paymentIdsToDelete = Object.keys(selectedPayments);
            if (paymentIdsToDelete.length === 0) {
                alert("Будь ласка, виберіть платежі для видалення.");
                return;
            }
            for (const paymentId of paymentIdsToDelete) {
                await deletePayment(paymentId);
            }
            setSelectedPayments({});
            fetchPaymentHistory(selectedApartmentId);
            enqueueSnackbar("Платежі успішно видалено", { variant: "success" });
        } catch (error) {
            console.error("Error deleting payments:", error);
        }
    };

    const handleRowSelect = (payment) => {
        const newSelectedPayments = { ...selectedPayments };
        if (newSelectedPayments[payment.id]) {
            delete newSelectedPayments[payment.id];
        } else {
            newSelectedPayments[payment.id] = payment;
        }
        setSelectedPayments(newSelectedPayments);
    };



    const getMeterIcon = (type) => {
        switch (type) {
            case "Електроенергія":
                return <FaBolt style={{ color: "gold" }} />;
            case "Вода":
                return <FaTint style={{ color: "blue" }} />;
            case "Газ":
                return <FaFire style={{ color: "orange" }} />;
            case "Гроші":
                return <FaMoneyBillWave style={{ color: "green" }} />;
            case "Утримання будинку":
                return <FaHome style={{ color: "brown" }} />;
            case "Опалення":
                return <FaTemperatureLow style={{color: "red"}}/>;
            default:
                return <FaQuestionCircle style={{color: "black"}}/>;
        }
    };




    const paymentColumns = [
        {
            key: "meterType",
            label: "Тип платежу",
            render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {getMeterIcon(row.meterType)}
                    <span>{row.meterType}</span>
                </div>
            ),
        },
        {
            key: "sum",
            label: "Сума",
            render: (row) => `${row.sum?.toFixed(2) || "0.00"} грн`,
        },
        {
            key: "remToPay",
            label: "Залишилось до сплати",
            render: (row) => `${row.remToPay?.toFixed(2) || "0.00"} грн`,
        },
        {
            key: "date",
            label: "Дата",
        },
        {
            key: "status",
            label: "Статус",
            render: (row) =>
                row.status ? <FaCheck color="green" /> : <FaTimes color="red" />,
        },
    ];

    const apartmentColumns = [
        { key: "number", label: "Номер",   render: (row) => `№ ${row.number}`},
        { key: "area", label: "Площа ",   render: (row) => `${row.area} м²`},
        { key: "roomNum", label: "Кімнат" }
    ];

    const houseOptions = houses.map((house) => (
        <option key={house.id} value={house.id}>
            {house.address}
        </option>
    ));

    const prepareBarChartData = () => {
        const groupedData = paymentHistory.reduce((acc, payment) => {
            const meterType = ["Електроенергія", "Вода", "Газ", "Утримання будинку", "Опалення"].includes(payment.meterType)
                ? payment.meterType
                : "Інше";

            acc[meterType] = (acc[meterType] || 0) + payment.sum;
            return acc;
        }, {});

        return Object.keys(groupedData).map((key) => ({
            meterType: key,
            sum: groupedData[key],
        }));
    };

    const preparePieChartData = () => {
        return prepareBarChartData();
    };





    const [chartsVisible, setChartsVisible] = useState(false);
    const toggleCharts = () => {
        setChartsVisible(!chartsVisible);
    };

    const prepareDualBarChartData = () => {
        const groupedData = {};

        paymentHistory.forEach((payment) => {
            const meterType = ["Електроенергія", "Вода", "Газ", "Утримання будинку", "Опалення"].includes(payment.meterType)
                ? payment.meterType
                : "Інше";

            if (!groupedData[meterType]) {
                groupedData[meterType] = {
                    meterType,
                    paid: 0,
                    latestPayment: payment,
                };
            } else {
                const prevDate = new Date(groupedData[meterType].latestPayment.createdAt);
                const currDate = new Date(payment.createdAt);
                if (currDate > prevDate) {
                    groupedData[meterType].latestPayment = payment;
                }
            }

            groupedData[meterType].paid += payment.sum;
        });

        return Object.values(groupedData).map((item) => ({
            meterType: item.meterType,
            paid: item.paid,
            remaining: item.latestPayment.remToPay || 0,
        }));
    };




    const CATEGORY_COLORS = {
        "Утримання будинку": "#FF6666",
        "Вода": "#0088FE",
        "Газ": "#00C49F",
        "Електроенергія": "#FFBB28",
        "Опалення": "#FF8042"
    };


    return (
        <div className="payment-container">
            <div className="payment-page">
                <div className="left-table">
                    <h2 className="table-title">Квартири</h2>
                    <div className="dropdown-container">
                        <h3 className="tip-build-section">Оберіть будинок:</h3>
                        <select onChange={handleHouseChange} value={selectedHouseId || ""}>
                            <option value="" disabled>Виберіть будинок</option>
                            {houseOptions}
                        </select>
                    </div>
                    <Table
                        rowsPerPage={19}
                        columns={apartmentColumns}
                        data={apartments}
                        onRowClick={handleApartmentSelect}
                        showCheckboxColumn={false}
                        editedRowId={selectedApartmentId}
                    />
                </div>

                <div className="right-table">
                    <h2 className="table-title">
                        Історія
                        платежів {selectedApartmentId ? `| Квартира №${apartments.find(a => a.id === selectedApartmentId)?.number}` : ""}
                    </h2>
                    <div className="button-section">
                        <button
                            onClick={handleDeletePayments}
                            className="delete-button"
                            disabled={Object.keys(selectedPayments).length === 0 || !selectedApartmentId}
                        >
                            <FaTrash/> Видалити вибрані платежі
                        </button>
                        <button
                            onClick={toggleCharts}
                            className="approve-button"
                        >
                            {chartsVisible ? "Сховати графіки" : "Показати графіки"}
                        </button>
                    </div>
                    {!chartsVisible && (
                        <Table
                            rowsPerPage={19}
                            columns={paymentColumns}
                            data={paymentHistory}
                            selectedRows={selectedPayments}
                            setSelectedRows={setSelectedPayments}
                            onRowSelect={handleRowSelect}
                        />
                    )}
                    {chartsVisible && (
                        <div>
                            <div className="charts-container">
                                <div className="chart-item">
                                    <h3>Розподіл платежів</h3>
                                    {preparePieChartData().length > 0 ? (
                                        <ResponsiveContainer width="100%" height="110%">
                                            <PieChart>
                                                <Pie data={preparePieChartData()} dataKey="sum" nameKey="meterType"
                                                     outerRadius={100} label>
                                                    {preparePieChartData().map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={CATEGORY_COLORS[entry.meterType] || "#A28DFF"}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{textAlign: "center", paddingTop: "80px", color: "#888"}}>Немає
                                            даних для відображення</div>
                                    )}
                                </div>

                                <div className="chart-item-wide">
                                    <h3>Суми сплачених та залишкових платежів</h3>
                                    {prepareDualBarChartData().length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={prepareDualBarChartData()}
                                                      margin={{top: 20, right: 20, left: 0, bottom: 20}}>
                                                <XAxis dataKey="meterType" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="paid" name="Сплачено" fill="#4CAF50" />
                                                <Bar dataKey="remaining" name="Залишилось сплатити" fill="#FF5722" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{textAlign: "center", paddingTop: "90px", color: "#888"}}>Немає
                                            даних для відображення</div>
                                    )}
                                </div>
                            </div>
                            <div className="form-bottom"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default PaymentHistorySection;
