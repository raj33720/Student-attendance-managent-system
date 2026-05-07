const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');

const btechBranches = ['CSE', 'ECE', 'EEE', 'ME', 'CE'];

const makeRoll = (course, branch, year, idx) => {
  // Example roll: BT-CSE-1-001
  const prefix = course === 'btech' ? 'BT' : 'MT';
  return `${prefix}-${branch}-${year}-${String(idx).padStart(3, '0')}`;
};

const buildStudents = () => {
  const docs = [];
  // create 10 students per branch per year
  btechBranches.forEach((branch) => {
    for (let year = 1; year <= 4; year++) {
      for (let i = 1; i <= 6; i++) {
        const roll = makeRoll('btech', branch, year, i + (year - 1) * 10);
        docs.push({
          name: `Student ${branch}${year}${i}`,
          roll,
          email: `${roll.replace(/-/g, '')}@example.edu`,
          contact: '9999999999',
          course: 'btech',
          year: String(year),
          branch,
          semester: String(year * 2),
          password: 'password123'
        });
      }
    }
  });

  return docs;
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const toInsert = buildStudents();

    const existingRolls = new Set((await Student.find({}).select('roll').lean()).map((s) => s.roll));
    const filtered = toInsert.filter((d) => !existingRolls.has(d.roll));
    if (!filtered.length) {
      console.log('No new students to insert.');
      process.exit(0);
    }

    // Hash passwords
    for (const doc of filtered) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }

    await Student.insertMany(filtered);
    console.log(`Inserted ${filtered.length} students.`);
  } catch (err) {
    console.error('Student seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
