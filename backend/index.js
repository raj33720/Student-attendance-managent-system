require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const studentRoutes = require('./routes/StudentRoutes')
const teacherRoutes = require('./routes/TeacherRoutes')
const adminRoutes = require('./routes/AdminRoutes')
const connectDB = require('./config/conn');

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', adminRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Listening on port ", PORT);
        })
    })
    .catch(() => {
        process.exit(1);
    });
