/**
 * data.js — Curriculum index.
 *
 * Aggregates all stage arrays (loaded as globals by <script> tags in index.html)
 * into a single searchable structure. Also validates the schema on boot.
 *
 * Data files expose globals: PY_S1, PY_S2 ... CS_S1 ... ML_S1 ... ML_S6
 */

/** All stages across all tracks, in display order. */
export const ALL_STAGES = [
  // Python
  ...(window.PY_S1 ? [window.PY_S1] : []),
  ...(window.PY_S2 ? [window.PY_S2] : []),
  ...(window.PY_S3 ? [window.PY_S3] : []),
  ...(window.PY_S4 ? [window.PY_S4] : []),
  ...(window.PY_S5 ? [window.PY_S5] : []),
  // CS
  ...(window.CS_S1 ? [window.CS_S1] : []),
  ...(window.CS_S2 ? [window.CS_S2] : []),
  // ML
  ...(window.ML_S1 ? [window.ML_S1] : []),
  ...(window.ML_S2 ? [window.ML_S2] : []),
  ...(window.ML_S3 ? [window.ML_S3] : []),
  ...(window.ML_S4 ? [window.ML_S4] : []),
  ...(window.ML_S5 ? [window.ML_S5] : []),
  ...(window.ML_S6 ? [window.ML_S6] : []),
];

/** Flat list of all topics with stageId and track injected. */
export const ALL_TOPICS = ALL_STAGES.flatMap(stage =>
  stage.topics.map(topic => ({ ...topic, stageId: stage.id, track: stage.track }))
);

/** Lookup a stage by its ID. */
export function getStage(stageId) {
  return ALL_STAGES.find(s => s.id === stageId) || null;
}

/** Lookup a topic by its ID. */
export function getTopic(topicId) {
  return ALL_TOPICS.find(t => t.id === topicId) || null;
}

/** All stages for a given track. */
export function stagesForTrack(track) {
  return ALL_STAGES.filter(s => s.track === track);
}

/** All topics for a given track, in order. */
export function topicsForTrack(track) {
  return ALL_TOPICS.filter(t => t.track === track);
}

/**
 * Validate all loaded topic objects against the required schema.
 * Logs warnings for any violations — caught at boot time.
 */
export function validateSchema() {
  const required = ['id','name','desc','explanation','code','cheatsheet','exercises','resources'];
  const seenIds = new Set();
  let warnings = 0;

  for (const topic of ALL_TOPICS) {
    for (const field of required) {
      if (topic[field] === undefined || topic[field] === null) {
        console.warn(`[PyHub schema] Topic "${topic.id}" missing field: ${field}`);
        warnings++;
      }
    }
    if (seenIds.has(topic.id)) {
      console.warn(`[PyHub schema] Duplicate topic ID: "${topic.id}"`);
      warnings++;
    }
    seenIds.add(topic.id);
  }

  if (warnings === 0) {
    console.info(`[PyHub] Schema valid — ${ALL_TOPICS.length} topics across ${ALL_STAGES.length} stages`);
  } else {
    console.warn(`[PyHub] Schema validation: ${warnings} warning(s) found`);
  }
}
