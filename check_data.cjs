const s = require('./src/data/modelStrengths');
const m = require('./src/data/models');
const r = require('./src/data/rankings');
console.log('strengths:', s.strengths?.length ?? 'undefined');
console.log('models:', m.models?.length ?? m.default?.length ?? 'undefined');
console.log('ranking WEEKLY:', r.WEEKLY_RANKING?.length ?? 'undefined');
console.log('ranking TOP:', r.TOP_RANKING?.length ?? 'undefined');
