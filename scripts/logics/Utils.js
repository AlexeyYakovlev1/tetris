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

		$square.classList.remove(cssClass, "figure", "active--figure");
	}

	// Добавление определенного квадрата
	addDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquareByCoords(coords);

		$square.classList.add(cssClass, "figure", "active--figure");
	}
}

export default Utils;