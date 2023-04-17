import figures from "../data/figures.js";
import Utils from "./Utils.js";
import Draw from "./Draw.js";

const draw = new Draw();

class Figures extends Utils {
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

	// Рисует рандомную фигуру
	renderRandomFigure(n = this.list.length) {
		// Ищем рандомную фигуру
		const figureIdx = Math.floor(Math.random() * n);
		const currentFigure = this.list[figureIdx];

		// Рисуем
		draw.draw(currentFigure);

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