const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
    {
        roll: { type: String, required: true, trim: true },
        year: { type: String, required: true, trim: true },
        semester: { type: String, required: true, trim: true },
        course: { type: String, trim: true, default: '' },
        branch: { type: String, trim: true, default: '' },
        subject: { type: String, required: true, trim: true },
        status: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        dateKey: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

AttendanceSchema.index({ roll: 1, subject: 1, year: 1, dateKey: 1 });

AttendanceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
    }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
