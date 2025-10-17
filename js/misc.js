// ===== Miscellaneous Memory Management =====

/**
 * Miscellaneous Memory Map (Korean Version)
 * These addresses need verification on Korean version
 * Offsets are estimated based on other memory regions
 */
const MISC_MEMORY_MAP = {
    // Date/Time (estimated: International + 0xFD offset)
    // Note: These addresses need verification on actual Korean ROM
    DAY_OF_WEEK: 0xC3AF,  // International: 0xC2B2 + 0xFD (estimated)
    HOUR: 0xC3B0,          // International: 0xC2B3 + 0xFD (estimated)
    MINUTE: 0xC3B1         // International: 0xC2B4 + 0xFD (estimated)
};

// Global state
let dateTimeState = {
    dayOfWeek: 0,  // 0=Sunday, 1=Monday, ..., 6=Saturday
    hour: 0,       // 0-23
    minute: 0      // 0-59
};

/**
 * Day of week names in Korean
 */
const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * Calculate date/time memory
 * @returns {Array} Array of memory entries
 */
function calculateDateTimeMemory() {
    const entries = [];

    // Day of week
    entries.push({
        address: MISC_MEMORY_MAP.DAY_OF_WEEK,
        value: toHex(dateTimeState.dayOfWeek),
        description: `요일 (${DAY_NAMES[dateTimeState.dayOfWeek]})`
    });

    // Hour
    entries.push({
        address: MISC_MEMORY_MAP.HOUR,
        value: toHex(dateTimeState.hour),
        description: `시 (${dateTimeState.hour}시)`
    });

    // Minute
    entries.push({
        address: MISC_MEMORY_MAP.MINUTE,
        value: toHex(dateTimeState.minute),
        description: `분 (${dateTimeState.minute}분)`
    });

    return entries;
}

/**
 * Update date/time state
 * @param {String} field - 'dayOfWeek', 'hour', or 'minute'
 * @param {Number} value - New value
 */
function updateDateTime(field, value) {
    if (field === 'dayOfWeek') {
        dateTimeState.dayOfWeek = Math.max(0, Math.min(6, parseInt(value) || 0));
    } else if (field === 'hour') {
        dateTimeState.hour = Math.max(0, Math.min(23, parseInt(value) || 0));
    } else if (field === 'minute') {
        dateTimeState.minute = Math.max(0, Math.min(59, parseInt(value) || 0));
    }
}

/**
 * Reset date/time to default
 */
function resetDateTime() {
    dateTimeState = {
        dayOfWeek: 0,
        hour: 0,
        minute: 0
    };
}
