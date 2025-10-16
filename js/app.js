// ===== GSMemKit - Main Application Logic =====

// Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    initTabSwitching();
    initPartySlots();
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
 * Initialize party slot enable/disable functionality
 */
function initPartySlots() {
    const partySlots = document.querySelectorAll('.party-slot');

    partySlots.forEach(slot => {
        const checkbox = slot.querySelector('.slot-enabled');
        const inputs = slot.querySelectorAll('select, input[type="number"]');

        checkbox.addEventListener('change', () => {
            inputs.forEach(input => {
                input.disabled = !checkbox.checked;
            });
        });
    });
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

    // Reset all checkboxes except first party slot
    document.querySelectorAll('.slot-enabled').forEach((checkbox, index) => {
        checkbox.checked = index === 0;
        checkbox.dispatchEvent(new Event('change'));
    });

    // Reset all selects
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });

    // Reset all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = 50;
    });

    // Reset trainer capture
    document.getElementById('trainer-capture-toggle').checked = false;

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
