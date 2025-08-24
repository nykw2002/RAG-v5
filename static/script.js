// ===== GLOBAL VARIABLES =====
let selectedFiles = [];
let referencedElements = ['kpi-table'];
let currentMethod = 'extraction';
let isProcessing = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 AI Document Analysis System - Initializing...');
    initializeApp();
});

function initializeApp() {
    try {
        setupEventListeners();
        loadConfiguration();
        checkSystemHealth();
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        showAlert('Application initialization failed: ' + error.message, 'error');
    }
}

// ===== UTILITY FUNCTIONS =====
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`⚠️ Element with id '${id}' not found`);
    }
    return element;
}

function querySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`⚠️ Element with selector '${selector}' not found`);
    }
    return element;
}

function querySelectorAll(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        console.warn(`⚠️ No elements found with selector '${selector}'`);
    }
    return elements;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    try {
        console.log('🔧 Setting up event listeners...');

        // File input handler
        const fileInput = getElement('file-upload');
        if (fileInput) {
            fileInput.addEventListener('change', handleFileSelection);
            console.log('✅ File input listener added');
        }

        // Method buttons in editor modal
        const methodButtons = querySelectorAll('.method-btn');
        methodButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentMethod = this.dataset.method || 'extraction';
                console.log('📝 Method changed to:', currentMethod);
            });
        });

        // Element buttons
        const elementButtons = querySelectorAll('.element-btn');
        elementButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const element = this.dataset.element;
                
                if (this.classList.contains('active')) {
                    if (!referencedElements.includes(element)) {
                        referencedElements.push(element);
                    }
                } else {
                    referencedElements = referencedElements.filter(e => e !== element);
                }
                console.log('📋 Referenced elements:', referencedElements);
            });
        });

        // Modal click outside to close
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                closeAllModals();
            }
        });

        console.log('✅ Event listeners setup complete');
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }
}

// ===== MODAL MANAGEMENT =====
function openConfigurationModal() {
    console.log('📋 Opening configuration modal...');
    const modal = getElement('config-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        // Load current config into form
        loadConfigurationIntoForm();
    }
}

function closeConfigurationModal() {
    console.log('📋 Closing configuration modal...');
    const modal = getElement('config-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    }
}

function openEditorModal() {
    console.log('📝 Opening editor modal...');
    const modal = getElement('editor-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
}

function closeEditorModal() {
    console.log('📝 Closing editor modal...');
    const modal = getElement('editor-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    }
}

function closeAllModals() {
    closeConfigurationModal();
    closeEditorModal();
}

function backToConfiguration() {
    closeEditorModal();
    setTimeout(() => {
        openConfigurationModal();
    }, 100);
}

// ===== FILE MANAGEMENT =====
function selectFiles() {
    console.log('📁 Opening file selector...');
    
    try {
        const fileInput = getElement('file-upload');
        if (!fileInput) {
            throw new Error('File input element not found');
        }
        
        fileInput.click();
    } catch (error) {
        console.error('❌ Error selecting files:', error);
        showAlert('Error selecting files: ' + error.message, 'error');
    }
}

function handleFileSelection(event) {
    try {
        console.log('📁 File selection event triggered');
        selectedFiles = Array.from(event.target.files);
        updateFilesList();
        console.log('✅ Files selected:', selectedFiles.map(f => f.name));
    } catch (error) {
        console.error('❌ Error handling file selection:', error);
    }
}

function updateFilesList() {
    try {
        const fileListElement = getElement('selected-files');
        if (!fileListElement) {
            console.error('❌ selected-files element not found');
            return;
        }
        
        if (selectedFiles.length === 0) {
            fileListElement.textContent = 'No files selected';
            fileListElement.className = 'selected-files';
        } else {
            const fileTagsHtml = selectedFiles.map(file => 
                `<span class="file-tag">${escapeHtml(file.name)}</span>`
            ).join('');
            
            fileListElement.innerHTML = fileTagsHtml;
            fileListElement.className = 'selected-files';
        }
        
        console.log('✅ File list updated');
    } catch (error) {
        console.error('❌ Error updating files list:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== CONFIGURATION PROCESSING =====
async function processAndContinueToEditor() {
    if (isProcessing) {
        console.log('⏳ Already processing, ignoring...');
        return;
    }

    console.log('🚀 Processing configuration and continuing to editor...');
    
    try {
        isProcessing = true;
        const continueBtn = getElement('continue-btn');
        if (continueBtn) {
            continueBtn.disabled = true;
            continueBtn.textContent = 'Processing...';
        }
        
        // Collect configuration data
        const configData = collectConfigurationData();
        if (!configData) {
            throw new Error('Failed to collect configuration data');
        }
        
        console.log('📋 Configuration collected:', configData);
        
        // Send to backend
        const response = await fetch('/api/process-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(configData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.detail || 'Processing failed');
        }
        
        console.log('✅ Configuration processed successfully');
        
        // Close config modal and open editor modal
        closeConfigurationModal();
        
        setTimeout(() => {
            openEditorModal();
            
            // Display results after modal is open
            setTimeout(() => {
                displayAIResult(result);
            }, 100);
        }, 200);
        
        showAlert('Configuration processed successfully! Check the analysis results.', 'success');
        
    } catch (error) {
        console.error('❌ Error processing configuration:', error);
        showAlert('Error: ' + error.message, 'error');
    } finally {
        isProcessing = false;
        const continueBtn = getElement('continue-btn');
        if (continueBtn) {
            continueBtn.disabled = false;
            continueBtn.textContent = 'Continue to Editor';
        }
    }
}

function collectConfigurationData() {
    try {
        const defaultPrompt = getElement('default-prompt');
        const modelSelect = getElement('model-select');
        const methodSelect = getElement('method-select');
        
        if (!defaultPrompt || !modelSelect || !methodSelect) {
            throw new Error('Configuration form elements not found');
        }
        
        const config = {
            default_prompt: defaultPrompt.value.trim() || 'Tell me about this document',
            model: modelSelect.value || 'gpt-4o-mini',
            method: methodSelect.value || 'extraction',
            document_sources: selectedFiles.map(file => file.name),
            referenced_elements: [...referencedElements]
        };
        
        return config;
    } catch (error) {
        console.error('❌ Error collecting configuration:', error);
        return null;
    }
}

// ===== AI RESULT DISPLAY =====
function displayAIResult(result) {
    try {
        console.log('🎯 Displaying AI result in preview panel');
        
        // Since we're in a modal now, the preview-content should always be accessible
        const previewContent = getElement('preview-content');
        if (!previewContent) {
            console.error('❌ Preview content element not found');
            showAlert('Preview panel not available in editor modal.', 'error');
            return;
        }
        
        const timestamp = new Date().toLocaleTimeString();
        const methodLabel = result.method_used || 'Unknown';
        const modelLabel = result.model_used || 'Unknown';
        
        const resultHtml = `
            <div class="preview-header">
                <strong>AI Analysis Complete</strong><br>
                Method: <strong>${escapeHtml(methodLabel)}</strong> | 
                Model: <strong>${escapeHtml(modelLabel)}</strong> | 
                ${timestamp}
            </div>
            
            <div class="config-summary">
                <h4>Configuration Summary</h4>
                <div style="font-size: 13px; line-height: 1.5;">
                    <strong>Prompt:</strong> ${escapeHtml(result.user_prompt ? result.user_prompt.substring(0, 150) + (result.user_prompt.length > 150 ? '...' : '') : 'N/A')}<br>
                    <strong>Files:</strong> ${result.files_processed ? result.files_processed.join(', ') : 'None'}<br>
                    ${result.referenced_elements && result.referenced_elements.length > 0 ? 
                        `<strong>Elements:</strong> ${result.referenced_elements.join(', ')}` : ''}
                </div>
            </div>
            
            <div class="preview-result">
                ${escapeHtml(result.result || 'No result available')}
            </div>
        `;
        
        previewContent.innerHTML = resultHtml;
        console.log('✅ AI result displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying AI result:', error);
        showErrorInPreview('Error displaying AI result: ' + error.message);
    }
}

function showErrorInPreview(errorMessage) {
    try {
        const previewContent = getElement('preview-content');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="error-message">
                    <strong>Error:</strong> ${escapeHtml(errorMessage)}
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error showing error in preview:', error);
    }
}

// ===== CHAT FUNCTIONALITY =====
function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    if (isProcessing) {
        console.log('⏳ Already processing, ignoring chat message...');
        return;
    }
    
    try {
        const chatInput = getElement('chat-input');
        const sendBtn = getElement('send-btn');
        
        if (!chatInput) {
            throw new Error('Chat input not found');
        }
        
        const message = chatInput.value.trim();
        if (!message) {
            showAlert('Please enter a message', 'info');
            return;
        }
        
        console.log('💬 Sending chat message:', message);
        
        // Add user message to chat
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Update UI
        isProcessing = true;
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.textContent = 'Processing...';
        }
        
        // Show loading in preview
        showLoadingInPreview();
        
        // Prepare request (using the regular /api/process endpoint for chat)
        const requestData = {
            user_prompt: message,
            method: currentMethod,
            model: 'gpt-4o-mini',
            data: [],
            files: selectedFiles.length > 0 ? selectedFiles.map(file => ({
                file_name: file.name,
                file_type: file.type || 'unknown',
                file_path: file.name
            })) : [{
                file_name: 'test',
                file_type: 'TXT',
                file_path: 'test.txt'
            }]
        };
        
        const response = await fetch('/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            addChatMessage(result.result || 'No response received', 'ai');
            showChatResultInPreview(result.result, result.method_used);
        } else {
            throw new Error(result.detail || 'Chat processing failed');
        }
        
    } catch (error) {
        console.error('❌ Error sending chat message:', error);
        addChatMessage('Error: ' + error.message, 'ai');
        showErrorInPreview('Chat error: ' + error.message);
    } finally {
        isProcessing = false;
        const sendBtn = getElement('send-btn');
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send';
        }
    }
}

function addChatMessage(text, sender) {
    try {
        const chatMessages = getElement('chat-messages');
        if (!chatMessages) return;
        
        // Remove welcome message if it exists
        const welcomeMsg = chatMessages.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (text.length > 500) {
            const pre = document.createElement('pre');
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.fontFamily = 'inherit';
            pre.style.margin = '0';
            pre.textContent = text;
            messageDiv.appendChild(pre);
        } else {
            messageDiv.textContent = text;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } catch (error) {
        console.error('❌ Error adding chat message:', error);
    }
}

function showLoadingInPreview() {
    try {
        const previewContent = getElement('preview-content');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    Processing your query using <strong>${currentMethod}</strong> method...
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error showing loading in preview:', error);
    }
}

function showChatResultInPreview(content, method) {
    try {
        const previewContent = getElement('preview-content');
        if (previewContent) {
            const timestamp = new Date().toLocaleTimeString();
            previewContent.innerHTML = `
                <div class="preview-header">
                    <strong>Chat Response</strong><br>
                    Method: <strong>${escapeHtml(method || currentMethod)}</strong> | ${timestamp}
                </div>
                <div class="preview-result">
                    ${escapeHtml(content || 'No content')}
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error showing chat result in preview:', error);
    }
}

// ===== CONFIGURATION MANAGEMENT =====
async function saveConfig() {
    try {
        const configData = collectConfigurationData();
        if (!configData) {
            throw new Error('Failed to collect configuration data');
        }
        
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            showAlert('Configuration saved successfully!', 'success');
        } else {
            throw new Error(result.message || 'Save failed');
        }
        
    } catch (error) {
        console.error('❌ Error saving configuration:', error);
        showAlert('Error saving configuration: ' + error.message, 'error');
    }
}

async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        
        if (response.ok) {
            const config = await response.json();
            
            // Update form elements
            const defaultPrompt = getElement('default-prompt');
            const modelSelect = getElement('model-select');
            const methodSelect = getElement('method-select');
            
            if (defaultPrompt) defaultPrompt.value = config.default_prompt || 'Tell me about this document';
            if (modelSelect) modelSelect.value = config.model || 'gpt-4o-mini';
            if (methodSelect) methodSelect.value = config.method || 'extraction';
            
            // Update referenced elements
            referencedElements = config.referenced_elements || ['kpi-table'];
            
            // Update element buttons
            querySelectorAll('.element-btn').forEach(btn => {
                const element = btn.dataset.element;
                if (referencedElements.includes(element)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            console.log('✅ Configuration loaded');
        }
        
    } catch (error) {
        console.error('❌ Error loading configuration:', error);
    }
}

function loadConfigurationIntoForm() {
    // This gets called when opening the config modal
    loadConfig();
}

// ===== SYSTEM HEALTH =====
async function checkSystemHealth() {
    try {
        console.log('🔍 Checking system health...');
        
        const response = await fetch('/api/health');
        const health = await response.json();
        
        updateStatusIndicator('system-status', 
            health.status === 'healthy', 
            health.status || 'Unknown');
            
        updateStatusIndicator('api-status', 
            health.api_key_configured === true, 
            health.api_key_configured ? 'Configured' : 'Not configured');
            
        updateStatusIndicator('requirements-status', 
            health.requirements_met === true, 
            health.requirements_met ? 'Met' : 'Not met');
        
        console.log('✅ Health check completed');
        
    } catch (error) {
        console.error('❌ Health check failed:', error);
        updateStatusIndicator('system-status', false, 'Error');
        updateStatusIndicator('api-status', false, 'Error');
        updateStatusIndicator('requirements-status', false, 'Error');
    }
}

function updateStatusIndicator(textElementId, isHealthy, text) {
    try {
        const textElement = getElement(textElementId);
        if (textElement) {
            textElement.textContent = text;
            
            const statusItem = textElement.parentElement;
            if (statusItem) {
                const indicator = statusItem.querySelector('.status-indicator');
                if (indicator) {
                    indicator.className = 'status-indicator ' + 
                        (isHealthy ? 'healthy' : 'error');
                }
            }
        }
    } catch (error) {
        console.error('❌ Error updating status indicator:', error);
    }
}

// ===== ALERT SYSTEM =====
function showAlert(message, type = 'info') {
    try {
        const alertContainer = getElement('alert-container');
        
        if (!alertContainer) {
            console.log(`${type.toUpperCase()}: ${message}`);
            return;
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'alert-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => alert.remove();
        
        alert.textContent = message;
        alert.appendChild(closeButton);
        
        alertContainer.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
        
    } catch (error) {
        console.error('❌ Error showing alert:', error);
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('❌ Global error:', event.error);
    showAlert('An unexpected error occurred. Check console for details.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Unhandled promise rejection:', event.reason);
    showAlert('A network or processing error occurred. Please try again.', 'error');
});

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
// Make functions available to HTML onclick handlers
window.openConfigurationModal = openConfigurationModal;
window.closeConfigurationModal = closeConfigurationModal;
window.openEditorModal = openEditorModal;
window.closeEditorModal = closeEditorModal;
window.backToConfiguration = backToConfiguration;
window.selectFiles = selectFiles;
window.processAndContinueToEditor = processAndContinueToEditor;
window.saveConfig = saveConfig;
window.loadConfig = loadConfig;
window.checkHealth = checkSystemHealth;
window.handleChatKeyPress = handleChatKeyPress;
window.sendMessage = sendMessage;

console.log('📝 AI Document Analysis System - Script loaded successfully');
console.log('🎨 Modal-based UI system ready');
console.log('✅ Global functions exposed for HTML onclick handlers');