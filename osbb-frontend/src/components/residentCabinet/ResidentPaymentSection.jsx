import React, { useEffect, useState } from "react";
import {
    FaMoneyBillWave,
    FaCheck,
    FaTimes,
    FaBolt,
    FaTint,
    FaFire,
    FaHome,
    FaTemperatureLow, FaQuestionCircle
} from "react-icons/fa";
import Table from "../layout/Table.jsx";
import "./styles/residentPaymentSection.css";
import { getApartmentByResidentId } from "../../api/apartmentApi.jsx";
import { getPaymentsByApartmentId } from "../../api/paymentApi.jsx";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    Legend,
    XAxis,
    YAxis,
    Cell
} from "recharts";
import {useOutletContext} from "react-router-dom";

const ResidentPaymentSection = () => {
    const { userId } = useOutletContext();
    const [apartment, setApartment] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchApartmentAndPayments(userId);
        }
    }, [userId]);

    const fetchApartmentAndPayments = async (id) => {
        try {
            const apt = await getApartmentByResidentId(id);
            setApartment(apt[0]);
            console.log(apt)
            if (apt[0]?.id) {
                const payments = await getPaymentsByApartmentId(apt[0].id);
                setPaymentHistory(payments);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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

    const prepareChartData = () => {
        const grouped = {};
        paymentHistory.forEach((payment) => {
            const meterType = ["Електроенергія", "Вода", "Газ", "Утримання будинку", "Опалення"].includes(payment.meterType)
                ? payment.meterType
                : "Інше";

            if (!grouped[meterType]) {
                grouped[meterType] = { meterType, paid: 0, remaining: 0 };
            }

            grouped[meterType].paid += payment.sum;
            grouped[meterType].remaining = payment.remToPay;
        });

        return Object.values(grouped);
    };


    const CATEGORY_COLORS = {
        "Утримання будинку": "#FF6666",
        "Вода": "#0088FE",
        "Газ": "#00C49F",
        "Електроенергія": "#FFBB28",
        "Опалення": "#FF8042"
    };

    return (
        <div className="resident-payment-container">
            <div className="payment-page">
                <div className="left-table">
                    <h2 className="table-title">Платежі квартири {apartment ? `№${apartment.number}` : ""}</h2>
                    <Table
                        rowsPerPage={20}
                        columns={paymentColumns}
                        data={paymentHistory}
                        showCheckboxColumn={false}
                    />
                </div>

                <div className="right-table">
                    <h2 className="table-title">Графіки</h2>


                    <div className="charts-container">
                        <div className="chart-item">
                            <h3>Розподіл платежів</h3>
                            {prepareChartData().length > 0 ? (
                                <ResponsiveContainer width="100%" height="115%">
                                    <PieChart>
                                        <Pie data={prepareChartData()} dataKey="paid" nameKey="meterType"
                                             outerRadius={110} label>
                                            {prepareChartData().map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={CATEGORY_COLORS[entry.meterType] || "#A28DFF"}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{textAlign: "center", paddingTop: "80px", color: "#888"}}>Немає
                                    даних для відображення</div>
                            )}
                        </div>
                        <div className="chart-item-wide">
                            <h3>Сплачені та залишкові платежі</h3>
                            {prepareChartData().length > 0 ? (
                                <ResponsiveContainer width="100%" height="105%">
                                    <BarChart data={prepareChartData()}
                                              margin={{top: 20, right: 20, left: 0, bottom: 20}}>
                                        <XAxis dataKey="meterType"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="paid" name="Сплачено" fill="#4CAF50"/>
                                        <Bar dataKey="remaining" name="Залишилось сплатити" fill="#FF5722"/>
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

            </div>
        </div>
    );
};

export default ResidentPaymentSection;
