// ===== GSMemKit - Main Application Logic =====

// Global state
let partySlots = [
    { species: '', level: 50 }
];
let selectedSlot = 0;

// Pokemon name mapping
const POKEMON_NAMES = {
    '0x19': '피카츄',
    '0x96': '이브이',
    '0x03': '이상해씨',
    '0x09': '꼬부기',
    '0x06': '파이리',
    '0x99': '뮤',
    '0x95': '뮤츠'
};

// Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    initTabSwitching();
    initPartyUI();
    initActionButtons();
});

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
        });
    });
}

/**
 * Initialize party Pokemon UI
 */
function initPartyUI() {
    // Render initial state
    renderSlotList();
    renderEditArea();
    updatePartyCount();

    // Add/Remove slot buttons
    document.getElementById('add-slot-btn').addEventListener('click', addSlot);
    document.getElementById('remove-slot-btn').addEventListener('click', removeSlot);

    // Edit form listeners
    document.getElementById('edit-species').addEventListener('change', onFormChange);
    document.getElementById('edit-level').addEventListener('input', onFormChange);
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

    document.getElementById('edit-title').textContent = `슬롯 ${selectedSlot + 1} 편집`;
    document.getElementById('edit-species').value = slot.species;
    document.getElementById('edit-level').value = slot.level;
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

    partySlots.push({ species: '', level: 50 });
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
    slot.species = document.getElementById('edit-species').value;
    slot.level = parseInt(document.getElementById('edit-level').value) || 50;

    renderSlotList();
    updatePartyCount();
}

/**
 * Initialize action buttons (Generate, Reset)
 */
function initActionButtons() {
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    generateBtn.addEventListener('click', generateMemoryOutput);
    resetBtn.addEventListener('click', resetForm);
    copyBtn.addEventListener('click', copyTableToClipboard);
    downloadBtn.addEventListener('click', downloadAsCSV);
}

/**
 * Generate memory output table
 */
function generateMemoryOutput() {
    const memoryEntries = [];

    // Collect party Pokemon data
    const partyData = collectPartyData();
    partyData.forEach(pokemon => {
        memoryEntries.push(...calculatePartyMemory(pokemon));
    });

    // Collect trainer capture toggle
    const trainerCapture = document.getElementById('trainer-capture-toggle').checked;
    if (trainerCapture) {
        memoryEntries.push(...calculateTrainerCaptureMemory());
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
    partySlots = [{ species: '', level: 50 }];
    selectedSlot = 0;

    // Reset trainer capture
    document.getElementById('trainer-capture-toggle').checked = false;

    // Re-render
    renderSlotList();
    renderEditArea();
    updatePartyCount();

    // Clear output table
    const tbody = document.querySelector('#output-table tbody');
    tbody.innerHTML = '<tr class="empty-state"><td colspan="3">생성 버튼을 눌러 메모리 값을 생성하세요.</td></tr>';
}

/**
 * Copy table to clipboard
 */
function copyTableToClipboard() {
    const table = document.getElementById('output-table');
    const rows = table.querySelectorAll('tr:not(.empty-state)');

    if (rows.length <= 1) { // Only header
        alert('복사할 데이터가 없습니다.');
        return;
    }

    let text = '';
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        const rowText = Array.from(cells).map(cell => cell.textContent.trim()).join('\t');
        text += rowText + '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
        alert('클립보드에 복사되었습니다!');
    }).catch(() => {
        alert('복사에 실패했습니다.');
    });
}

/**
 * Download table as CSV
 */
function downloadAsCSV() {
    const table = document.getElementById('output-table');
    const rows = table.querySelectorAll('tr:not(.empty-state)');

    if (rows.length <= 1) { // Only header
        alert('다운로드할 데이터가 없습니다.');
        return;
    }

    let csv = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => `"${cell.textContent.trim()}"`).join(',');
        csv += rowData + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `GSMemKit_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
