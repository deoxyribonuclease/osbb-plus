import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";
import { getNewsById, getNewsNeighborsById } from "../../api/newsApi.jsx";
import Loader from "../layout/Loader.jsx";
import {Link, useParams} from "react-router-dom";

const NewsDetailPage = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [neighbors, setNeighbors] = useState({ prev: null, next: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            window.scrollTo(0, 0);
            try {
                const newsData = await getNewsById(id);
                setNews(newsData);
                try {
                    const neighborsData = await getNewsNeighborsById(id);
                    setNeighbors(neighborsData);
                } catch (neighborError) {
                    console.error("Error loading neighbor news:", neighborError);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to load news article");
                setLoading(false);
                console.error("Error loading news article:", err);
            }
        };

        fetchNewsDetail();
    }, [id]);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    minHeight: "60vh",
                    width: "100%"
                }}
            >
                <Loader />
            </div>
        );
    }

    if (error) return <div className="error-message">{error}</div>;
    if (!news) return <div className="not-found">News article not found</div>;

    const options = {
        transform: (node, index) => {
            if (node.type === 'tag' && node.name === 'blockquote') {
                return <blockquote key={index} className="article-quote">{ReactHtmlParser(node.children[0].data)}</blockquote>;
            }
            return undefined;
        }
    };

    return (
        <div className="single-news"  style={{minHeight:'100hv'}}>
            {news.image && (
                <div className="article-image-wrapper">
                    <img
                        src={news.image}
                        alt={news.title}
                        className="article-image"
                        onError={(e) => {e.target.src = '/placeholder-image.jpg'}}
                    />
                    <div className="article-image-number-container">
                        <div className="article-image-number">
                            {news.title}
                        </div>
                    </div>
                </div>
            )}
            <div className="news-container">
                <div className="article-preview">
                    {!news.image && (
                        <h1 className="article-title">{news.title}</h1>
                    )}
                    <div className="article-content">
                        {ReactHtmlParser(news.text, options)}
                    </div>
                    <div className="article-date">
                        {news.date ? "ОСББ+ " + new Date(news.date).toLocaleDateString('uk-UA')  : new Date().toLocaleDateString('uk-UA')}
                        {news.author && ` | Автор: ${news.author}`}
                    </div>
                </div>

                <div className="news-navigation">
                    {neighbors.previous ? (
                        <Link
                            to={`/news/${neighbors.previous.id}`}
                            className="nav-button prev-button"
                            style={{
                                backgroundImage: neighbors.previous.image ? `url(${neighbors.previous.image})` : 'none'
                            }}
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            <div className="nav-button-content">
                                <div className="nav-direction">🡸 Попередня</div>
                                <div className="nav-title">{neighbors.previous.title || "тайтл..."}</div>
                            </div>
                        </Link>
                    ) : (
                        <div></div>
                    )}
                    {neighbors.next ? (
                        <Link
                            to={`/news/${neighbors.next.id}`}
                            className="nav-button next-button"
                            style={{
                                backgroundImage: neighbors.next.image ? `url(${neighbors.next.image})` : 'none'
                            }}
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            <div className="nav-button-content">
                                <div className="nav-direction">Наступна 🡺</div>
                                <div className="nav-title">{neighbors.next.title || "тайтл..."}</div>
                            </div>
                        </Link>
                    ) : (
                        <div> </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsDetailPage;