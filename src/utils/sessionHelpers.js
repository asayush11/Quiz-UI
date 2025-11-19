// Utilities for storing and reading quiz state in sessionStorage
export function getQuestions() {
    try {
        return JSON.parse(sessionStorage.getItem('questions') || '[]');
    } catch (e) {
        return [];
    }
}

export function setQuestions(qs) {
    sessionStorage.setItem('questions', JSON.stringify(qs || []));
}

export function getAnswers() {
    try {
        const raw = JSON.parse(sessionStorage.getItem('answers') || '[]');
        if (!Array.isArray(raw)) return [];
        // Normalize legacy object entries to selected-only values
        return raw.map((a) => (a && typeof a === 'object' && 'selected' in a ? a.selected : a));
    } catch (e) {
        return [];
    }
}

export function initAnswers(n) {
    const size = Math.max(0, parseInt(n) || 0);
    sessionStorage.setItem('answers', JSON.stringify(Array(size).fill(null)));
}

export function ensureAnswersLength(n) {
    const answers = getAnswers();
    const size = Math.max(0, parseInt(n) || 0);
    if (answers.length === size || size === 0) return;
    const resized = Array(size).fill(null);
    for (let i = 0; i < Math.min(answers.length, size); i++) resized[i] = answers[i];
    sessionStorage.setItem('answers', JSON.stringify(resized));
}

export function setAnswer(index, value) {
    const answers = getAnswers();
    const i = parseInt(index) || 0;
    if (answers.length <= i) {
        ensureAnswersLength(i + 1);
    }
    const updated = getAnswers();
    updated[i] = typeof value === 'undefined' ? null : value;
    sessionStorage.setItem('answers', JSON.stringify(updated));
}

export function clearAnswer(index) {
    setAnswer(index, null);
}

export function getCurrent() {
    return parseInt(sessionStorage.getItem('current') || '0');
}

export function setCurrent(i) {
    sessionStorage.setItem('current', String(i || 0));
}

export function getTotalTime() {
    return parseInt(sessionStorage.getItem('totalTime') || '0');
}

export function setTotalTime(t) {
    sessionStorage.setItem('totalTime', String(t || 0));
}

export function getCategory() {
    return sessionStorage.getItem('category') || '';
}

export function setCategory(cat) {
    sessionStorage.setItem('category', cat || '');
}

export function setCorrectAnswers() {
    const questions = getQuestions();
    const correctAnswers = questions.map(q => q.correct);
    sessionStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
}

export function getCorrectAnswers() {
    try {
        return JSON.parse(sessionStorage.getItem('correctAnswers') || '[]');
    } catch (e) {
        return [];
    }
}

export function clearAll() {
    sessionStorage.clear();
}

export function clearQuiz() {
    sessionStorage.removeItem('answers');
    sessionStorage.removeItem('questions');
    sessionStorage.removeItem('current');
    sessionStorage.removeItem('totalTime');
    sessionStorage.removeItem('category');
    sessionStorage.removeItem('correctAnswers');
    sessionStorage.removeItem('marked');
}

// Marked-for-review helpers
export function getMarked() {
    try {
        const raw = JSON.parse(sessionStorage.getItem('marked') || '[]');
        return Array.isArray(raw) ? raw : [];
    } catch (e) {
        return [];
    }
}

export function initMarked(n) {
    const size = Math.max(0, parseInt(n) || 0);
    sessionStorage.setItem('marked', JSON.stringify(Array(size).fill(false)));
}

export function ensureMarkedLength(n) {
    const marked = getMarked();
    const size = Math.max(0, parseInt(n) || 0);
    if (marked.length === size || size === 0) return;
    const resized = Array(size).fill(false);
    for (let i = 0; i < Math.min(marked.length, size); i++) resized[i] = marked[i];
    sessionStorage.setItem('marked', JSON.stringify(resized));
}

export function toggleMarked(index) {
    const marked = getMarked();
    const i = parseInt(index) || 0;
    if (marked.length <= i) ensureMarkedLength(i + 1);
    const updated = getMarked();
    updated[i] = !updated[i];
    sessionStorage.setItem('marked', JSON.stringify(updated));
}
