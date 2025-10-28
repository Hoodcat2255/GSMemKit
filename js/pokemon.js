// ===== Pokemon Data Management =====

/**
 * Nature data for Pokemon Transporter (Korean)
 * Index = Experience % 25
 * Format: [name, increasedStat, decreasedStat]
 * Stats: 공격, 방어, 특공, 특방, 스피드
 */
const NATURE_DATA = [
    ['노력', null, null],           // 0 - Hardy (중립)
    ['외로움', '공격', '방어'],      // 1 - Lonely
    ['용감', '공격', '스피드'],      // 2 - Brave
    ['고집', '공격', '특공'],        // 3 - Adamant
    ['개구쟁이', '공격', '특방'],    // 4 - Naughty
    ['대담', '방어', '공격'],        // 5 - Bold
    ['온순', null, null],           // 6 - Docile (중립)
    ['무사태평', '방어', '스피드'],  // 7 - Relaxed
    ['장난꾸러기', '방어', '특공'],  // 8 - Impish
    ['촐랑', '방어', '특방'],        // 9 - Lax
    ['겁쟁이', '스피드', '공격'],    // 10 - Timid
    ['성급', '스피드', '방어'],      // 11 - Hasty
    ['성실', null, null],           // 12 - Serious (중립)
    ['명랑', '스피드', '특공'],      // 13 - Jolly
    ['천진난만', '스피드', '특방'],  // 14 - Naive
    ['조심', '특공', '공격'],        // 15 - Modest
    ['의젓', '특공', '방어'],        // 16 - Mild
    ['냉정', '특공', '스피드'],      // 17 - Quiet
    ['수줍음', null, null],         // 18 - Bashful (중립)
    ['덜렁', '특공', '특방'],        // 19 - Rash
    ['차분', '특방', '공격'],        // 20 - Calm
    ['얌전', '특방', '방어'],        // 21 - Gentle
    ['건방', '특방', '스피드'],      // 22 - Sassy
    ['신중', '특방', '특공'],        // 23 - Careful
    ['변덕', null, null]            // 24 - Quirky (중립)
];

/**
 * Calculate nature from experience points
 * Nature is determined by (Experience % 25) when transferred via Pokemon Transporter
 * @param {Number} exp - Experience points
 * @returns {Object} Nature object with name and stat changes
 */
function calculateNature(exp) {
    const natureIndex = exp % 25;
    const [name, increased, decreased] = NATURE_DATA[natureIndex];

    let displayText = name;
    let displayHTML = name;
    if (increased && decreased) {
        displayText += ` (${increased}↑ ${decreased}↓)`;
        displayHTML += ` (<span style="color: #d292a3;">${increased}↑</span> <span style="color: #9aacd3;">${decreased}↓</span>)`;
    }

    return {
        name: name,
        increased: increased,
        decreased: decreased,
        displayText: displayText,
        displayHTML: displayHTML,
        index: natureIndex
    };
}

/**
 * Get nature index from experience points
 * @param {Number} exp - Experience points
 * @returns {Number} Nature index (0-24)
 */
function getNatureIndex(exp) {
    return exp % 25;
}

/**
 * Calculate minimum experience for a given nature that is greater than current exp
 * @param {Number} currentExp - Current experience points
 * @param {Number} natureIndex - Desired nature index (0-24)
 * @returns {Number} Minimum experience for the nature
 */
function calculateExpForNature(currentExp, natureIndex) {
    // currentExp보다 큰 값 중에서 % 25 = natureIndex인 최소값
    // 공식: floor(currentExp / 25) * 25 + natureIndex
    // 만약 이 값이 currentExp 이하면 +25

    let targetExp = Math.floor(currentExp / 25) * 25 + natureIndex;

    if (targetExp <= currentExp) {
        targetExp += 25;
    }

    return targetExp;
}

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
            otId: parseInt(slot.otId) || 0,
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
            pokerus: parseInt(slot.pokerus) || 0,
            caughtData: parseInt(slot.caughtData) || 0,
            ivAttack: parseInt(slot.ivAttack) || 0,
            ivDefense: parseInt(slot.ivDefense) || 0,
            ivSpeed: parseInt(slot.ivSpeed) || 0,
            ivSpecial: parseInt(slot.ivSpecial) || 0,
            evHp: parseInt(slot.evHp) || 0,
            evAttack: parseInt(slot.evAttack) || 0,
            evDefense: parseInt(slot.evDefense) || 0,
            evSpeed: parseInt(slot.evSpeed) || 0,
            evSpecial: parseInt(slot.evSpecial) || 0
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

    // OT ID (Offset +0x06, 2 bytes, big-endian)
    const otId = pokemon.otId;
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_OT_ID,
        value: toHex((otId >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 트레이너 ID (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_OT_ID + 1,
        value: toHex(otId & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 트레이너 ID (하위 바이트)`
    });

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

    // EVs (Offset +0x0B-0x14, 2 bytes each, big-endian)
    // HP EV
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_HP,
        value: toHex((pokemon.evHp >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 노력치 HP (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_HP + 1,
        value: toHex(pokemon.evHp & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 노력치 HP (하위 바이트)`
    });

    // Attack EV
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_ATTACK,
        value: toHex((pokemon.evAttack >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 노력치 공격 (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_ATTACK + 1,
        value: toHex(pokemon.evAttack & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 노력치 공격 (하위 바이트)`
    });

    // Defense EV
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_DEFENSE,
        value: toHex((pokemon.evDefense >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 노력치 방어 (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_DEFENSE + 1,
        value: toHex(pokemon.evDefense & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 노력치 방어 (하위 바이트)`
    });

    // Speed EV
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_SPEED,
        value: toHex((pokemon.evSpeed >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 노력치 스피드 (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_SPEED + 1,
        value: toHex(pokemon.evSpeed & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 노력치 스피드 (하위 바이트)`
    });

    // Special EV
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_SPECIAL,
        value: toHex((pokemon.evSpecial >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 노력치 특수 (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_EV_SPECIAL + 1,
        value: toHex(pokemon.evSpecial & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 노력치 특수 (하위 바이트)`
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

    // PokeRus (Offset +0x1C)
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_POKERUS,
        value: toHex(pokemon.pokerus),
        description: `파티 ${partyNum}번 - 포켓러스`
    });

    // Caught Data (Offset +0x1D, 2 bytes, big-endian)
    const caughtData = pokemon.caughtData;
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_CAUGHT_DATA,
        value: toHex((caughtData >> 8) & 0xFF), // High byte
        description: `파티 ${partyNum}번 - 포획 데이터 (상위 바이트)`
    });
    entries.push({
        address: baseAddress + slotOffset + MEMORY_MAP.OFFSET_CAUGHT_DATA + 1,
        value: toHex(caughtData & 0xFF), // Low byte
        description: `파티 ${partyNum}번 - 포획 데이터 (하위 바이트)`
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
