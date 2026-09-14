import { CATALOG as MODERN_CATALOG } from './catalog.mjs';
import { LEGACY_500_PLUS, LEGACY_NAMED_COUNT, LEGACY_GENERATED_COUNT } from './legacy-500-plus.mjs';
const merged = new Map();
for (const t of MODERN_CATALOG) merged.set(t.slug, t);
for (const t of LEGACY_500_PLUS) if (!merged.has(t.slug)) merged.set(t.slug, t);
// Dedicated production-grade media studio route; the historical registry remains untouched.
merged.set('watermark-remover', {slug:'watermark-remover', name:'AI & Video Watermark Remover', category:'image-editing-and-utility-tools', categoryName:'Image Editing & Utility Tools', phase:1, engine:'watermark'});
export const CATALOG = [...merged.values()];
export const MODERN_TOOL_COUNT = MODERN_CATALOG.length;
export const LEGACY_TOOL_COUNT = LEGACY_500_PLUS.length;
export const LEGACY_NAMED_TOOL_COUNT = LEGACY_NAMED_COUNT;
export const LEGACY_GENERATED_TOOL_COUNT = LEGACY_GENERATED_COUNT;
export const RESTORED_LEGACY_COUNT = CATALOG.length - MODERN_CATALOG.length;
if (MODERN_CATALOG.length !== 1009) throw new Error(`Modern catalog integrity failure: ${MODERN_CATALOG.length}`);
if (LEGACY_NAMED_COUNT !== 200 || LEGACY_GENERATED_COUNT !== 400 || LEGACY_500_PLUS.length !== 600) throw new Error(`Legacy catalog integrity failure: ${LEGACY_500_PLUS.length}`);
if (new Set(CATALOG.map(x => x.slug)).size !== CATALOG.length) throw new Error('Combined catalog contains duplicate slugs');
if (!CATALOG.some(x => x.slug === 'watermark-remover' && x.engine === 'watermark')) throw new Error('Watermark remover route missing');
console.log(`Combined catalog: ${MODERN_CATALOG.length} modern + ${LEGACY_500_PLUS.length} historical + dedicated watermark studio, ${RESTORED_LEGACY_COUNT} historical routes, ${CATALOG.length} unique total.`);
