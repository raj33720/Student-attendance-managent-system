const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        roll: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, trim: true },
        contact: { type: String, required: true, trim: true },
        course: { type: String, required: true, trim: true },
        year: { type: String, required: true, trim: true },
        branch: { type: String, required: true, trim: true },
        semester: { type: String, required: true, trim: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

StudentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('Student', StudentSchema);
