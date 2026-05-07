const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('./models/Subject');
const {
    normalizeLower,
    normalizeText,
    normalizeSubjectCode,
    canonicalBranch,
    canonicalCourse,
    normalizeYearOrSemester
} = require('./utils/normalization');

const btechBranches = ['CSE', 'ECE', 'EEE', 'ME', 'CE'];
const mtechBranches = ['CSE', 'ECE'];

const btechCommonYear1 = {
    1: [
        'Engineering Mathematics-I',
        'Engineering Physics',
        'Basic Electrical Engineering',
        'Programming for Problem Solving'
    ],
    2: [
        'Engineering Mathematics-II',
        'Engineering Chemistry',
        'Engineering Mechanics',
        'Workshop Practice'
    ]
};

const btechBranchPlans = {
    CSE: {
        3: ['Data Structures', 'Digital Logic', 'Discrete Mathematics', 'Object Oriented Programming'],
        4: ['Computer Organization', 'Operating Systems', 'Database Management Systems', 'Design and Analysis of Algorithms'],
        5: ['Computer Networks', 'Theory of Computation', 'Software Engineering', 'Web Technologies'],
        6: ['Compiler Design', 'Artificial Intelligence', 'Cloud Computing', 'Information Security'],
        7: ['Machine Learning', 'Distributed Systems', 'Big Data Engineering', 'DevOps and Automation'],
        8: ['Internet of Things', 'Blockchain Fundamentals', 'Deep Learning', 'Project and Seminar']
    },
    ECE: {
        3: ['Electronic Devices', 'Network Theory', 'Signals and Systems', 'Digital Electronics'],
        4: ['Analog Circuits', 'Microprocessors', 'Electromagnetic Theory', 'Probability and Random Processes'],
        5: ['Digital Signal Processing', 'Communication Systems', 'Control Systems', 'VLSI Design'],
        6: ['Embedded Systems', 'Antenna and Wave Propagation', 'Digital Communication', 'Microwave Engineering'],
        7: ['Wireless Communication', 'Optical Communication', 'Internet of Things', 'Mobile Communication'],
        8: ['Satellite Communication', 'RF System Design', 'Advanced VLSI', 'Project and Seminar']
    },
    EEE: {
        3: ['Circuit Theory', 'Electrical Machines-I', 'Electromagnetic Fields', 'Signals and Systems'],
        4: ['Electrical Machines-II', 'Power Electronics', 'Control Systems', 'Analog and Digital Electronics'],
        5: ['Power Systems-I', 'Microprocessors and Microcontrollers', 'Measurements and Instrumentation', 'Renewable Energy Systems'],
        6: ['Power Systems-II', 'Electrical Drives', 'High Voltage Engineering', 'Protection and Switchgear'],
        7: ['Smart Grid Technology', 'Power System Operation and Control', 'Electric Vehicles', 'Industrial Automation'],
        8: ['FACTS and HVDC', 'Energy Management', 'Power System Stability', 'Project and Seminar']
    },
    ME: {
        3: ['Engineering Thermodynamics', 'Mechanics of Solids', 'Manufacturing Processes', 'Fluid Mechanics'],
        4: ['Theory of Machines', 'Strength of Materials', 'Heat Transfer', 'Machine Drawing and CAD'],
        5: ['Internal Combustion Engines', 'Dynamics of Machines', 'Design of Machine Elements', 'Metrology and Quality Control'],
        6: ['Refrigeration and Air Conditioning', 'Finite Element Methods', 'Industrial Engineering', 'Robotics'],
        7: ['Automobile Engineering', 'CNC and Automation', 'Composite Materials', 'Renewable Energy Engineering'],
        8: ['Advanced Manufacturing', 'Operations Research', 'Maintenance Engineering', 'Project and Seminar']
    },
    CE: {
        3: ['Surveying', 'Strength of Materials', 'Building Materials and Construction', 'Fluid Mechanics'],
        4: ['Structural Analysis', 'Geotechnical Engineering-I', 'Transportation Engineering-I', 'Hydrology and Water Resources'],
        5: ['Reinforced Concrete Design', 'Environmental Engineering-I', 'Transportation Engineering-II', 'Geotechnical Engineering-II'],
        6: ['Steel Structure Design', 'Environmental Engineering-II', 'Open Channel Flow', 'Construction Planning and Management'],
        7: ['Design of Foundations', 'Bridge Engineering', 'Pavement Design', 'Earthquake Resistant Structures'],
        8: ['Quantity Surveying and Valuation', 'Advanced Concrete Technology', 'Tunnel Engineering', 'Project and Seminar']
    }
};

const mtechPlans = {
    CSE: {
        1: ['Advanced Algorithms', 'Advanced Database Systems', 'Machine Learning', 'Research Methodology'],
        2: ['Distributed Computing', 'Natural Language Processing', 'Cloud Infrastructure', 'Information Security'],
        3: ['Big Data Analytics', 'Advanced AI', 'Software Quality Assurance', 'Seminar'],
        4: ['Dissertation Phase-I', 'Dissertation Phase-II', 'Industry Internship', 'Technical Writing']
    },
    ECE: {
        1: ['Advanced Signal Processing', 'Digital Communication', 'VLSI System Design', 'Research Methodology'],
        2: ['Wireless Sensor Networks', 'Advanced Embedded Systems', 'Microwave Engineering', 'Optical Communication'],
        3: ['RF Integrated Circuits', 'Image and Video Processing', 'Antenna Design', 'Seminar'],
        4: ['Dissertation Phase-I', 'Dissertation Phase-II', 'Industry Internship', 'Technical Writing']
    }
};

const codeFor = (course, branch, semester, idx) => {
    const prefix = course === 'btech' ? 'BT' : 'MT';
    return `${prefix}${branch}${semester}${String(idx + 1).padStart(2, '0')}`;
};

const yearFromSemester = (semester) => {
    if (semester <= 2) return '1';
    if (semester <= 4) return '2';
    if (semester <= 6) return '3';
    return '4';
};

const buildDocs = () => {
    const docs = [];

    btechBranches.forEach((branch) => {
        Object.entries(btechCommonYear1).forEach(([semester, subjects]) => {
            subjects.forEach((name, idx) => {
                docs.push({
                    code: codeFor('btech', branch, Number(semester), idx),
                    name,
                    course: 'btech',
                    branch,
                    semester: String(semester),
                    year: '1',
                    teacher_id: 'TBD'
                });
            });
        });

        Object.entries(btechBranchPlans[branch]).forEach(([semester, subjects]) => {
            subjects.forEach((name, idx) => {
                docs.push({
                    code: codeFor('btech', branch, Number(semester), idx),
                    name,
                    course: 'btech',
                    branch,
                    semester: String(semester),
                    year: yearFromSemester(Number(semester)),
                    teacher_id: 'TBD'
                });
            });
        });
    });

    mtechBranches.forEach((branch) => {
        Object.entries(mtechPlans[branch]).forEach(([semester, subjects]) => {
            subjects.forEach((name, idx) => {
                docs.push({
                    code: codeFor('mtech', branch, Number(semester), idx),
                    name,
                    course: 'mtech',
                    branch,
                    semester: String(semester),
                    year: Number(semester) <= 2 ? '1' : '2',
                    teacher_id: 'TBD'
                });
            });
        });
    });

    return docs;
};

const normalizeExistingSubjects = async () => {
    const allSubjects = await Subject.find({});
    for (const subject of allSubjects) {
        const normalized = {
            code: normalizeSubjectCode(subject.code),
            name: normalizeText(subject.name),
            course: canonicalCourse(subject.course) || normalizeLower(subject.course),
            branch: canonicalBranch(subject.branch) || normalizeText(subject.branch),
            year: normalizeYearOrSemester(subject.year),
            semester: normalizeYearOrSemester(subject.semester),
            teacher_id: normalizeText(subject.teacher_id) || 'TBD'
        };

        const changed =
            normalized.code !== subject.code ||
            normalized.name !== subject.name ||
            normalized.course !== subject.course ||
            normalized.branch !== subject.branch ||
            normalized.year !== subject.year ||
            normalized.semester !== subject.semester ||
            normalized.teacher_id !== subject.teacher_id;

        if (changed) {
            await Subject.updateOne({ _id: subject._id }, { $set: normalized });
        }
    }
};

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await normalizeExistingSubjects();

        const targetDocs = buildDocs();
        const existingCodes = new Set(
            (await Subject.find({}).select('code').lean()).map((s) => normalizeSubjectCode(s.code))
        );

        const toInsert = targetDocs.filter((doc) => !existingCodes.has(doc.code));
        if (!toInsert.length) {
            console.log('No new subjects to insert.');
        } else {
            await Subject.insertMany(toInsert);
            console.log(`Inserted ${toInsert.length} subjects.`);
        }
    } catch (error) {
        console.error('Subject seeding failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
