
const User = require('./User');
const Osbb = require('./Osbb');
const Apartment = require('./Apartment');
const House = require('./House');
const Meter = require('./Meter');
const Resident = require('./Resident');
const RepairApplication = require('./RepairApplication');
const PaymentHistory = require('./PaymentHistory');
const Notification = require('./Notification');
const UserNotification = require('./UserNotification');
const Balance = require('./Balance');
const Expense = require('./Expense');


User.hasOne(Osbb, { foreignKey: 'userId', onDelete: 'CASCADE'  });
Osbb.belongsTo(User, { foreignKey: 'userId' });

Apartment.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Notification, { through: UserNotification, foreignKey: 'userId' });
Notification.belongsToMany(User, { through: UserNotification, foreignKey: 'notificationId' });

Osbb.hasMany(Expense, { foreignKey: 'osbbId', onDelete: 'CASCADE' });
Expense.belongsTo(Osbb, { foreignKey: 'osbbId' });

Osbb.hasMany(House, { foreignKey: 'osbbId', onDelete: 'CASCADE' });
House.belongsTo(Osbb, { foreignKey: 'osbbId' });

House.hasMany(Apartment, { foreignKey: 'houseId', onDelete: 'CASCADE' });
Apartment.belongsTo(House, { foreignKey: 'houseId' });

Apartment.hasMany(Resident, { foreignKey: 'apartmentId', onDelete: 'CASCADE' });
Resident.belongsTo(Apartment, { foreignKey: 'apartmentId' });

Apartment.hasMany(Meter, { foreignKey: 'apartmentId', onDelete: 'CASCADE' });
Meter.belongsTo(Apartment, { foreignKey: 'apartmentId' });

Apartment.hasMany(Balance, { foreignKey: 'apartmentId', onDelete: 'CASCADE' });
Balance.belongsTo(Apartment, { foreignKey: 'apartmentId' });

Apartment.hasMany(RepairApplication, { foreignKey: 'apartmentId', onDelete: 'CASCADE' });
RepairApplication.belongsTo(Apartment, { foreignKey: 'apartmentId' });

Apartment.hasMany(PaymentHistory, { foreignKey: 'apartmentId', onDelete: 'CASCADE' });
PaymentHistory.belongsTo(Apartment, { foreignKey: 'apartmentId' });


module.exports = { Osbb, Apartment, House, Meter, Resident, User, RepairApplication, PaymentHistory, Notification, UserNotification, Balance, Expense };