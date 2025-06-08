import React, { useEffect, useState } from "react";
import {getHouseByOSBBId} from "../../api/houseApi.jsx";
import { getApartmentsByHouse } from "../../api/apartmentApi.jsx";
import {deleteBalance, getBalanceByApartmentId, getDebt} from "../../api/paymentApi.jsx";
import Table from "../layout/Table.jsx";
import jsPDF from "jspdf";
import "./styles/debtSection.css"
import "jspdf-autotable";
import "../../assets/fonts/Roboto-Regular-normal.js";
import "./styles/paymentSection.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import autoTable from "jspdf-autotable";
import {enqueueSnackbar} from "notistack";
import {createNotification} from "../../api/notificationApi.jsx";
import {
    FaBolt,
    FaFire,
    FaHome,
    FaMoneyBillWave,
    FaQuestionCircle,
    FaTemperatureLow,
    FaTimes,
    FaTint
} from "react-icons/fa";
import {FaGear, FaMessage} from "react-icons/fa6";
import ReactModal from "react-modal";
import {useOutletContext} from "react-router-dom";

const DebtSection = () => {
    const [houses, setHouses] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState(null);
    const [selectedHouseAddress, setSelectedHouseAddress] = useState("");
    const [apartments, setApartments] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reminderMessage, setReminderMessage] = useState(
        "Нагадуємо вам про необхідність сплати комунальних послуг. Сума боргу: "
    );
    const [debtModalIsOpen, setDebtModalIsOpen] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [apartmentDebts, setApartmentDebts] = useState([]);
    const { osbbId } = useOutletContext();



    useEffect(() => {
        fetchHouses();
    }, [osbbId]);

    useEffect(() => {
        if (selectedHouseId) {
            const house = houses.find(h => h.id === Number(selectedHouseId));
            setSelectedHouseAddress(house ? house.address : "");
            fetchApartments(selectedHouseId);
        } else {
            setApartments([]);
            setSelectedHouseAddress("");
        }
    }, [selectedHouseId, houses,apartmentDebts ]);


    const handleSendReminder = async () => {
        if (!apartments || apartments.length === 0) {
            enqueueSnackbar('Немає квартир для нагадування.', { variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            return;
        }

        const userIds = apartments
            .filter(apartment => apartment.userId)
            .map(apartment => apartment.userId);

        if (userIds.length === 0) {
            enqueueSnackbar('Немає користувачів для нагадування.', { variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' }});
            return;
        }

        const notificationData = {
            title: "Нагадування про сплату комунальних послуг",
            text: reminderMessage,
            date: new Date().toISOString(),
            userIds: userIds
        };

        try {
            await createNotification(notificationData);
            enqueueSnackbar('Сповіщення успішно надіслано!', { variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right'} });
        } catch (error) {
            enqueueSnackbar('Не вдалося надіслати сповіщення.' + error, { variant: 'error' ,
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right'}});
        }
    };
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
            const withDebts = [];
            for (const apt of apartmentsData) {
                const debt = await getDebt(apt.id);
                if (debt.totalSum > 0) {
                    withDebts.push({ ...apt, totalDebt: debt.totalSum });
                }
            }
            setApartments(withDebts);
        } catch (error) {
            console.error("Error fetching apartments:", error);
        }
    };



    const generatePDF = () => {

        if(!selectedHouseId){
            enqueueSnackbar('Оберiть будинок', { variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right'} });
            return;
        }
        const doc = new jsPDF();

        doc.setFont("Roboto-Regular");

        const text2 = "Шановний(а) власнику/користувачу житлового приміщення!";
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(text2);
        const x = (pageWidth - textWidth) / 2;
        const y = 20;
        doc.text(text2, x, y);
        doc.setLineWidth(0.5);
        doc.line(x, y + 1, x + textWidth, y + 1);

        doc.setFontSize(10);
        const text = 'Адреса будинку: ' + selectedHouseAddress;
        const maxWidth = 180;
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, 14, 30);
        doc.setFontSize(14);
        doc.setFont(undefined, "normal");

        doc.setFontSize(12);
        doc.setFont(undefined, "normal");

        const text3 = "У вас утворилася заборгованість за надані житлово-комунальні послуги.";
        const textWidth3 = doc.getTextWidth(text3);
        const x2 = (pageWidth - textWidth3) / 2;
        const y2 = 45;
        doc.text(text3, x2, y2);

        const tableColumn = ["Квартира", "Заборгованість (грн)"];
        const tableRows = apartments.map(apt => [
            `Кв. ${apt.number}`,
            `${apt.totalDebt.toFixed(2)}`
        ]);

        const marginTop = 50;
        const tableHeight = 10 * tableRows.length + 20;
        const availableHeight = doc.internal.pageSize.height - marginTop - 20;


        let fontSize = 11;
        if (tableHeight > availableHeight) {
            fontSize = 9;
        }

        autoTable(doc, {
            startY: marginTop,
            head: [tableColumn],
            body: tableRows,
            styles: {
                font: "Roboto-Regular",
                fontSize: fontSize,
                lineWidth: 0.1,
                lineColor: [0, 0, 0]
            },
            headStyles: {
                font: "Roboto-Regular",
                fontStyle: 'normal',
                textColor: [0, 0, 0],
                lineWidth: 0.5,
                fontSize: 14,
                fillColor: false,
                halign: 'center',
            },
            bodyStyles: { halign: "center" },
            margin: { left: 14, right: 14 },
            tableLineWidth: 0.1,
            tableLineColor: [0, 0, 0]
        });

        const finalY = doc.lastAutoTable.finalY + 10;


        doc.setFontSize(14);
        const text4 = `Сума заборгованості вказана станом на ${new Date().toLocaleDateString()}.`;
        const textWidth4 = doc.getTextWidth(text4);
        const x4 = (pageWidth - textWidth4) / 2;
        doc.text(text4, x4, finalY);



        doc.setFontSize(11);
        doc.text("З питань оплати заборгованості необхідно звернутися до юридичного відділу.", 14, finalY + 8);
        doc.text("Адреса електронної пошти: example@email.com", 14, finalY + 24);

        doc.setFontSize(12);
        doc.text("ОСББ 'аааа'", 14, finalY + 30);

        doc.save(`заборгованість_${selectedHouseAddress}.pdf`);
    };


    const handleDeletePayment = async (paymentId) => {
        try {
            await deleteBalance(paymentId);
            enqueueSnackbar('Платіж успішно видалено!', {
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            const updatedDebts = apartmentDebts.filter(debt => debt.id !== paymentId);
            setApartmentDebts(updatedDebts);
        } catch (error) {
            enqueueSnackbar('Не вдалося видалити платіж.', {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
        }
    };


    const openDebtModal = async (apartment) => {
        setSelectedApartment(apartment);
        try {
            const debtDetails = await getBalanceByApartmentId(apartment.id);
            const filteredDebts = debtDetails.filter(debt => debt.sum > 0);
            setApartmentDebts(filteredDebts);
            setDebtModalIsOpen(true);
        } catch (error) {
            console.error("Error fetching debt details:", error);
        }
    };



    const prepareDebtPieChart = () => {
        return apartments.map((apt) => ({
            name: `№${apt.number}`,
            value: apt.totalDebt,
        }));
    };

    const handleHouseChange = (event) => {
        setSelectedHouseId(event.target.value);
    };

    const apartmentColumns = [
        { key: "number", label: "Номер", render: (row) => `№ ${row.number}` },
        { key: "area", label: "Площа ", render: (row) => `${row.area} м²` },
        { key: "roomNum", label: "Кімнат" },
        { key: "totalDebt", label: "Борг", render: (row) => `${row.totalDebt.toFixed(2)} грн` },
        {
            key: "userId",
            label: "Кабінет",
            render: (row) => row.userId ? "✔️" : "❌"
        }
    ];

    const COLORS = [
        "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666", "#4CAF50", "#D81B60"
    ];

    const houseOptions = houses.map((house) => (
        <option key={house.id} value={house.id}>
            {house.address}
        </option>
    ));

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

    const totalDebt = apartments.reduce((sum, apt) => sum + apt.totalDebt, 0);
    const numberOfApartmentsWithDebt = apartments.length;
    const largestDebtor = apartments.reduce((max, apt) => apt.totalDebt > max.totalDebt ? apt : max, { totalDebt: 0 });

    return (
        <div className="debt-container">
            <div className="payment-page">
                <div className="left-table">
                    <h2 className="table-title">Квартири з боргами</h2>
                    <div className="dropdown-container">
                        <h3 className="tip-build-section">Оберіть будинок:</h3>
                        <select onChange={handleHouseChange} value={selectedHouseId || ""}>
                            <option value="" disabled>Виберіть будинок</option>
                            {houseOptions}
                        </select>
                    </div>
                    <div className="button-section">
                        <button onClick={generatePDF} className="approve-button">
                            Згенерувати PDF боржників
                        </button>
                        <button onClick={() => setModalIsOpen(true)} className="add-button">
                            <FaGear className="icon" /> Додаткові опції
                        </button>
                        <ReactModal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            className="modal-content"
                            overlayClassName="modal-overlay"
                            ariaHideApp={false}
                        >
                            <h2>Додаткові опції</h2>
                            <div className="modal-border">
                                <label htmlFor="reminder-message" className="input-label">Текст нагадування:</label>
                                <div className="input-group">

                                <textarea
                                    id="reminder-message"
                                    value={reminderMessage}
                                    onChange={(e) => setReminderMessage(e.target.value)}
                                    className="input-textarea"
                                    rows="3"
                                />
                                    <button onClick={handleSendReminder} className="reminder-button">
                                        <FaMessage/> Надіслати нагадування
                                    </button>
                                </div>
                                <label htmlFor="reminder-message" className="input-label">
                                    <span className="red-star">* </span>
                                    Нагадування будуть надіслані тільки тим квартирам, в яких є обліковий запис.
                                </label>
                            </div>

                            <div className="buttons-container">
                                <button onClick={() => setModalIsOpen(false)} className="close-button">
                                    <FaTimes/> Закрити
                                </button>
                            </div>
                        </ReactModal>
                    </div>
                    <Table
                        rowsPerPage={18}
                        columns={apartmentColumns}
                        data={apartments}
                        showCheckboxColumn={false}
                        onRowClick={openDebtModal}
                        editedRowId={null}
                    />
                    <ReactModal
                        isOpen={debtModalIsOpen}
                        onRequestClose={() => setDebtModalIsOpen(false)}
                        className="modal-content"
                        overlayClassName="modal-overlay"
                        ariaHideApp={false}
                    >
                        <h2>Деталі боргу для квартири №{selectedApartment?.number}</h2>
                        <div className="modal-border">
                            <table className="debt-table">
                                <thead>
                                <tr>
                                    <th>Послуга</th>
                                    <th>Сума (грн)</th>
                                    <th>Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {apartmentDebts.map((debt) => (
                                    <tr key={debt.id}>
                                        <td>
                                            <span className="icon">{getMeterIcon(debt.meterType)}</span>
                                            {debt.meterType}
                                        </td>
                                        <td className="debt-amount">{debt.sum.toFixed(2)}</td>
                                        <td className="debt-button-section">
                                            <button
                                                className="delete-debt-button"
                                                onClick={() => handleDeletePayment(debt.id)}
                                            >
                                                <FaTimes  className="delete-icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="buttons-container">
                            <button onClick={() => setDebtModalIsOpen(false)} className="close-button">
                                <FaTimes className="close-icon" /> Закрити
                            </button>
                        </div>
                    </ReactModal>
                </div>

                <div className="right-table">
                    <h2 className="table-title">
                        Загальний борг по будинку
                    </h2>
                    <div className="chart-border">
                    <div style={{width: "100%", minWidth: "400px", height: "600px"}}>
                            {apartments.length > 0 ? (
                                <ResponsiveContainer width="100%" height={500}>
                                    <PieChart>
                                        <Pie
                                            data={prepareDebtPieChart()}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={190}
                                            label
                                        >
                                            {apartments.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{textAlign: "center", paddingTop: "180px", color: "#888"}}>
                                    Немає даних для відображення
                                </div>
                            )}
                        </div>

                        <div className="statistics">
                            <div className="stat-panel">
                                <p><strong>Загальний борг по будинку: </strong>{totalDebt.toFixed(2)} грн</p>
                            </div>
                            <div className="stat-panel">
                                <p><strong>Кількість квартир з боргом: </strong>{numberOfApartmentsWithDebt}</p>
                            </div>
                            <div className="stat-panel">
                                <p><strong>Найбільший
                                    боржник: </strong>Кв {largestDebtor.number} - {largestDebtor.totalDebt.toFixed(2)} грн
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="form-bottom"></div>
                </div>
            </div>
        </div>
    );

};


export default DebtSection;
