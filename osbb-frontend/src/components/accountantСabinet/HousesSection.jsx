import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./styles/housesSection.css";
import Table from "../layout/Table.jsx";
import {getAllHouses, getHouseByOSBBId} from "../../api/houseApi.jsx";
import { deleteHouse } from "../../api/houseApi.jsx";
import AddHouseModal from "./AddHouseModal.jsx";
import {useOutletContext} from "react-router-dom";
import {enqueueSnackbar} from "notistack";

const HousesSection = () => {
    const [houses, setHouses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [editedHouseId, setEditedHouseId] = useState(null);
    const [selectedHouses, setSelectedHouses] = useState({});
    const { osbbId } = useOutletContext();

    useEffect(() => {
        fetchHouses();
    }, [osbbId]);

    const fetchHouses = async () => {
        try {
            const housesData = await  getHouseByOSBBId(osbbId) ;
            setHouses(housesData);
            console.log("OSBB ID:", osbbId);
        } catch (error) {
            console.error("Error fetching houses:", error);
        }
    };

    const houseColumns = [
        { key: "address", label: "Адреса" },
        { key: "entNum", label: "Під'їздів" },
        { key: "floorNum", label: "Поверхів" },
        { key: "appartNum", label: "Квартир" }
    ];

    const handleEditHouse = (house) => {
        if (selectedHouse && selectedHouse.id === house.id) {
            setIsModalOpen(false);
            setEditedHouseId(null);
            setSelectedHouse(null);
        } else {
            setSelectedHouse(house);
            setEditedHouseId(house.id);
            setIsModalOpen(true);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const houseIdsToDelete = Object.keys(selectedHouses);
            setIsModalOpen(false);
            setEditedHouseId(null);
            setSelectedHouse(null);
            for (const houseId of houseIdsToDelete) {
                await deleteHouse(houseId);
            }
            setSelectedHouses({});
            fetchHouses();
            enqueueSnackbar("Будинки видалено успішно.", { variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, });
        } catch (error) {
            console.error("Error deleting houses:", error);
        }
    };

    return (
        <div className="dashboard-content">
            <div style={{ padding: "10px", minHeight: "80vh" }}>
                <h2 className="table-title">Будинки</h2>
                <div className="button-section">
                    <button
                        onClick={() => {
                            setSelectedHouse(null);
                            setEditedHouseId(null);
                            setIsModalOpen(prev => !prev);
                        }}
                        className="add-button">
                        <FaPlus className="icon"/> Додати будинок
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        className="delete-button"
                        disabled={Object.keys(selectedHouses).length === 0}
                    >
                        <FaTrash className="icon"/> Видалити обрані будинки
                    </button>
                </div>
                <Table
                    rowsPerPage={19}
                    columns={houseColumns}
                    data={houses}
                    onRowClick={handleEditHouse}
                    editedRowId={editedHouseId}
                    selectedRows={selectedHouses}
                    setSelectedRows={setSelectedHouses}
                />
            </div>

            <AddHouseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditedHouseId(null);
                    setSelectedHouse(null);
                }}
                osbbId={osbbId}
                onHouseAdded={fetchHouses}
                houseData={selectedHouse}
                editedHouseId={editedHouseId}
            />
        </div>
    );
};

export default HousesSection;
