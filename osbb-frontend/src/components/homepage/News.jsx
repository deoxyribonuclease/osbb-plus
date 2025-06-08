import React, {useEffect, useState} from "react";
import "./styles/news.css"

import {Link} from "react-router-dom";
import {getAllNews} from "../../api/newsApi.jsx";
import {FaLink} from "react-icons/fa";



const News = () => {
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const allNews = await getAllNews();
                const sortedNews = allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
                const latest = sortedNews.slice(0, 3);
                setLatestNews(latest);
                setLoading(false);
            } catch (err) {
                setError("Failed to load news");
                setLoading(false);
                console.error("Error loading news:", err);
            }
        };

        fetchLatestNews();
    }, []);

    if (loading) return <div className="loading">Loading latest news...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <section id="news" className="news">
            <h3>БЛОГ</h3>
            <Link to="/news">
            <h2>Читай наші новини
                <FaLink style={{fontSize:"30px", marginLeft:"10px"}}></FaLink>
           </h2> </Link>
            <div className="news-gallery">
                {latestNews.map((item, index) => (
                    <div className="news-item" key={item.id || index}>
                        <img
                            className="news-image"
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {e.target.src = '/placeholder-image.jpg'}}
                        />
                        <div className="news-description">
                            <span>
                                {new Date(item.date).toLocaleDateString('uk-UA')} &nbsp;
                                від {item.author || "Модератор"}
                            </span>
                            <p>{item.title}</p>
                            <Link to={`/news/${item.id}`} className="btn">
                                Читати більше
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default News;
