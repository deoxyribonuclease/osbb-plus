import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getUserById, deleteUser } from "../../api/userApi";
import { getAllOSBBs, updateOSBB } from "../../api/osbbApi";
import { FaFilter, FaSearch, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUser, FaEnvelope } from "react-icons/fa";
import "./styles/moderateOsbb.css";


const ModerateOsbb = () => {
    const [osbbs, setOsbbs] = useState([]);
    const [filteredOsbbs, setFilteredOsbbs] = useState([]);
    const [selectedOsbb, setSelectedOsbb] = useState(null);
    const [owner, setOwner] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchOSBBs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [osbbs, searchTerm, filterStatus]);

    const fetchOSBBs = async () => {
        try {
            const response = await getAllOSBBs();
            const sortedOsbbs = response.sort((a, b) => a.status.localeCompare(b.status));
            setOsbbs(sortedOsbbs);
            setFilteredOsbbs(sortedOsbbs);
        } catch (error) {
            console.error("Error fetching OSBBs:", error);
        }
    };

    const applyFilters = () => {
        let result = [...osbbs];

        if (searchTerm) {
            result = result.filter(osbb =>
                osbb.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== "all") {
            result = result.filter(osbb => osbb.status === filterStatus);
        }

        setFilteredOsbbs(result);
    };

    const openModal = async (osbb) => {
        setSelectedOsbb(osbb);
        setModalIsOpen(true);

        try {
            const user = await getUserById(osbb.userId);
            setOwner(user);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedOsbb(null);
        setOwner(null);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити це ОСББ?")) return;
        try {
            await deleteUser(userId);
            fetchOSBBs();
            if (selectedOsbb && selectedOsbb.userId === userId) {
                closeModal();
            }
        } catch (error) {
            console.error("Error deleting OSBB:", error);
        }
    };

    const toggleStatus = async (osbb) => {
        const newStatus = osbb.status === "Verified" ? "Unverified" : "Verified";
        try {
            await updateOSBB(osbb.id, { ...osbb, status: newStatus });
            fetchOSBBs();
            if (selectedOsbb && selectedOsbb.id === osbb.id) {
                setSelectedOsbb({...osbb, status: newStatus});
            }
        } catch (error) {
            console.error("Error updating OSBB status:", error);
        }
    };

    return (
        <div className="osbbsection-mod-container">
            <h2 className="osbb-title">Модерація ОСББ</h2>

            <div className="filters-container">
                <div className="search-box">
                    <FaSearch className="icon-inline"  style={{marginBottom:"15px"}} />
                    <input
                        type="text"
                        placeholder="Пошук за назвою..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <FaFilter className="icon-inline" style={{marginBottom:"15px"}} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Всі статуси</option>
                        <option value="Verified">Підтверджені</option>
                        <option value="Unverified">Непідтверджені</option>
                    </select>
                </div>
            </div>

            <div className="content full-width">
                <div className="osbb-grid">
                    {filteredOsbbs.length > 0 ? (
                        filteredOsbbs.map((osbb) => (
                            <div
                                key={osbb.id}
                                className={`osbb-card ${osbb.status === "Verified" ? "verified" : "unverified"}`}
                            >
                                <h3>{osbb.name}</h3>
                                <div className="field">
                                    <FaMapMarkerAlt className="icon-inline" />
                                    <strong>Адреса:</strong>
                                    <span>{osbb.address}</span>
                                </div>
                                <div className="field">
                                    <FaPhone className="icon-inline" />
                                    <strong>Контакт:</strong>
                                    <span>{osbb.contact}</span>
                                </div>
                                <div className="status-indicator">
                                    {osbb.status === "Verified" ? (
                                        <><FaCheckCircle className="icon-inline verified-icon" /> Підтверджено</>
                                    ) : (
                                        <><FaTimesCircle className="icon-inline unverified-icon" /> Непідтверджено</>
                                    )}
                                </div>
                                <div className="card-buttons">
                                    <button className="details-btn" onClick={() => openModal(osbb)}>
                                        Детальніше
                                    </button>
                                    <button
                                        className={osbb.status === "Verified" ? "status-btn verified" : "status-btn unverified"}
                                        onClick={() => toggleStatus(osbb)}
                                    >
                                        {osbb.status === "Verified" ? "Скасувати підтвердження" : "Підтвердити"}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(osbb.userId)}
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">Не знайдено ОСББ за вказаними критеріями</div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Деталі ОСББ"
                className="modal-mod-content compact"
                overlayClassName="modal-mod-overlay"
            >
                {selectedOsbb && (
                    <div className="modal-inner">
                        <h2 className="modal-title">{selectedOsbb.name}</h2>

                        <div className="modal-body compact">
                            <div className="modal-section">
                                <h3>Інформація про ОСББ</h3>
                                <div className="compact-fields">
                                    <div className="field">
                                        <FaMapMarkerAlt className="icon-inline" />
                                        <strong>Адреса: </strong>
                                        <span>{selectedOsbb.address}</span>
                                    </div>
                                    <div className="field">
                                        <FaPhone className="icon-inline" />
                                        <strong>Контакт: </strong>
                                        <span>{selectedOsbb.contact}</span>
                                    </div>
                                    <div className="field">
                                        <FaCalendarAlt className="icon-inline" />
                                        <strong>Дата створення: </strong>
                                        <span>{selectedOsbb.creationDate}</span>
                                    </div>
                                    <div className="field">
                                        <strong>Статус:</strong>
                                        <span className={selectedOsbb.status === "Verified" ? "status verified" : "status unverified"}>
                                            {selectedOsbb.status === "Verified" ? (
                                                <><FaCheckCircle /> Підтверджено</>
                                            ) : (
                                                <><FaTimesCircle /> Непідтверджено</>
                                            )}
                                        </span>
                                    </div>
                                    <div className="field full-width">
                                        <strong>Опис:</strong>
                                        <p className="field-description">{selectedOsbb.details || "Не вказано"}</p>
                                    </div>
                                </div>
                            </div>

                            {owner && (
                                <div className="modal-section">
                                    <h3>Інформація про власника</h3>
                                    <div className="compact-fields">
                                        <div className="field">
                                            <FaUser className="icon-inline" />
                                            <strong>Логін: </strong>
                                            <span>{owner.login}</span>
                                        </div>
                                        <div className="field">
                                            <strong>Роль: </strong>
                                            <span>{owner.role}</span>
                                        </div>
                                        <div className="field">
                                            <FaPhone className="icon-inline" />
                                            <strong>Телефон: </strong>
                                            <span>{owner.phone || "Не вказано"}</span>
                                        </div>
                                        <div className="field">
                                            <FaEnvelope className="icon-inline" />
                                            <strong>Email: </strong>
                                            <span>{owner.email}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button
                                className={selectedOsbb.status === "Verified" ? "status-btn verified" : "status-btn unverified"}
                                onClick={() => toggleStatus(selectedOsbb)}
                            >
                                {selectedOsbb.status === "Verified" ? "Скасувати підтвердження" : "Підтвердити"}
                            </button>
                            <button className="delete-btn" onClick={() => {
                                handleDelete(selectedOsbb.userId);
                            }}>
                                Видалити
                            </button>
                            <button className="close-btn" onClick={closeModal}>
                                Закрити
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <div className="osbb-bottom">
            </div>
        </div>
    );
};

export default ModerateOsbb;