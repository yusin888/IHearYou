document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const statusDiv = document.getElementById('status');
    const body = document.body;
    let recognition = null;
    let speaking = false;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    } else {
        statusDiv.textContent = 'Speech recognition not supported';
        startBtn.disabled = true;
        return;
    }

    // Initialize speech synthesis
    const speechSynthesis = window.speechSynthesis;
    
    function speak(text) {
        if (speaking) return;
        speaking = true;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            speaking = false;
        };
        speechSynthesis.speak(utterance);
    }

    // Handle recognition results
    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const color = event.results[last][0].transcript.trim().toLowerCase();

        if (color === 'blue') {
            body.className = 'h-screen w-screen flex flex-col items-center justify-center transition-colors duration-500 bg-blue-500';
            speak('Here is the blue screen');
            statusDiv.textContent = 'Recognized: Blue';
        } else if (color === 'red') {
            body.className = 'h-screen w-screen flex flex-col items-center justify-center transition-colors duration-500 bg-red-500';
            speak('Here is the red screen');
            statusDiv.textContent = 'Recognized: Red';
        }
    };

    recognition.onerror = (event) => {
        statusDiv.textContent = 'Error occurred: ' + event.error;
    };

    recognition.onend = () => {
        recognition.start();
        statusDiv.textContent = 'Listening...';
    };

    // Handle start button
    let isListening = false;
    startBtn.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
            startBtn.textContent = 'Stop Listening';
            startBtn.className = 'bg-red-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-600 transition-colors';
            statusDiv.textContent = 'Listening...';
        } else {
            recognition.stop();
            startBtn.textContent = 'Start Listening';
            startBtn.className = 'bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition-colors';
            statusDiv.textContent = 'Click Start to begin listening';
            body.className = 'h-screen w-screen flex flex-col items-center justify-center transition-colors duration-500';
        }
        isListening = !isListening;
    });
});