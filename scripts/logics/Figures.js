class Figures {
	list = [
		{
			color: "#FAFF00",
			name: "O",
			sides: [
				{
					yList: 20,
					xSquare: 5,
					fillUpTo: {
						y: 1,
						x: 0
					}
				},
				{
					yList: 20,
					xSquare: 6,
					fillUpTo: {
						y: 1,
						x: 0
					}
				}
			]
		},
		{
			color: "#00E4FF",
			name: "I",
			yList: 20,
			xSquare: 6,
			fillUpTo: {
				y: 3,
				x: 0
			}
		},
		{
			color: "#F60000",
			name: "S",
			sides: [
				{
					yList: 20,
					xSquare: 6,
					fillUpTo: {
						y: 1,
						x: 0
					}
				},
				{
					yList: 20,
					xSquare: 7,
					fillUpTo: {
						y: 0,
						x: 0
					}
				},
				{
					yList: 19,
					xSquare: 5,
					fillUpTo: {
						y: 0,
						x: 0
					}
				}
			]
		},
		{
			color: "#69B625",
			name: "Z",
			sides: [
				{
					yList: 20,
					xSquare: 6,
					fillUpTo: {
						y: 1,
						x: 0
					}
				},
				{
					yList: 20,
					xSquare: 5,
					fillUpTo: {
						y: 0,
						x: 0
					}
				},
				{
					yList: 19,
					xSquare: 7,
					fillUpTo: {
						y: 0,
						x: 0
					}
				}
			]
		},
		{
			color: "#FF8D00",
			name: "L",
			sides: [
				{
					yList: 20,
					xSquare: 6,
					fillUpTo: {
						y: 2,
						x: 0
					}
				},
				{
					yList: 18,
					xSquare: 5,
					fillUpTo: {
						y: 0,
						x: 0
					}
				}
			]
		},
		{
			color: "#FF51BC",
			name: "J",
			sides: [
				{
					yList: 20,
					xSquare: 6,
					fillUpTo: {
						y: 2,
						x: 0
					}
				},
				{
					yList: 18,
					xSquare: 7,
					fillUpTo: {
						y: 0,
						x: 0
					}
				}
			]
		},
		{
			color: "#9F0096",
			name: "T",
			sides: [
				{
					yList: 20,
					xSquare: 5,
					fillUpTo: {
						y: 1,
						x: 0
					}
				},
				{
					yList: 20,
					xSquare: 6,
					fillUpTo: {
						y: 0,
						x: 0
					}
				},
				{
					yList: 20,
					xSquare: 4,
					fillUpTo: {
						y: 0,
						x: 0
					}
				}
			]
		},
	];
	activeFigure = {};
	activeFigureHaveSides = false;
	refreshPosition = null;
	stopDropFigure = false;

	// Рисование фигуры
	draw(figure) {
		// Проверка типа фигуры
		if (!Object.keys(figure).includes("sides")) {
			this.drawTypeI(figure);
		} else if (figure.sides.length >= 2) {
			this.drawOtherFigures(figure);
		}
	}

	// Рисует рандомную фигуру
	renderRandomFigure(n = this.list.length) {
		// Ищем рандомную фигуру
		const figureIdx = Math.floor(Math.random() * n);
		const currentFigure = this.list[figureIdx];

		// Назначаем
		this.activeFigure = currentFigure;
		this.activeFigureHaveSides = Object.keys(currentFigure).includes("sides");

		// Рисуем
		this.draw(currentFigure);
	}

	// Рисование фигур типа I
	drawTypeI(figure) {
		const { yList, xSquare, fillUpTo: { y: fillUpToY } } = figure;
		const $startSquare = this.getHTMLSquaresByCoords({ x: xSquare, y: yList })[0];
		const cssClass = `figure__${figure.name}`;

		$startSquare.classList.add(cssClass, "figure");

		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: i })[0];
			$square.classList.add(cssClass, "figure");
		}
	}

	// Получение квадратов из html по координатам
	getHTMLSquaresByCoords(coords) {
		const { x, y } = coords;
		const $fieldSquares = document.querySelectorAll(`.field__square[data-x="${x}"][data-y="${y}"]`);

		return $fieldSquares;
	}

	// Метод рисования других фигур
	drawOtherFigures(figure) {
		const cssClass = `figure__${figure.name}`;

		figure.sides.forEach((side) => {
			const { yList, xSquare, fillUpTo: { x: fillUpToX, y: fillUpToY } } = side;
			const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: yList })[0];

			$square.classList.add(cssClass);

			if (fillUpToX !== 0) {
				this.drawStretchingX(side, fillUpToX, cssClass);
			}

			if (fillUpToY !== 0) {
				this.drawStretchingY(xSquare, yList, fillUpToY, cssClass);
			}
		});
	}

	// Растягивание фигур по вертикали Y
	drawStretchingY(xSquare, yList, fillUpToY, cssClass) {
		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: i })[0];
			$square.classList.add(cssClass);
		}
	}

	// Растягивание фигур по горизонтали X
	drawStretchingX(side, fillUpToX, cssClass) {
		const fillUpToXHaveWhere = Object.keys(fillUpToX).includes("where");
		const { xSquare, yList } = side;

		if (fillUpToXHaveWhere) {
			const { where, value } = fillUpToX;
			this.drawStretchingInTwoDirections(where, value, side, cssClass);
		} else {
			for (let i = xSquare; i <= xSquare + fillUpToX; i++) {
				const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
				$square.classList.add(cssClass);
			}
		}
	}

	// Растягивание фигур в опредленную сторону (RIGHT, LEFT)
	drawStretchingInTwoDirections(where, value, side, cssClass) {
		const whereArray = where.split(";");
		const { xSquare, yList } = side;

		if (whereArray.includes("RIGHT") && whereArray.includes("LEFT")) {
			for (let i = xSquare; i <= xSquare + value; i++) {
				const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
				$square.classList.add(cssClass);
			}
			for (let i = xSquare - 1; i >= xSquare - value; i--) {
				const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
				$square.classList.add(cssClass);
			}
		} else if (whereArray[0] === "RIGHT") {
			for (let i = xSquare; i <= xSquare + value; i++) {
				const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
				$square.classList.add(cssClass);
			}
		} else if (whereArray[0] === "LEFT") {
			for (let i = xSquare - 1; i >= xSquare - value; i--) {
				const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
				$square.classList.add(cssClass);
			}
		}
	}

	// Удаление/Добавление css класса квадрату
	setSquareClass(coords, figureName) {
		const cssClass = `figure__${figureName}`;
		const { y: yList, x: xSquare } = coords;
		const coordsForFindSquares = { x: xSquare, y: yList };
		const $square = this.getHTMLSquaresByCoords(coordsForFindSquares)[0];

		$square.classList.remove(cssClass, "figure");

		// Если у активной фигуры нет сторон
		if (this.activeFigureHaveSides === false) {
			const { fillUpTo: { y: fillUpToY } } = coords;

			this.activeFigure.yList -= 1;

			const coordsForNextSquare = { y: yList - fillUpToY - 1, x: xSquare };
			const $newSquare = this.getHTMLSquaresByCoords(coordsForNextSquare)[0];

			$newSquare.classList.add(cssClass, "figure");
		} else {
			const { x, y, fillUpTo: { y: fillUpToY }, idxCurrentSide } = coords;
			const $removedSquare = this.getHTMLSquaresByCoords({ x, y })[0];

			$removedSquare.classList.remove(cssClass, "figure");

			// Опускаем текущую сторону
			this.activeFigure.sides[idxCurrentSide].yList -= 1;

			const $newSquare = this.getHTMLSquaresByCoords({ y: y - fillUpToY - 1, x })[0];

			$newSquare.classList.add(cssClass, "figure");
		}
	}

	get getStopDropFigure() {
		return this.stopDropFigure;
	}

	set setStopDropFigure(value) {
		this.stopDropFigure = value;
	}

	// Каждую секунду опускаем рандомную фигуру
	dropFigureAfterSeconds(sec = 1) {
		const refreshPosition = setInterval(() => {
			if (this.getStopDropFigure === true) clearInterval(refreshPosition);

			const { name } = this.activeFigure;

			if (this.activeFigureHaveSides === false) {
				const { yList, xSquare, fillUpTo } = this.activeFigure;
				const coords = { x: xSquare, y: yList, fillUpTo };

				this.setSquareClass(coords, name);
			} else {
				this.activeFigure.sides.forEach((side, idx) => {
					const { yList, xSquare, fillUpTo } = side;
					const coords = { x: xSquare, y: yList, fillUpTo, idxCurrentSide: idx };

					console.log("Side coords: ", coords);

					this.setSquareClass(coords, name);
				});
			}
		}, sec * 1000);
	}
}

export default Figures;