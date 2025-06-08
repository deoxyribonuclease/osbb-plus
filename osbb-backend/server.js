const express = require('express');
const cors = require('cors');
const sequelize = require('./db');


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
require('./models/Osbb');

require('./models/associations');

sequelize.sync({ force: false })
    .then(() => console.log('Database & tables created!'))
    .catch((error) => console.error('Error creating database tables:', error));

app.use('/users', require('./routes/userRoutes'));
app.use('/osbb', require('./routes/osbbRoutes'));
app.use('/house', require('./routes/houseRoutes'));
app.use('/apartment', require('./routes/apartmentRoutes'));
app.use('/resident', require('./routes/residentRoutes'));
app.use('/meter', require('./routes/meterRoutes'));
app.use('/rep-apl', require('./routes/repairApplicationRoutes'));
app.use('/notification', require('./routes/notificationRoutes'));
app.use('/news', require('./routes/newsRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
