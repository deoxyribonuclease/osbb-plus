import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { loginUser } from "../../api/userApi.jsx";
import "./styles/loginform.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decodedData = jwtDecode(token);
                redirectBasedOnRole(decodedData.user.role);
            } catch (error) {
                Cookies.remove("token");
                enqueueSnackbar("Помилка авторизації. Необхідно увійти знову.", {
                    variant: 'warning',
                    autoHideDuration: 2000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }
                });
            }
        }
    }, []);

    const redirectBasedOnRole = (role) => {
        switch (role) {
            case "Accountant":
                navigate("/accountant-cabinet");
                break;
            case "Resident":
                navigate("/resident-cabinet");
                break;
            case "Moderator":
                navigate("/moderator-cabinet");
                break;
            default:
                navigate("/");
                break;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData.email, formData.password);
            if (data.token) {
                Cookies.set("token", data.token, { expires: 7 });
                const decodedData = jwtDecode(data.token);
                redirectBasedOnRole(decodedData.user.role);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Помилка входу. Перевірте електронну пошту та пароль.", {
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Вхід в ОСББ</h2>
            <input
                type="email"
                name="email"
                className="email"
                placeholder="ваша_пошта@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <div className="password-input-container">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="password"
                    placeholder="Ваш пароль..."
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <div className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
            </div>
            <button type="submit">Вхід</button>
        </form>
    );
};

export default LoginForm;