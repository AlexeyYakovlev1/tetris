import figures from "../data/figures.js";

class Field {
	constructor($field) {
		this.list = figures;
		this.$field = $field;
		this.squares = [];
		this.gameStarted = false;
		this.gamePaused = false;
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

	// Заполнить и нарисовать квадраты
	fillAndDrawSquares() {
		// заполняем
		for (let i = 20; i >= 1; i--) {
			const list = [];
			for (let j = 1; j <= 10; j++) list.push({ x: j, y: i });
			this.squares.push(list);
		}

		// рисуем
		for (let i = this.squares.length; i > 0; i--) {
			this.$field.innerHTML += `
				<ul class="field__list" data-y="${i}"></ul>
			`;
		}

		const $fieldList = document.querySelectorAll(".field__list");

		$fieldList.forEach(($list, idx) => {
			this.squares[idx].forEach(({ x, y }) => {
				$list.innerHTML += `
					<li
						class="field__square"
						data-x="${x}"
						data-y="${y}"
					></li>
				`;
			});
		});
	}

	// Очищение поля
	clear() {
		document.querySelectorAll(".figure").forEach(($figureSquare) => {
			$figureSquare.className = "field__square";
		});
	}

	// Рендер поля
	render() {
		this.fillAndDrawSquares();
	}

	// Запуск 
	startPlay() {
		this.gamePaused = false;
		this.gameStarted = true;

		this.clear();
	}

	// Продолжить играть после паузы
	continuePlay() {
		this.gamePaused = false;
		this.gameStarted = true;
		this.setStopDropFigure = false;
	}

	// Пауза
	pause() {
		this.gamePaused = true;
	}
}

export default Field;