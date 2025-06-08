import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../api/userApi";
import { useOutletContext } from "react-router-dom";
import "./styles/profileSettings.css"
import {enqueueSnackbar} from "notistack";

export const ProfileSettingsAcc = () => {
    const { userId } = useOutletContext();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        login: "",
        email: "",
        phone: "",
        password: "",
    });


    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const user = await getUserById(userId);
                setUserData((prev) => ({
                    ...prev,
                    login: user.login || "",
                    email: user.email || "",
                    phone: user.phone || "",
                }));
            } catch (error) {
                console.error("Failed to fetch user:", error);
                enqueueSnackbar("Помилка при отриманні даних ОСББ: " + error.message, {
                    variant: 'error',
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        };

        fetchUser();
    }, [userId, enqueueSnackbar]);


    const handleChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userId, userData);
            enqueueSnackbar("Дані успішно оновлено", {
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        } catch (error) {
            enqueueSnackbar("Помилка оновлення даних: " + error.message, {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
            });
        }
    };


    const handleLogout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
    };

    return (
        <div className="profile-settings">
            <h2 className="profile-settings__title">Налаштування профілю</h2>

            <div className="profile-settings__content">
                <div className="profile-settings__left-column">
                    <div className="profile-settings__card">
                        <form onSubmit={handleSubmit}>
                            <div className="profile-settings__field">
                                <label htmlFor="login" className="profile-settings__label">Логін</label>
                                <input
                                    id="login"
                                    type="text"
                                    name="login"
                                    className="profile-settings__input"
                                    value={userData.login}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="profile-settings__field">
                                <label htmlFor="email" className="profile-settings__label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="profile-settings__input"
                                    value={userData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="profile-settings__field">
                                <label htmlFor="phone" className="profile-settings__label">Телефон</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    className="profile-settings__input"
                                    value={userData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="profile-settings__field">
                                <label htmlFor="password" className="profile-settings__label">Новий пароль</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="profile-settings__input"
                                    value={userData.password}
                                    onChange={handleChange}
                                />
                                <span className="profile-settings__input-hint">
                                    Залиште поле порожнім, якщо не хочете змінювати пароль
                                </span>
                            </div>

                            <div className="profile-settings__button-group">
                                <button
                                    type="submit"
                                    className="profile-settings__button profile-settings__button--primary"
                                >
                                    Оновити
                                </button>
                                <button
                                    type="button"
                                    className="profile-settings__button profile-settings__button--danger"
                                    onClick={handleLogout}
                                >
                                    Вийти
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="profile-settings__right-column"></div>
            </div>
            <div className="form-bottom"></div>
        </div>
    );
};

export default ProfileSettingsAcc;