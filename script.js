const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.textContent = '🌙';
    }
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') {
        return;
    }

    appendMessage(userMessage, 'user-message');
    userInput.value = '';
    
    // Create a temporary element for the AI message to type into
    const aiMessageElement = document.createElement('div');
    aiMessageElement.classList.add('chat-message', 'ai-message');
    chatBox.appendChild(aiMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight;


    fetch(`https://mhmaldyb510-nlp-chat.hf.space/chat?q=${userMessage}`)
        .then(response => response.json())
        .then(data => {
            const aiMessage = data.response;
            typeMessage(aiMessageElement, aiMessage);
        })
        .catch(error => {
            console.error('Error:', error);
            typeMessage(aiMessageElement, 'Sorry, something went wrong. Please try again later.');
        });
}

function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeMessage(element, message, delay = 20) {
    let i = 0;
    element.textContent = ''; // Clear existing content for typing effect
    function type() {
        if (i < message.length) {
            element.textContent += message.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight; // Keep scrolling to bottom
            setTimeout(type, delay);
        }
    }
    type();
}