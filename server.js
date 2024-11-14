const express = require('express')
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimits = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();
const PORT = 3008;

const limiter = rateLimits.rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
});

const corsOptions = {
    methods: ['GET','POST','PUT','DELETE']
}
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use('/api/users', userRoutes)


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})