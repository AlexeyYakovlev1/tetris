import Figures from "./Figures.js";

class Field extends Figures {
	constructor($field) {
		super();
		this.$field = $field;
		this.squares = [];
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
				<ul class="field__list" data-list data-y="${i}"></ul>
			`;
		}

		const $fieldList = document.querySelectorAll(".field__list");

		$fieldList.forEach(($list, idx) => {
			this.squares[idx].forEach(({ x, y }) => {
				$list.innerHTML += `
					<li
						class="field__square"
						data-square
						data-x="${x}"
						data-y="${y}"
					></li>
				`;
			});
		});
	}

	// Запуск 
	start() {
		this.fillAndDrawSquares();
		this.renderRandomFigure();
	}
}

export default Field;