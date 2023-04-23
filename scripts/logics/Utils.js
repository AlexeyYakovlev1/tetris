class Utils {
	// Получение квадратов из html по координатам
	getHTMLSquareByCoords(coords) {
		const { x, y } = coords;
		return document.querySelector(`.field__square[data-x="${x}"][data-y="${y}"]`);
	}

	// Удаление определенного квадрата
	removeDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquareByCoords(coords);

		$square.classList.remove(cssClass, "figure");
	}

	// Добавление определенного квадрата
	addDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquareByCoords(coords);

		$square.classList.add(cssClass, "figure");
	}

	// Нахождение минимального числа
	findMinNumber(arr) {
		if (arr.length === 0) return;

		let min = arr[0];

		for (let i = 0; i < arr.length; i++) if (arr[i] < min) min = arr[i];

		return min;
	}
}

export default Utils;