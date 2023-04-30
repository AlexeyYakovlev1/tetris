class Utils {
	/**
	 * Получение квадратов из html по координатам
	 * @param {object} coords Объект координат
	 * @public
	 */
	getHTMLSquareByCoords(coords) {
		const { x, y } = coords;
		return document.querySelector(`.field__square[data-x="${x}"][data-y="${y}"]`);
	}

	/**
	 * Получение списка из html по координатам
	 * @param {number} y Координата списка по Y
	 * @public
	 */
	getHTMLListByCoords(y) {
		return document.querySelector(`.field__list[data-y="${y}"]`);
	}

	/**
	 * Удаление определенного квадрата
	 * @param {object} coords Объект координат
	 * @param {string} nameActiveFigure Имя активной фигуры
	 * @public
	 */
	removeDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquareByCoords(coords);

		$square.classList.remove(cssClass, "figure", "active--figure");
	}

	/**
	 * Добавление определенного квадрата
	 * @param {object} coords Объект координат
	 * @param {string} nameActiveFigure Имя активной фигуры
	 * @public
	 */
	addDefiniteSquare(coords, nameActiveFigure) {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquareByCoords(coords);

		$square.classList.add(cssClass, "figure", "active--figure");
	}
}

export default Utils;