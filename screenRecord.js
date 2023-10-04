// Перевірте, чи браузер підтримує запис екрану
if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
	console.log('Ваш браузер не підтримує запис екрану');
} else {
	// Знайдіть кнопку за її id
	const startButton = document.getElementById('start');
	const stopButton = document.getElementById('stop');
	const preview = document.getElementById('preview');
	let mediaRecorder;

	// Додайте обробник подій click до кнопки
	startButton.addEventListener('click', () => {
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			alert('Запис екрану вже запущено');
			return;
		}
		// Запитайте дозвіл на запис екрану
		navigator.mediaDevices.getDisplayMedia({ video: true })
			.then(stream => {
				// Покажіть потік у вікні перегляду
				preview.srcObject = stream;
				// Створіть новий об'єкт MediaRecorder
				mediaRecorder = new MediaRecorder(stream);
				// Зберігайте дані в масиві поки запис триває
				const chunks = [];
				mediaRecorder.ondataavailable = e => chunks.push(e.data);
				// Коли запис закінчиться, збережіть дані у файл Blob
				mediaRecorder.onstop = e => {
					const blob = new Blob(chunks, { type: 'video/webm' });
					const url = URL.createObjectURL(blob);
					// Завантажте файл
					const a = document.createElement('a');
					a.href = url;
					a.download = 'screen-record.webm';
					a.click();
				};
				// Почніть запис
				mediaRecorder.start();
				stopButton.disabled = false;
			})
			.catch(err => console.error(err));
	});
	stopButton.addEventListener('click', () => {
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			// Зупиніть запис і вимкніть кнопку stop
			mediaRecorder.stop();
			stopButton.disabled = true;
			// Вимкніть вікно перегляду
			preview.srcObject.getTracks().forEach(track => track.stop());
			preview.srcObject = null;
		}
	});
}
