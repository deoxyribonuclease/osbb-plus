import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./styles/residentSection.css";
import Table from "../layout/Table.jsx";
import { getHouseByOSBBId } from "../../api/houseApi.jsx";
import { getApartmentsByHouse } from "../../api/apartmentApi.jsx";
import { getResidentsByApartment, deleteResident } from "../../api/residentApi.jsx";
import AddResidentModal from "./AddResidentModal.jsx";
import { useOutletContext } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const ResidentSection = () => {
    const [houses, setHouses] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    const [residents, setResidents] = useState([]);
    const [selectedResidents, setSelectedResidents] = useState({});
    const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [editedResidentId, setEditedResidentId] = useState(null);
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
    }, [selectedHouseId]);

    useEffect(() => {
        setSelectedApartmentId(null);
        setResidents([]);
        setSelectedResident(null);
        setEditedResidentId(null);
        setIsAddResidentModalOpen(false);
    }, [selectedHouseId]);

    useEffect(() => {
        setResidents([]);
        setSelectedResident(null);
        setEditedResidentId(null);
        setIsAddResidentModalOpen(false);
    }, [selectedApartmentId]);

    const fetchHouses = async () => {
        try {
            const housesData = await getHouseByOSBBId(osbbId);
            setHouses(housesData);
        } catch (error) {
            console.error("Error fetching houses:", error);
            enqueueSnackbar("Помилка при завантаженні будинків.", {
                variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    const fetchApartments = async (houseId) => {
        try {
            const apartmentsData = await getApartmentsByHouse(houseId);
            setApartments(apartmentsData);
        } catch (error) {
            console.error("Error fetching apartments:", error);
            enqueueSnackbar("Помилка при завантаженні квартир.", {
                variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    const fetchResidents = async (apartmentId) => {
        try {
            const residentsData = await getResidentsByApartment(apartmentId);
            setResidents(residentsData);
        } catch (error) {
            console.error("Error fetching residents:", error);
            enqueueSnackbar("Помилка при завантаженні мешканців.", {
                variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    const handleHouseChange = (event) => {
        setSelectedHouseId(event.target.value);
        setSelectedApartmentId(null);
        setResidents([]);
    };

    const handleApartmentSelect = (apartment) => {
        setSelectedApartmentId(apartment.id);
        setSelectedResidents({});
        fetchResidents(apartment.id);
    };

    const handleAddResident = () => {
        setSelectedResident(null);
        setEditedResidentId(null);
        setIsAddResidentModalOpen(prev => !prev);
    };

    const handleEditResident = (resident) => {
        if (selectedResident && selectedResident.id === resident.id) {
            setSelectedResident(null);
            setEditedResidentId(null);
            setIsAddResidentModalOpen(false);
        } else {
            setSelectedResident(resident);
            setEditedResidentId(resident.id);
            setIsAddResidentModalOpen(true);
        }
    };

    const handleDeleteResidents = async () => {
        try {
            const residentIdsToDelete = Object.keys(selectedResidents);
            if (residentIdsToDelete.length === 0) {
                enqueueSnackbar("Будь ласка, виберіть мешканців для видалення.", {
                    variant: 'info',
                    autoHideDuration: 2000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }
                });
                return;
            }
            setSelectedResident(null);
            setEditedResidentId(null);
            setIsAddResidentModalOpen(false);

            for (const residentId of residentIdsToDelete) {
                await deleteResident(residentId);
            }

            setSelectedResidents({});
            if (selectedApartmentId) {
                fetchResidents(selectedApartmentId);
            }

            enqueueSnackbar("Мешканців успішно видалено.", {
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } catch (error) {
            console.error("Error deleting residents:", error);
            enqueueSnackbar("Помилка при видаленні мешканців.", {
                variant: 'warning',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    const handleRowSelect = (resident) => {
        const newSelectedResidents = { ...selectedResidents };
        if (newSelectedResidents[resident.id]) {
            delete newSelectedResidents[resident.id];
        } else {
            newSelectedResidents[resident.id] = resident;
        }
        setSelectedResidents(newSelectedResidents);
    };

    const houseOptions = houses.map((house) => (
        <option key={house.id} value={house.id}>
            {house.address}
        </option>
    ));

    const apartmentColumns = [
        { key: "number", label: "Номер", render: (row) => `№ ${row.number}` },
        { key: "area", label: "Площа ", render: (row) => `${row.area} м²` },
        { key: "roomNum", label: "Кімнат" }
    ];

    const residentColumns = [
        { key: "fullname", label: "ПІБ" },
        { key: "birthDate", label: "Дата народження" },
        { key: "passportData", label: "Паспорт/Свідоцтво" },
        { key: "taxNum", label: "РНОКПП" }
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: "20px", padding: "10px" }}>
                <div className="left-table" style={{ flex: 1 }}>
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

                <div className="right-table" style={{ flex: 1 }}>
                    <h2 className="table-title">
                        Мешканці {selectedApartmentId ? `| Квартира №${apartments.find(apartment => apartment.id === selectedApartmentId)?.number}` : ""}
                    </h2>
                    <div className="button-section">
                        <button
                            onClick={handleAddResident}
                            className="add-button"
                            disabled={!selectedApartmentId}
                        >
                            <FaPlus /> Додати мешканця
                        </button>
                        <button
                            onClick={handleDeleteResidents}
                            className="delete-button"
                            disabled={Object.keys(selectedResidents).length === 0 || !selectedApartmentId}
                        >
                            <FaTrash /> Видалити обраних мешканців
                        </button>
                    </div>

                    <Table
                        rowsPerPage={19}
                        columns={residentColumns}
                        data={residents}
                        selectedRows={selectedResidents}
                        setSelectedRows={setSelectedResidents}
                        onRowClick={handleEditResident}
                        onRowSelect={handleRowSelect}
                        editedRowId={editedResidentId}
                    />
                </div>
            </div>

            <AddResidentModal
                isOpen={isAddResidentModalOpen}
                onClose={() => {
                    setIsAddResidentModalOpen(false);
                    setEditedResidentId(null);
                    setSelectedResident(null);
                }}
                onResidentAdded={() => {
                    fetchResidents(selectedApartmentId);
                }}
                apartmentId={selectedApartmentId}
                residentData={selectedResident}
                editedResidentId={editedResidentId}
            />
        </div>
    );
};

export default ResidentSection;