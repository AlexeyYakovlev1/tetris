class Utils {
	// Получение квадратов из html по координатам
	getHTMLSquaresByCoords(coords) {
		const { x, y } = coords;
		const $fieldSquares = document.querySelectorAll(`.field__square[data-x="${x}"][data-y="${y}"]`);

		return $fieldSquares;
	}
}

export default Utils;