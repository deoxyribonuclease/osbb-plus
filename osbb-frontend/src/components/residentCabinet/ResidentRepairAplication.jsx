import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./styles/repairApplication.css";
import Table from "../layout/Table.jsx";
import { getRepairApplicationsByApartment, deleteRepairApplication } from "../../api/repairApplicationApi.jsx";
import AddRepairApplicationModal from "./AddRepairApplicationModal.jsx";
import ViewRepairApplicationModal from "./ViewRepairApplicationModal.jsx";
import {enqueueSnackbar} from "notistack";
import {useOutletContext} from "react-router-dom";

const ResidentRepairApplication = () => {
    const [applications, setApplications] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedApplications, setSelectedApplications] = useState({})
    const { apartmentId } = useOutletContext();

    useEffect(() => {
        if (apartmentId) {
            fetchApplications();
        }
    }, [apartmentId]);

    const fetchApplications = async () => {
        try {
            const applicationsData = await getRepairApplicationsByApartment(apartmentId);
            setApplications(applicationsData);
        } catch (error) {
            console.error("Error fetching repair applications:", error);
        }
    };

    const formatStatus = (status) => {
        const statusMap = {
            pending: "Очікує",
            in_progress: "В процесі",
            completed: "Виконано",
            rejected: "Відхилено"
        };

        const statusClasses = {
            pending: "status-badge status-pending",
            in_progress: "status-badge status-in-progress",
            completed: "status-badge status-completed",
            rejected: "status-badge status-rejected"
        };

        return (
            <div className={statusClasses[status] || "status-badge"}>
                {statusMap[status] || status}
            </div>
        );
    };

    const applicationColumns = [
        {
            key: "id",
            label: "№ заявки"
        },
        {
            key: "title",
            label: "Заголовок",
            render: (row) => row.title.length > 30 ? row.title.substring(0, 30) + "..." : row.title
        },
        {
            key: "description",
            label: "Опис",
            render: (row) => row.description.length > 30 ? row.description.substring(0, 30) + "..." : row.description
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

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setIsViewModalOpen(true);
    };

    const handleDeleteSelected = async () => {
        try {
            const applicationIdsToDelete = Object.keys(selectedApplications);
            setIsViewModalOpen(false);
            setSelectedApplication(null);
            for (const applicationId of applicationIdsToDelete) {
                await deleteRepairApplication(applicationId);
            }
            setSelectedApplications({});
            fetchApplications();
            enqueueSnackbar("Заявки успішно видалено.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        } catch (error) {
            console.error("Error deleting applications:", error);
        }
    };

    return (
        <div className="repair-dashboard-content">
            <div style={{ padding: "10px", minHeight: "80vh" }}>
                <h2 className="table-title">Заявки на ремонт</h2>
                <div className="button-section">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="add-button">
                        <FaPlus className="icon"/> Додати заявку
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        className="delete-button"
                        disabled={Object.keys(selectedApplications).length === 0}
                    >
                        <FaTrash className="icon"/> Видалити обрані заявки
                    </button>
                </div>
                    <Table
                        columns={applicationColumns}
                        data={applications}
                        rowsPerPage={19}
                        onRowClick={handleViewApplication}
                        selectedRows={selectedApplications}
                        setSelectedRows={setSelectedApplications}
                    />
            </div>

            <AddRepairApplicationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onApplicationAdded={fetchApplications}
                apartmentId={apartmentId}
            />

            <ViewRepairApplicationModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedApplication(null);
                }}
                applicationData={selectedApplication}
            />
        </div>
    );
};

export default ResidentRepairApplication;