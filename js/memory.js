// ===== Memory Address Management & Output Rendering =====

/**
 * Render memory entries to output table
 * @param {Array} entries - Array of memory entry objects
 */
function renderOutputTable(entries) {
    const tbody = document.querySelector('#output-table tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Check if empty
    if (entries.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="2">생성할 메모리 값이 없습니다. 슬롯을 활성화하고 값을 입력해주세요.</td></tr>';
        return;
    }

    // Sort entries by address
    entries.sort((a, b) => a.address - b.address);

    // Render each entry
    entries.forEach(entry => {
        const row = document.createElement('tr');

        const addressCell = document.createElement('td');
        addressCell.textContent = formatAddress(entry.address);
        row.appendChild(addressCell);

        const valueCell = document.createElement('td');
        valueCell.textContent = entry.value;
        row.appendChild(valueCell);

        tbody.appendChild(row);
    });
}

/**
 * Format memory address to hex string
 * @param {Number} address - Memory address
 * @returns {String} Formatted address (e.g., "0xDCD8")
 */
function formatAddress(address) {
    return '0x' + address.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Memory Map Reference
 *
 * Pokemon Gold/Silver (Japanese/English version)
 * Note: Korean version addresses may differ and need verification
 *
 * Party Pokemon:
 * - Party count: 0xDCD7 (1 byte)
 * - Party data: 0xDCD8~ (48 bytes per Pokemon)
 *   - Offset +0x00: Species ID
 *   - Offset +0x01: Held Item
 *   - Offset +0x02-0x05: Moves 1-4
 *   - Offset +0x1F: Level
 *   - Offset +0x22-0x23: Current HP
 *   - Offset +0x24-0x25: Max HP
 *
 * Items:
 * - Bag items: 0xD892~ (Item ID + Quantity pairs)
 *   - Terminator: 0xFF
 *
 * Trainer Capture:
 * - Flag address: 0xD0E0 (placeholder, needs verification)
 */

/**
 * Memory address constants
 */
const MEMORY_MAP = {
    PARTY_COUNT: 0xDCD7,
    PARTY_DATA_START: 0xDCD8,
    PARTY_POKEMON_SIZE: 48,

    OFFSET_SPECIES: 0x00,
    OFFSET_HELD_ITEM: 0x01,
    OFFSET_MOVE_1: 0x02,
    OFFSET_MOVE_2: 0x03,
    OFFSET_MOVE_3: 0x04,
    OFFSET_MOVE_4: 0x05,
    OFFSET_LEVEL: 0x1F,
    OFFSET_CURRENT_HP: 0x22,
    OFFSET_MAX_HP: 0x24,

    BAG_ITEMS_START: 0xD892,
    ITEM_TERMINATOR: 0xFF,

    TRAINER_CAPTURE_FLAG: 0xD0E0 // Placeholder
};
