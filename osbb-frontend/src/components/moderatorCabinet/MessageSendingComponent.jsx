import React, { useState, useEffect } from 'react';
import { getAllUsersWithHierarchy } from '../../api/userApi';
import { createNotification } from '../../api/notificationApi';
import { Checkbox, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import "./styles/messageComponentStyles.css";
import {enqueueSnackbar} from "notistack";

const { Panel } = Collapse;

const MessageSendingComponent = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [allUserIds, setAllUserIds] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getAllUsersWithHierarchy();
                const processedData = normalizeUserData(data);
                setUsers(processedData);

                const extractedIds = extractAllUserIds(processedData);
                setAllUserIds(extractedIds);
            } catch (error) {
                showNotification(`Помилка завантаження користувачів: ${error.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const normalizeUserData = (data) => {
        return data.map(user => {
            if (!user.Osbb) {
                user.Osbb = { id: `osbb-${user.id}`, name: 'Не вказано', Houses: [] };
            }
            user.Osbb.Houses = (user.Osbb.Houses || []).map(house => {
                house.Apartments = (house.Apartments || []).map(apt => {
                    if (!apt.User) {
                        apt.User = { login: 'Мешканець' };
                    }
                    if (!apt.number) {
                        apt.number = 'Не вказано';
                    }
                    return apt;
                });

                return house;
            });

            return user;
        });
    };

    const extractAllUserIds = (userData) => {
        const ids = [];

        userData.forEach(user => {
            ids.push(user.id);

            if (user.Osbb) {
                user.Osbb.Houses?.forEach(house => {
                    house.Apartments?.forEach(apt => {
                        if (apt.userId) {
                            ids.push(apt.userId);
                        }
                    });
                });
            }
        });

        return ids;
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        enqueueSnackbar(message, {
            variant: type,
            autoHideDuration: 2000,
            anchorOrigin: { vertical: "top", horizontal: "right" },
        });
    };

    const handleUserSelect = (userId, checked) => {
        setSelectedUserIds(prev => {
            if (checked) {
                return [...prev, userId];
            } else {
                return prev.filter(id => id !== userId);
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedUserIds.length > 0) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds([...allUserIds]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            showNotification('Введіть заголовок повідомлення', 'error');
            return;
        }

        if (!message.trim()) {
            showNotification('Введіть текст повідомлення', 'error');
            return;
        }

        if (selectedUserIds.length === 0) {
            showNotification('Виберіть хоча б одного користувача', 'error');
            return;
        }

        const notificationData = {
            title: title,
            text: message,
            date: new Date().toISOString(),
            userIds: selectedUserIds
        };

        try {
            await createNotification(notificationData);
            showNotification('Сповіщення успішно надіслано!', 'success');
            setTitle('');
            setMessage('');
            setSelectedUserIds([]);
        } catch (error) {
            showNotification(`Не вдалося надіслати сповіщення: ${error.message}`, 'error');
        }
    };

    const getTotalUsers = () => {
        return allUserIds.length;
    };

    const truncateText = (text, maxLength = 25) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const renderUserHierarchy = () => {
        return (
            <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                defaultActiveKey={['all-users']}
                className="hierarchy-collapse"
            >
                    {users.map(user => (
                        <div key={user.id} className="hierarchy-item">
                            <Checkbox
                                checked={selectedUserIds.includes(user.id)}
                                onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                                className="hierarchy-checkbox"
                            >
                                {user.login || 'Користувач'} ({user.email || 'Немає email'}) - Бухгалтер
                            </Checkbox>

                            {user.Osbb && (
                                <Collapse
                                    className="hierarchy-nested-collapse"
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                >
                                    <Panel
                                        header={`ОСББ: ${truncateText(user.Osbb.name || 'Не вказано')}`}
                                        key={`osbb-${user.id}`}
                                        className="hierarchy-nested-panel"
                                    >
                                        {user.Osbb.Houses && user.Osbb.Houses.map(house => (
                                            <Collapse
                                                key={`house-${house.address}`}
                                                className="hierarchy-nested-collapse"
                                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                            >
                                                <Panel
                                                    header={`Будинок: ${house.address ? house.address : 'Адреса не вказана'}`}
                                                    key={`house-${house.address}`}
                                                    className="hierarchy-nested-panel"
                                                >
                                                    {house.Apartments && house.Apartments.map((apt, index) => {
                                                        const aptKey = apt.id || `apt-${index}-${house.address}`;
                                                        return (
                                                            <div key={aptKey} className="hierarchy-item">
                                                                <Checkbox
                                                                    checked={selectedUserIds.includes(apt.userId)}
                                                                    onChange={(e) => handleUserSelect(apt.userId, e.target.checked)}
                                                                    className="hierarchy-checkbox"
                                                                >
                                                                    {apt.User?.login || 'Мешканець'} (Кв. {apt.number || ''})
                                                                </Checkbox>
                                                            </div>
                                                        );
                                                    })}

                                                </Panel>
                                            </Collapse>
                                        ))}
                                    </Panel>
                                </Collapse>
                            )}
                        </div>
                    ))}
            </Collapse>
        );
    };

    return (
        <div className="message-component">
            <div className="message-container">
                <div className="users-panel">
                    <h2 className="panel-title">Користувачі</h2>

                    {loading ? (
                        <div className="loading-indicator">Завантаження...</div>
                    ) : (
                        <div>
                            <div className="selection-stats">
                                <span className="selection-count-text">
                                    Вибрано: {selectedUserIds.length} з {getTotalUsers()}
                                </span>
                                <button
                                    onClick={handleSelectAll}
                                    className="select-all-button"
                                >
                                    {selectedUserIds.length > 0 ? "Скасувати всі" : "Вибрати всі"}
                                </button>
                            </div>

                            <div className="hierarchy-container">
                                {renderUserHierarchy()}
                            </div>
                        </div>
                    )}
                    <div className="osbb-bottom">
                    </div>
                </div>

                <div className="form-panel">
                    <h2 className="panel-title">Надіслати повідомлення</h2>

                    <form onSubmit={handleSendMessage}>
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Заголовок</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-input"
                                placeholder="Введіть заголовок повідомлення"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Повідомлення</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-input form-textarea"
                                placeholder="Введіть текст повідомлення"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <div className="selection-count">
                                <span className="selection-text">Вибрано користувачів: {selectedUserIds.length}</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                Надіслати
                            </button>
                        </div>
                    </form>
                    <div className="osbb-bottom">
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MessageSendingComponent;