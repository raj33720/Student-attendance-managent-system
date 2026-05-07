const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        contact: { type: String, required: true, trim: true },
        branch: { type: String, required: true, trim: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

TeacherSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
