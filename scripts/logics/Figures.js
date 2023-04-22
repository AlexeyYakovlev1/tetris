import figures from "../data/figures.js";
import Utils from "./Utils.js";
import Draw from "./Draw.js";

const draw = new Draw();
const utils = new Utils();

class Figures {
	list = figures;
	refreshPosition = setInterval(() => { });
	stopDropFigure = true;
	allowedCodes = ["ArrowRight", "ArrowLeft", "ArrowDown"];
	activeFigureData = {
		activeFigure: {},
		activeFigureHaveSides: false,
		coordinatesOfAllActiveSquares: []
	};

	set setStopDropFigure(value) {
		this.stopDropFigure = value;
	}

	// Объяление значений по умолчанию
	resetToDefaultValue() {
		this.activeFigureData = {
			activeFigure: {},
			activeFigureHaveSides: false,
			coordinatesOfAllActiveSquares: []
		};

		this.refreshPosition = setInterval(() => { });
		this.stopDropFigure = true;
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
		this.activeFigureData.activeFigure = figure;
		this.activeFigureData.activeFigureHaveSides = Object.keys(figure).includes("sides");
		this.setCoordsSquaresFromActiveFigure();
	}

	// Определяем координаты всех квадратов активной фигуры
	setCoordsSquaresFromActiveFigure(figure = this.activeFigureData.activeFigure) {
		const { yList, xSquare, fillUpTo } = figure;

		// Если у фигуры есть стороны
		if (yList === undefined || xSquare === undefined) {
			if (this.activeFigureData.activeFigureHaveSides === true) {
				figure.sides.forEach(s => this.setCoordsSquaresFromActiveFigure(s));
			}
			return
		}

		const { x: fillUpToX, y: fillUpToY } = fillUpTo;
		const coords = [];

		// Если сторона не расширяется
		if (fillUpToY === 0 && fillUpToX === 0) coords.push({ x: xSquare, y: yList });

		// Если сторона расширяется по Y
		if (fillUpToY !== 0 && fillUpToX === 0) {
			for (let i = yList; i >= yList - fillUpToY; i--) coords.push({ x: xSquare, y: i });
		}

		// Если сторона расширяется по X
		if (fillUpToX !== 0 && fillUpToY === 0) {
			for (let i = xSquare; i >= xSquare - fillUpToX; i--) coords.push({ x: i, y: yList });
		}

		// Если сторона расширяется по X и Y
		if (fillUpToY !== 0 && fillUpToX !== 0) {
			for (let i = xSquare; i >= xSquare - fillUpToX; i--) {
				for (let j = yList; j >= yList - fillUpToY; j--) coords.push({ x: i, y: j });
			}
		}

		this.activeFigureData.coordinatesOfAllActiveSquares.push(...coords);
	}

	// Каждую секунду опускаем активную фигуру
	dropFigureAfterSeconds(sec = 1) {
		const refreshPosition = setInterval(() => {
			if (this.stopDropFigure === true) {
				clearInterval(refreshPosition);
				return;
			}

			const { name } = this.activeFigureData.activeFigure;

			// Опускаем
			if (this.activeFigureData.activeFigureHaveSides === true) {
				this.activeFigureData.activeFigure.sides.forEach((side) => side.yList -= 1);
			} else {
				this.activeFigureData.activeFigure.yList -= 1;
			}

			// Удаляем квадрат с текущими координатами (старый)
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => utils.removeDefiniteSquare(coords, name));

			// Обновляем массив с координатами активных квадратов
			this.activeFigureData.coordinatesOfAllActiveSquares = [];
			this.setCoordsSquaresFromActiveFigure();

			// Добавляем квадрат с обновленными координатами (новый)
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => utils.addDefiniteSquare(coords, name));
		}, sec * 500);
	}

	// Правая стрелка
	right() {
		const { activeFigureHaveSides, activeFigure } = this.activeFigureData;

		// Меняем координату X для стороны
		if (activeFigureHaveSides) activeFigure.sides.forEach((side) => side.xSquare += 1)
		else activeFigure.xSquare += 1;
	}

	// Левая стрелка
	left() {
		const { activeFigureHaveSides, activeFigure } = this.activeFigureData;

		// Меняем координату X для стороны
		if (activeFigureHaveSides) activeFigure.sides.forEach((side) => side.xSquare -= 1)
		else activeFigure.xSquare -= 1;
	}

	// Нижняя стрелка
	down() {
		console.log("down click");
	}

	// Распределение кликов
	move(code) {
		if (this.allowedCodes.includes(code) === false) {
			return;
		}

		switch (code) {
			case "ArrowRight":
				this.right();
				break;
			case "ArrowLeft":
				this.left();
				break;
			case "ArrowDown":
				this.down();
				break;
		}
	}
}

export default Figures;