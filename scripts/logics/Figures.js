import figures from "../data/figures.js";

class Figures {
	list = figures;
	activeFigure = {};
	activeFigureHaveSides = false;
	refreshPosition = null;
	stopDropFigure = true;
	coordinatesOfAllActiveSquares = [];

	get getActiveFigureData() {
		return {
			activeFigure: this.activeFigure,
			activeFigureHaveSides: this.activeFigureHaveSides,
			coordinatesOfAllActiveSquares: this.coordinatesOfAllActiveSquares
		};
	}

	// Объяление значений по умолчанию
	resetToDefaultValue() {
		this.activeFigure = {};
		this.activeFigureHaveSides = false;
		this.refreshPosition = null;
		this.stopDropFigure = true;
		this.coordinatesOfAllActiveSquares = [];
	}

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

		// Рисуем
		this.draw(currentFigure);

		// Назначаем
		this.assignAnActiveFigure(currentFigure);
	}

	// Определяем переменные для активной фигуры
	assignAnActiveFigure(figure) {
		this.activeFigure = figure;
		this.activeFigureHaveSides = Object.keys(figure).includes("sides");
		this.setCoordsSquaresFromActiveFigure();
	}

	// Определяем координаты всех квадратов активной фигуры
	setCoordsSquaresFromActiveFigure(figure = this.activeFigure) {
		const { yList, xSquare, fillUpTo } = figure;

		// Если у фигуры есть стороны
		if (yList === undefined || xSquare === undefined) {
			if (this.activeFigureHaveSides === true) {
				figure.sides.forEach(s => this.setCoordsSquaresFromActiveFigure(s));
			}
			return
		}

		const { x: fillUpToX, y: fillUpToY } = fillUpTo;
		const coords = [];

		// Если сторона не расширяется
		if (fillUpToY === 0 && fillUpToX === 0) {
			coords.push({ x: xSquare, y: yList });
		}

		// Если сторона расширяется по Y
		if (fillUpToY && fillUpToX === 0) {
			for (let i = yList; i >= yList - fillUpToY; i--) {
				coords.push({ x: xSquare, y: i });
			}
		}

		// Если сторона расширяется по X
		if (fillUpToX && fillUpToY === 0) {
			for (let i = xSquare; i >= xSquare - fillUpToX; i--) {
				coords.push({ x: i, y: yList });
			}
		}

		// Если сторона расширяется по X и Y
		if (fillUpToY && fillUpToX) {
			for (let i = xSquare; i >= xSquare - fillUpToX; i--) {
				for (let j = yList; j >= yList - fillUpToY; j--) {
					coords.push({ x: i, y: j });
				}
			}
		}

		this.coordinatesOfAllActiveSquares.push(...coords);
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

	// Метод рисования фигур (кроме I типа)
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
		const { xSquare, yList } = side;

		for (let i = xSquare; i <= xSquare + fillUpToX; i++) {
			const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];

			$square.classList.add(cssClass);
		}
	}

	// Удаление/Добавление css класса квадрату
	setSquareClass(coords, figureName) {
		const cssClass = `figure__${figureName}`;
		const { y: yList, x: xSquare } = coords;
		const coordsForFindSquare = { x: xSquare, y: yList };
		const $square = this.getHTMLSquaresByCoords(coordsForFindSquare)[0];

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

	set setStopDropFigure(value) {
		this.stopDropFigure = value;
	}

	// Каждую секунду опускаем активную фигуру
	dropFigureAfterSeconds(sec = 1) {
		const refreshPosition = setInterval(() => {
			if (this.stopDropFigure === true) clearInterval(refreshPosition);

			const { name } = this.activeFigure;

			if (this.activeFigureHaveSides === false) {
				const { yList, xSquare, fillUpTo } = this.activeFigure;
				const coords = { x: xSquare, y: yList, fillUpTo };

				this.setSquareClass(coords, name);
			} else {
				this.activeFigure.sides.forEach((side, idx) => {
					const { yList, xSquare, fillUpTo } = side;
					const coords = { x: xSquare, y: yList, fillUpTo, idxCurrentSide: idx };

					this.setSquareClass(coords, name);
				});
			}

			// Обновляем массив с координатами активных квадратов
			this.coordinatesOfAllActiveSquares = [];
			this.setCoordsSquaresFromActiveFigure();
		}, sec * 1000);
	}
}

export default Figures;