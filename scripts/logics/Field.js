import figures from "../data/figures.js";

class Field {
	list = figures;
	squares = [];
	gameStarted = false;
	gamePaused = true;
	gameOver = false;
	endOfField = [];
	scores = 0;
	yMax = 20;

	constructor($field) {
		this.$field = $field;
	}

	get getYMax() {
		return this.yMax;
	}

	get getGameStarted() {
		return this.gameStarted;
	}

	get getGamePaused() {
		return this.getGamePaused;
	}

	get getCoordsOfSquares() {
		return this.squares;
	}

	get getEndOfField() {
		return this.endOfField;
	}

	get getGameOver() {
		return this.gameOver;
	}

	set setGameOver(value) {
		this.gameOver = value;
	}

	/**
	 * Обновление рейтинга
	 * @param {number} value Новое значение для поля очков
	 * @param {clear} boolean Нужно ли очистить очки 
	 * @public
	 */
	updateScores(value, clear = false) {
		this.scores = clear === false ? this.scores + Number(value) : value;
		document.querySelector(".scores__value").textContent = this.scores;
	}

	/**
	 * Окончание игры
	 * @public
	 */
	finishGameOver() {
		this.gameOver = true;

		document.querySelector("#gameOverModal").classList.remove("hidden");
		document.querySelector(".gameOver__content--subtitle").textContent = `
			Вы набрали ${this.scores} очков!
		`;

		this.updateScores(0, true);
	}

	/**
	 * Заполнить и нарисовать квадраты
	 * @public
	 * */
	fillAndDrawSquares() {
		// Заполняем
		for (let y = this.yMax; y >= 1; y--) {
			const list = [];

			for (let x = 1; x <= 10; x++) {
				let coords = { x, y };

				// Определяем позиции для конечных квадратов
				if (x === 1) coords = { ...coords, position: "LEFT" };
				if (x === 10) coords = { ...coords, position: "RIGHT" };
				if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(x) && y === 1) coords = { ...coords, end: true, position: "DOWN" };

				// Заполняем массив с координатами конечных квадратов
				if (Object.keys(coords).includes("position")) this.endOfField.push(coords);

				list.push(coords);
			}

			this.squares.push(list);
		}

		// Рисуем списки
		for (let i = this.squares.length; i > 0; i--) {
			this.$field.innerHTML += `
				<ul class="field__list" data-y="${i}" data-fill="0"></ul>
			`;
		}

		const $fieldList = document.querySelectorAll(".field__list");

		// Отрисовка квадратов для конкретного списка
		$fieldList.forEach(($list, idx) => {
			this.squares[idx].forEach(({ x, y, position }) => {
				$list.innerHTML += `
					<li
						class="field__square"
						data-x="${x}"
						data-y="${y}"
						${position ? `data-position="${position}"` : ""}
					></li>
				`;
			});
		});
	}

	/**
	 * Очищение поля
	 * @public
	*/
	clear() {
		document.querySelectorAll(".figure").forEach(($figureSquare) => {
			$figureSquare.className = "field__square";
		});
	}

	/**
	 * Рендер поля
	 * @public
	 * */
	render() {
		this.fillAndDrawSquares();
	}

	/** 
	 * Запуск
	 * @public
	 * */
	startPlay() {
		this.gamePaused = false;
		this.gameStarted = true;

		this.clear();
	}

	/**
	 * Продолжить играть после паузы
	 * @public
	 */
	continuePlay() {
		this.gamePaused = false;
		this.gameStarted = true;
		this.setStopDropFigure = false;
	}

	/**
	 * Пауза
	 * @public
	 * */
	pause() {
		this.gamePaused = true;
	}
}

export default Field;