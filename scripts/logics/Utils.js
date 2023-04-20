class Utils {
	// Получение квадратов из html по координатам
	getHTMLSquaresByCoords(coords) {
		const { x, y } = coords;
		return document.querySelector(`.field__square[data-x="${x}"][data-y="${y}"]`);
	}

	// Удаление определенного квадрата
	removeDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquaresByCoords(coords);

		$square.classList.remove(cssClass, "figure");
	}

	// Добавление определенного квадрата
	addDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquaresByCoords(coords);

		$square.classList.add(cssClass, "figure");
	}
}

export default Utils;