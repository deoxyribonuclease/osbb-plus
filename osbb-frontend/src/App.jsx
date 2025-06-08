import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './App.css';
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegistrationForm from "./components/homepage/RegistrationForm.jsx";
import LoginForm from "./components/homepage/LoginForm.jsx";
import AccountantCabinetPage from "./pages/AccountantCabinetPage.jsx";
import HousesSection from "./components/accountantСabinet/HousesSection.jsx";
import NotFound from "./pages/NotFound.jsx";
import OSBBSection from "./components/accountantСabinet/OSBBSection.jsx";
import Modal from "react-modal";
import ApartmentsSection from "./components/accountantСabinet/ApartmentsSection.jsx";
import ResidentSection from "./components/accountantСabinet/ResidentSection.jsx";
import MeterSection from "./components/accountantСabinet/MeterSection.jsx"; Modal.setAppElement('#root');
import { SnackbarProvider } from 'notistack';
import PaymentHistorySection from "./components/accountantСabinet/PaymentHistorySection.jsx";
import DebtSection from "./components/accountantСabinet/DebtSection.jsx";
import ExpenseSection from "./components/accountantСabinet/ExpenseSection.jsx";
import ResidentCabinetPage from "./pages/ResidentCabinetPage.jsx";
import OSBBinfoSection from "./components/residentCabinet/OSBBinfoSection.jsx";
import HouseInfoSection from "./components/residentCabinet/HouseInfoSection.jsx";
import ResidentPaymentSection from "./components/residentCabinet/ResidentPaymentSection.jsx";
import ResidentNotificationSection from "./components/residentCabinet/ResidentNotificationSection.jsx";
import UtilityPaymentsPage from "./components/residentCabinet/UtilityPaymentsPage.jsx";
import ResidentRepairAplication from "./components/residentCabinet/ResidentRepairAplication.jsx";
import RepairApplicationSection from "./components/accountantСabinet/RepairApplicationSection.jsx";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ProfileSettingsAcc from "./components/accountantСabinet/ProfileSettingsAcc.jsx";
import ProfileSettingsRes from "./components/residentCabinet/ProfileSettingsRes.jsx.jsx";
import ModeratorCabinetPage from "./pages/ModeratorCabinetPage.jsx";
import ModerateOsbb from "./components/moderatorCabinet/ModerateOsbb.jsx";
import NewsManagement from "./components/moderatorCabinet/NewsManagement.jsx";
import NewsListPage from "./components/homepage/NewsListPage.jsx";
import NewsDetailPage from "./components/homepage/NewsDetailPage.jsx";
import MessageSendingComponent from "./components/moderatorCabinet/MessageSendingComponent.jsx";
import AccNotificationSection from "./components/accountantСabinet/AccNotificationSection.jsx";

function Layout() {
    const location = useLocation();
    const isCabinet =
        location.pathname.startsWith("/accountant-cabinet") ||
        location.pathname.startsWith("/resident-cabinet")||
        location.pathname.startsWith("/moderator-cabinet");


    return (
        <div className="app-container">
            {!isCabinet && <Header />}
            <div className="main-container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/registration" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/news" element={<NewsListPage />} />
                    <Route path="/news/:id" element={<NewsDetailPage />} />

                    <Route element={<ProtectedRoute allowedRole="Accountant" />}>
                        <Route path="/accountant-cabinet" element={<AccountantCabinetPage />}>
                            <Route path="" element={<OSBBSection />} />
                            <Route path="houses" element={<HousesSection />} />
                            <Route path="apartments" element={<ApartmentsSection />} />
                            <Route path="residents" element={<ResidentSection />} />
                            <Route path="meter" element={<MeterSection />} />
                            <Route path="paymenthistory" element={<PaymentHistorySection />} />
                            <Route path="debts" element={<DebtSection />} />
                            <Route path="expenses" element={<ExpenseSection />} />
                            <Route path="repair-requests" element={<RepairApplicationSection />} />
                            <Route path="notifications" element={<AccNotificationSection />} />
                            <Route path="settings" element={<ProfileSettingsAcc />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRole="Resident" />}>
                        <Route path="/resident-cabinet" element={<ResidentCabinetPage />}>
                            <Route path="" element={<OSBBinfoSection />} />
                            <Route path="house-info" element={<HouseInfoSection />} />
                            <Route path="notifications" element={<ResidentNotificationSection />} />
                            <Route path="payment-history" element={<ResidentPaymentSection />} />
                            <Route path="utilities" element={<UtilityPaymentsPage />} />
                            <Route path="repair-requests" element={<ResidentRepairAplication />} />
                            <Route path="settings" element={<ProfileSettingsRes />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRole="Moderator" />}>
                        <Route path="/moderator-cabinet" element={<ModeratorCabinetPage />}>
                            <Route path="" element={<ModerateOsbb />} />
                            <Route path="news" element={<NewsManagement />} />
                            <Route path="settings" element={<ProfileSettingsRes />} />
                            <Route path="message" element={<MessageSendingComponent />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
            {!isCabinet && <Footer />}
        </div>
    );
}


const ProtectedRoute = ({ allowedRole, redirectTo = "/login" }) => {
    const token = Cookies.get("token");
    if (!token) {
        return <Navigate to={redirectTo} replace />;
    }
    let decoded;
    try {
        decoded = jwtDecode(token);
    } catch (err) {
        return <Navigate to={redirectTo} replace />;
    }
    const userRole = decoded.user.role;
    const userId = decoded.user.id;
    if (userRole !== allowedRole) {
        return <Navigate to="/" replace />;
    }
    return <Outlet context={{ userId }} />;
};


function App() {
    return (
        <SnackbarProvider maxSnack={3}>
        <Router>
            <Layout />
        </Router>
        </SnackbarProvider>
    );
}

export default App;
