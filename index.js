const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();
const database = require('./config/database');
const Routes = require('./routes/routes');
const User = require('./models/Users/user');
const Affiliate = require('./models/Affiliate/affiliate');
const Product = require('./models/Product/product');
const Order = require('./models/Order/order');
const Commission = require('./models/Affiliate/commission');

const app = express();

app.use(
    cors({
        credentials: true,
        origin: true
    })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', Routes)

database.authenticate().then(async () => {
    console.log('Database connected');
    // await database.sync({ alter: true });
}).catch(err => console.log(`Error: ${err}`));

app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT}`);
});
