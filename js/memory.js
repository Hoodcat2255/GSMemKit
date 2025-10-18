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
        tbody.innerHTML = '<tr class="empty-state"><td colspan="3">생성할 메모리 값이 없습니다. 슬롯을 활성화하고 값을 입력해주세요.</td></tr>';
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

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = entry.description || '-';
        row.appendChild(descriptionCell);

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
 * Pokemon Gold/Silver Korean Version
 * Verified addresses for Korean ROM
 *
 * Version Differences:
 * - Party Pokemon: Korean = International + 0xFD (253 bytes)
 *   - International: 0xDA22 → Korean: 0xDB1F
 * - Opponent Pokemon: Korean = International + 0xBD (189 bytes)
 *   - International: 0xD116 → Korean: 0xD1D3
 *
 * Party Pokemon:
 * - Party count: 0xDB1F (1 byte)
 * - Party species list: 0xDB20-0xDB25 (6 bytes, 1-6 slots)
 * - Species list terminator: 0xDB26 (0xFF)
 * - Party data: 0xDB27~ (48 bytes per Pokemon)
 *   - Offset +0x00: Species ID
 *   - Offset +0x01: Held Item
 *   - Offset +0x02-0x05: Moves 1-4
 *   - Offset +0x08-0x0A: Experience (3 bytes)
 *   - Offset +0x0B-0x0C: HP EV (2 bytes, Big-Endian)
 *   - Offset +0x0D-0x0E: Attack EV (2 bytes, Big-Endian)
 *   - Offset +0x0F-0x10: Defense EV (2 bytes, Big-Endian)
 *   - Offset +0x11-0x12: Speed EV (2 bytes, Big-Endian)
 *   - Offset +0x13-0x14: Special EV (2 bytes, Big-Endian)
 *   - Offset +0x15: Attack/Defense IV (upper 4 bits / lower 4 bits)
 *   - Offset +0x16: Speed/Special IV (upper 4 bits / lower 4 bits)
 *   - Offset +0x17-0x1A: PP for moves 1-4
 *   - Offset +0x1B: Friendship
 *   - Offset +0x1F: Level
 *   - Offset +0x22-0x23: Current HP (2 bytes)
 *   - Offset +0x24-0x25: Max HP (2 bytes)
 *
 * Items:
 * - Bag items: 0xD892~ (Item ID + Quantity pairs)
 *   - Terminator: 0xFF
 *
 * Trainer Capture:
 * - Flag address: 0xD0E0 (placeholder, needs verification)
 */

/**
 * Memory address constants (Korean Version)
 */
const MEMORY_MAP = {
    // Party meta
    PARTY_COUNT: 0xDB1F,
    PARTY_SPECIES_LIST_START: 0xDB20,
    PARTY_SPECIES_TERMINATOR: 0xDB26,

    // Party data
    PARTY_DATA_START: 0xDB27,
    PARTY_POKEMON_SIZE: 48,

    // Offsets
    OFFSET_SPECIES: 0x00,
    OFFSET_HELD_ITEM: 0x01,
    OFFSET_MOVE_1: 0x02,
    OFFSET_MOVE_2: 0x03,
    OFFSET_MOVE_3: 0x04,
    OFFSET_MOVE_4: 0x05,
    OFFSET_EXPERIENCE: 0x08,
    OFFSET_EV_HP: 0x0B,
    OFFSET_EV_ATTACK: 0x0D,
    OFFSET_EV_DEFENSE: 0x0F,
    OFFSET_EV_SPEED: 0x11,
    OFFSET_EV_SPECIAL: 0x13,
    OFFSET_IV_ATK_DEF: 0x15,
    OFFSET_IV_SPD_SPC: 0x16,
    OFFSET_PP_1: 0x17,
    OFFSET_PP_2: 0x18,
    OFFSET_PP_3: 0x19,
    OFFSET_PP_4: 0x1A,
    OFFSET_FRIENDSHIP: 0x1B,
    OFFSET_LEVEL: 0x1F,
    OFFSET_CURRENT_HP: 0x22,
    OFFSET_MAX_HP: 0x24,

    // Items
    BAG_ITEMS_START: 0xD892,
    ITEM_TERMINATOR: 0xFF,

    // Trainer Capture
    TRAINER_CAPTURE_FLAG: 0xD0E0 // Placeholder
};
