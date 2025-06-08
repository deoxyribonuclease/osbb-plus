import React from "react";
import { AiOutlineSetting, AiOutlinePieChart } from "react-icons/ai";
import {MdOutlineSecurity, MdOutlinePeopleAlt, MdPayment} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import "./styles/services.css";

const services = [
    { icon: <AiOutlineSetting />, title: "Автоматизація процесів", description: "Зменшення рутинної роботи завдяки цифровим рішенням." },
    { icon: <AiOutlinePieChart />, title: "Фінансова прозорість", description: "Контроль платежів та витрат у зручному форматі." },
    { icon: <MdOutlineSecurity />, title: "Безпека даних", description: "Захист персональних даних мешканців та управителів." },
    { icon: <MdOutlinePeopleAlt />, title: "Комунікація", description: "Швидке інформування мешканців про важливі події." },
    { icon: <MdPayment />, title: "Онлайн-оплата комунальних послуг", description: "Зручна та швидка оплата рахунків через особистий кабінет." }
];

const Services = () => {
    return (
        <div className="services-back">
        <section id="services" className="services">
            <div className="services-header">
                <h2>Наші переваги</h2>
                <p>ОСББ+ надає всі необхідні інструменти для ефективного управління вашим будинком.</p>
            </div>
            <div className="services-list">
                {services.map((service, index) => (
                    <div className="service-item" key={index}>
                        <div className="icon">{service.icon}</div>
                        <div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
    );
};

export default Services;
