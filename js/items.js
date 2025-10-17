// ===== Items Management =====

/**
 * Items Memory Map (Korean Version)
 * Offset: +0xB3 (179 bytes) from International version
 */
const ITEMS_MEMORY_MAP = {
    // TM/HM (bit flags) - Not implemented yet
    TM_START: 0xD631,
    TM_END: 0xD662,
    HM_START: 0xD663,
    HM_END: 0xD669,

    // Items (max 20 slots)
    ITEMS_COUNT: 0xD66A,
    ITEMS_START: 0xD66B,
    ITEMS_MAX_SLOTS: 20,
    ITEMS_END_MARKER: 0xD693,

    // Key Items (max 25 slots, no amount!)
    KEY_ITEMS_COUNT: 0xD694,
    KEY_ITEMS_START: 0xD695,
    KEY_ITEMS_MAX_SLOTS: 25,
    KEY_ITEMS_END_MARKER: 0xD6AE,

    // Balls (max 12 slots)
    BALLS_COUNT: 0xD6AF,
    BALLS_START: 0xD6B0,
    BALLS_MAX_SLOTS: 12,
    BALLS_END_MARKER: 0xD6C8
};

// Global state
let itemSlots = [];      // { id: '0x12', amount: 50 }
let keyItemSlots = [];   // { id: '0x34' } (no amount)
let ballSlots = [];      // { id: '0x04', amount: 10 }

/**
 * Calculate items memory (도구)
 * @returns {Array} Array of memory entries
 */
function calculateItemsMemory() {
    const entries = [];
    const validItems = itemSlots.filter(slot => slot.id && slot.amount > 0);

    // Limit to max slots
    const items = validItems.slice(0, ITEMS_MEMORY_MAP.ITEMS_MAX_SLOTS);

    // Total count
    entries.push({
        address: ITEMS_MEMORY_MAP.ITEMS_COUNT,
        value: toHex(items.length),
        description: `도구 종류 개수 (${items.length})`
    });

    // Item pairs (ID + Amount)
    items.forEach((item, index) => {
        const baseAddr = ITEMS_MEMORY_MAP.ITEMS_START + (index * 2);

        entries.push({
            address: baseAddr,
            value: item.id,
            description: `도구 ${index + 1} - 종류`
        });

        entries.push({
            address: baseAddr + 1,
            value: toHex(item.amount),
            description: `도구 ${index + 1} - 개수 (${item.amount})`
        });
    });

    // End marker
    entries.push({
        address: ITEMS_MEMORY_MAP.ITEMS_END_MARKER,
        value: '0xFF',
        description: '도구 목록 종결자'
    });

    return entries;
}

/**
 * Calculate key items memory (중요한 도구)
 * @returns {Array} Array of memory entries
 */
function calculateKeyItemsMemory() {
    const entries = [];
    const validItems = keyItemSlots.filter(slot => slot.id);

    // Limit to max slots
    const items = validItems.slice(0, ITEMS_MEMORY_MAP.KEY_ITEMS_MAX_SLOTS);

    // Total count
    entries.push({
        address: ITEMS_MEMORY_MAP.KEY_ITEMS_COUNT,
        value: toHex(items.length),
        description: `중요한 도구 개수 (${items.length})`
    });

    // Key item IDs only (NO AMOUNT!)
    items.forEach((item, index) => {
        entries.push({
            address: ITEMS_MEMORY_MAP.KEY_ITEMS_START + index,
            value: item.id,
            description: `중요한 도구 ${index + 1}`
        });
    });

    // End marker
    entries.push({
        address: ITEMS_MEMORY_MAP.KEY_ITEMS_END_MARKER,
        value: '0xFF',
        description: '중요한 도구 목록 종결자'
    });

    return entries;
}

/**
 * Calculate balls memory (볼)
 * @returns {Array} Array of memory entries
 */
function calculateBallsMemory() {
    const entries = [];
    const validBalls = ballSlots.filter(slot => slot.id && slot.amount > 0);

    // Limit to max slots
    const balls = validBalls.slice(0, ITEMS_MEMORY_MAP.BALLS_MAX_SLOTS);

    // Total count
    entries.push({
        address: ITEMS_MEMORY_MAP.BALLS_COUNT,
        value: toHex(balls.length),
        description: `볼 종류 개수 (${balls.length})`
    });

    // Ball pairs (ID + Amount)
    balls.forEach((ball, index) => {
        const baseAddr = ITEMS_MEMORY_MAP.BALLS_START + (index * 2);

        entries.push({
            address: baseAddr,
            value: ball.id,
            description: `볼 ${index + 1} - 종류`
        });

        entries.push({
            address: baseAddr + 1,
            value: toHex(ball.amount),
            description: `볼 ${index + 1} - 개수 (${ball.amount})`
        });
    });

    // End marker
    entries.push({
        address: ITEMS_MEMORY_MAP.BALLS_END_MARKER,
        value: '0xFF',
        description: '볼 목록 종결자'
    });

    return entries;
}

/**
 * Add item slot
 * @param {String} category - 'items', 'key-items', or 'balls'
 */
function addItemSlot(category) {
    if (category === 'items') {
        if (itemSlots.length >= ITEMS_MEMORY_MAP.ITEMS_MAX_SLOTS) {
            alert(`최대 ${ITEMS_MEMORY_MAP.ITEMS_MAX_SLOTS}개까지만 추가할 수 있습니다.`);
            return;
        }
        itemSlots.push({ id: '', amount: 1 });
    } else if (category === 'key-items') {
        if (keyItemSlots.length >= ITEMS_MEMORY_MAP.KEY_ITEMS_MAX_SLOTS) {
            alert(`최대 ${ITEMS_MEMORY_MAP.KEY_ITEMS_MAX_SLOTS}개까지만 추가할 수 있습니다.`);
            return;
        }
        keyItemSlots.push({ id: '' });
    } else if (category === 'balls') {
        if (ballSlots.length >= ITEMS_MEMORY_MAP.BALLS_MAX_SLOTS) {
            alert(`최대 ${ITEMS_MEMORY_MAP.BALLS_MAX_SLOTS}개까지만 추가할 수 있습니다.`);
            return;
        }
        ballSlots.push({ id: '', amount: 1 });
    }
}

/**
 * Remove item slot
 * @param {String} category - 'items', 'key-items', or 'balls'
 * @param {Number} index - Slot index
 */
function removeItemSlot(category, index) {
    if (category === 'items') {
        itemSlots.splice(index, 1);
    } else if (category === 'key-items') {
        keyItemSlots.splice(index, 1);
    } else if (category === 'balls') {
        ballSlots.splice(index, 1);
    }
}

/**
 * Update item slot
 * @param {String} category - 'items', 'key-items', or 'balls'
 * @param {Number} index - Slot index
 * @param {String} field - 'id' or 'amount'
 * @param {*} value - New value
 */
function updateItemSlot(category, index, field, value) {
    if (category === 'items') {
        if (itemSlots[index]) {
            itemSlots[index][field] = value;
        }
    } else if (category === 'key-items') {
        if (keyItemSlots[index]) {
            keyItemSlots[index][field] = value;
        }
    } else if (category === 'balls') {
        if (ballSlots[index]) {
            ballSlots[index][field] = value;
        }
    }
}
