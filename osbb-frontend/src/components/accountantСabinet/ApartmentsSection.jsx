import React, { useEffect, useState } from "react";
import { FaPlus, FaQuestionCircle, FaTrash } from "react-icons/fa";
import "./styles/apartmentsSection.css";
import Table from "../layout/Table.jsx";
import { getHouseByOSBBId} from "../../api/houseApi.jsx";
import { getApartmentsByHouse, deleteApartment } from "../../api/apartmentApi.jsx";
import AddApartmentModal from "./AddApartmentModal.jsx";
import {useOutletContext} from "react-router-dom";

const ApartmentsSection = () => {
    const [houses, setHouses] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState(null);
    const [selectedApartments, setSelectedApartments] = useState({});
    const [isAddApartmentModalOpen, setIsAddApartmentModalOpen] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [editedApartmentId, setEditedApartmentId] = useState(null);
    const { osbbId } = useOutletContext();

    useEffect(() => {
        fetchHouses();
    }, [osbbId]);

    useEffect(() => {
        setSelectedApartment(null);
        setEditedApartmentId(null);
        setIsAddApartmentModalOpen(false);
    }, [selectedHouseId]);

    const fetchHouses = async () => {
        try {
            const housesData = await  getHouseByOSBBId(osbbId);
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

    const handleHouseSelect = (house) => {
        setSelectedHouseId(house.id);
        fetchApartments(house.id);
    };

    const handleAddApartment = () => {
        setSelectedApartment(null);
        setEditedApartmentId(null);
        setIsAddApartmentModalOpen(true);
    };

    const handleEditApartment = (apartment) => {

        if (selectedApartment && selectedApartment.id === apartment.id) {
            setSelectedApartment(null);
            setEditedApartmentId(null);
            setIsAddApartmentModalOpen(false);
        } else {
            setSelectedApartment(apartment);
            setEditedApartmentId(apartment.id);
            setIsAddApartmentModalOpen(true);
        }
    };

    const handleDeleteApartments = async () => {
        try {
            const apartmentIdsToDelete = Object.keys(selectedApartments);
            if (apartmentIdsToDelete.length === 0) {
                alert("Будь ласка, виберіть квартири для видалення.");
                return;
            }
            setSelectedApartment(null);
            setEditedApartmentId(null);
            setIsAddApartmentModalOpen(false);
            for (const apartmentId of apartmentIdsToDelete) {
                await deleteApartment(apartmentId);
            }
            setSelectedApartments({});
            if (selectedHouseId) {
                fetchApartments(selectedHouseId);
            }
        } catch (error) {
            console.error("Error deleting apartments:", error);
        }
    };

    const handleRowSelect = (apartment) => {
        const newSelectedApartments = { ...selectedApartments };
        if (newSelectedApartments[apartment.id]) {
            delete newSelectedApartments[apartment.id];
        } else {
            newSelectedApartments[apartment.id] = apartment;
        }
        setSelectedApartments(newSelectedApartments);
    };

    const houseColumns = [
        { key: "address", label: "Адреса" },
        { key: "entNum", label: "Під'їздів" },
        { key: "floorNum", label: "Поверхів" },
        { key: "appartNum", label: "Квартир" }
    ];



    const apartmentColumns = [
        {
            key: "number",
            label: "Номер",
            render: (row) => `№ ${row.number}`,
        },
        {
            key: "area",
            label: "Площа",
            render: (row) => `${row.area} м²`
        },
        {
            key: "roomNum",
            label: "Кількість кімнат"
        },
        {
            key: "userId",
            label: "Кабінет",
            render: (row) => row.userId ? "✔️" : "❌"
        }
    ];


    return (
        <div>
            <div style={{ display: "flex", gap: "20px", padding: "10px" }}>

                <div className="left-apartment-table" style={{ flex: 1 }}>
                    <h2 className="table-title">Будинки</h2>
                    <div className="button-section">
                        <h3 className="tip-text-section">
                            <span className="icon-container">
                                <FaQuestionCircle className="icon" />
                            </span>
                            Оберіть будинок для перегляду квартир.
                        </h3>
                    </div>
                    <Table
                        columns={houseColumns}
                        rowsPerPage={19}
                        data={houses}
                        onRowClick={handleHouseSelect}
                        showCheckboxColumn={false}
                        editedRowId={selectedHouseId}
                    />
                </div>

                <div className="right-apartment-table" style={{ flex: 1 }}>
                    <h2 className="table-title">
                        Квартири {selectedHouseId ? `Будинок ID: ${selectedHouseId}` : ""}
                    </h2>
                    <div className="button-section">
                        <button
                            onClick={handleAddApartment}

                            className="add-button"
                            disabled={selectedHouseId === null}
                        >
                            <FaPlus className="icon" /> Додати квартиру
                        </button>
                        <button
                            onClick={handleDeleteApartments}
                            className="delete-button"
                            disabled={Object.keys(selectedApartments).length === 0 || selectedHouseId === null}
                        >
                            <FaTrash className="icon" /> Видалити обрані квартири
                        </button>
                    </div>
                    <Table
                        rowsPerPage={19}
                        columns={apartmentColumns}
                        data={apartments}
                        selectedRows={selectedApartments}
                        setSelectedRows={setSelectedApartments}
                        onRowClick={handleEditApartment}
                        onRowSelect={handleRowSelect}
                        editedRowId={editedApartmentId}
                    />
                </div>
            </div>

            <AddApartmentModal
                isOpen={isAddApartmentModalOpen}
                onClose={() => {
                    setIsAddApartmentModalOpen(false);
                    setEditedApartmentId(null);
                    setSelectedApartment(null);
                }}
                onApartmentAdded={() => fetchApartments(selectedHouseId)}
                houseId={selectedHouseId}
                apartmentData={selectedApartment}
                editedApartmentId={editedApartmentId}
            />
        </div>
    );
};

export default ApartmentsSection;
