import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    FaBolt,
    FaFire,
    FaHome,
    FaMoneyBillWave,
    FaTimes,
    FaTint,
    FaTimesCircle, FaTemperatureLow, FaTrash, FaPlus, FaCheck
} from "react-icons/fa";
import "./styles/meterSection.css";
import Table from "../layout/Table.jsx";
import { getHouseByOSBBId} from "../../api/houseApi.jsx";
import { getApartmentsByHouse } from "../../api/apartmentApi.jsx";
import { approveToPay, createMeter, deleteMeter, getMetersByApartment } from "../../api/meterApi.jsx";
import ReactModal from "react-modal";
import { enqueueSnackbar } from "notistack";
import MeterModal from "./AddMeterModal.jsx";
import { createNotification } from "../../api/notificationApi.jsx";
import { FaGear, FaMessage } from "react-icons/fa6";
import {useOutletContext} from "react-router-dom";

const MeterSection = () => {
    const [houses, setHouses] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    const [meters, setMeters] = useState([]);
    const [maintenanceRate, setMaintenanceRate] = useState(10);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState(null);
    const [editedMeterId, setEditedMeterId] = useState(null);
    const [selectedMeters, setSelectedMeters] = useState({});
    const [filterType, setFilterType] = useState(null);
    const [reminderMessage, setReminderMessage] = useState(
        "Будь ласка, передайте показники лічильників за поточний місяць."
    );
    const { osbbId } = useOutletContext();

    const selectedApartment = useMemo(() =>
            filteredApartments.find(apartment => apartment.id === selectedApartmentId),
        [filteredApartments, selectedApartmentId]
    );

    const filteredMeters = useMemo(() =>
            filterType ? meters.filter(m => m.meterType === filterType) : meters,
        [meters, filterType]
    );


    const fetchHouses = useCallback(async () => {
        try {
            const housesData = await getHouseByOSBBId(osbbId);
            setHouses(housesData);
        } catch (error) {
            console.error("Error fetching houses:", error);
        }
    }, [osbbId]);

    const fetchApartments = useCallback(async (houseId) => {
        try {
            const apartmentsData = await getApartmentsByHouse(houseId);
            setFilteredApartments(apartmentsData);
        } catch (error) {
            console.error("Error fetching apartments:", error);
        }
    }, []);

    const fetchMeters = useCallback(async (apartmentId) => {
        try {
            const metersData = await getMetersByApartment(apartmentId);
            setMeters(metersData);
        } catch (error) {
            console.error("Error fetching meters:", error);
        }
    }, []);

    const resetSelections = useCallback(() => {
        setSelectedMeter(null);
        setEditedMeterId(null);
        setSelectedMeters({});
    }, []);

    useEffect(() => {
        fetchHouses();
    }, [fetchHouses]);

    useEffect(() => {
        if (selectedHouseId) {
            fetchApartments(selectedHouseId);
        }
    }, [selectedHouseId, fetchApartments]);

    useEffect(() => {
        if (selectedApartmentId) {
            fetchMeters(selectedApartmentId);
            resetSelections();
        } else {
            setMeters([]);
        }
    }, [selectedApartmentId, fetchMeters, resetSelections]);

    const handleHouseChange = (event) => {
        setSelectedHouseId(event.target.value);
        setSelectedApartmentId(null);
        setMeters([]);
    };

    const handleApartmentSelect = (apartment) => {
        setSelectedApartmentId(apartment.id);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditedMeterId(null);
        setSelectedMeter(null);
        setIsModalOpen(false);
    };

    const handleEditMeter = (meter) => {
        if (selectedMeter && selectedMeter.id === meter.id) {
            closeModal();
        } else {
            setSelectedMeter(meter);
            setEditedMeterId(meter.id);
            setIsModalOpen(true);
        }
    };

    const handleAddMaintenanceCharge = async () => {
        if (!selectedHouseId || filteredApartments.length === 0) {
            showNotification('Будь ласка, оберіть будинок із квартирами.', 'warning');
            return;
        }

        try {
            const newMeters = filteredApartments.map(apartment => ({
                apartmentId: apartment.id,
                meterType: "Утримання будинку",
                prevIndicators: 0,
                currIndicators: apartment.area,
                consumption: apartment.area,
                rate: maintenanceRate,
                date: new Date().toISOString()
            }));

            await Promise.all(newMeters.map(meter => createMeter(meter)));
            showNotification('Показники за утримання будинку успішно додані!', 'success');

            if (selectedApartmentId) {
                fetchMeters(selectedApartmentId);
            }
        } catch (error) {
            showNotification('Сталася помилка, спробуйте ще раз.' + error, 'error');
        }

        setModalIsOpen(false);
    };

    const handleDeleteMeters = async () => {
        const metersIdsToDelete = Object.keys(selectedMeters);
        if (metersIdsToDelete.length === 0) {
            showNotification('Будь ласка, виберіть лічильники для видалення.', 'warning');
            return;
        }

        try {
            setSelectedMeters({});
            resetSelections();
            await deleteMeter(metersIdsToDelete);

            if (selectedApartmentId) {
                fetchMeters(selectedApartmentId);
            }

            showNotification('Лічильники успішно видалені.', 'success');
        } catch (error) {
            console.error("Error deleting meters:", error);
            showNotification('Сталася помилка при видаленні лічильників, спробуйте ще раз.', 'error');
        }
    };

    const handleApproveToPay = async () => {
        const metersIdsToApprove = Object.keys(selectedMeters);

        if (metersIdsToApprove.length === 0) {
            showNotification('Будь ласка, виберіть лічильники для підтвердження оплати.', 'warning');
            return;
        }

        try {
            setSelectedMeters({});
            resetSelections();

            const response = await approveToPay(selectedApartmentId, metersIdsToApprove);

            if (response.alreadyApproved && response.alreadyApproved.length > 0) {
                showNotification(`Деякі лічильники вже підтверджені: ${response.alreadyApproved.join(', ')}`, 'info', 3000);
            }

            if (selectedApartmentId) {
                fetchMeters(selectedApartmentId);
            }

            showNotification('Лічильники успішно схвалено до оплати.', 'success');
        } catch (error) {
            console.error("Error approving meters for payment:", error);
            showNotification('Сталася помилка при підтвердженні оплати лічильників, спробуйте ще раз.', 'error');
        }
    };

    const handleSendReminder = async () => {
        if (!filteredApartments || filteredApartments.length === 0) {
            showNotification('Немає квартир для нагадування.', 'warning');
            return;
        }

        const userIds = filteredApartments
            .filter(apartment => apartment.userId)
            .map(apartment => apartment.userId);

        if (userIds.length === 0) {
            showNotification('Немає користувачів для нагадування.', 'warning');
            return;
        }

        const notificationData = {
            title: "Нагадування про передачу показників",
            text: reminderMessage,
            date: new Date().toISOString(),
            userIds: userIds
        };

        try {
            await createNotification(notificationData);
            showNotification('Сповіщення успішно надіслано!', 'success');
        } catch (error) {
            showNotification('Не вдалося надіслати сповіщення.' + error, 'error');
        }
    };

    const showNotification = (message, variant, duration = 2000) => {
        enqueueSnackbar(message, {
            variant,
            autoHideDuration: duration,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
    };

    const getMeterIcon = (type) => {
        switch (type) {
            case "Електроенергія": return <FaBolt style={{ color: "gold" }} />;
            case "Вода": return <FaTint style={{ color: "blue" }} />;
            case "Газ": return <FaFire style={{ color: "orange" }} />;
            case "Гроші": return <FaMoneyBillWave style={{ color: "green" }} />;
            case "Утримання будинку": return <FaHome style={{ color: "brown" }} />;
            case "Опалення": return <FaTemperatureLow style={{ color: "red" }} />;
            default: return null;
        }
    };

    const formatMeterValue = (value, type) => {
        if (type === "Електроенергія") return `${value} кВт`;
        if (type === "Вода" || type === "Газ") return `${value} м³`;
        if (type === "Гроші") return `${value} грн`;
        if (type === "Опалення") return `${value} м³`;
        if (type === "Утримання будинку") return `${value} м²`;
        return value;
    };

    // Мемоізовані колонки для таблиць
    const meterColumns = useMemo(() => [
        {
            key: "meterType",
            label: "Тип",
            render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {getMeterIcon(row.meterType)}
                    <span>{row.meterType}</span>
                </div>
            ),
        },
        {
            key: "prevIndicators",
            label: "Попередній показник",
            render: (row) => formatMeterValue(Number(row.prevIndicators).toFixed(2), row.meterType),
        },
        {
            key: "currIndicators",
            label: "Поточний показник",
            render: (row) => formatMeterValue(Number(row.currIndicators).toFixed(2), row.meterType),
        },
        {
            key: "consumption",
            label: "Споживання",
            render: (row) => formatMeterValue(Number(row.consumption).toFixed(2), row.meterType),
        },
        { key: "date", label: "Дата" },
        {
            key: "rate",
            label: "Тариф",
            render: (row) => formatMeterValue(Number(row.rate).toFixed(2) || "", "Гроші"),
        },
        {
            key: "amountDue",
            label: "До сплати",
            render: (row) => {
                const amountDue = parseFloat(row.amountDue);
                if (isNaN(amountDue)) {
                    return formatMeterValue("0.00", "Гроші");
                }
                return formatMeterValue(amountDue.toFixed(2), "Гроші");
            }

        },
        {
            key: "toPay",
            label: "Схвалено?",
            render: (row) => (row.toPay ? "✔️" : "❌"),
        }
    ], []);

    const apartmentColumns = useMemo(() => [
        { key: "number", label: "Номер", render: (row) => `№ ${row.number}` },
        { key: "area", label: "Площа (м²)", render: (row) => `${row.area} м²` },
        { key: "roomNum", label: "Кімнат" },
        {
            key: "userId",
            label: "Кабінет",
            render: (row) => row.userId ? "✔️" : "❌"
        }
    ], []);

    const filterButtons = useMemo(() => [
        { type: "Електроенергія", icon: <FaBolt style={{ color: "gold" }} /> },
        { type: "Вода", icon: <FaTint style={{ color: "blue" }} /> },
        { type: "Газ", icon: <FaFire style={{ color: "orange" }} /> },
        { type: "Опалення", icon: <FaTemperatureLow style={{ color: "red" }} /> },
        { type: "Утримання будинку", icon: <FaHome style={{ color: "brown" }} /> }
    ], []);

    return (
        <div className="meter-container">
            <div style={{ display: "flex", gap: "20px", padding: "10px" }}>
                {!isModalOpen && (
                    <div className="left-table" style={{ flex: 1 }}>
                        <h2 className="table-title">Квартири</h2>
                        <div className="dropdown-container">
                            <h3 className="tip-build-section">Оберіть будинок:</h3>
                            <select onChange={handleHouseChange} value={selectedHouseId || ""}>
                                <option value="" disabled>Виберіть будинок</option>
                                {houses.map((house) => (
                                    <option key={house.id} value={house.id}>
                                        {house.address}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="button-section">
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
                                            <FaMessage /> Надіслати нагадування
                                        </button>
                                    </div>
                                    <label htmlFor="reminder-message" className="input-label">
                                        <span className="red-star">* </span>
                                        Нагадування будуть надіслані тільки тим квартирам, в яких є обліковий запис.
                                    </label>
                                </div>

                                <div className="modal-border">
                                    <label htmlFor="maintenance-rate" className="input-label">Тариф за м²:</label>
                                    <div className="input-group">
                                        <input
                                            id="maintenance-rate"
                                            type="number"
                                            value={maintenanceRate}
                                            onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="input-field"
                                        />
                                        <button onClick={handleAddMaintenanceCharge} className="add-button">
                                            <FaHome /> Розподілити утримання будинку
                                        </button>
                                    </div>
                                    <label htmlFor="reminder-message" className="input-label">
                                        <span className="red-star">* </span>
                                        Формула розподілення: ПлощаКвартири(м²) * Тариф(грн)
                                    </label>
                                </div>

                                <div className="buttons-container">
                                    <button onClick={() => setModalIsOpen(false)} className="close-button">
                                        <FaTimes /> Закрити
                                    </button>
                                </div>
                            </ReactModal>
                        </div>

                        <Table
                            rowsPerPage={18}
                            columns={apartmentColumns}
                            data={filteredApartments}
                            onRowClick={handleApartmentSelect}
                            showCheckboxColumn={false}
                            editedRowId={selectedApartmentId}
                        />
                    </div>
                )}
                <div className="right-table" style={{ flex: 1 }}>
                    <h2 className="table-title">
                        Лічильники {selectedApartmentId ? `| Квартира №${selectedApartment?.number}` : ""}
                    </h2>

                    <div className="right-table-wrapper">
                        <div className="filter-buttons"
                             style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
                            {filterButtons.map(({ type, icon }) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setFilterType(type);
                                        resetSelections();
                                    }}
                                    className={filterType === type ? "active" : ""}
                                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px" }}
                                >
                                    {icon}
                                    {type}
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    setFilterType(null);
                                    resetSelections();
                                }}
                                className="reset-filter"
                                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px" }}
                            >
                                <FaTimesCircle style={{ color: "gray" }} />
                                Скинути фільтр
                            </button>
                        </div>
                    </div>
                    <div className="button-section">
                        <button
                            className="add-button"
                            onClick={() => {
                                openModal();
                                resetSelections();
                            }}
                            disabled={selectedApartmentId === null}
                        >
                            <FaPlus className="icon" /> Додати лічильник / платіж
                        </button>
                        <button
                            onClick={handleDeleteMeters}
                            className="delete-button"
                        >
                            <FaTrash className="icon" /> Видалити обрані показники
                        </button>
                        <button
                            onClick={handleApproveToPay}
                            className="approve-button"
                        >
                            <FaCheck className="icon" /> Схвалити показники
                        </button>
                    </div>

                    <Table
                        rowsPerPage={18}
                        columns={meterColumns}
                        data={filteredMeters}
                        onRowClick={handleEditMeter}
                        editedRowId={editedMeterId}
                        selectedRows={selectedMeters}
                        setSelectedRows={setSelectedMeters}
                    />
                </div>
            </div>
            {isModalOpen && (
                <MeterModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onMeterUpdated={() => fetchMeters(selectedApartmentId)}
                    apartmentId={selectedApartmentId}
                    meterData={selectedMeter}
                    editedMeterId={selectedMeter?.id}
                />
            )}
        </div>
    );
};

export default MeterSection;