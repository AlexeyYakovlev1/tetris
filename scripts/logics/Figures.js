import figures from "../data/figures.js";
import valueScores from "../data/scores.js";
import Utils from "./Utils.js";
import Draw from "./Draw.js";

const draw = new Draw();
const utils = new Utils();

class Figures {
	list = JSON.parse(JSON.stringify(figures));
	refreshPosition = setInterval(() => { });
	stopDropFigure = true;
	allowedCodesForControl = ["ArrowRight", "ArrowLeft", "ArrowDown", "KeyR"];
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
	stopGame = false;

	constructor(endOfField, gameOver, updateScores, maxCoords) {
		this.endOfField = endOfField;
		this.gameOver = gameOver;
		this.updateScores = updateScores;
		this.maxCoords = maxCoords;
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

		// Deep copy
		this.list = JSON.parse(JSON.stringify(figures));
		this.currentPositionActiveSquare = new Set();
		this.refreshPosition = setInterval(() => { });
		this.stopDropFigure = true;
		this.renderNewFigure = false;
		this.stopGame = false;
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
		if (this._checkIfFigureCanBeDropped() === false) {
			this.resetToDefaultValue();
			this.gameOver();
			this.stopGame = true;
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

		const coords = [];

		if (!fillUpTo) {
			coords.push({ x: xSquare, y: yList });
		} else {
			const { x: fillUpToX, y: fillUpToY } = fillUpTo;

			// Если сторона не расширяется
			if (fillUpToY === 0 && fillUpToX === 0) coords.push({ x: xSquare, y: yList });

			// Если сторона расширяется по Y
			if (fillUpToY !== 0 && fillUpToX === 0) {
				for (let i = yList; i >= yList - fillUpToY; i--) coords.push({ x: xSquare, y: i });
			}

			// Если сторона расширяется по X
			if (fillUpToX !== 0 && fillUpToY === 0) {
				for (let i = xSquare; i <= xSquare + fillUpToX; i++) {
					coords.push({ x: i, y: yList });
				}
			}

			// Если сторона расширяется по X и Y
			if (fillUpToY !== 0 && fillUpToX !== 0) {
				for (let i = xSquare; i >= xSquare - fillUpToX; i--) {
					for (let j = yList; j >= yList - fillUpToY; j--) coords.push({ x: i, y: j });
				}
			}
		}

		this.activeFigureData.coordinatesOfAllActiveSquares.push(...coords);
	}

	/**
	 * Определение конца поля относительно фигуры
	 * @public
	 */
	defineEndOfField() {
		const { coordinatesOfAllActiveSquares } = this.activeFigureData;

		// Находим активные квадраты на концах поля
		const activeSquaresInEndField = coordinatesOfAllActiveSquares.filter((coordsActiveSquare) => {
			return this.endOfField.find((coordsEndSquare) => {
				const { x, y } = coordsEndSquare;
				return x === coordsActiveSquare.x && y === coordsActiveSquare.y;
			});
		});

		if (activeSquaresInEndField.length === 0) {
			this.currentPositionActiveSquare = new Set();
			return;
		}

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
	 * @param {boolean} isCollidingWithOtherFigures Для только что отрисованной фигуры если true, то при столкновении с фигурами метод будет возвращать true
	 * @private
	 */
	_identifyFiguresLocatedToDownOfActiveOne($activeSquares, isCollidingWithOtherFigures) {
		let flag = false;

		$activeSquares.forEach(($square) => {
			const { x, y } = $square.dataset;
			const $nextSquare = utils.getHTMLSquareByCoords({ x, y: Number(y) - 1 });

			// Если следующий квадрат будет содержаться в определенной фигуре
			if (this._conditionForDefineFiguresRegardingActiveFigure($nextSquare) === true) {
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
		if (Number(fill) >= 10) {
			// Зачисляем очки
			this.updateScores(valueScores.REMOVE_LIST);

			// Очищаем список от квадратов
			[...$list.children].forEach(($square) => $square.className = "field__square");
			$list.dataset.fill = "0";

			// Опускаем верхние квадраты вниз
			this._dropUpSquares($list);
		}
	}

	/**
	 * Опускаем верхние квадраты вниз
	 * @param {HTMLElement} $list HTML список
	 * @private
	 */
	_dropUpSquares($list) {
		const $allSquaresOfFigure = document.querySelectorAll(".figure");
		const $allUpSquares = [...$allSquaresOfFigure].filter(($square) => {
			return Number($square.dataset.y) > Number($list.dataset.y);
		});

		const yUpSquares = new Set();
		const yCurrentSquares = new Set();
		const dataAllUpSquares = [];

		// Получаем координаты всех квадратов фигур
		for (let i = 0; i < $allUpSquares.length; i++) {
			const $square = $allUpSquares[i];
			const { x, y, id } = $square.dataset;

			yUpSquares.add(y);
			dataAllUpSquares.push({ name: utils.getFigureName({ x, y }), id, x, y });
		}

		// Удаляем старые квадраты
		dataAllUpSquares.forEach((data) => {
			const { x, y, name } = data;
			utils.removeDefiniteSquare({ x, y }, name);
			data.y -= 1;
		});

		// Добавляем новые квадраты
		dataAllUpSquares.forEach((data) => {
			const { x, y, name, id } = data;

			utils.addDefiniteSquare({ x, y }, name, id);
			utils.getHTMLSquareByCoords({ x, y }).classList.remove("active--figure");

			// Заполняем список
			yCurrentSquares.add(y);
		});

		yCurrentSquares.forEach((y) => {
			const $findList = utils.getHTMLListByCoords(y);
			const lengthSquares = [...$findList.children].filter(($square) => $square.classList.contains("figure")).length;

			$findList.dataset.fill = lengthSquares;
		});

		// Обновляем "заполненность" квадратами у списка
		yUpSquares.forEach((y) => {
			const $findList = utils.getHTMLListByCoords(y);
			const lengthSquares = [...$findList.children].filter(($square) => $square.classList.contains("figure")).length;

			$findList.dataset.fill = lengthSquares;
		});
	}

	/**
	 * Каждую секунду опускаем активную фигуру
	 * @param {number} time Время, через которое будет опускаться активная фигура
	 * @public
	 */
	dropFigureAfterSeconds(time = 1) {
		this.refreshPosition = setInterval(() => {
			const figureId = utils.generateId();

			if (this.stopDropFigure === true) {
				clearInterval(this.refreshPosition);
				return;
			}

			this.defineEndOfField();

			// Если фигуры на крае поля или столкнулась с другой фигурой (снизу)
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
					$square.classList.remove("active--figure");

					this.checkingTheFillingOfTheListWithSquares($list);
				});

				this.resetToDefaultValue();
				this.stopDropFigure = false;
				this.renderRandomFigure();

				return;
			}

			// Зачисляем очки
			this.updateScores(valueScores.TIME_OVER);

			const { name } = this.activeFigureData.activeFigure;

			// Удаляем квадрат с текущими координатами (старый)
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
				utils.removeDefiniteSquare(coords, name);
			});

			// Опускаем
			if (this.activeFigureData.activeFigureHaveSides === true) {
				this.activeFigureData.activeFigure.sides.forEach((side) => side.yList -= 1);
			} else {
				this.activeFigureData.activeFigure.yList -= 1;
			}

			// Обновляем массив с координатами активных квадратов
			this.activeFigureData.coordinatesOfAllActiveSquares = [];
			this.setCoordsSquaresFromActiveFigure();

			// Добавляем квадрат с обновленными координатами (новый)
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
				utils.addDefiniteSquare(coords, name, figureId);
			});

			// Определяем фигуры относительно активной фигуры снизу
			this.defineFiguresRegardingActiveFigure(this.endPositions.DOWN);
		}, time * 500);
	}

	/**
	 * Правая стрелка
	 * @private
	 */
	_right() {
		// Если при смещении вправо фигура находится на крае поля или рядом другие фигуры (справо)
		if (
			this.stopGame === true ||
			this.currentPositionActiveSquare.has(this.endPositions.RIGHT) ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.RIGHT) === true
		) {
			return;
		}

		this.defineEndOfField();

		const { activeFigureHaveSides, activeFigure, coordinatesOfAllActiveSquares } = this.activeFigureData;

		let countDownSquares = 0;

		// Определяем нижний правый квадрат
		coordinatesOfAllActiveSquares.forEach((coords) => {
			// Находим нижний квадрат другой фигуры относительно активной
			const downSquareCoords = {
				y: Number(coords.y) - 1,
				x: Number(coords.x) + 1
			};
			const $downSquare = utils.getHTMLSquareByCoords(downSquareCoords);

			// Если квадрат есть
			if (this._conditionForDefineFiguresRegardingActiveFigure($downSquare) === true) {
				countDownSquares += 1;
			}
		});

		// Удаляем старые квадраты
		coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.removeDefiniteSquare(coords, activeFigure.name);
		});

		// Меняем координату X для стороны
		if (activeFigureHaveSides) {
			activeFigure.sides.forEach((side) => {
				if (side.xSquare >= 10) return;
				side.xSquare += 1;
			});
		} else {
			if (activeFigure.xSquare >= 10) return;
			activeFigure.xSquare += 1;
		}

		// Обновляем массив с координатами активных квадратов
		this.activeFigureData.coordinatesOfAllActiveSquares = [];
		this.setCoordsSquaresFromActiveFigure();

		// Если снизу справо есть квадрат другой фигуры
		if (countDownSquares > 0) {
			const figureId = utils.generateId();

			// Добавляем новые квадраты
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
				utils.addDefiniteSquare(coords, activeFigure.name, figureId);
				utils.getHTMLSquareByCoords(coords).classList.remove("active--figure");
			});

			this.stopDropFigure = false;
			this.renderNewFigure = true;

			return;
		}

		const id = utils.generateId();

		// Добавляем новые квадраты
		this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.addDefiniteSquare(coords, activeFigure.name, id);
		});
	}

	/**
	 * Левая стрелка
	 * @private
	 */
	_left() {
		// Если при смещении влево фигура находится на крае поля или рядом другие фигуры (слево)
		if (
			this.stopGame === true ||
			this.currentPositionActiveSquare.has(this.endPositions.LEFT) ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.LEFT) === true
		) {
			return;
		}

		this.defineEndOfField();

		const { activeFigureHaveSides, activeFigure, coordinatesOfAllActiveSquares } = this.activeFigureData;

		let countDownSquares = 0;

		// Определяем нижний левый квадрат
		coordinatesOfAllActiveSquares.forEach((coords) => {
			// Находим нижний квадрат другой фигуры относительно активной
			const downSquareCoords = {
				y: Number(coords.y) - 1,
				x: Number(coords.x) - 1
			};
			const $downSquare = utils.getHTMLSquareByCoords(downSquareCoords);

			// Если квадрат есть
			if (this._conditionForDefineFiguresRegardingActiveFigure($downSquare) === true) {
				countDownSquares += 1;
			}
		});

		// Удаляем старые квадраты
		coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.removeDefiniteSquare(coords, activeFigure.name);
		});

		// Меняем координату X для стороны
		if (activeFigureHaveSides) {
			activeFigure.sides.forEach((side) => {
				if (side.xSquare <= 1) return;
				side.xSquare -= 1;
			});
		} else {
			if (activeFigure.xSquare <= 1) return;
			activeFigure.xSquare -= 1;
		}

		// Обновляем массив с координатами активных квадратов
		this.activeFigureData.coordinatesOfAllActiveSquares = [];
		this.setCoordsSquaresFromActiveFigure();

		// Если снизу слево есть квадрат другой фигуры
		if (countDownSquares > 0) {
			const figureId = utils.generateId();

			// Добавляем новые квадраты
			this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
				utils.addDefiniteSquare(coords, activeFigure.name, figureId);
				utils.getHTMLSquareByCoords(coords).classList.remove("active--figure");
			});

			this.stopDropFigure = false;
			this.renderNewFigure = true;

			return;
		}

		const id = utils.generateId();

		// Добавляем новые квадраты
		this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.addDefiniteSquare(coords, activeFigure.name, id);
		});
	}

	/**
	 * Нижняя стрелка
	 * @private
	 */
	_down() {
		this.defineEndOfField();
		this.stopDropFigure = true;

		// Если при смещении вниз фигура находится на крае поля или рядом другие фигуры (снизу)
		if (
			this.stopGame === true ||
			this.currentPositionActiveSquare.has(this.endPositions.DOWN) ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.DOWN) === true
		) {
			this.stopDropFigure = false;
			return;
		}

		const { activeFigureHaveSides, activeFigure, coordinatesOfAllActiveSquares } = this.activeFigureData;
		const figureId = utils.generateId();

		// Удаляем старые квадраты
		coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.removeDefiniteSquare(coords, activeFigure.name);
		});

		// Меняем координату Y для стороны
		if (activeFigureHaveSides) {
			activeFigure.sides.forEach((side) => {
				if (side.yList <= 0) return;
				side.yList -= 1;
			});
		} else {
			if (activeFigure.yList <= 0) return;
			activeFigure.yList -= 1;
		}

		// Обновляем массив с координатами активных квадратов
		this.activeFigureData.coordinatesOfAllActiveSquares = [];
		this.setCoordsSquaresFromActiveFigure();

		// Добавляем новые квадраты
		this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.addDefiniteSquare(coords, activeFigure.name, figureId);
		});

		this.stopDropFigure = false;
	}

	/**
	 * Переворачивание фигуры на клавишу R
	 * @private
	 */
	_rotateFigure() {
		if (
			this.stopGame === true ||

			this.currentPositionActiveSquare.has(this.endPositions.DOWN) ||
			this.currentPositionActiveSquare.has(this.endPositions.RIGHT) ||
			this.currentPositionActiveSquare.has(this.endPositions.LEFT) ||

			this.defineFiguresRegardingActiveFigure(this.endPositions.DOWN) === true ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.RIGHT) === true ||
			this.defineFiguresRegardingActiveFigure(this.endPositions.LEFT) === true
		) {
			return;
		}

		this.defineEndOfField();

		const { activeFigure, coordinatesOfAllActiveSquares } = this.activeFigureData;

		if (activeFigure.name === "O") {
			return;
		}

		const [smbl] = activeFigure.name.split("-"); // Символ фигуры
		const figureId = utils.generateId();

		// Находим максимальное количество переворотов для активной фигуры
		let maxRotateCount = 0;
		let count = Number(activeFigure.name.at(-1)) || 0;
		let flag = false;

		for (let i = 0; i < this.list.length; i++) {
			const figure = this.list[i];

			if (figure.name.split("-")[0] !== smbl) continue;

			const rotateCount = Number(figure.name.at(-1)) || 0;

			if (rotateCount > maxRotateCount) maxRotateCount = rotateCount;
		}

		// Если кол-во переворотов максимальное, то счетчик нужно обнулять
		if (count + 1 > maxRotateCount) {
			flag = true;
		}

		if (flag === true) count = 0;
		else count++;

		// Ищем фигуру, которой будем заменять активную
		let rotateFigureName = `${smbl}-rotate-${count}`;

		if (count === 0) rotateFigureName = smbl;

		const rotateFigure = this.list.find((figure) => figure.name === rotateFigureName);

		if (rotateFigure === undefined) {
			return;
		}

		// Обновление координат для старой активной фигуры
		const idxOldFigure = this.list.findIndex((figure) => figure.name === activeFigure.name);
		this.list[idxOldFigure] = JSON.parse(JSON.stringify(figures[idxOldFigure]));

		// Отрисовка новой фигуры на том же уровне координат 
		const maxYFromActiveSquares = utils.getMaxNumber(coordinatesOfAllActiveSquares.map(({ y }) => y));
		const yForSubtraction = this.maxCoords.y - maxYFromActiveSquares;
		const rotateFigureHaveSides = Object.keys(rotateFigure).includes("sides");

		// Обновляем координату Y для каждой стороны или фигуры
		if (rotateFigureHaveSides && this.activeFigureData.activeFigureHaveSides) {
			rotateFigure.sides.forEach((side) => {
				side.yList -= yForSubtraction;
			});
		} else if (rotateFigureHaveSides && !this.activeFigureData.activeFigureHaveSides) {
			rotateFigure.sides.forEach((side) => {
				side.yList -= yForSubtraction;
			});
		} else {
			rotateFigure.yList -= yForSubtraction;
		}

		// Назначаем новую фигуру
		this.assignAnActiveFigure(rotateFigure);

		// Обновляем массив с координатами активных квадратов
		this.activeFigureData.coordinatesOfAllActiveSquares = [];
		this.setCoordsSquaresFromActiveFigure();

		let figureCantRotate = false;

		// Проверка координат найденной фигуры на наличие квадратов других фигур
		for (let i = 0; i < this.activeFigureData.coordinatesOfAllActiveSquares.length; i++) {
			const coords = this.activeFigureData.coordinatesOfAllActiveSquares[i];
			const $square = utils.getHTMLSquareByCoords(coords);

			figureCantRotate = this._conditionForDefineFiguresRegardingActiveFigure($square);
			if (figureCantRotate) break;
		}

		// Удаляем старые квадраты
		coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.removeDefiniteSquare(coords, activeFigure.name);
		});

		// Добавляем квадрат с обновленными координатами (новый)
		this.activeFigureData.coordinatesOfAllActiveSquares.forEach((coords) => {
			utils.addDefiniteSquare(coords, rotateFigure.name, figureId);
			utils.getHTMLSquareByCoords(coords).classList.add("active--figure");
		});
	}

	/**
	 * Распределение нажатий
	 * @public
	 */
	move(code) {
		if (this.allowedCodesForControl.includes(code) === false) return;

		// Заменяю if-ом, потому что ругается ident в eslint
		if (code === "ArrowRight") this._right();
		else if (code === "ArrowLeft") this._left();
		else if (code === "ArrowDown") this._down();
		else if (code === "KeyR") this._rotateFigure();
	}
}

export default Figures;