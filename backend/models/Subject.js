const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        course: { type: String, required: true, trim: true },
        branch: { type: String, required: true, trim: true },
        semester: { type: String, required: true, trim: true },
        year: { type: String, required: true, trim: true },
        teacher_id: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

SubjectSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);
