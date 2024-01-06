const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const preview = document.getElementById('preview');
const timerDisplay = document.getElementById('timer');

let mediaRecorder;
let startTime;
let timerInterval;

if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
	alert('Ваш браузер не підтримує запис екрану');
} else {
	startButton.addEventListener('click', () => {
		navigator.mediaDevices.getDisplayMedia({ video: true })
			.then(stream => {
				preview.srcObject = stream;
				mediaRecorder = new MediaRecorder(stream);
				const chunks = [];
				startTime = new Date().getTime();

				mediaRecorder.ondataavailable = e => chunks.push(e.data);
				mediaRecorder.onstop = e => {
					const blob = new Blob(chunks, { type: 'video/webm' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'screen-record.webm';
					a.click();
					clearInterval(timerInterval);
				};

				const updateTimer = () => {
					const currentTime = new Date().getTime();
					const elapsedTime = (currentTime - startTime) / 1000;
					timerDisplay.textContent = formatTime(elapsedTime);
				};
				mediaRecorder.start();
				updateTimer();
				timerInterval = setInterval(updateTimer, 1000);
				startButton.disabled = true;
				stopButton.disabled = false;
			})
			.catch(err => console.error(err));
	});
	stopButton.addEventListener('click', () => {
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			mediaRecorder.stop();
			stopButton.disabled = true;
			preview.srcObject.getTracks().forEach(track => track.stop());
			preview.srcObject = null;
			timerDisplay.textContent = '00:00';
		}
	});
}

function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	const formattedHours = padZero(hours);
	const formattedMinutes = padZero(minutes);
	const formattedSeconds = padZero(remainingSeconds);

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function padZero(number) {
	return number < 10 ? `0${number}` : number;
}