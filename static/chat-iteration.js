// Chat Iteration System with Context Feeding
console.log('💬 Chat Iteration System Loading...');

// Enhanced chat functionality for version iterations
window.ChatIteration = {
    isProcessing: false,
    messageHistory: [],
    currentContext: ''
};

// Enhanced send message function with context feeding
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !sendBtn || !chatMessages) {
        console.error('❌ Chat elements not found');
        return;
    }
    
    const message = chatInput.value.trim();
    if (!message || window.ChatIteration.isProcessing) {
        return;
    }
    
    // Clear input and disable controls
    chatInput.value = '';
    window.ChatIteration.isProcessing = true;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Processing...';
    
    try {
        // Add user message to chat
        addMessageToChat('user', message);
        
        // Show loading indicator in chat
        const loadingId = addLoadingMessage();
        
        // Get current context from preview
        const currentContext = getCurrentPreviewContext();
        const selectedMethod = getSelectedChatMethod();
        
        // Prepare iteration request
        const iterationRequest = {
            user_message: message,
            method: selectedMethod,
            current_context: currentContext,
            chat_history: window.ChatIteration.messageHistory,
            element_context: window.ElementVersioning ? {
                current_version: window.ElementVersioning.currentVersion,
                original_prompt: window.ElementVersioning.originalPrompt
            } : null
        };
        
        console.log('🚀 Sending chat iteration request:', iterationRequest);
        
        // Send to backend for AI processing
        const response = await fetch('/api/chat/iterate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(iterationRequest)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.detail || result.message || 'Chat iteration failed');
        }
        
        // Remove loading message
        removeLoadingMessage(loadingId);
        
        // Add AI response to chat
        addMessageToChat('assistant', result.ai_response);
        
        // Update preview with new output (creating new version)
        if (result.updated_output) {
            updatePreviewWithNewVersion(result.updated_output, message, currentContext);
        }
        
        // Update message history
        window.ChatIteration.messageHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        window.ChatIteration.messageHistory.push({
            role: 'assistant', 
            content: result.ai_response,
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Chat iteration completed successfully');
        
    } catch (error) {
        console.error('❌ Error in chat iteration:', error);
        removeLoadingMessage(loadingId);
        addMessageToChat('system', `Error: ${error.message}`, 'error');
    } finally {
        // Re-enable controls
        window.ChatIteration.isProcessing = false;
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        chatInput.focus();
    }
}

// Get current preview content as context
function getCurrentPreviewContext() {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return '';
    
    // Extract text content, removing HTML tags and metadata
    const previewResult = previewContent.querySelector('.preview-result');
    if (previewResult) {
        return previewResult.textContent || previewResult.innerText || '';
    }
    
    return previewContent.textContent || previewContent.innerText || '';
}

// Get selected chat method (extraction or reasoning)
function getSelectedChatMethod() {
    const activeMethodBtn = document.querySelector('.method-btn.active');
    if (activeMethodBtn) {
        return activeMethodBtn.getAttribute('data-method') || 'extraction';
    }
    return 'extraction';
}

// Add message to chat display
function addMessageToChat(role, content, type = 'normal') {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Remove welcome message if it exists
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;
    
    if (type === 'error') {
        messageDiv.classList.add('error-message');
    }
    
    const timestamp = new Date().toLocaleTimeString();
    
    let messageHTML = '';
    if (role === 'user') {
        messageHTML = `
            <div class="message-header">
                <span class="message-role">You</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">${escapeHtml(content)}</div>
        `;
    } else if (role === 'assistant') {
        messageHTML = `
            <div class="message-header">
                <span class="message-role">AI Assistant</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">${escapeHtml(content)}</div>
        `;
    } else if (role === 'system') {
        messageHTML = `
            <div class="message-content system-message">${escapeHtml(content)}</div>
        `;
    }
    
    messageDiv.innerHTML = messageHTML;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Add loading message
function addLoadingMessage() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return null;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message assistant-message loading-message';
    loadingDiv.innerHTML = `
        <div class="message-header">
            <span class="message-role">AI Assistant</span>
            <span class="message-time">Processing...</span>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return loadingDiv;
}

// Remove loading message
function removeLoadingMessage(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

// Update preview with new version
function updatePreviewWithNewVersion(newOutput, userMessage, previousContext) {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;
    
    // Create new version if version control is available
    if (typeof createNewVersion === 'function' && window.ElementVersioning) {
        const contextUsed = `Previous output: ${previousContext.substring(0, 500)}... + User request: ${userMessage}`;
        createNewVersion(newOutput, userMessage, contextUsed);
    }
    
    // Update preview display
    const timestamp = new Date().toLocaleTimeString();
    const currentVersion = window.ElementVersioning ? window.ElementVersioning.currentVersion : 'Unknown';
    
    const resultHtml = `
        <div class="preview-header">
            <strong>Updated Analysis - Version ${currentVersion}</strong><br>
            Updated at ${timestamp} via chat iteration
        </div>
        
        <div class="iteration-context" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin: 10px 0; font-size: 0.9rem;">
            <strong>Latest Request:</strong> ${escapeHtml(userMessage)}
        </div>
        
        <div class="preview-result">
            ${newOutput}
        </div>
    `;
    
    previewContent.innerHTML = resultHtml;
    console.log('✅ Preview updated with new version');
}

// Method selector functionality
function initializeChatMethodSelector() {
    const methodButtons = document.querySelectorAll('.method-btn');
    
    methodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            methodButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            console.log(`🎯 Chat method switched to: ${method}`);
        });
    });
}

// Enhanced keyboard handler
function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize chat system when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChatMethodSelector();
    console.log('✅ Chat iteration system initialized');
});

// Expose functions to global scope
window.sendMessage = sendMessage;
window.handleChatKeyPress = handleChatKeyPress;

console.log('✅ Chat Iteration System Loaded');