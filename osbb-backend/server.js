const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const { ip, port } = require('./config');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

require('./models/User');
require('./models/House');
require('./models/Apartment');
require('./models/Resident');
require('./models/Meter');
require('./models/RepairApplication');
require('./models/Notification');
require('./models/News');
require('./models/PaymentHistory');
require('./models/Balance');
require('./models/UserNotification');
require('./models/Expense');
require('./models/OSBB');

require('./models/associations');

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Error creating database tables:', error);
    });

const userRoute = require('./routes/userRoutes');
app.use('/users', userRoute);

const osbbRoute = require('./routes/osbbRoutes');
app.use('/osbb', osbbRoute);

const houseRoute = require('./routes/houseRoutes');
app.use('/house', houseRoute);

const apartmentRoute = require('./routes/apartmentRoutes');
app.use('/apartment', apartmentRoute);

const residentRoute = require('./routes/residentRoutes');
app.use('/resident', residentRoute);

const meterRoute = require('./routes/meterRoutes');
app.use('/meter', meterRoute);

const repairApplicationRoute = require('./routes/repairApplicationRoutes');
app.use('/rep-apl', repairApplicationRoute);

const notificationRoute = require('./routes/notificationRoutes');
app.use('/notification', notificationRoute);

const newsRoute = require('./routes/newsRoutes');
app.use('/news', newsRoute);

const paymentRoute = require('./routes/paymentRoutes');
app.use('/payment', paymentRoute);

const authRoute = require('./routes/authRoutes');
app.use('/auth', authRoute);

const expenseRoute = require('./routes/expenseRoutes');
app.use('/expense', expenseRoute);

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});


app.listen(port, ip, () => {
    console.log(`Server is running on: ${ip}:${port}`);
});
