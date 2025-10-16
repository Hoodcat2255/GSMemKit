// ===== Pokemon Data Management =====

/**
 * Collect party Pokemon data from global partySlots array
 * @returns {Array} Array of pokemon objects
 */
function collectPartyData() {
    const partyData = [];

    partySlots.forEach((slot, index) => {
        // Only include slots with a species selected
        if (!slot.species || slot.species === '') {
            return;
        }

        const level = parseInt(slot.level);

        // Validate data
        if (!level || level < 1 || level > 100) {
            return;
        }

        partyData.push({
            slotIndex: index,
            species: slot.species,
            level: level
        });
    });

    return partyData;
}

/**
 * Calculate party Pokemon memory addresses and values
 * @param {Object} pokemon - Pokemon data object
 * @returns {Array} Array of memory entries
 */
function calculatePartyMemory(pokemon) {
    const entries = [];
    const baseAddress = 0xDCD8; // Party Pokemon data start address
    const pokemonSize = 48; // Each Pokemon is 48 bytes
    const slotOffset = pokemon.slotIndex * pokemonSize;

    // Pokemon Species (Offset +0x00)
    entries.push({
        address: baseAddress + slotOffset + 0x00,
        value: pokemon.species,
        description: `파티 ${pokemon.slotIndex + 1}번 - 포켓몬 종족 (${POKEMON_NAMES[pokemon.species] || '???'})`
    });

    // Pokemon Level (Offset +0x1F)
    entries.push({
        address: baseAddress + slotOffset + 0x1F,
        value: toHex(pokemon.level),
        description: `파티 ${pokemon.slotIndex + 1}번 - 레벨 (${pokemon.level})`
    });

    return entries;
}

/**
 * Calculate trainer capture memory addresses and values
 * @returns {Array} Array of memory entries
 */
function calculateTrainerCaptureMemory() {
    // Note: This address needs to be verified for Korean version
    // For now using placeholder
    return [{
        address: 0xD0E0,
        value: '0x01',
        description: '트레이너 포켓몬 포획 활성화'
    }];
}

/**
 * Convert decimal to hex string
 * @param {Number} num - Decimal number
 * @returns {String} Hex string with 0x prefix
 */
function toHex(num) {
    return '0x' + num.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Convert hex string to decimal
 * @param {String} hex - Hex string (with or without 0x prefix)
 * @returns {Number} Decimal number
 */
function hexToDec(hex) {
    return parseInt(hex.replace('0x', ''), 16);
}
