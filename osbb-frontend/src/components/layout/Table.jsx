import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import Loader from "./Loader";
import "./styles/table.css";

const Table = ({ columns, data, onRowClick, editedRowId, selectedRows = {}, setSelectedRows, showCheckboxColumn = true, rowsPerPage }) => {
    const defaultRowsPerPage = 20;
    rowsPerPage = rowsPerPage || defaultRowsPerPage;
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setCurrentPage(1);
    }, [data]);


    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, [data]);

    const handleFilterChange = (e, key) => {
        setFilters({ ...filters, [key]: e.target.value });
    };

    const handleSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : (sortConfig.direction === "desc" ? null : "asc")
            });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };

    const handleSelectAll = (e) => {
        const newSelectedRows = {};
        if (e.target.checked) {
            data.forEach((row) => {
                newSelectedRows[row.id] = true;
            });
        } else {
            data.forEach((row) => {
                delete newSelectedRows[row.id];
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const handleRowSelect = (id) => {
        setSelectedRows((prev) => {
            const newSelected = { ...prev };
            if (newSelected[id]) {
                delete newSelected[id];
            } else {
                newSelected[id] = true;
            }
            return newSelected;
        });
    };

    const filteredData = data.filter((row) =>
        Object.keys(filters).every((key) =>
            row[key]?.toString().toLowerCase().includes(filters[key]?.toLowerCase())
        )
    );

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };


    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key || sortConfig.direction === null) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
    const displayedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const paddedData = [...displayedData, ...Array(rowsPerPage - displayedData.length).fill(null)];

    const allChecked = Object.keys(selectedRows).length === data.length && data.length > 0;
    const getValueFromObject = (obj, key) => {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : null, obj);
    };

    return (
        <div className="table-container">
            {loading ? <Loader /> : (
                <>
                    <table>
                        <thead>
                        <tr>
                            {showCheckboxColumn && (
                                <th className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th key={col.key}>
                                    <div className="table-header">
                                        <button onClick={() => handleSort(col.key)}>
                                            <span>{col.label}</span>
                                            {sortConfig.key === col.key ? (
                                                sortConfig.direction === "asc" ? (
                                                    <FaSortDown />
                                                ) : sortConfig.direction === "desc" ? (
                                                    <FaSortUp />
                                                ) : (
                                                    <FaSort />
                                                )
                                            ) : (
                                                <FaSort />
                                            )}
                                        </button>
                                    </div>

                                    <div className="search-box">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder={`Пошук за ${col.label}`}
                                            value={filters[col.key] || ""}
                                            onChange={(e) => handleFilterChange(e, col.key)}
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (showCheckboxColumn ? 1 : 0)} className="empty-table-message" >
                                    Немає доступних даних для відображення.
                                </td>
                            </tr>
                        ) : (
                            paddedData.map((row, index) => (
                                <tr
                                    key={row ? row.id : `empty-row-${index}`}
                                    className={row ? (row.id === editedRowId ? "highlighted-row" : "") : "empty-row"}
                                    onClick={() => row && onRowClick(row)}
                                    style={{ cursor: row ? "pointer" : "default" }}
                                >
                                    {showCheckboxColumn && (
                                        <td className="checkbox-column">
                                            {row && (
                                                <input
                                                    type="checkbox"
                                                    checked={!!selectedRows[row.id]}
                                                    onChange={() => handleRowSelect(row.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            )}
                                        </td>
                                    )}
                                    {columns.map((col, index) => (
                                        <td key={`${col.key}-${index}`}>
                                            {row && getValueFromObject(row, col.key) != null
                                                ? col.render
                                                    ? col.render(row)
                                                    : col.key === "birthDate" || col.key === "date" || col.key === "createdAt"
                                                        ? formatDate(getValueFromObject(row, col.key))
                                                        : getValueFromObject(row, col.key)
                                                : ""}
                                        </td>
                                    ))}

                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            <FaChevronLeft />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            <FaChevronRight />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Table;
