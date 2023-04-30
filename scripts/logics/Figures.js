import figures from "../data/figures.js";
import valueScores from "../data/scores.js";
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
	scores = 0;
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

	constructor(endOfField, gameOver, updateScores) {
		this.endOfField = endOfField;
		this.gameOver = gameOver;
		this.updateScores = updateScores;
	}

	set setStopDropFigure(value) {
		this.stopDropFigure = value;
	}

	/**
	 * Объяление значений по умолчанию
	 * @public
	 */
	resetToDefaultValue() {
		this.activeFigureData = {
			activeFigure: {},
			activeFigureHaveSides: false,
			coordinatesOfAllActiveSquares: []
		};

		// Каким-то образом изменяется массив figures, поэтому обнуление будет выглядеть так (
		this.list = [
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
		this.currentPositionActiveSquare = new Set();
		this.refreshPosition = setInterval(() => { });
		this.stopDropFigure = true;
		this.renderNewFigure = false;
	}

	/**
	 * Рисует рандомную фигуру
	 * @param {number} n Номер для нахождения рандомной фигуры
	 * @public
	 */
	renderRandomFigure(n = this.list.length) {
		// Ищем рандомную фигуру
		const figureIdx = Math.floor(Math.random() * n);
		const currentFigure = this.list[figureIdx];

		// Рисуем на начальной позиции
		draw.init(currentFigure);

		// Зачисляем очки
		this.updateScores(valueScores.NEW_FIGURE);

		// Назначаем
		this.assignAnActiveFigure(currentFigure);

		// Если при рендере новой фигуры снизу уже есть фигуры
		if (this._checkIfFigureCanBeDropped(currentFigure) === false) {
			this.resetToDefaultValue();
			this.gameOver();
			return;
		}
	}

	/**
	 * Проверка для отрисованной фигуры на разрешение падать
	 * @private
	 */
	_checkIfFigureCanBeDropped() {
		if (this.defineFiguresRegardingActiveFigure(this.endPositions.DOWN, true) === true) {
			return false;
		}

		return true;
	}

	/**
	 * Определяем переменные для активной фигуры
	 * @param {object} figure Объект фигуры
	 * @public
	 */
	assignAnActiveFigure(figure) {
		this.activeFigureData = {
			...this.activeFigureData,
			activeFigure: figure,
			activeFigureHaveSides: Object.keys(figure).includes("sides")
		};
		this.setCoordsSquaresFromActiveFigure();
	}

	/**
	 * Определяем координаты всех квадратов активной фигуры
	 * @param {object} figure Объект фигуры
	 * @public
	 */
	setCoordsSquaresFromActiveFigure(figure = this.activeFigureData.activeFigure) {
		const { yList, xSquare, fillUpTo } = figure;

		// Если у фигуры есть стороны
		if (yList === undefined || xSquare === undefined) {
			if (this.activeFigureData.activeFigureHaveSides === true) {
				figure.sides.forEach(s => this.setCoordsSquaresFromActiveFigure(s));
			}
			return;
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

	/**
	 * Определение конца поля относительно фигуры
	 * @public
	 */
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
	}

	/**
	 * Определение фигур относительно активной фигуры
	 * @param {string} position Позиция, которая определяет конец поля
	 * @param {boolean} renderFigureReturn (optional) Для только что отрисованной фигуры если true, то при столкновении с фигурами метод будет возвращать true
	 * @public
	 */
	defineFiguresRegardingActiveFigure(position, isCollidingWithOtherFigures = false) {
		const { coordinatesOfAllActiveSquares } = this.activeFigureData;
		const $activeSquares = [];

		// Находим все активные квадраты
		coordinatesOfAllActiveSquares.forEach((coords) => {
			$activeSquares.push(utils.getHTMLSquareByCoords(coords));
		});

		// Заменяю if-ом, потому что ругается ident в eslint
		if (position === this.endPositions.DOWN) {
			return this._identifyFiguresLocatedToDownOfActiveOne($activeSquares, isCollidingWithOtherFigures);
		} else if (position === this.endPositions.RIGHT) {
			return this._identifyFiguresLocatedToRightOfActiveOne($activeSquares);
		} else if (position === this.endPositions.LEFT) {
			return this._identifyFiguresLocatedToLeftOfActiveOne($activeSquares);
		}
	}

	/**
	 * Определяет фигуры снизу относительно активной фигуры
	 * @param {HTMLCollection} $activeSquares Активные HTML квадраты
	 * @param {boolean} renderFigureReturn Для только что отрисованной фигуры если true, то при столкновении с фигурами метод будет возвращать true
	 * @private
	 */
	_identifyFiguresLocatedToDownOfActiveOne($activeSquares, isCollidingWithOtherFigures) {
		let flag = false;

		$activeSquares.forEach(($square) => {
			const { x, y } = $square.dataset;
			const $nextSquare = utils.getHTMLSquareByCoords({ x, y: Number(y) - 1 });

			// Если следующий квадрат будет содержаться в определенной фигуре
			if (this._conditionForDefineFiguresRegardingActiveFigure($nextSquare)) {
				flag = true;
				this.renderNewFigure = true;
				return;
			}
		});

		if (isCollidingWithOtherFigures === true && flag === true) return true;
	}

	/**
	 * Определяет фигуры слева относительно активной фигуры
	 * @param {HTMLCollection} $activeSquares Активные HTML квадраты
	 * @private
	 */
	_identifyFiguresLocatedToLeftOfActiveOne($activeSquares) {
		const squaresInFigureToRight = $activeSquares.filter(($square) => {
			const { x, y } = $square.dataset;
			const $rightSquare = utils.getHTMLSquareByCoords({ x: Number(x) - 1, y });

			// Если следующий правый квадрат будет содержаться в определенной фигуре
			return this._conditionForDefineFiguresRegardingActiveFigure($rightSquare);
		});

		return !!squaresInFigureToRight.length;
	}

	/**
	 * Определяет фигуры справа относительно активной фигуры
	 * @param {HTMLCollection} $activeSquares Активные HTML квадраты
	 * @private
	 */
	_identifyFiguresLocatedToRightOfActiveOne($activeSquares) {
		const squaresInFigureToRight = $activeSquares.filter(($square) => {
			const { x, y } = $square.dataset;
			const $rightSquare = utils.getHTMLSquareByCoords({ x: Number(x) + 1, y });

			// Если следующий правый квадрат будет содержаться в определенной фигуре
			return this._conditionForDefineFiguresRegardingActiveFigure($rightSquare);
		});

		return !!squaresInFigureToRight.length;
	}

	/**
	 * Условие для определения фигур относительно активных квадратов фигуры
	 * @param {HTMLElement} $square HTML квадрат
	 * @private
	 */
	_conditionForDefineFiguresRegardingActiveFigure($square) {
		return (
			$square !== null &&
			$square.classList.contains("figure") &&
			!$square.classList.contains("active--figure")
		);
	}

	/**
	 * Проверяет заполненность квадратами список (для последующего очищения)
	 * @param {HTMLElement} $list HTML список квадратов
	 * @public
	 */
	checkingTheFillingOfTheListWithSquares($list) {
		const { fill } = $list.dataset;

		// Если список полностью заполненный, то очищаем
		if (fill == 10) {
			// Зачисляем очки
			this.updateScores(valueScores.REMOVE_LIST);

			[...$list.children].forEach(($square) => $square.className = "field__square");
			$list.dataset.fill = "0";
		}
	}

	/**
	 * Каждую секунду опускаем активную фигуру
	 * @param {number} time Время, через которое будет опускаться активная фигура
	 * @public
	 */
	dropFigureAfterSeconds(time = 1) {
		this.refreshPosition = setInterval(() => {
			if (this.stopDropFigure === true) {
				clearInterval(this.refreshPosition);
				return;
			}

			// Если фигуры на крае поля (снизу) или столкнулась с другой фигурой
			if (
				this.currentPositionActiveSquare.has(this.endPositions.DOWN) ||
				this.renderNewFigure === true
			) {
				// Очищаем текущие квадраты от активной фигуры
				this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
					const $square = utils.getHTMLSquareByCoords(coords);
					const $list = utils.getHTMLListByCoords(coords.y);

					// Обновляем значение "заполненность квадратами" (fill) у списка
					$list.dataset.fill = Number($list.dataset.fill) + 1;

					this.checkingTheFillingOfTheListWithSquares($list);

					$square.classList.remove("active--figure");
				});

				this.resetToDefaultValue();
				this.stopDropFigure = false;
				this.renderRandomFigure();

				return;
			}

			// Зачисляем очки
			this.updateScores(valueScores.TIME_OVER);

			const { name } = this.activeFigureData.activeFigure;

			// Опускаем
			if (this.activeFigureData.activeFigureHaveSides === true) {
				this.activeFigureData.activeFigure.sides.forEach((side) => side.yList -= 1);
			} else {
				this.activeFigureData.activeFigure.yList -= 1;
			}

			// Удаляем квадрат с текущими координатами (старый)
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
				utils.removeDefiniteSquare(coords, name);
			});

			// Обновляем массив с координатами активных квадратов
			this.activeFigureData.coordinatesOfAllActiveSquares = [];
			this.setCoordsSquaresFromActiveFigure();

			// Добавляем квадрат с обновленными координатами (новый)
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
				utils.addDefiniteSquare(coords, name);
			});

			this.defineEndOfField();
			this.defineFiguresRegardingActiveFigure(this.endPositions.DOWN);
		}, time * 300);
	}

	/**
	 * Правая стрелка
	 * @public
	 */
	right() {
		// Если при смещении вправо фигура находится на крае поля
		if (
			this.currentPositionActiveSquare.has(this.endPositions.RIGHT) === true ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.RIGHT) === true
		) {
			return;
		}

		const { activeFigureHaveSides, activeFigure } = this.activeFigureData;

		// Меняем координату X для стороны
		if (activeFigureHaveSides) activeFigure.sides.forEach((side) => side.xSquare += 1);
		else activeFigure.xSquare += 1;
	}

	/**
	 * Левая стрелка
	 * @public
	 */
	left() {
		// Если при смещении влево фигура находится на крае поля
		if (
			this.currentPositionActiveSquare.has(this.endPositions.LEFT) === true ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.LEFT) === true
		) {
			return;
		}

		const { activeFigureHaveSides, activeFigure } = this.activeFigureData;

		// Меняем координату X для стороны
		if (activeFigureHaveSides) activeFigure.sides.forEach((side) => side.xSquare -= 1);
		else activeFigure.xSquare -= 1;
	}

	/**
	 * Нижняя стрелка
	 * @public
	 */
	down() {
		console.log("down click");
	}

	/**
	 * Распределение кликов
	 * @public
	 */
	move(code) {
		if (this.allowedCodesForControl.includes(code) === false) return;

		// Заменяю if-ом, потому что ругается ident в eslint
		if (code === "ArrowRight") this.right();
		else if (code === "ArrowLeft") this.left();
		else if (code === "ArrowDown") this.down();
	}
}

export default Figures;