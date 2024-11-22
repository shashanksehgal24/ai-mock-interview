let mediaRecorder;
let recordedChunks = [];
let questionIndex = 0;
let currentQuestionSet = [];

// Default Interview Questions
const defaultQuestions = [
    // "Tell us about yourself.",
    // "Why do you want to work with us?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in five years?",
    "How do you handle stressful situations?",
];

// MERN Stack Questions
const mernQuestions = [
    // "What is the MERN stack?",
    "Explain the role of MongoDB in the MERN stack.",
    "How does Express.js differ from other backend frameworks?",
    "Can you explain the virtual DOM in React?",
    "How do you manage state in a React application?",
    "What is the role of Node.js in the MERN stack?",
    "What are some best practices for building a RESTful API?",
];

// DOM Elements
const video = document.getElementById('video');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const recordingStatus = document.getElementById('recording-status');
const questionsContainer = document.getElementById('current-question');
const showMERNQuestionsButton = document.getElementById('showMERNQuestions');

// Request access to user's webcam
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;

        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream);

        // Store recorded data in chunks
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            // Create video blob and download link
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'mock_interview.webm';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            recordedChunks = [];
        };
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// Start Recording
startRecordingButton.addEventListener('click', () => {
    mediaRecorder.start();
    recordingStatus.textContent = "Recording...";
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;

    // Start showing default questions
    currentQuestionSet = defaultQuestions;
    questionIndex = 0;
    showNextQuestion();
});

// Stop Recording
stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordingStatus.textContent = "Recording stopped. Video saved.";
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});

// Show MERN Questions
showMERNQuestionsButton.addEventListener('click', () => {
    currentQuestionSet = mernQuestions;
    questionIndex = 0;
    showNextQuestion();
});

// Show Next Question
function showNextQuestion() {
    if (questionIndex < currentQuestionSet.length) {
        questionsContainer.textContent = currentQuestionSet[questionIndex];
        questionIndex++;
        setTimeout(showNextQuestion, 30000); // Show each question for 15 seconds
    } 
    // else {
    //     questionsContainer.textContent = "All questions completed!";
    // }
}
