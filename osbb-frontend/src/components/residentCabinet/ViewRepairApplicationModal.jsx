import React from "react";
import Modal from "react-modal";

const ViewRepairApplicationModal = ({ isOpen, onClose, applicationData }) => {
    if (!applicationData) {
        return null;
    }

    const getStatusText = (status) => {
        const statusMap = {
            pending: "Очікує",
            in_progress: "В процесі",
            completed: "Виконано",
            rejected: "Відхилено"
        };

        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        return `status-badge ${`status-${status}`}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="view-application-modal"
            overlayClassName="view-application-overlay"
            ariaHideApp={false}
        >
            <h2 className="add-build-title">Деталі заявки №{applicationData.id}</h2>
            <div className="modal-wrapper view-application-wrapper">
                <div className="application-view-container">
                    <div className="application-header">
                        <h3>{applicationData.title}</h3>
                        <div className={getStatusClass(applicationData.status)}>
                            {getStatusText(applicationData.status)}
                        </div>
                    </div>

                    <div className="application-info">
                        <div className="info-content-wrapper">
                            <div className="info-left-column">
                                <div className="info-group">
                                    <label>Номер заявки:</label>
                                    <p>{applicationData.id}</p>
                                </div>

                                <div className="info-group">
                                    <label>Дата створення:</label>
                                    <p>{formatDate(applicationData.createdAt)}</p>
                                </div>

                                <div className="info-group description-group">
                                    <label>Опис:</label>
                                    <div className="description-text">{applicationData.description}</div>
                                </div>
                            </div>

                            {applicationData.image && (
                                <div className="info-right-column">
                                    <div className="info-group image-group">
                                        <label>Зображення:</label>
                                        <div className="image-container">
                                            <img
                                                src={applicationData.image}
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
                        <button type="button" className="close-button" onClick={onClose}>
                            Закрити
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewRepairApplicationModal;