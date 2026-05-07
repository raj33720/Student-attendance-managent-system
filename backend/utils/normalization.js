const normalizeText = (value) => (value ?? '').toString().trim();

const normalizeLower = (value) => normalizeText(value).toLowerCase();

const normalizeUpper = (value) => normalizeText(value).toUpperCase();

const normalizeCompact = (value) =>
    normalizeLower(value)
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]/g, '');

const escapeRegex = (value) =>
    normalizeText(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const exactCI = (value) => new RegExp(`^${escapeRegex(value)}$`, 'i');

const BRANCH_ALIASES = {
    CSE: [
        'CSE',
        'CS',
        'Computer Science',
        'Computer Science & Engineering',
        'Computer Science and Engineering'
    ],
    ECE: [
        'ECE',
        'Electronics and Communication',
        'Electronics & Communication',
        'Electronics and Communication Engineering',
        'Electronics & Communication Engineering'
    ],
    EEE: [
        'EEE',
        'Electrical and Electronics',
        'Electrical & Electronics',
        'Electrical and Electronics Engineering',
        'Electrical & Electronics Engineering'
    ],
    ME: ['ME', 'Mechanical', 'Mechanical Engineering'],
    CE: ['CE', 'Civil', 'Civil Engineering']
};

const COURSE_ALIASES = {
    btech: ['btech', 'b-tech', 'be', 'b.e', 'bachelor of technology'],
    mtech: ['mtech', 'm-tech', 'me', 'm.e', 'master of technology']
};

const findCanonicalByAlias = (value, aliases) => {
    const compact = normalizeCompact(value);
    if (!compact) return '';

    for (const [canonical, list] of Object.entries(aliases)) {
        const all = [canonical, ...list];
        const matched = all.some((entry) => normalizeCompact(entry) === compact);
        if (matched) return canonical;
    }
    return '';
};

const canonicalBranch = (value) => findCanonicalByAlias(value, BRANCH_ALIASES);

const canonicalCourse = (value) => findCanonicalByAlias(value, COURSE_ALIASES);

const normalizeYearOrSemester = (value) => {
    const normalized = normalizeText(value);
    if (!normalized) return '';
    const digits = normalized.replace(/[^\d]/g, '');
    return digits || normalized;
};

const normalizeRoll = (value) => normalizeUpper(value);

const normalizeSubjectCode = (value) => normalizeUpper(value);

const branchFilter = (value) => {
    const canonical = canonicalBranch(value);
    if (!canonical) {
        const raw = normalizeText(value);
        return raw ? exactCI(raw) : null;
    }
    const variants = [canonical, ...BRANCH_ALIASES[canonical]]
        .flatMap((entry) => [entry, normalizeLower(entry), normalizeUpper(entry)])
        .concat([canonical.toLowerCase(), canonical.toUpperCase()]);
    return { $in: [...new Set(variants.map((v) => normalizeText(v)).filter(Boolean))] };
};

const courseFilter = (value) => {
    const canonical = canonicalCourse(value);
    if (!canonical) {
        const raw = normalizeText(value);
        return raw ? exactCI(raw) : null;
    }
    const variants = [canonical, ...COURSE_ALIASES[canonical]]
        .flatMap((entry) => [entry, normalizeLower(entry), normalizeUpper(entry)]);
    return { $in: [...new Set(variants.map((v) => normalizeText(v)).filter(Boolean))] };
};

const numericStringFilter = (value) => {
    const normalized = normalizeYearOrSemester(value);
    if (!normalized) return null;
    const asNumber = Number(normalized);
    if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
        // Accept both normalized numeric values ("4") and legacy textual forms
        // like "4th Year", "Sem 4", etc.
        return new RegExp(`(^|\\D)0*${escapeRegex(normalized)}(\\D|$)`, 'i');
    }
    return exactCI(normalized);
};

module.exports = {
    normalizeText,
    normalizeLower,
    normalizeUpper,
    exactCI,
    canonicalBranch,
    canonicalCourse,
    normalizeYearOrSemester,
    normalizeRoll,
    normalizeSubjectCode,
    branchFilter,
    courseFilter,
    numericStringFilter
};
