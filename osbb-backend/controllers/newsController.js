const { Sequelize } = require('sequelize');
const newsService = require('../services/newsService');

const getAllNews = async (req, res) => {
    try {
        const news = await newsService.getAll();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve news: ${error.message}` });
    }
};

const getNewsById = async (req, res) => {
    const { id } = req.params;
    try {
        const newsItem = await newsService.get(id);
        if (newsItem) {
            res.status(200).json(newsItem);
        } else {
            res.status(404).json({ error: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get news: ${error.message}` });
    }
};

const getNewsNeighbors = async (req, res) => {
    const { id } = req.params;
    try {
        const newsData = await newsService.getNewsNeighbors(id);
        if (newsData) {
            res.status(200).json({
                previous: newsData.previous,
                next: newsData.next
            });
        } else {
            res.status(404).json({ error: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to get news with neighbors: ${error.message}` });
    }
};

const createNews = async (req, res) => {
    const { title, text, image, date } = req.body;
    try {
        const newNews = await newsService.add({ title, text, image, date });
        res.status(201).json(newNews);
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};

const updateNews = async (req, res) => {
    const { id } = req.params;
    const { title, text, image, date } = req.body;
    try {
        const updatedNews = await newsService.update(id, { title, text, image, date });
        if (updatedNews) {
            res.status(200).json(updatedNews);
        } else {
            res.status(404).json({ error: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update news: ${error.message}` });
    }
};

const deleteNews = async (req, res) => {
    const { id } = req.params;
    try {
        if (await newsService.del(id)) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to delete news: ${error.message}` });
    }
};

module.exports = { getAllNews, getNewsById, createNews, updateNews, deleteNews,getNewsNeighbors };
