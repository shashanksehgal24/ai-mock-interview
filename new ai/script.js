let mediaRecorder;
let recordedChunks = [];
let questionIndex = 0;

// Questions Array
const questions = [
    "Tell us about yourself.",
    "Why do you want to work with us?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in five years?",
    "How do you handle stressful situations?",
    "What is your greatest achievement?",
    "Describe a challenging project you worked on.",
];

// DOM Elements
const video = document.getElementById('video');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const recordingStatus = document.getElementById('recording-status');
const feedbackTextarea = document.getElementById('feedback');
const submitFeedbackButton = document.getElementById('submitFeedback');
const questionsContainer = document.getElementById('current-question');

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

    // Start showing questions
    showNextQuestion();
});

// Stop Recording
stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordingStatus.textContent = "Recording stopped. Video saved.";
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});

// Show Next Question
function showNextQuestion() {
    if (questionIndex < questions.length) {
        questionsContainer.textContent = questions[questionIndex];
        questionIndex++;
        setTimeout(showNextQuestion, 15000); // Show each question for 15 seconds
    } else {
        questionsContainer.textContent = "All questions completed!";
    }
}

// Submit Feedback
submitFeedbackButton.addEventListener('click', () => {
    const feedback = feedbackTextarea.value.trim();
    if (feedback) {
        console.log("Feedback Submitted:", feedback);
        alert("Thank you for your feedback!");
        feedbackTextarea.value = '';
    } else {
        alert("Please write feedback before submitting.");
    }
});
