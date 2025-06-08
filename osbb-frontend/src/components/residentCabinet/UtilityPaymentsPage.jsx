import React, { useEffect, useRef, useState } from "react";
import { getBalanceByApartmentId, pay, deleteBalance } from "../../api/paymentApi";
import { createMeter, getMetersByApartment } from "../../api/meterApi";
import { getApartmentByResidentId } from "../../api/apartmentApi";
import { enqueueSnackbar } from "notistack";
import {
    FaBolt,
    FaFire,
    FaTint,
    FaHome,
    FaTemperatureLow,
    FaQuestionCircle
} from "react-icons/fa";
import "./styles/utilityPaymentsPage.css";
import Cards from "react-credit-cards-2";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Loader from "../layout/Loader";
import { useOutletContext } from "react-router-dom";

const meterTypes = [
    { type: "Електроенергія", icon: <FaBolt style={{ color: "gold" }} /> },
    { type: "Вода", icon: <FaTint style={{ color: "blue" }} /> },
    { type: "Газ", icon: <FaFire style={{ color: "orange" }} /> },
    { type: "Опалення", icon: <FaTemperatureLow style={{ color: "red" }} /> },
    { type: "Утримання будинку", icon:<FaHome style={{ color: "brown" }} /> }
];

const initialPaymentData = {
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
    meterType: '',
    amount: ''
};

const UtilityPaymentsPage = () => {
    const [apartment, setApartment] = useState(null);
    const [balance, setBalance] = useState([]);
    const [meters, setMeters] = useState({});
    const [meterInputs, setMeterInputs] = useState({});
    const [paymentData, setPaymentData] = useState(initialPaymentData);
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useOutletContext();

    const numberRef = useRef(null);
    const nameRef = useRef(null);
    const expiryRef = useRef(null);
    const cvcRef = useRef(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                const apt = await getApartmentByResidentId(userId);
                if (apt.length > 0) {
                    setApartment(apt[0]);
                    await Promise.all([
                        fetchBalance(apt[0].id),
                        fetchMeters(apt[0].id)
                    ]);
                }
            } catch (error) {
                console.error("Помилка отримання даних:", error);
                showNotification("Помилка отримання даних", "error");
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [userId]);

    const fetchBalance = async (apartmentId) => {
        try {
            const balanceData = await getBalanceByApartmentId(apartmentId);

            const allowedTypes = ["Електроенергія", "Вода", "Газ", "Опалення", "Утримання будинку"];

            const filteredBalance = balanceData.filter(item =>
                item.sum > 0 || allowedTypes.includes(item.meterType) && item.sum !== 0
            );

            setBalance(filteredBalance);

            if (filteredBalance.length > 0 ) {
                setPaymentData(prev => ({
                    ...prev,
                    meterType: filteredBalance[0].meterType,
                    amount: filteredBalance[0].sum.toFixed(2)
                }));
            }

            return filteredBalance;
        } catch (error) {
            console.error("Помилка отримання балансу:", error);
            throw error;
        }
    };


    const fetchMeters = async (apartmentId) => {
        try {
            const metersData = await getMetersByApartment(apartmentId);
            const latestMeters = metersData.reduce((acc, meter) => {
                acc[meter.meterType] = meter;
                return acc;
            }, {});
            setMeters(latestMeters);

            const initialInputs = meterTypes.reduce((acc, { type }) => {
                acc[type] = "";
                return acc;
            }, {});
            setMeterInputs(initialInputs);
            return metersData;
        } catch (error) {
            console.error("Помилка отримання показників лічильників:", error);
            throw error;
        }
    };


    const showNotification = (message, variant = "info") => {
        enqueueSnackbar(message, {
            variant,
            autoHideDuration: 2000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
    };

    const handleInputChange = (type, value) => {
        setMeterInputs(prev => ({ ...prev, [type]: value }));
    };

    const submitMeterReading = async (type) => {
        const newReading = meterInputs[type];
        const currentMeter = meters[type] || {};
        const currentReading = currentMeter.currIndicators || 0;
        if (!newReading) {
            showNotification(`Введіть показники для ${type}`, "warning");
            return;
        }

        if (Number(newReading) < currentReading) {
            showNotification(`Нові показники для ${type} не можуть бути меншими за поточні (${currentReading})`, "error");
            return;
        }

        try {
            await createMeter({
                apartmentId: apartment.id,
                currIndicators: Number(newReading),
                meterType: type,
                date: new Date().toISOString(),
            });


            showNotification(`Показники для ${type} передані успішно!`, "success");

            await Promise.all([
                fetchBalance(apartment.id),
                fetchMeters(apartment.id)
            ]);

            setMeterInputs(prev => ({ ...prev, [type]: "" }));
        } catch (error) {
            showNotification(`Помилка передавання показників для ${type}`, "error");
        }
    };

    const handlePaymentInputChange = (evt) => {
        const { name, value } = evt.target;

        if (name === "meterType") {
            const selectedBalanceItem = balance.find(item => item.meterType === value);
            setPaymentData(prev => ({
                ...prev,
                [name]: value,
                amount: selectedBalanceItem ? selectedBalanceItem.sum.toFixed(2) : ''
            }));
            return;
        }



        if (name === "number") {
            let formattedNumber = value.replace(/\D/g, "").slice(0, 16);
            formattedNumber = formattedNumber.replace(/(\d{4})/g, "$1 ").trim();
            setPaymentData(prev => ({ ...prev, number: formattedNumber }));

            if (formattedNumber.length === 19) {
                nameRef.current.focus();
            }
            return;
        }

        if (name === "expiry") {
            let formattedExpiry = value.replace(/\D/g, "").slice(0, 4);
            if (formattedExpiry.length > 2) {
                formattedExpiry = formattedExpiry.replace(/(\d{2})(\d{2})/, "$1/$2");
            }
            setPaymentData(prev => ({ ...prev, expiry: formattedExpiry }));

            if (formattedExpiry.length === 5) {
                cvcRef.current.focus();
            }
            return;
        }

        if (name === "cvc") {
            const formattedCvc = value.replace(/\D/g, "").slice(0, 3);
            setPaymentData(prev => ({ ...prev, cvc: formattedCvc }));

            if (formattedCvc.length === 3) {
                showNotification("Перевірте введені дані перед оплатою!", "info");
            }
            return;
        }
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentInputFocus = (evt) => {
        setPaymentData(prev => ({ ...prev, focus: evt.target.name }));
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();

        if (!paymentData.amount || !paymentData.meterType || !apartment) {
            showNotification("Будь ласка, заповніть всі поля!", "warning");
            return;
        }

        try {
            await pay({
                apartmentId: apartment.id,
                sum: parseFloat(paymentData.amount),
                meterType: paymentData.meterType,
                status: "no",
                date: new Date().toISOString(),
            });

            showNotification("Оплата успішно здійснена!", "success");
            await fetchBalance(apartment.id);
            setPaymentData(initialPaymentData);
        } catch (error) {
            showNotification(`Помилка під час оплати: ${error}`, "error");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="utility-payments">
            <h1 className="utility-title">Комунальні платежі</h1>
            <div className="utility-wrapper">
                {apartment ? (
                    <>
                        <h2>Передача показників</h2>
                        <div className="meters-grid">
                            {meterTypes
                                .filter(({type}) => type !== "Утримання будинку")
                                .map(({type, icon}) => {
                                    const meter = meters[type] || {};
                                    return (
                                        <div key={type} className="meter-block">
                                            <h3>{icon} {type}</h3>
                                            <p>Попередній показник: <strong>{meter.prevIndicators ?? "—"}</strong></p>
                                            <p>Поточний показник: <strong>{meter.currIndicators ?? "—"}</strong></p>
                                            <p>Споживання: <strong>{meter.consumption ?? "—"}</strong></p>
                                            <p>Остання передача: <strong>
                                                {meter.createdAt ? new Date(meter.createdAt).toLocaleString("uk-UA") : "—"}
                                            </strong></p>

                                            <input
                                                type="number"
                                                value={meterInputs[type] || ""}
                                                onChange={(e) => handleInputChange(type, e.target.value)}
                                                placeholder="Введіть показники"
                                                min={meter.currIndicators || 0}
                                            />
                                            <button onClick={() => submitMeterReading(type)}>Передати</button>
                                        </div>
                                    );
                                })}
                        </div>


                        <div className="payment-container">
                            <div className="balance-section">
                                <h4>До сплати:</h4>
                                <div className="balance-grid">
                                    {balance.length > 0 ? (
                                        balance.map((item) => {
                                            const meterType = meterTypes.find((m) => m.type === item.meterType);
                                            return (
                                                <div key={item.id} className="balance-item">
                                                    {meterType ? meterType.icon :
                                                        <FaQuestionCircle style={{color: "black"}}/>}
                                                    <span>{item.meterType}: {item.sum.toFixed(2)} грн</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="balance-placeholder">
                                            <FaHome style={{color: "gray", fontSize: "2rem"}}/>
                                            <p>Немає рахунків до сплати</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="payment-sector">
                                <div className="card-preview">
                                    <Cards
                                        number={paymentData.number}
                                        expiry={paymentData.expiry}
                                        cvc={paymentData.cvc}
                                        name={paymentData.name}
                                        focused={paymentData.focus}
                                    />
                                </div>

                                <div className="payment-form">
                                    <h4>Оплата</h4>
                                    <form onSubmit={handlePaymentSubmit}><select
                                        name="meterType"
                                        value={paymentData.meterType || ""}
                                        onChange={handlePaymentInputChange}
                                        disabled={balance.length === 0}
                                    >
                                        <option value="" disabled>Оберіть тип</option>
                                        {balance.map(({meterType}) => (
                                            <option key={meterType} value={meterType}>
                                                {meterType}
                                            </option>
                                        ))}
                                    </select>

                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Сума"
                                            value={paymentData.amount || ""}
                                            onChange={handlePaymentInputChange}
                                            min="0"
                                            step="0.1"
                                        />
                                        <input
                                            ref={numberRef}
                                            type="text"
                                            name="number"
                                            placeholder="Номер картки"
                                            value={paymentData.number}
                                            onChange={handlePaymentInputChange}
                                            onFocus={handlePaymentInputFocus}
                                        />
                                        <input
                                            ref={nameRef}
                                            type="text"
                                            name="name"
                                            placeholder="Ім'я власника"
                                            value={paymentData.name}
                                            onChange={handlePaymentInputChange}
                                            onFocus={handlePaymentInputFocus}
                                        />
                                        <div className="payment-row">
                                            <input
                                                ref={expiryRef}
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={paymentData.expiry}
                                                onChange={handlePaymentInputChange}
                                                onFocus={handlePaymentInputFocus}
                                            />
                                            <input
                                                ref={cvcRef}
                                                type="text"
                                                name="cvc"
                                                placeholder="CVC"
                                                value={paymentData.cvc}
                                                onChange={handlePaymentInputChange}
                                                onFocus={handlePaymentInputFocus}
                                            />
                                        </div>
                                        <button type="submit" disabled={balance.length === 0}>Оплатити</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-apartment">
                        <FaHome size={40} style={{color: "brown"}}/>
                        <p>Немає доступних квартир для цього користувача</p>
                    </div>
                )}
            </div>
            <div className="form-bottom"></div>
        </div>
    );
};

export default UtilityPaymentsPage;