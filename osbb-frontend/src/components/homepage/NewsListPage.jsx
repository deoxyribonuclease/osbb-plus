import {useEffect, useState} from "react";
import {getAllNews} from "../../api/newsApi.jsx";
import {Link} from "react-router-dom";
import Loader from "../layout/Loader.jsx";

const NewsListPage = () => {
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const news = await getAllNews();
                const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAllNews(sortedNews);
                setLoading(false);
            } catch (err) {
                setError("Failed to load news");
                setLoading(false);
                console.error("Error loading news:", err);
            }
        };

        fetchAllNews();
    }, []);


    if (loading) return <Loader></Loader>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="news-list-page">
            <h1>Всі новини</h1>
            <div className="news-grid">
                {allNews.map((item) => (
                    <div className="news-grid-item" key={item.id}>
                        <div className="news-card">
                            <img
                                className="news-card-image"
                                src={item.image}
                                alt={item.title}
                                onError={(e) => {e.target.src = '/placeholder-image.jpg'}}
                            />
                            <div className="news-card-content">
                                <h3>{item.title}</h3>
                                <p className="news-date">
                                    {new Date(item.date).toLocaleDateString('uk-UA')} &nbsp;
                                    від Модератор
                                </p>
                                <p className="news-excerpt">
                                    {item.excerpt || item.text.substring(0, 150).replace(/<[^>]*>/g, '')}...
                                </p>
                                <Link to={`/news/${item.id}`} className="btn">
                                    Читати більше
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default  NewsListPage;