import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./styles/repairApplicationSection.css";
import Table from "../layout/Table.jsx";
import {
    deleteRepairApplication,
    updateRepairApplication,
    getRepairApplicationsByOsbb
} from "../../api/repairApplicationApi.jsx";
import { createNotification } from "../../api/notificationApi.jsx";
import Modal from "react-modal";
import {enqueueSnackbar} from "notistack";
import {useOutletContext} from "react-router-dom";




const RepairApplicationSection = () => {
    const [applications, setApplications] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedApplications, setSelectedApplications] = useState({});
    const [pendingStatus, setPendingStatus] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredApplications = statusFilter === 'all'
        ? applications
        : applications.filter(app => app.status === statusFilter);
    const { osbbId } = useOutletContext();

    useEffect(() => {
        fetchApplications();
    }, [osbbId]);

    const fetchApplications = async () => {
        try {
            const applicationsData = await getRepairApplicationsByOsbb(osbbId);
            setApplications(applicationsData);
        } catch (error) {
            console.error("Error fetching repair applications:", error);
        }
    };

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setPendingStatus(application.status);
        setIsViewModalOpen(true);
    };

    const handleDeleteSelected = async () => {
        try {
            const applicationIdsToDelete = Object.keys(selectedApplications);
            if (applicationIdsToDelete.length === 0) return;

            if (window.confirm("Ви впевнені, що хочете видалити обрані заявки?")) {
                setIsViewModalOpen(false);
                setSelectedApplication(null);

                for (const applicationId of applicationIdsToDelete) {
                    await deleteRepairApplication(applicationId);
                }

                setSelectedApplications({});
                fetchApplications();
                enqueueSnackbar("Обрані заявки успішно видаллені.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, });
            }
        } catch (error) {
            console.error("Error deleting applications:", error);
        }
    };

    const handleStatusSelection = (status) => {
        setPendingStatus(status);
    };

    const applyStatusChange = async () => {
        try {
            if (!selectedApplication || pendingStatus === selectedApplication.status) {
                return;
            }


            await updateRepairApplication(selectedApplication.id, { status: pendingStatus });

            const ids = [];
            ids[0] = selectedApplication.Apartment.userId;
            const notificationData = {
                userIds: ids,
                title: 'Оновлення статусу заявки №' + selectedApplication.id,
                text: notificationMessage ||
                    `Статус вашої заявки №${selectedApplication.id} було змінено на "${getStatusText(pendingStatus)}"`,
                date: new Date().toISOString()
            };


            await createNotification(notificationData);
            setSelectedApplication({
                ...selectedApplication,
                status: pendingStatus
            });

            setNotificationMessage("");
            fetchApplications();
            setIsViewModalOpen(false);
            enqueueSnackbar("Статус заявки успішно оновлено.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        } catch (error) {
            console.error("Error updating application status:", error);
            enqueueSnackbar("Помилка при оновленні статусу заявки.", { variant: 'warning', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        }
    };

    const formatStatus = (status) => {
        const statusClass = `status-badge status-${status}`;

        return (
            <div className={statusClass}>
                {getStatusText(status)}
            </div>
        );
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: "Очікує",
            in_progress: "В процесі",
            completed: "Виконано",
            rejected: "Відхилено"
        };

        return statusMap[status] || status;
    };

    const applicationColumns = [
        {
            key: "id",
            label: "№ заявки"
        },
        {
            key: "updatedAt",
            label: "Будинок",
            render: (row) => {
                const address = row.Apartment?.House?.address;
                return address ? (address.length > 30 ? address.substring(0, 30) + "..." : address) : "Невідомо";
            }
        },
        {
            key: "Apartment",
            label: "Квартира",
            render: (row) => row.Apartment?.number || "Невідомо"
        },
        {
            key: "title",
            label: "Заявка",
            render: (row) => row.title.length > 20 ? row.title.substring(0, 20) + "..." : row.title
        },
        {
            key: "status",
            label: "Статус",
            render: (row) => formatStatus(row.status)
        },
        {
            key: "createdAt",
            label: "Дата створення",
            render: (row) => new Date(row.createdAt).toLocaleString('uk-UA', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusButtonClass = (status) => {
        const baseClass = `status-button status-${status}`;
        return `${baseClass} ${pendingStatus === status ? 'active' : ''}`;
    };

    return (
        <div className="repair-dashboard-content-section">
            <div style={{padding: "10px", minHeight: "80vh"}}>
                <h2 className="table-title">Управління заявками на ремонт</h2>
                <div className="button-section">
                    <button
                        onClick={handleDeleteSelected}
                        className="delete-button"
                        disabled={Object.keys(selectedApplications).length === 0}
                    >
                        <FaTrash className="icon"/> Видалити обрані заявки
                    </button>
                    <div className="status-filter-buttons">
                        <button
                            className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('all')}
                        >
                            Усі
                        </button>
                        <button
                            className={`filter-button ${statusFilter === 'pending' ? 'active' : ''} status-pending`}
                            onClick={() => setStatusFilter('pending')}
                        >
                            Очікує
                        </button>
                        <button
                            className={`filter-button ${statusFilter === 'in_progress' ? 'active' : ''} status-in_progress`}
                            onClick={() => setStatusFilter('in_progress')}
                        >
                            В процесі
                        </button>
                        <button
                            className={`filter-button ${statusFilter === 'completed' ? 'active' : ''} status-completed`}
                            onClick={() => setStatusFilter('completed')}
                        >
                            Виконано
                        </button>
                        <button
                            className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''} status-rejected`}
                            onClick={() => setStatusFilter('rejected')}
                        >
                            Відхилено
                        </button>
                    </div>

                </div>
                    <div className="table-container">
                        <Table
                            columns={applicationColumns}
                            data={filteredApplications}
                            rowsPerPage={19}
                            onRowClick={handleViewApplication}
                            selectedRows={selectedApplications}
                            setSelectedRows={setSelectedApplications}
                        />

                    </div>
            </div>
            <Modal
                isOpen={isViewModalOpen}
                onRequestClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedApplication(null);
                    setPendingStatus(null);
                    setNotificationMessage("");
                }}
                className="view-application-modal"
                overlayClassName="view-application-overlay"
                ariaHideApp={false}
            >
            {selectedApplication && (
                    <>
                        <h2 className="repair-app-title">Деталі заявки №{selectedApplication.id}</h2>
                        <div className="modal-wrapper view-application-wrapper">
                            <div className="application-view-container">
                                <div className="application-header">
                                    <h3>{selectedApplication.title}</h3>
                                    <div className={`status-badge status-${selectedApplication.status}`}>
                                        {getStatusText(selectedApplication.status)}
                                    </div>
                                </div>

                                <div className="application-info">
                                    <div className="info-content-wrapper">
                                    <div className="info-left-column">
                                            <div className="info-group">
                                                <label>Номер заявки:</label>
                                                <p>{selectedApplication.id}</p>
                                            </div>

                                            <div className="info-group">
                                                <label>Будинок:</label>
                                                <p>{selectedApplication.Apartment?.House?.address || "Невідомо"}</p>
                                            </div>

                                            <div className="info-group">
                                                <label>Квартира №:</label>
                                                <p>{selectedApplication.Apartment?.number || "Невідомо"}</p>
                                            </div>

                                            <div className="info-group">
                                                <label>Дата створення:</label>
                                                <p>{formatDate(selectedApplication.createdAt)}</p>
                                            </div>

                                            <div className="info-group description-group">
                                                <label>Опис:</label>
                                                <div
                                                    className="description-text">{selectedApplication.description}</div>
                                            </div>

                                            <div className="info-group status-change-group">
                                                <label>Змінити статус:</label>
                                                <div className="status-buttons">
                                                    <button
                                                        className={getStatusButtonClass('pending')}
                                                        onClick={() => handleStatusSelection('pending')}
                                                    >
                                                        Очікує
                                                    </button>
                                                    <button
                                                        className={getStatusButtonClass('in_progress')}
                                                        onClick={() => handleStatusSelection('in_progress')}
                                                    >
                                                        В процесі
                                                    </button>
                                                    <button
                                                        className={getStatusButtonClass('completed')}
                                                        onClick={() => handleStatusSelection('completed')}
                                                    >
                                                        Виконано
                                                    </button>
                                                    <button
                                                        className={getStatusButtonClass('rejected')}
                                                        onClick={() => handleStatusSelection('rejected')}
                                                    >
                                                        Відхилено
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="info-group notification-message-group">
                                                <label>Повідомлення для користувача:</label>
                                                <textarea
                                                    className="notification-message"
                                                    value={notificationMessage}
                                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                                    placeholder="Введіть додаткову інформацію для користувача..."
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        {selectedApplication.image && (
                                            <div className="info-right-column">
                                                <div className="info-group image-group">
                                                    <label>Зображення:</label>
                                                    <div className="image-container">
                                                        <img
                                                            src={selectedApplication.image}
                                                            alt="Зображення проблеми"
                                                            className="application-image"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="buttons-container">
                                    <button
                                        className="modal-button modal-accept"
                                        onClick={applyStatusChange}
                                        disabled={pendingStatus === selectedApplication.status}
                                    >
                                        Зберегти зміни
                                    </button>

                                    <button
                                        type="button"
                                        className="modal-button modal-delete"
                                        onClick={async () => {
                                            if (window.confirm("Ви впевнені, що хочете видалити цю заявку?")) {
                                                await deleteRepairApplication(selectedApplication.id);
                                                setIsViewModalOpen(false);
                                                setSelectedApplication(null);
                                                setPendingStatus(null);
                                                setNotificationMessage("");
                                                fetchApplications();
                                            }
                                        }}
                                    >
                                        Видалити заявку
                                    </button>

                                    <button
                                        type="button"
                                        className="modal-button modal-close"
                                        onClick={() => {
                                            setIsViewModalOpen(false);
                                            setSelectedApplication(null);
                                            setPendingStatus(null);
                                            setNotificationMessage("");
                                        }}
                                    >
                                        Закрити
                                    </button>
                                </div>

                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default RepairApplicationSection;