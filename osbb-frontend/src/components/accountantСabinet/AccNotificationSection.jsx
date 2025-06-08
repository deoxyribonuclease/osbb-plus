import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import "./styles/accNotificationSection.css";
import Table from "../layout/Table.jsx";
import { getNotificationsByUser } from "../../api/notificationApi.jsx";
import { FaTimes } from "react-icons/fa";
import {useOutletContext} from "react-router-dom";

ReactModal.setAppElement("#root");

const AccNotificationSection = () => {
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const { userId } = useOutletContext();

    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const data = await getNotificationsByUser(userId);
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const notificationColumns = [
        { key: "title", label: "Заголовок" },
        { key: "text", label: "Повідомлення" },
        {
            key: "createdAt",
            label: "Дата",
            render: (row) => new Date(row.createdAt).toLocaleString("uk-UA")
        }
    ];

    const openModal = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className="notifications-section-acc">
            <div className="notification-table-wrapper">
                <h2 className="table-title">Ваші повідомлення</h2>
                <Table
                    columns={notificationColumns}
                    data={notifications}
                    showCheckboxColumn={false}
                    onRowClick={(notification) => openModal(notification)}
                />
            </div>
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Повне повідомлення"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {selectedNotification && (
                    <div className="modal-body">
                        <h2>{selectedNotification.title}</h2>
                        <p>{selectedNotification.text}</p>
                        <p><strong>Дата:</strong> {new Date(selectedNotification.createdAt).toLocaleString("uk-UA")}</p>
                        <div className="buttons-container">
                            <button onClick={closeModal} className="close-button">
                                <FaTimes className="close-icon" /> Закрити
                            </button>
                        </div>
                    </div>
                )}
            </ReactModal>
        </div>
    );
};

export default AccNotificationSection;
