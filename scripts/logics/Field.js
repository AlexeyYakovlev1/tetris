class Field {
	constructor($field) {
		this.$field = $field;
		this.squares = [];
	}

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

	// получение квадратов из html по координатам
	getHTMLSquaresByCoords(coords) {
		const { x, y } = coords;
		const $fieldSquares = document.querySelectorAll(`.field__square[data-x="${x}"][data-y="${y}"]`);

		return $fieldSquares;
	}

	start() {
		this.fillAndDrawSquares();
	}
}