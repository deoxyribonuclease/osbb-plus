const News = require("../models/news");
const {Sequelize} = require("sequelize");

const getAll = async () => {
    return await News.findAll();
};

const get = async (id) => {
    return await News.findByPk(id);
};

const getNewsNeighbors = async (id) => {
    const currentNews = await News.findByPk(id);
    if (!currentNews) return null;
    const [previousNews, nextNews] = await Promise.all([
        News.findOne({
            where: {
                date: { [Sequelize.Op.lt]: currentNews.date }
            },
            order: [['date', 'DESC']],
            limit: 1
        }),
        News.findOne({
            where: {
                date: { [Sequelize.Op.gt]: currentNews.date }
            },
            order: [['date', 'ASC']],
            limit: 1
        })
    ]);

    return {
        previous: previousNews,
        next: nextNews
    };
};

const add = async (newsData) => {
    const { title, text, image, date } = newsData;
    return await News.create({ title, text, image, date });
};

const update = async (id, newsData) => {
    const { title, text, image, date } = newsData;
    const newsItem = await News.findByPk(id);
    if (newsItem) {
        newsItem.title = title || newsItem.title;
        newsItem.text = text || newsItem.text;
        newsItem.image = image || newsItem.image;
        newsItem.date = date || newsItem.date;

        await newsItem.save();
        return newsItem;
    }
    return null;
};

const del = async (id) => {
    const newsItem = await News.findByPk(id);
    if (newsItem) {
        await newsItem.destroy();
        return true;
    }
    return false;
};

module.exports = { getAll, get, add, update, del,getNewsNeighbors };
