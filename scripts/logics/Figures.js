import figures from "../data/figures.js";
import Utils from "./Utils.js";
import Draw from "./Draw.js";

const draw = new Draw();
const utils = new Utils();

class Figures {
	list = figures;
	refreshPosition = setInterval(() => { });
	stopDropFigure = true;
	allowedCodesForControl = ["ArrowRight", "ArrowLeft", "ArrowDown"];
	currentPositionActiveSquare = new Set();
	renderNewFigure = false;
	endPositions = {
		DOWN: "DOWN",
		RIGHT: "RIGHT",
		LEFT: "LEFT"
	};
	activeFigureData = {
		activeFigure: {},
		activeFigureHaveSides: false,
		coordinatesOfAllActiveSquares: []
	};

	constructor(endOfField) {
		this.endOfField = endOfField;
	}

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

		this.currentPositionActiveSquare = new Set();
		this.refreshPosition = setInterval(() => { });
		this.stopDropFigure = true;
		this.renderNewFigure = false;
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
		this.activeFigureData = {
			...this.activeFigureData,
			activeFigure: figure,
			activeFigureHaveSides: Object.keys(figure).includes("sides")
		};
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

	// Определение конца поля относительно фигуры
	defineEndOfField() {
		const activeSquaresInEndField = this.activeFigureData.coordinatesOfAllActiveSquares.filter((coordsActiveSquare) => {
			return this.endOfField.find((coordsEndSquare) => {
				const { x, y } = coordsEndSquare;
				return x === coordsActiveSquare.x && y === coordsActiveSquare.y;
			});
		});

		// Забираем позиции из активных конечных квадратов
		activeSquaresInEndField.forEach((coords) => {
			const $square = utils.getHTMLSquareByCoords(coords);
			const currentPosition = $square.dataset.position;

			this.currentPositionActiveSquare.add(currentPosition);
		});
	};

	// Определение фигур относительно активной фигуры
	defineFiguresRegardingActiveFigure(position = this.endPositions.DOWN) {
		if (position === this.endPositions.DOWN) {
			const yActiveSquares = this.activeFigureData.coordinatesOfAllActiveSquares.map((coords) => Number(coords.y));
			const minY = utils.findMinNumber(yActiveSquares);
			const anyXByMinY = this.activeFigureData.coordinatesOfAllActiveSquares.filter((coords) => coords.y === minY)[0].x;

			const $nextSquare = utils.getHTMLSquareByCoords({ x: anyXByMinY, y: minY - 1 });

			if ($nextSquare !== null && $nextSquare.classList.contains("figure")) {
				this.renderNewFigure = true;
				return;
			}
		}
	};

	// Каждую секунду опускаем активную фигуру
	dropFigureAfterSeconds(sec = 1) {
		const refreshPosition = setInterval(() => {
			if (this.stopDropFigure === true) {
				clearInterval(refreshPosition);
				return;
			}

			const { name } = this.activeFigureData.activeFigure;

			// Если фигуры на крае поля (снизу)
			if (
				this.currentPositionActiveSquare.has(this.endPositions.DOWN) ||
				this.renderNewFigure === true
			) {
				// Сохраняем класс figure для квадратов
				this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => utils.addDefiniteSquare(coords, name));

				this.resetToDefaultValue();
				this.renderRandomFigure();
				this.stopDropFigure = false;
				return;
			};

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

			this.defineEndOfField();
			this.defineFiguresRegardingActiveFigure();
		}, sec * 500);
	}

	// Правая стрелка
	right() {
		// Если при смещении вправо фигура находится на крае поля
		if (this.currentPositionActiveSquare.has(this.endPositions.RIGHT)) {
			return;
		};

		const { activeFigureHaveSides, activeFigure } = this.activeFigureData;

		// Меняем координату X для стороны
		if (activeFigureHaveSides) activeFigure.sides.forEach((side) => side.xSquare += 1)
		else activeFigure.xSquare += 1;
	}

	// Левая стрелка
	left() {
		// Если при смещении влево фигура находится на крае поля
		if (this.currentPositionActiveSquare.has(this.endPositions.LEFT)) {
			return;
		};

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
		if (this.allowedCodesForControl.includes(code) === false) {
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