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

        // Validate level
        const level = parseInt(slot.level);
        if (!level || level < 1 || level > 100) {
            return;
        }

        // Collect all pokemon data
        partyData.push({
            slotIndex: index,
            species: slot.species,
            level: level,
            item: slot.item || '0x00',
            exp: parseInt(slot.exp) || 0,
            moves: [
                slot.moves[0] || '0x00',
                slot.moves[1] || '0x00',
                slot.moves[2] || '0x00',
                slot.moves[3] || '0x00'
            ],
            pp: [
                parseInt(slot.pp[0]) || 0,
                parseInt(slot.pp[1]) || 0,
                parseInt(slot.pp[2]) || 0,
                parseInt(slot.pp[3]) || 0
            ],
            currentHp: parseInt(slot.currentHp) || 0,
            maxHp: parseInt(slot.maxHp) || 1,
            friendship: parseInt(slot.friendship) || 0,
            ivAttack: parseInt(slot.ivAttack) || 0,
            ivDefense: parseInt(slot.ivDefense) || 0,
            ivSpeed: parseInt(slot.ivSpeed) || 0,
            ivSpecial: parseInt(slot.ivSpecial) || 0
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
    const baseAddress = MEMORY_MAP.PARTY_DATA_START; // 0xDB27
    const pokemonSize = MEMORY_MAP.PARTY_POKEMON_SIZE; // 48 bytes
    const slotOffset = pokemon.slotIndex * pokemonSize;
    const partyNum = pokemon.slotIndex + 1;

    // Get Pokemon name
    const pokemonName = POKEMON_NAMES[pokemon.species] || '???';

    // Pokemon Species (Offset +0x00)
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_SPECIES,
        value: pokemon.species,
        description: `파티 ${partyNum}번 - 포켓몬 종족 (${pokemonName})`
    });

    // Held Item (Offset +0x01)
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_HELD_ITEM,
        value: pokemon.item,
        description: `파티 ${partyNum}번 - 지닌 도구`
    });

    // Moves 1-4 (Offset +0x02, +0x03, +0x04, +0x05)
    for (let i = 0; i < 4; i++) {
        entries.push({
            address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_MOVE_1 + i,
            value: pokemon.moves[i],
            description: `파티 ${partyNum}번 - 기술 ${i + 1}`
        });
    }

    // Experience (Offset +0x08, 3 bytes, big-endian)
    const exp = pokemon.exp;
    const expByte1 = (exp >> 16) & 0xFF; // High byte
    const expByte2 = (exp >> 8) & 0xFF;  // Mid byte
    const expByte3 = exp & 0xFF;         // Low byte

    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EXPERIENCE,
        value: toHex(expByte1),
        description: `파티 ${partyNum}번 - 경험치 (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EXPERIENCE + 1,
        value: toHex(expByte2),
        description: `파티 ${partyNum}번 - 경험치 (중간 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EXPERIENCE + 2,
        value: toHex(expByte3),
        description: `파티 ${partyNum}번 - 경험치 (하위 바이트)`
    });

    // IVs (Offset +0x15, +0x16 - bit-packed)
    // +0x15: Attack (upper 4 bits) | Defense (lower 4 bits)
    // +0x16: Speed (upper 4 bits) | Special (lower 4 bits)
    const ivAtkDef = ((pokemon.ivAttack & 0x0F) << 4) | (pokemon.ivDefense & 0x0F);
    const ivSpdSpc = ((pokemon.ivSpeed & 0x0F) << 4) | (pokemon.ivSpecial & 0x0F);

    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_IV_ATK_DEF,
        value: toHex(ivAtkDef),
        description: `파티 ${partyNum}번 - 개체값 (공격/방어)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_IV_SPD_SPC,
        value: toHex(ivSpdSpc),
        description: `파티 ${partyNum}번 - 개체값 (스피드/특수)`
    });

    // PP for moves 1-4 (Offset +0x17, +0x18, +0x19, +0x1A)
    for (let i = 0; i < 4; i++) {
        entries.push({
            address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_PP_1 + i,
            value: toHex(pokemon.pp[i]),
            description: `파티 ${partyNum}번 - 기술 ${i + 1} PP`
        });
    }

    // Friendship (Offset +0x1B)
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_FRIENDSHIP,
        value: toHex(pokemon.friendship),
        description: `파티 ${partyNum}번 - 친밀도`
    });

    // Pokemon Level (Offset +0x1F)
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_LEVEL,
        value: toHex(pokemon.level),
        description: `파티 ${partyNum}번 - 레벨 (${pokemon.level})`
    });

    // Current HP (Offset +0x22, 2 bytes, big-endian)
    const currentHp = pokemon.currentHp;
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_CURRENT_HP,
        value: toHex((currentHp >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 현재 HP (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_CURRENT_HP + 1,
        value: toHex(currentHp & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 현재 HP (하위 바이트)`
    });

    // Max HP (Offset +0x24, 2 bytes, big-endian)
    const maxHp = pokemon.maxHp;
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_MAX_HP,
        value: toHex((maxHp >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 최대 HP (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_MAX_HP + 1,
        value: toHex(maxHp & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 최대 HP (하위 바이트)`
    });

    return entries;
}

/**
 * Calculate trainer capture memory addresses and values
 * @returns {Array} Array of memory entries
 */
function calculateTrainerCaptureMemory() {
    const entries = [];

    // 1. 전투 타입을 야생으로 변경 (고정값)
    entries.push({
        address: 0xD1D3,
        value: '0x01',
        description: '전투 타입을 야생으로 변경 (트레이너 → 야생)'
    });

    // 2. 상대 기술 확인용 (0xD0C8-0xD0CB)
    for (let i = 0; i < 4; i++) {
        entries.push({
            address: 0xD0C8 + i,
            value: '-',
            description: `[확인 필요] 상대 기술 ${i + 1}`
        });
    }

    // 3. 포획 시 기술 (0xCC1B-0xCC1E)
    // trainerMoves가 정의되어 있으면 사용, 없으면 안내 메시지
    for (let i = 0; i < 4; i++) {
        const refAddress = 0xD0C8 + i;
        const hasValue = typeof trainerMoves !== 'undefined' && trainerMoves[i];
        entries.push({
            address: 0xCC1B + i,
            value: hasValue ? trainerMoves[i] : `(0x${refAddress.toString(16).toUpperCase()} 확인)`,
            description: `포획 시 기술 ${i + 1}${hasValue ? '' : ' - 위에서 확인한 값을 입력하세요'}`
        });
    }

    return entries;
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
