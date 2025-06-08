import React from "react";
import "./styles/about.css";
import design from "../../assets/homeimage.jpg";

const About = () => {
    return (
        <section id="about" className="about">
            <div className="about-wrapper">
                <div className="about-images">
                    <img src={design} alt="We Are Digital" />
                </div>
                <div className="about-item">
                    <span style={{ color: "#005081" }}>ОСББ</span>
                    <span style={{ color: "#638e32" }}>+ </span>
                    <p>Цифрова платформа для ОСББ та керуючих компаній, що об’єднує всі необхідні інструменти — від фінансів до комунікації з мешканцями.
                        ОСББ+ автоматизує рутинні процеси, економить час і підвищує ефективність управління.
                        Особисті кабінети мешканців забезпечують прозорість та зміцнюють довіру. Доступно з будь-якого пристрою без потреби в установці.</p>
                    <a href="/registration" className="btn">Зареєструвати ОСББ</a>
                </div>
            </div>
        </section>
    );
};

export default About;
