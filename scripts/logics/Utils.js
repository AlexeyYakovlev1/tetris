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
		$square.dataset.id = "";
	}

	/**
	 * Добавление определенного квадрата
	 * @param {object} coords Объект координат
	 * @param {string} nameActiveFigure Имя активной фигуры
	 * @param {string} id (optional) Идентификатор квадрата
	 * @public
	 */
	addDefiniteSquare(coords, nameActiveFigure, id = "") {
		const cssClass = `figure__${nameActiveFigure}`;
		const $square = this.getHTMLSquareByCoords(coords);

		$square.classList.add(cssClass, "figure", "active--figure");
		$square.dataset.id = id;
	}

	/**
	 * Генерация идентификатора
	 * @public
	 */
	generateId() {
		return Math.random().toString(16).slice(2);
	}

	/**
	 * Получение имени фигуры из квадрата
	 * @param {object} coords Объект координат
	 * @public
	 */
	getFigureName(coords) {
		const $square = this.getHTMLSquareByCoords(coords);
		let result = "";

		$square.className.split(" ").forEach((cssClass) => {
			if (cssClass.includes("figure__")) result = cssClass.replace("figure__", "");
		});

		return result;
	}
}

export default Utils;