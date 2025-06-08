const bcrypt = require("bcryptjs");
const User = require("../models/user");
const OSBB = require("../models/Osbb");
const {House, Apartment, B, Balance, Expense, Meter, PaymentHistory, RepairApplication, Resident, Notification} = require("../models/associations");
const {Sequelize} = require("sequelize");

const saltRounds = 10;

const getAll = async () => {
    return await User.findAll();
};

const get = async (id) => {
    return await User.findByPk(id);
};



const getAccountantsWithHierarchy = async () => {

 /*   console.log(Resident.associations);
    console.log(RepairApplication.associations);
    console.log(PaymentHistory.associations);
    console.log(Notification.associations);
    console.log(Meter.associations);
    console.log(Expense.associations);
    console.log(Balance.associations);
    console.log(Apartment.associations);
    console.log(User.associations);
    console.log(OSBB.associations);
    console.log(House.associations);
    console.log(Apartment.associations);*/


    const accountants = await User.findAll({
        where: { role: 'Accountant' },
        attributes: ['id', 'login','email'],
        include: [
            {
                model: OSBB,
                as: 'Osbb',
                attributes: ['name'],
                include: [
                    {
                        model: House,
                        as: 'Houses',
                        attributes: ['address'],
                        include: [
                            {
                                model: Apartment,
                                as: 'Apartments',
                                attributes: ['userId', 'number'],
                                where: {
                                    userId: {
                                        [Sequelize.Op.ne]: null
                                    }
                                },
                                include: [
                                    {
                                        model: User,
                                        as: 'User',
                                        attributes: ['id', 'login']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    return accountants;
};




const getByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const add = async (userData) => {
    const { login, password, role, phone, email, osbbName } = userData;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
        login,
        password: hashedPassword,
        role,
        phone,
        email
    }, {
        osbbName: osbbName,
        individualHooks: true
    });
    return newUser;
};

const update = async (id, userData) => {
    const { login, password, role, phone, email } = userData;
    const user = await User.findByPk(id);
    if (user) {
        user.login = login || user.login;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        if (password) {
            user.password = await bcrypt.hash(password, saltRounds);
        }

        await user.save();
        return user;
    }
    return null;
};

const del = async (id) => {
    const user = await User.findByPk(id);
    if (user) {
        await user.destroy();
        return true;
    }
    return false;
};

module.exports = { getAll, get, add, update, del, getByEmail ,getAccountantsWithHierarchy };
