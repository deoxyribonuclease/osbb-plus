import { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/userApi.jsx";
import "./styles/registrationform.css";

const RegistrationForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        osbbName: "",
        agreement: false,
        role: "",
    });

    const [loading, setLoading] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (name === "role" && value === "resident") {
            setInfoMessage("Зверніться до бухгалтера або члена управління для отримання доступу до акаунту.");
        } else {
            setInfoMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            enqueueSnackbar("Паролі не співпадають!", {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            return;
        }
        if (!formData.agreement) {
            enqueueSnackbar("Необхідно прийняти умови!", {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            return;
        }
        if (!formData.role) {
            enqueueSnackbar("Виберіть вашу роль!", {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            return;
        }

        setLoading(true);
        try {
            const response = await registerUser(
                formData.email,
                formData.password,
                formData.role,
                "",
                formData.email,
                formData.osbbName
            );
            console.log("User registered successfully:", response);

            enqueueSnackbar("Реєстрація пройшла успішно! Перенаправлення на сторінку входу...", {
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });

            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                osbbName: "",
                agreement: false,
                role: "",
            });
            setInfoMessage("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            enqueueSnackbar(`Помилка реєстрації: ${errorMessage}`, {
                variant: 'error',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="registration-form">
            <h2>Реєстрація ОСББ</h2>

            <input
                type="email"
                name="email"
                className="email"
                placeholder="ваша_пошта@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                className="password"
                placeholder="Ваш пароль..."
                value={formData.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="confirmPassword"
                className="password"
                placeholder="Повторіть пароль..."
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="osbbName"
                placeholder="Назва ОСББ..."
                className="osbb-name"
                value={formData.osbbName}
                onChange={handleChange}
                required
            />



            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="resident"
                        checked={formData.role === "resident"}
                        onChange={handleChange}
                    />
                    Я мешканець / співвласник
                </label>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="Accountant"
                        checked={formData.role === "Accountant"}
                        onChange={handleChange}
                    />
                    Я голова / бухгалтер / член правління
                </label>
            </div>

            {infoMessage && <p className="info-message">{infoMessage}</p>}

            <button
                type="submit"
                disabled={loading || formData.role === "resident"}
                style={{
                    backgroundColor: (loading || formData.role === "resident") ? "#ccc" : "",
                    cursor: (loading || formData.role === "resident") ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Обробка..." : "Почати роботу"}
            </button>

            <div className="login-link" style={{marginTop:"10px"}}>
                Вже маєте акаунт? <a href="/login">Увійти</a>
            </div>
        </form>
    );
};

export default RegistrationForm;