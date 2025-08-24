// Version Control System for Dynamic Elements
console.log('Version Control System Loading...');
console.log('Current window.ElementVersioning:', window.ElementVersioning);

// Global state for version management
window.ElementVersioning = {
    currentElement: null,
    versions: [],
    currentVersion: 1,
    lockedVersions: [],
    chatHistory: [],
    originalPrompt: ''
};

// Initialize version control when element is created
function initializeVersionControl(initialOutput, configPrompt) {
    console.log('Initializing version control system');
    
    // Initialize the global versioning object if it doesn't exist
    if (!window.ElementVersioning) {
        window.ElementVersioning = {};
    }
    
    const versionSystem = window.ElementVersioning;
    
    // Generate smart element name
    const generatedName = generateElementName(configPrompt || 'Analysis');
    
    // Reset state
    versionSystem.currentElement = {
        id: generateElementId(),
        created_at: new Date().toISOString(),
        name: generatedName
    };
    
    // Populate the element name input field with the generated name
    const elementNameInput = document.getElementById('element-name-input');
    if (elementNameInput) {
        elementNameInput.value = generatedName;
        console.log('Element name input populated with:', generatedName);
    }
    
    versionSystem.versions = [{
        version: 1,
        output: initialOutput || 'Analysis result',
        chat_history: [configPrompt || 'User analysis request'],
        locked: false,
        timestamp: new Date().toISOString(),
        context_used: configPrompt || 'User analysis request'
    }];
    
    versionSystem.currentVersion = 1;
    versionSystem.lockedVersions = [];
    versionSystem.chatHistory = [configPrompt || 'User analysis request'];
    versionSystem.originalPrompt = configPrompt || 'User analysis request';
    
    // Show version controls
    showVersionControls();
    updateVersionDisplay();
    
    console.log('Version control initialized successfully:', {
        versions: versionSystem.versions.length,
        currentVersion: versionSystem.currentVersion,
        outputLength: initialOutput ? initialOutput.length : 0
    });
}

// Show version control UI elements
function showVersionControls() {
    const versionIndicator = document.getElementById('version-indicator');
    const versionControls = document.getElementById('version-controls');
    const versionStatus = document.getElementById('version-status');
    
    if (versionIndicator) versionIndicator.style.display = 'block';
    if (versionControls) versionControls.style.display = 'flex';
    if (versionStatus) versionStatus.style.display = 'block';
}

// Update version display
function updateVersionDisplay() {
    const versionText = document.getElementById('version-text');
    const saveBtn = document.getElementById('save-element-btn');
    const lockBtn = document.getElementById('lock-version-btn');
    
    const versionSystem = window.ElementVersioning;
    const currentVer = versionSystem.versions.find(v => v.version === versionSystem.currentVersion);
    
    if (versionText) {
        versionText.textContent = `Version ${versionSystem.currentVersion}`;
    }
    
    // Update button states
    if (lockBtn) {
        if (currentVer && currentVer.locked) {
            lockBtn.textContent = 'Locked ✓';
            lockBtn.disabled = true;
            lockBtn.className = 'btn btn-small btn-outline locked';
        } else {
            lockBtn.textContent = 'Lock Version';
            lockBtn.disabled = false;
            lockBtn.className = 'btn btn-small btn-outline';
        }
    }
    
    // Enable save button if any version exists (locked or not)
    if (saveBtn) {
        const hasVersions = versionSystem.versions && versionSystem.versions.length > 0;
        saveBtn.disabled = !hasVersions;
        console.log('Save button state:', { hasVersions, disabled: saveBtn.disabled });
    }
    
    updateLockedVersionsDisplay();
}

// Lock current version
function lockCurrentVersion() {
    console.log('Lock button clicked');
    
    // Check if version system is initialized
    if (!window.ElementVersioning || !window.ElementVersioning.versions || window.ElementVersioning.versions.length === 0) {
        console.log('Version system not initialized, initializing now...');
        // Initialize with current preview content
        const previewContent = document.getElementById('preview-content');
        const previewResult = previewContent ? previewContent.querySelector('.preview-result') : null;
        const currentOutput = previewResult ? (previewResult.textContent || previewResult.innerText) : 'Analysis result';
        
        if (currentOutput && currentOutput.trim().length > 0) {
            console.log('Initializing with output:', currentOutput.substring(0, 100) + '...');
            initializeVersionControl(currentOutput, 'User analysis request');
        } else {
            showAlert('Error: No analysis result found to lock', 'error');
            return;
        }
    }
    
    const versionSystem = window.ElementVersioning;
    if (!versionSystem || !versionSystem.versions || versionSystem.versions.length === 0) {
        showAlert('Error: No version found to lock', 'error');
        return;
    }
    
    const currentVer = versionSystem.versions.find(v => v.version === versionSystem.currentVersion);
    
    if (!currentVer) {
        showAlert('Error: Current version not found', 'error');
        return;
    }
    
    if (currentVer.locked) {
        showAlert('Version ' + versionSystem.currentVersion + ' is already locked!', 'info');
        return;
    }
    
    // Lock the version
    currentVer.locked = true;
    currentVer.locked_at = new Date().toISOString();
    
    versionSystem.lockedVersions.push(versionSystem.currentVersion);
    
    // Update UI
    updateVersionDisplay();
    
    // Show success notification
    showAlert('Version ' + versionSystem.currentVersion + ' locked successfully!', 'success');
    
    // Add visual feedback to button
    const lockBtn = document.getElementById('lock-version-btn');
    if (lockBtn) {
        lockBtn.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
            if (lockBtn.style) lockBtn.style.animation = '';
        }, 300);
    }
    
    console.log('Version locked:', currentVer);
}

// Create new version from chat iteration
function createNewVersion(newOutput, chatMessage, contextUsed) {
    console.log('Creating new version from chat iteration');
    
    const versionSystem = window.ElementVersioning;
    const newVersionNumber = versionSystem.versions.length + 1;
    
    // Add chat message to history
    versionSystem.chatHistory.push(chatMessage);
    
    // Create new version
    const newVersion = {
        version: newVersionNumber,
        output: newOutput,
        chat_history: [...versionSystem.chatHistory],
        locked: false,
        timestamp: new Date().toISOString(),
        context_used: contextUsed
    };
    
    versionSystem.versions.push(newVersion);
    versionSystem.currentVersion = newVersionNumber;
    
    updateVersionDisplay();
    
    console.log('New version created:', newVersion);
    return newVersion;
}

// Display locked versions
function updateLockedVersionsDisplay() {
    const lockedVersionsContainer = document.getElementById('locked-versions');
    if (!lockedVersionsContainer) return;
    
    const versionSystem = window.ElementVersioning;
    const lockedVersions = versionSystem.versions.filter(v => v.locked);
    
    if (lockedVersions.length === 0) {
        lockedVersionsContainer.innerHTML = '<span style="color: #64748b; font-size: 0.9rem;">No locked versions yet</span>';
        return;
    }
    
    const versionChips = lockedVersions.map(version => `
        <div class="version-chip locked" onclick="selectVersionForSave(${version.version})">
            Locked V${version.version}
        </div>
    `).join('');
    
    lockedVersionsContainer.innerHTML = versionChips;
}

// Select version for saving
let selectedVersionForSave = null;

function selectVersionForSave(versionNumber) {
    selectedVersionForSave = versionNumber;
    
    // Update visual selection
    document.querySelectorAll('.version-chip.locked').forEach(chip => {
        chip.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    
    // Update save button text
    const saveBtn = document.getElementById('save-element-btn');
    if (saveBtn) {
        saveBtn.textContent = `Save Version ${versionNumber}`;
    }
}

// Save element with selected version
function saveElement() {
    console.log('Saving element');
    
    const versionSystem = window.ElementVersioning;
    
    if (!selectedVersionForSave) {
        // Default to latest locked version, or if no locked versions, default to version 1
        const lockedVersions = versionSystem.versions.filter(v => v.locked);
        if (lockedVersions.length > 0) {
            selectedVersionForSave = lockedVersions[lockedVersions.length - 1].version;
        } else {
            // No locked versions, default to version 1
            selectedVersionForSave = 1;
            console.log('No locked versions found, defaulting to version 1');
        }
    }
    
    const versionToSave = versionSystem.versions.find(v => v.version === selectedVersionForSave);
    if (!versionToSave) {
        showAlert('Selected version not found', 'error');
        return;
    }
    
    // Get custom element name from input field
    const elementNameInput = document.getElementById('element-name-input');
    const customElementName = elementNameInput ? elementNameInput.value.trim() : '';
    const elementName = customElementName || versionSystem.currentElement.name || generateElementName('Analysis');
    
    // Prepare save data
    const saveData = {
        element_id: versionSystem.currentElement.id,
        element_name: elementName,
        saved_version: selectedVersionForSave,
        output: versionToSave.output,
        full_chat_history: versionToSave.chat_history,
        context_used: versionToSave.context_used,
        created_at: versionSystem.currentElement.created_at,
        saved_at: new Date().toISOString(),
        all_versions: versionSystem.versions.map(v => ({
            version: v.version,
            locked: v.locked,
            timestamp: v.timestamp
        }))
    };
    
    console.log('Saving with custom name:', elementName);
    
    // Send to backend
    saveElementToBackend(saveData);
}

// Save element to backend
async function saveElementToBackend(saveData) {
    try {
        const saveBtn = document.getElementById('save-element-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
        }
        
        const response = await fetch('/api/elements/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(`Element "${saveData.element_name}" saved successfully!`, 'success');
            console.log('Element saved to backend:', result);
            
            // Mark version as saved
            const versionSystem = window.ElementVersioning;
            const savedVersion = versionSystem.versions.find(v => v.version === selectedVersionForSave);
            if (savedVersion) {
                savedVersion.saved = true;
                savedVersion.saved_at = new Date().toISOString();
            }
            
            updateVersionDisplay();
        } else {
            throw new Error(result.message || 'Save failed');
        }
        
    } catch (error) {
        console.error('Error saving element:', error);
        showAlert('Error saving element: ' + error.message, 'error');
    } finally {
        const saveBtn = document.getElementById('save-element-btn');
        if (saveBtn) {
            saveBtn.disabled = false;
            const defaultVersion = selectedVersionForSave || 1;
            saveBtn.textContent = `Save Version ${defaultVersion}`;
        }
    }
}

// Utility functions
function generateElementId() {
    return 'element_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateElementName(prompt) {
    // Extract meaningful name from prompt
    const words = prompt.toLowerCase();
    
    // Check for specific patterns
    if (words.includes('complaint') || words.includes('complaints')) {
        if (words.includes('israel')) {
            return 'Israel Complaints Analysis';
        } else if (words.includes('germany')) {
            return 'Germany Complaints Analysis';
        } else {
            return 'Complaints Analysis';
        }
    }
    
    if (words.includes('extract') || words.includes('extraction')) {
        return 'Data Extraction';
    }
    
    if (words.includes('summary') || words.includes('summarize')) {
        return 'Document Summary';
    }
    
    if (words.includes('report') || words.includes('reporting')) {
        return 'Analysis Report';
    }
    
    // Default fallback
    const date = new Date().toLocaleDateString();
    return `Analysis - ${date}`;
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertContainer = document.getElementById('alert-container') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            alertDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            alertDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        default:
            alertDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

// Expose functions to global scope
window.lockCurrentVersion = lockCurrentVersion;
window.saveElement = saveElement;
window.initializeVersionControl = initializeVersionControl;
window.createNewVersion = createNewVersion;

console.log('Version Control System Loaded');
console.log('Functions exposed to window:', {
    initializeVersionControl: typeof window.initializeVersionControl,
    lockCurrentVersion: typeof window.lockCurrentVersion,
    saveElement: typeof window.saveElement,
    createNewVersion: typeof window.createNewVersion
});