import React, { useState, useEffect } from 'react';
import { getAllNews, getNewsById, createNews, updateNews, deleteNews } from '../../api/newsApi';
import ReactModal from "react-modal";
import { enqueueSnackbar } from 'notistack';
import ReactHtmlParser from 'react-html-parser';
import "./styles/newsManagment.css";
import Loader from "../layout/Loader.jsx";
import {FaSearch, FaSort} from "react-icons/fa";

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [currentNews, setCurrentNews] = useState({ title: '', text: '', image: '', date: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await getAllNews();
            setNews(data);
        } catch (err) {
            enqueueSnackbar("Помилка при завантаженні новин: " + err.message, {
                variant: "error",
                autoHideDuration: 2000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentNews(prev => ({
            ...prev,
            [name]: name === "date" ? new Date(value).toISOString().split('T')[0] : value
        }));
    };

    const resetForm = () => {
        setCurrentNews({ title: '', text: '', image: '', date: '' });
        setIsEditing(false);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing) {
                await updateNews(currentNews.id, currentNews);
                enqueueSnackbar("Новину успішно оновлено", {
                    variant: "success",
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            } else {
                await createNews({
                    ...currentNews,
                    date: currentNews.date ? new Date(currentNews.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                });
                enqueueSnackbar("Новину успішно створено", {
                    variant: "success",
                    autoHideDuration: 2000,
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            }

            resetForm();
            fetchNews();
        } catch (err) {
            const errorMessage = `Помилка при ${isEditing ? 'оновленні' : 'створенні'} новини`;
            enqueueSnackbar(errorMessage + ": " + err.message, {
                variant: "error",
                autoHideDuration: 2000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        setLoading(true);
        try {
            const newsItem = await getNewsById(id);
            setCurrentNews(newsItem);
            setIsEditing(true);
            setShowForm(true);
        } catch (err) {
            enqueueSnackbar("Помилка при завантаженні новини: " + err.message, {
                variant: "error",
                autoHideDuration: 2000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цю новину?')) return;

        setLoading(true);
        try {
            await deleteNews(id);
            fetchNews();
            enqueueSnackbar("Новину успішно видалено", {
                variant: "success",
                autoHideDuration: 2000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        } catch (err) {
            enqueueSnackbar("Помилка при видаленні новини: " + err.message, {
                variant: "error",
                autoHideDuration: 2000,
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        } finally {
            setLoading(false);
        }
    };

    const insertTag = (tag) => {
        const textField = document.getElementById('news-text');
        if (!textField) return;

        const startPos = textField.selectionStart;
        const endPos = textField.selectionEnd;
        const text = currentNews.text;

        const tagText = tag === 'blockquote' ? '<blockquote>\nТекст цитати\n</blockquote>' : '<p>\nТекст абзацу\n</p>';

        const newText =
            text.substring(0, startPos) +
            '\n' + tagText + '\n' +
            text.substring(endPos);

        setCurrentNews(prev => ({ ...prev, text: newText }));
        setTimeout(() => {
            const newCursorPos = startPos + tagText.indexOf('Текст');
            textField.focus();
            textField.setSelectionRange(newCursorPos, newCursorPos + 12);
        }, 0);
    };


    const handleAddNewClick = () => {
        setCurrentNews({ title: '', text: '', image: '', date: '' });
        setIsEditing(false);
        setShowForm(true);
    };

    const togglePreviewModal = () => {
        setShowPreviewModal(!showPreviewModal);
    };

    const handleImageAdd = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const encodedImage = await encodeToBase64(file);
            setCurrentNews(prev => ({
                ...prev,
                image: encodedImage
            }));
        }
    };

    const encodeToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAndSortedNews = news
        .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="news-management-container">
            <h1 className="news-title">Керування новинами</h1>
            {!showForm ? (
                <>
                    <div className="news-list-controls">
                        <div className="search-and-sort">
                            <div className="search-container">
                                <FaSearch className="icon-inline" />
                                <input
                                    type="text"
                                    placeholder="Пошук за назвою"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="search-input"
                                />
                            </div>
                            <div className="sort-container">
                                <FaSort className="icon-inline" />
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="desc">Спочатку новіші</option>
                                    <option value="asc">Спочатку старіші</option>
                                </select>
                            </div>
                            <button
                                onClick={handleAddNewClick}
                                className="add-button"
                            >
                                Додати новину
                            </button>
                        </div>
                    </div>

                    <div className="news-list-section">
                        {loading && <Loader></Loader>}

                        {!loading && filteredAndSortedNews.length === 0 && (
                            <p className="empty-message">
                                {searchTerm ? 'Немає новин, що відповідають критеріям пошуку' : 'Немає новин для відображення'}
                            </p>
                        )}

                        <div className="news-grid">
                            {filteredAndSortedNews.map((item) => (
                                <div key={item.id} className="news-card">
                                    <h3 className="news-card-title">{item.title}</h3>

                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="news-card-image"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg'
                                            }}
                                        />
                                    )}

                                    <p className="news-card-date">
                                        {new Date(item.date).toLocaleDateString('uk-UA')}
                                    </p>

                                    <p className="news-card-excerpt">
                                        {item.text.replace(/<[^>]*>?/gm, '')}
                                    </p>

                                    <div className="news-card-actions">
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="edit-button"
                                            disabled={loading}
                                        >
                                            Редагувати
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="delete-button"
                                            disabled={loading}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="news-form">
                        <h2 className="form-heading">{isEditing ? 'Редагування новини' : 'Створення новини'}</h2>

                        <div className="content">
                            <div className="left-column">
                                <div className="form-field">
                                    <label className="field-label" htmlFor="title">Заголовок</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={currentNews.title}
                                        onChange={handleInputChange}
                                        className="field-input"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="field-label" htmlFor="image">Зображення</label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        name="image-upload"
                                        onChange={handleImageAdd}
                                        className="field-input"
                                        accept="image/*"
                                    />
                                    <input
                                        type="url"
                                        id="image"
                                        name="image"
                                        value={currentNews.image}
                                        onChange={handleInputChange}
                                        className="field-input image-url-input"
                                        placeholder="або вставте URL зображення"
                                    />
                                    {currentNews.image && (
                                        <div className="image-preview">
                                            <img
                                                src={currentNews.image}
                                                alt="Превью"
                                                className="preview-image"
                                                onError={(e) => {e.target.src = '/placeholder-image.jpg'}}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label className="field-label" htmlFor="date">Дата</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={currentNews.date ? new Date(currentNews.date).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                        className="field-input"
                                    />

                                </div>

                                <div className="form-actions">
                                    {currentNews.text && (
                                        <button
                                            type="button"
                                            onClick={togglePreviewModal}
                                            className="secondary-button preview-button"
                                        >
                                            Попередній перегляд
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className="primary-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'Завантаження...' : isEditing ? 'Оновити' : 'Створити'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="secondary-button"
                                    >
                                        Скасувати
                                    </button>
                                </div>
                            </div>

                            <div className="right-column">
                                <div className="form-field text-field-container">
                                    <label className="field-label" htmlFor="news-text">Текст</label>
                                    <div className="button-container">
                                        <button type="button" onClick={() => insertTag('blockquote')}
                                                className="quote-button">
                                            Вставити цитату
                                        </button>
                                        <button type="button" onClick={() => insertTag('p')}
                                                className="quote-button">
                                            Вставити абзац
                                        </button>
                                    </div>

                                    <textarea
                                        id="news-text"
                                        name="text"
                                        value={currentNews.text}
                                        onChange={handleInputChange}
                                        className="field-textarea"
                                        rows="20"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
            )}

            {showPreviewModal && (
                <ReactModal
                    isOpen={showPreviewModal}
                    onRequestClose={togglePreviewModal}
                    contentLabel="Попередній перегляд новини"
                    className="modal-news-content"
                    overlayClassName="modal-news-overlay"
                >
                    <div className="modal-header">
                        <h2 className="modal-title">Попередній перегляд новини</h2>
                        <button onClick={togglePreviewModal} className="modal-close-button">×</button>
                    </div>
                    <div className="modal-body">
                        <NewsPreview news={currentNews} />
                    </div>
                </ReactModal>
            )}

            <footer className="news-bottom">
            </footer>
        </div>
    );
};

const NewsPreview = ({ news }) => {
    if (!news || !news.text) return null;

    const options = {
        transform: (node, index) => {
            if (node.type === 'tag' && node.name === 'blockquote') {
                return <blockquote key={index} className="news-quote">{ReactHtmlParser(node.children[0].data)}</blockquote>;
            }
            return undefined;
        }
    };

    return (
        <div className="news-preview">
            {news.image && (
                <div className="news-preview-image-container">
                    <img
                        src={news.image}
                        alt={news.title}
                        className="news-preview-image"
                        onError={(e) => {e.target.src = '/placeholder-image.jpg'}}
                    />
                    <div className="news-preview-image-overlay">
                        <h1 className="news-preview-title">{news.title}</h1>
                    </div>
                </div>
            )}

            {!news.image && (
                <h1 className="news-preview-title">{news.title}</h1>
            )}

            <p className="news-preview-date">
                {news.date ? new Date(news.date.split('T')[0]).toLocaleDateString('uk-UA') : new Date().toLocaleDateString('uk-UA')}
            </p>

            <div className="news-preview-content">
                {ReactHtmlParser(news.text, options)}
            </div>
        </div>
    );
};

export default NewsManagement;