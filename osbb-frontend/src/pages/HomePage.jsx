
import Services from "../components/homepage/Services";
import About from "../components/homepage/About";
import MapComponent from "../components/layout/MapComponent.jsx";
import News from "../components/homepage/News.jsx";

function HomePage() {
    return (
        <div>
            <About/>
            <Services/>
            <News/>
        </div>
    );
}

export default HomePage;
