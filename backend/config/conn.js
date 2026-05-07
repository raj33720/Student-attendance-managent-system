const mongoose = require('mongoose');

const MONGO_URI =
    process.env.MONGO_URI || 'mongodb+srv://rajh33720_db_user:Raj15@cluster0.bg0rpn9.mongodb.net/college_attendance?retryWrites=true&w=majority';

const connectDB = async() => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection established');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        throw error;
    }
};

module.exports = connectDB;