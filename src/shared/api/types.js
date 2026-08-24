/**
 * Domain shapes shared by both API implementations.
 * JSDoc rather than TypeScript so editors get completion without a build step.
 *
 * @typedef {{ en: string, ar: string }} Localised
 *
 * @typedef {Object} Question
 * @property {string} id
 * @property {Localised} text
 * @property {string} type        one of QUESTION_TYPE
 * @property {string} topic       one of TOPIC
 * @property {string} difficulty  one of DIFFICULTY
 * @property {number} marks
 * @property {string} source      one of QUESTION_SOURCE — immutable after creation
 * @property {string} status      one of QUESTION_STATUS
 *
 * @typedef {Object} BankCounts
 * @property {number} total
 * @property {number} inReview
 * @property {number} approved
 * @property {number} rejected
 *
 * @typedef {Object} BlueprintRow
 * @property {string} topic
 * @property {number} weight  percentage of the total
 * @property {number} easy
 * @property {number} medium
 * @property {number} hard
 *
 * @typedef {Object} Blueprint
 * @property {string} assessmentId
 * @property {Localised} name
 * @property {string} assessmentType
 * @property {number} totalMarks
 * @property {number} durationMinutes
 * @property {number} attemptLimit
 * @property {boolean} complete
 * @property {BlueprintRow[]} rows
 *
 * @typedef {Object} AssembledForm
 * @property {string} id
 * @property {number} items
 * @property {number} marks
 * @property {number} seed
 * @property {string} status
 * @property {Localised} note
 *
 * @typedef {Object} WorkItem
 * @property {string} id
 * @property {Localised} name
 * @property {string} status  one of WORK_STATUS
 *
 * @typedef {Object} Placement
 * @property {string} id
 * @property {string} level        one of ACADEMIC_LEVEL
 * @property {Localised} title     the parent — session/course/diploma name
 * @property {?WorkItem} quiz      at most one per session; null elsewhere or if unset
 * @property {WorkItem[]} assignments
 * @property {Localised} note
 *
 * @typedef {Object} AuditEntry
 * @property {string} time     HH:MM
 * @property {string} user     actor identity
 * @property {string} action   e.g. "POST /questions/QB-1051/review"
 * @property {string} outcome  "success" | "denied"
 * @property {string} detail   status code as a string
 * @property {string} source   source network address
 *
 * @typedef {Object} Attempt
 * @property {string} id
 * @property {Localised} assessmentTitle
 * @property {string} assessmentType
 * @property {string} form
 * @property {number} attemptNumber
 * @property {number} attemptLimit
 * @property {number} remainingSeconds  server-authoritative
 * @property {number} totalQuestions
 * @property {number} currentIndex
 * @property {?string} lastSavedAt
 * @property {boolean} submitted
 */

export {};
