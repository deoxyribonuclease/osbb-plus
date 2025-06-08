import React from "react";


import "./styles/footer.css"
import logo from "../../assets/logo.svg";
import facebookIcon from "../../assets/icons/facebook-icon.png";
import twitterIcon from "../../assets/icons/twitter-icon.png";
import instagramIcon from "../../assets/icons/instargam-icon.png";

const Footer = () => {
    return (
        <footer id="contact">
            <div className="footer-container">
                <div className="footer-columns">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src={logo} alt="Logo"/>
                            <h4 className="logo-text">ОСББ+</h4>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Наші контакти</h4>
                        <p>Місце: Черкаси....</p>
                        <p>Допомога: 380 000 000 00</p>
                        <p>Email: example@mail.com</p>
                    </div>
                    <div className="footer-section">
                        <h4>Про нас</h4>
                        <p>Ми надаємо комплексні послуги для об'єднань співвласників багатоквартирних будинків (ОСББ),
                            допомагаючи ефективно управляти майном, вирішувати питання з обслуговуванням та ремонтом, а
                            також оптимізувати процеси збору платежів. Наші послуги сприяють створенню комфортних і
                            безпечних умов для мешканців.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Слідкуйте за нами</h4>
                        <div className="social-icons">
                            <a href="#"><img src={facebookIcon} alt="Facebook"/></a>
                            <a href="#"><img src={twitterIcon} alt="Twitter"/></a>
                            <a href="#"><img src={instagramIcon} alt="Instagram"/></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
