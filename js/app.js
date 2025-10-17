// ===== GSMemKit - Main Application Logic =====

// Global state
let partySlots = [
    createEmptySlot()
];
let selectedSlot = 0;

// Data
let itemsData = [];
let movesData = [];

// Choices.js instances
let choicesInstances = {
    species: null,
    item: null,
    moves: []
};

// Trainer capture state
let trainerMoves = ['', '', '', ''];

/**
 * Create an empty slot with default values
 */
function createEmptySlot() {
    return {
        species: '',
        level: 50,
        item: '',
        exp: 0,
        moves: ['', '', '', ''],
        pp: [0, 0, 0, 0],
        currentHp: 100,
        maxHp: 100,
        friendship: 255,
        ivAttack: 15,
        ivDefense: 15,
        ivSpeed: 15,
        ivSpecial: 15
    };
}

// Pokemon name mapping (251 Pokemon - Gen 1 & 2)
const POKEMON_NAMES = {
    '0x01': '이상해씨', '0x02': '이상해풀', '0x03': '이상해꽃',
    '0x04': '파이리', '0x05': '리자드', '0x06': '리자몽',
    '0x07': '꼬부기', '0x08': '어니부기', '0x09': '거북왕',
    '0x0A': '캐터피', '0x0B': '단데기', '0x0C': '버터플',
    '0x0D': '뿔충이', '0x0E': '딱충이', '0x0F': '독침붕',
    '0x10': '구구', '0x11': '피죤', '0x12': '피죤투',
    '0x13': '꼬렛', '0x14': '레트라', '0x15': '깨비참',
    '0x16': '깨비드릴조', '0x17': '아보', '0x18': '아보크',
    '0x19': '피카츄', '0x1A': '라이츄', '0x1B': '모래두지',
    '0x1C': '고지', '0x1D': '니드런♀', '0x1E': '니드리나',
    '0x1F': '니드퀸', '0x20': '니드런♂', '0x21': '니드리노',
    '0x22': '니드킹', '0x23': '삐삐', '0x24': '픽시',
    '0x25': '식스테일', '0x26': '나인테일', '0x27': '푸린',
    '0x28': '푸크린', '0x29': '쥬뱃', '0x2A': '골뱃',
    '0x2B': '뚜벅쵸', '0x2C': '냄새꼬', '0x2D': '라플레시아',
    '0x2E': '파라스', '0x2F': '파라섹트', '0x30': '콘팡',
    '0x31': '도나리', '0x32': '디그다', '0x33': '닥트리오',
    '0x34': '나옹', '0x35': '페르시온', '0x36': '고라파덕',
    '0x37': '골덕', '0x38': '망키', '0x39': '성원숭',
    '0x3A': '가디', '0x3B': '윈디', '0x3C': '발챙이',
    '0x3D': '수륙챙이', '0x3E': '강챙이', '0x3F': '케이시',
    '0x40': '윤겔라', '0x41': '후딘', '0x42': '알통몬',
    '0x43': '근육몬', '0x44': '괴력몬', '0x45': '모다피',
    '0x46': '우츠동', '0x47': '우츠보트', '0x48': '왕눈해',
    '0x49': '독파리', '0x4A': '꼬마돌', '0x4B': '데구리',
    '0x4C': '딱구리', '0x4D': '포니타', '0x4E': '날쌩마',
    '0x4F': '야돈', '0x50': '야도란', '0x51': '코일',
    '0x52': '레어코일', '0x53': '파오리', '0x54': '두두',
    '0x55': '두트리오', '0x56': '쥬쥬', '0x57': '쥬래곤',
    '0x58': '질퍽이', '0x59': '질뻐기', '0x5A': '셀러',
    '0x5B': '파르셀', '0x5C': '고오스', '0x5D': '고우스트',
    '0x5E': '팬텀', '0x5F': '롱스톤', '0x60': '슬리프',
    '0x61': '슬리퍼', '0x62': '크랩', '0x63': '킹크랩',
    '0x64': '찌리리공', '0x65': '붐볼', '0x66': '아라리',
    '0x67': '나시', '0x68': '탕구리', '0x69': '텅구리',
    '0x6A': '시라소몬', '0x6B': '홍수몬', '0x6C': '내루미',
    '0x6D': '또가스', '0x6E': '또도가스', '0x6F': '뿔카노',
    '0x70': '꼬뿌리', '0x71': '럭키', '0x72': '덩쿠리',
    '0x73': '캥카', '0x74': '쏘드라', '0x75': '시드라',
    '0x76': '콘치', '0x77': '왕콘치', '0x78': '별가사리',
    '0x79': '아쿠스타', '0x7A': '마임맨', '0x7B': '스라크',
    '0x7C': '루주라', '0x7D': '에레브', '0x7E': '마그마',
    '0x7F': '쁘사이져', '0x80': '켄타로스', '0x81': '잉어킹',
    '0x82': '갸라도스', '0x83': '라프라스', '0x84': '메타몽',
    '0x85': '이브이', '0x86': '샤미드', '0x87': '쥬피썬더',
    '0x88': '부스터', '0x89': '폴리곤', '0x8A': '암나이트',
    '0x8B': '암스타', '0x8C': '투구', '0x8D': '투구푸스',
    '0x8E': '프테라', '0x8F': '잠만보', '0x90': '프리져',
    '0x91': '썬더', '0x92': '파이어', '0x93': '미뇽',
    '0x94': '신뇽', '0x95': '망나뇽', '0x96': '뮤츠',
    '0x97': '뮤', '0x98': '치코리타', '0x99': '베이리프',
    '0x9A': '메가니움', '0x9B': '브케인', '0x9C': '마그케인',
    '0x9D': '블레이범', '0x9E': '리아코', '0x9F': '엘리게이',
    '0xA0': '장크로다일', '0xA1': '꼬리선', '0xA2': '다꼬리',
    '0xA3': '부우부', '0xA4': '야부엉', '0xA5': '레디바',
    '0xA6': '레디안', '0xA7': '페이검', '0xA8': '아리아도스',
    '0xA9': '크로뱃', '0xAA': '초라기', '0xAB': '랜턴',
    '0xAC': '피츄', '0xAD': '삐', '0xAE': '푸푸린',
    '0xAF': '토게피', '0xB0': '토게틱', '0xB1': '네이티',
    '0xB2': '네이티오', '0xB3': '메리프', '0xB4': '보송송',
    '0xB5': '전룡', '0xB6': '아르코', '0xB7': '마릴',
    '0xB8': '마릴리', '0xB9': '꼬지모', '0xBA': '왕구리',
    '0xBB': '통통코', '0xBC': '두코', '0xBD': '솜솜코',
    '0xBE': '에이팜', '0xBF': '해너츠', '0xC0': '해루미',
    '0xC1': '왕자리', '0xC2': '우파', '0xC3': '누오',
    '0xC4': '에브이', '0xC5': '블랙키', '0xC6': '니로우',
    '0xC7': '야도킹', '0xC8': '무우마', '0xC9': '안농',
    '0xCA': '마자용', '0xCB': '키링키', '0xCC': '피콘',
    '0xCD': '쏘콘', '0xCE': '노고치', '0xCF': '글래이거',
    '0xD0': '강철톤', '0xD1': '블루', '0xD2': '그랑블루',
    '0xD3': '침바루', '0xD4': '핫삼', '0xD5': '단단지',
    '0xD6': '헤라크로스', '0xD7': '포푸니', '0xD8': '깜지곰',
    '0xD9': '링곰', '0xDA': '마그마그', '0xDB': '마그카르고',
    '0xDC': '꾸꾸리', '0xDD': '메꾸리', '0xDE': '코산호',
    '0xDF': '총어', '0xE0': '대포문어', '0xE1': '딜리버드',
    '0xE2': '만타인', '0xE3': '무장조', '0xE4': '델빌',
    '0xE5': '헬가', '0xE6': '킹드라', '0xE7': '코코리',
    '0xE8': '코리갑', '0xE9': '폴리곤2', '0xEA': '노라키',
    '0xEB': '루브도', '0xEC': '베루키', '0xED': '카포에라',
    '0xEE': '뽀뽀라', '0xEF': '에레키드', '0xF0': '마그비',
    '0xF1': '밀탱크', '0xF2': '해피너스', '0xF3': '라이코',
    '0xF4': '엔테이', '0xF5': '스이쿤', '0xF6': '에버라스',
    '0xF7': '데기라스', '0xF8': '마기라스', '0xF9': '루기아',
    '0xFA': '칠색조', '0xFB': '세레비'
};

// Tab Switching
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    initTabSwitching();
    initPartyUI();
    initItemsUI();
    initTrainerUI();
    initMiscUI();
    initActionButtons();
});

/**
 * Load items and moves data from JSON files
 */
async function loadData() {
    try {
        const [itemsResponse, movesResponse] = await Promise.all([
            fetch('js/data/items.json'),
            fetch('js/data/moves.json')
        ]);

        itemsData = await itemsResponse.json();
        movesData = await movesResponse.json();

        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Failed to load data:', error);
        alert('데이터 로딩에 실패했습니다. 페이지를 새로고침 해주세요.');
    }
}

/**
 * Populate items select element
 */
function populateItemsSelect() {
    const itemSelect = document.getElementById('edit-item');
    itemSelect.innerHTML = '<option value="0x00">0. 없음</option>';

    itemsData.forEach(item => {
        if (item.id !== '0x00') {
            const option = document.createElement('option');
            option.value = item.id;
            const decimalId = parseInt(item.id, 16);
            option.textContent = `${decimalId}. ${item.name}`;
            itemSelect.appendChild(option);
        }
    });
}

/**
 * Populate moves select elements
 */
function populateMovesSelects() {
    const moveSelects = [
        document.getElementById('edit-move-1'),
        document.getElementById('edit-move-2'),
        document.getElementById('edit-move-3'),
        document.getElementById('edit-move-4')
    ];

    moveSelects.forEach(select => {
        select.innerHTML = '<option value="0x00">0. 없음</option>';

        movesData.forEach(move => {
            if (move.id !== '0x00') {
                const option = document.createElement('option');
                option.value = move.id;
                const decimalId = parseInt(move.id, 16);
                option.textContent = `${decimalId}. ${move.name}`;
                select.appendChild(option);
            }
        });
    });
}

/**
 * Initialize Choices.js for party selects
 */
function initPartyChoices() {
    // Species select
    if (choicesInstances.species) {
        choicesInstances.species.destroy();
    }
    choicesInstances.species = new Choices('#edit-species', {
        searchEnabled: true,
        searchPlaceholderValue: '포켓몬 검색...',
        noResultsText: '결과 없음',
        itemSelectText: '선택',
        position: 'bottom'
    });

    // Item select
    if (choicesInstances.item) {
        choicesInstances.item.destroy();
    }
    choicesInstances.item = new Choices('#edit-item', {
        searchEnabled: true,
        searchPlaceholderValue: '도구 검색...',
        noResultsText: '결과 없음',
        itemSelectText: '선택',
        position: 'bottom'
    });

    // Move selects
    choicesInstances.moves.forEach(choice => choice && choice.destroy());
    choicesInstances.moves = [];

    for (let i = 1; i <= 4; i++) {
        const moveChoice = new Choices(`#edit-move-${i}`, {
            searchEnabled: true,
            searchPlaceholderValue: '기술 검색...',
            noResultsText: '결과 없음',
            itemSelectText: '선택',
            position: 'bottom'
        });
        choicesInstances.moves.push(moveChoice);
    }
}

/**
 * Clear output table
 */
function clearOutputTable() {
    const tbody = document.querySelector('#output-table tbody');
    tbody.innerHTML = '<tr class="empty-state"><td colspan="3">생성 버튼을 눌러 메모리 값을 생성하세요.</td></tr>';
}

/**
 * Initialize tab switching functionality
 */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and target pane
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');

            // Clear output table when switching tabs
            clearOutputTable();

            // Auto-generate memory table for trainer tab
            if (targetTab === 'trainer') {
                generateMemoryOutput();
            }
        });
    });
}

/**
 * Initialize party Pokemon UI
 */
function initPartyUI() {
    // Populate select elements with data
    populateItemsSelect();
    populateMovesSelects();

    // Initialize Choices.js for selects
    initPartyChoices();

    // Render initial state
    renderSlotList();
    renderEditArea();
    updatePartyCount();

    // Add/Remove slot buttons
    document.getElementById('add-slot-btn').addEventListener('click', addSlot);
    document.getElementById('remove-slot-btn').addEventListener('click', removeSlot);

    // Edit form listeners - Basic Info
    document.getElementById('edit-species').addEventListener('change', onFormChange);
    document.getElementById('edit-level').addEventListener('input', onFormChange);
    document.getElementById('edit-exp').addEventListener('input', onFormChange);
    document.getElementById('edit-item').addEventListener('change', onFormChange);

    // Edit form listeners - Moves
    document.getElementById('edit-move-1').addEventListener('change', onFormChange);
    document.getElementById('edit-move-2').addEventListener('change', onFormChange);
    document.getElementById('edit-move-3').addEventListener('change', onFormChange);
    document.getElementById('edit-move-4').addEventListener('change', onFormChange);

    // Edit form listeners - PP
    document.getElementById('edit-pp-1').addEventListener('input', onFormChange);
    document.getElementById('edit-pp-2').addEventListener('input', onFormChange);
    document.getElementById('edit-pp-3').addEventListener('input', onFormChange);
    document.getElementById('edit-pp-4').addEventListener('input', onFormChange);

    // Edit form listeners - HP & Friendship
    document.getElementById('edit-current-hp').addEventListener('input', onFormChange);
    document.getElementById('edit-max-hp').addEventListener('input', onFormChange);
    document.getElementById('edit-friendship').addEventListener('input', onFormChange);

    // Edit form listeners - IVs
    document.getElementById('edit-iv-attack').addEventListener('input', onFormChange);
    document.getElementById('edit-iv-defense').addEventListener('input', onFormChange);
    document.getElementById('edit-iv-speed').addEventListener('input', onFormChange);
    document.getElementById('edit-iv-special').addEventListener('input', onFormChange);
}

/**
 * Render party slot list
 */
function renderSlotList() {
    const slotList = document.getElementById('party-slot-list');
    slotList.innerHTML = '';

    partySlots.forEach((slot, index) => {
        const button = document.createElement('button');
        button.className = 'party-slot-btn';
        button.dataset.slotIndex = index;

        if (index === selectedSlot) {
            button.classList.add('active');
        }

        if (!slot.species) {
            button.classList.add('empty');
        }

        // Slot number
        const slotNumber = document.createElement('span');
        slotNumber.className = 'slot-number';
        slotNumber.textContent = index + 1;
        button.appendChild(slotNumber);

        // Slot content
        if (slot.species) {
            const slotName = document.createElement('div');
            slotName.className = 'slot-name';
            slotName.textContent = POKEMON_NAMES[slot.species] || '???';
            button.appendChild(slotName);

            const slotLevel = document.createElement('div');
            slotLevel.className = 'slot-level';
            slotLevel.textContent = `Lv.${slot.level}`;
            button.appendChild(slotLevel);
        } else {
            const emptyText = document.createElement('div');
            emptyText.textContent = '빈 슬롯';
            button.appendChild(emptyText);
        }

        button.addEventListener('click', () => selectSlot(index));
        slotList.appendChild(button);
    });

    // Update control buttons
    document.getElementById('add-slot-btn').disabled = partySlots.length >= 6;
    document.getElementById('remove-slot-btn').disabled = partySlots.length <= 1;
}

/**
 * Render edit area for selected slot
 */
function renderEditArea() {
    const slot = partySlots[selectedSlot];

    // Update title
    document.getElementById('edit-title').textContent = `슬롯 ${selectedSlot + 1} 편집`;

    // Basic Info
    if (choicesInstances.species) {
        choicesInstances.species.setChoiceByValue(slot.species);
    } else {
        document.getElementById('edit-species').value = slot.species;
    }

    document.getElementById('edit-level').value = slot.level;
    document.getElementById('edit-exp').value = slot.exp;

    if (choicesInstances.item) {
        choicesInstances.item.setChoiceByValue(slot.item || '0x00');
    } else {
        document.getElementById('edit-item').value = slot.item || '0x00';
    }

    // Moves
    for (let i = 0; i < 4; i++) {
        if (choicesInstances.moves[i]) {
            choicesInstances.moves[i].setChoiceByValue(slot.moves[i] || '0x00');
        } else {
            document.getElementById(`edit-move-${i + 1}`).value = slot.moves[i] || '0x00';
        }
    }

    // PP
    document.getElementById('edit-pp-1').value = slot.pp[0];
    document.getElementById('edit-pp-2').value = slot.pp[1];
    document.getElementById('edit-pp-3').value = slot.pp[2];
    document.getElementById('edit-pp-4').value = slot.pp[3];

    // HP & Friendship
    document.getElementById('edit-current-hp').value = slot.currentHp;
    document.getElementById('edit-max-hp').value = slot.maxHp;
    document.getElementById('edit-friendship').value = slot.friendship;

    // IVs
    document.getElementById('edit-iv-attack').value = slot.ivAttack;
    document.getElementById('edit-iv-defense').value = slot.ivDefense;
    document.getElementById('edit-iv-speed').value = slot.ivSpeed;
    document.getElementById('edit-iv-special').value = slot.ivSpecial;
}

/**
 * Update party count display
 */
function updatePartyCount() {
    const count = partySlots.filter(slot => slot.species).length;
    document.getElementById('party-count').textContent = `(${count}/${partySlots.length})`;
}

/**
 * Add new slot
 */
function addSlot() {
    if (partySlots.length >= 6) {
        return;
    }

    partySlots.push(createEmptySlot());
    renderSlotList();
    updatePartyCount();
}

/**
 * Remove last slot
 */
function removeSlot() {
    if (partySlots.length <= 1) {
        return;
    }

    partySlots.pop();

    // Adjust selected slot if needed
    if (selectedSlot >= partySlots.length) {
        selectedSlot = partySlots.length - 1;
        renderEditArea();
    }

    renderSlotList();
    updatePartyCount();
}

/**
 * Select a slot
 */
function selectSlot(index) {
    selectedSlot = index;
    renderSlotList();
    renderEditArea();
}

/**
 * Handle form changes
 */
function onFormChange() {
    const slot = partySlots[selectedSlot];

    // Basic Info
    slot.species = document.getElementById('edit-species').value;
    slot.level = parseInt(document.getElementById('edit-level').value) || 50;
    slot.exp = parseInt(document.getElementById('edit-exp').value) || 0;
    slot.item = document.getElementById('edit-item').value;

    // Moves
    slot.moves[0] = document.getElementById('edit-move-1').value;
    slot.moves[1] = document.getElementById('edit-move-2').value;
    slot.moves[2] = document.getElementById('edit-move-3').value;
    slot.moves[3] = document.getElementById('edit-move-4').value;

    // PP
    slot.pp[0] = parseInt(document.getElementById('edit-pp-1').value) || 0;
    slot.pp[1] = parseInt(document.getElementById('edit-pp-2').value) || 0;
    slot.pp[2] = parseInt(document.getElementById('edit-pp-3').value) || 0;
    slot.pp[3] = parseInt(document.getElementById('edit-pp-4').value) || 0;

    // HP & Friendship
    slot.currentHp = parseInt(document.getElementById('edit-current-hp').value) || 0;
    slot.maxHp = parseInt(document.getElementById('edit-max-hp').value) || 1;
    slot.friendship = parseInt(document.getElementById('edit-friendship').value) || 0;

    // IVs
    slot.ivAttack = parseInt(document.getElementById('edit-iv-attack').value) || 0;
    slot.ivDefense = parseInt(document.getElementById('edit-iv-defense').value) || 0;
    slot.ivSpeed = parseInt(document.getElementById('edit-iv-speed').value) || 0;
    slot.ivSpecial = parseInt(document.getElementById('edit-iv-special').value) || 0;

    renderSlotList();
    updatePartyCount();
}

/**
 * Initialize items tab UI
 */
function initItemsUI() {
    // Initialize sub-tabs
    initItemsSubTabs();

    // Add item button
    const addItemBtn = document.getElementById('add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            const activeSubTab = document.querySelector('.sub-tab-btn.active').dataset.subtab;
            addItemSlot(activeSubTab);
            renderItemsList();
        });
    }

    // Initial render
    renderItemsList();
}

/**
 * Initialize items sub-tabs
 */
function initItemsSubTabs() {
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');

    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all sub-tab buttons
            subTabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update add button text
            const category = button.dataset.subtab;
            const addItemBtn = document.getElementById('add-item-btn');
            if (addItemBtn) {
                const categoryNames = {
                    'items': '도구',
                    'balls': '볼',
                    'key-items': '중요한 도구'
                };
                addItemBtn.textContent = `+ ${categoryNames[category]} 추가`;
            }

            // Re-render items list
            renderItemsList();
        });
    });
}

/**
 * Render items list based on active sub-tab
 */
function renderItemsList() {
    const activeSubTab = document.querySelector('.sub-tab-btn.active')?.dataset.subtab || 'items';
    const itemsList = document.getElementById('items-list');

    if (!itemsList) return;

    // Get current category data
    let slots = [];
    let hasAmount = true;
    if (activeSubTab === 'items') {
        slots = itemSlots;
    } else if (activeSubTab === 'balls') {
        slots = ballSlots;
    } else if (activeSubTab === 'key-items') {
        slots = keyItemSlots;
        hasAmount = false;
    }

    // Clear list
    itemsList.innerHTML = '';

    // Render each slot
    slots.forEach((slot, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'item-slot';

        // Item select
        const selectDiv = document.createElement('div');
        selectDiv.className = 'item-select-wrapper';

        const select = document.createElement('select');
        select.className = 'item-select';
        select.innerHTML = '<option value="">아이템 선택</option>';

        // Populate select with items
        itemsData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            const decimalId = parseInt(item.id, 16);
            option.textContent = `${decimalId}. ${item.name}`;
            if (slot.id === item.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            updateItemSlot(activeSubTab, index, 'id', e.target.value);
        });

        selectDiv.appendChild(select);
        slotDiv.appendChild(selectDiv);

        // Initialize Choices.js for this select
        const itemChoice = new Choices(select, {
            searchEnabled: true,
            searchPlaceholderValue: '아이템 검색...',
            noResultsText: '결과 없음',
            itemSelectText: '선택',
            position: 'bottom'
        });

        // Amount input (only for items and balls)
        if (hasAmount) {
            const amountDiv = document.createElement('div');
            amountDiv.className = 'item-amount-wrapper';

            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.className = 'item-amount';
            amountInput.min = '1';
            amountInput.max = '99';
            amountInput.value = slot.amount || 1;
            amountInput.addEventListener('input', (e) => {
                const value = Math.min(99, Math.max(1, parseInt(e.target.value) || 1));
                e.target.value = value;
                updateItemSlot(activeSubTab, index, 'amount', value);
            });

            amountDiv.appendChild(amountInput);
            slotDiv.appendChild(amountDiv);
        }

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove-item';
        removeBtn.textContent = '삭제';
        removeBtn.addEventListener('click', () => {
            removeItemSlot(activeSubTab, index);
            renderItemsList();
        });

        slotDiv.appendChild(removeBtn);
        itemsList.appendChild(slotDiv);
    });

    // Empty state
    if (slots.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.textContent = '아이템을 추가해주세요.';
        itemsList.appendChild(emptyDiv);
    }
}

/**
 * Initialize trainer capture tab UI
 */
function initTrainerUI() {
    // Get input elements
    const moveInputs = [
        document.getElementById('trainer-move-1'),
        document.getElementById('trainer-move-2'),
        document.getElementById('trainer-move-3'),
        document.getElementById('trainer-move-4')
    ];

    // Add event listeners for each move input
    moveInputs.forEach((input, index) => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.trim().toUpperCase();

                // Auto-add 0x prefix if not present and value is not empty
                if (value && !value.startsWith('0X')) {
                    value = '0X' + value.replace(/^0X/i, '');
                }

                // Validate hex format (0xNN)
                if (value === '' || /^0X[0-9A-F]{0,2}$/i.test(value)) {
                    trainerMoves[index] = value;
                    e.target.value = value;
                } else {
                    // Invalid format, revert to previous value
                    e.target.value = trainerMoves[index] || '';
                }
            });
        }
    });
}

/**
 * Initialize misc tab UI
 */
function initMiscUI() {
    // Date/Time listeners
    const daySelect = document.getElementById('misc-day-of-week');
    const hourInput = document.getElementById('misc-hour');
    const minuteInput = document.getElementById('misc-minute');

    if (daySelect) {
        daySelect.addEventListener('change', (e) => {
            updateDateTime('dayOfWeek', e.target.value);
        });
    }

    if (hourInput) {
        hourInput.addEventListener('input', (e) => {
            updateDateTime('hour', e.target.value);
        });
    }

    if (minuteInput) {
        minuteInput.addEventListener('input', (e) => {
            updateDateTime('minute', e.target.value);
        });
    }
}

/**
 * Initialize action buttons (Generate, Reset)
 */
function initActionButtons() {
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');

    generateBtn.addEventListener('click', generateMemoryOutput);
    resetBtn.addEventListener('click', resetForm);
}

/**
 * Generate memory output table
 */
function generateMemoryOutput() {
    const memoryEntries = [];
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

    // Generate different memory based on active tab
    if (activeTab === 'trainer') {
        // Trainer tab: Only trainer capture memory
        memoryEntries.push(...calculateTrainerCaptureMemory());
    } else if (activeTab === 'items') {
        // Items tab: Only active sub-tab category
        const activeSubTab = document.querySelector('.sub-tab-btn.active')?.dataset.subtab || 'items';

        if (activeSubTab === 'items') {
            memoryEntries.push(...calculateItemsMemory());
        } else if (activeSubTab === 'balls') {
            memoryEntries.push(...calculateBallsMemory());
        } else if (activeSubTab === 'key-items') {
            memoryEntries.push(...calculateKeyItemsMemory());
        }
    } else if (activeTab === 'misc') {
        // Misc tab: Date/time and other miscellaneous memory
        memoryEntries.push(...calculateDateTimeMemory());
    } else {
        // Party tab: Party Pokemon memory
        const partyData = collectPartyData();

        // Party meta information
        if (partyData.length > 0) {
            // Party count
            memoryEntries.push({
                address: MEMORY_MAP.PARTY_COUNT,
                value: toHex(partyData.length),
                description: `파티 포켓몬 수 (${partyData.length})`
            });

            // Party species list
            partyData.forEach((pokemon, index) => {
                memoryEntries.push({
                    address: MEMORY_MAP.PARTY_SPECIES_LIST_START + index,
                    value: pokemon.species,
                    description: `파티 종족 목록 ${index + 1}번`
                });
            });

            // Species list terminator
            memoryEntries.push({
                address: MEMORY_MAP.PARTY_SPECIES_TERMINATOR,
                value: '0xFF',
                description: '종족 목록 종결자'
            });
        }

        // Individual Pokemon data
        partyData.forEach(pokemon => {
            memoryEntries.push(...calculatePartyMemory(pokemon));
        });
    }

    // Render output table
    renderOutputTable(memoryEntries);
}

/**
 * Reset form to initial state
 */
function resetForm() {
    if (!confirm('모든 입력을 초기화하시겠습니까?')) {
        return;
    }

    // Reset party slots
    partySlots = [createEmptySlot()];
    selectedSlot = 0;

    // Re-render
    renderSlotList();
    renderEditArea();
    updatePartyCount();

    // Clear output table
    clearOutputTable();
}
