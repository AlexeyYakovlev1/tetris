import Utils from "./Utils.js";

const utils = new Utils();

class Draw {
	/**
	 * Рисование фигуры
	 * @param {object} figure Объект фигуры
	 * @public
	 */
	init(figure) {
		// Проверка типа фигуры
		if (!Object.keys(figure).includes("sides")) this.drawTypeI(figure);
		else if (figure.sides.length >= 1) this.drawOtherFigures(figure);
	}

	/**
	 * Рисование фигур типа I
	 * @param {object} figure Объект фигуры
	 * @public
	 */
	drawTypeI(figure) {
		const { yList, xSquare, fillUpTo: { y: fillUpToY, x: fillUpToX } } = figure;
		const id = utils.generateId();

		utils.addDefiniteSquare({ x: xSquare, y: yList }, figure.name, id);

		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			utils.addDefiniteSquare({ x: xSquare, y: i }, figure.name, id);
		}

		for (let i = xSquare - 1; i >= xSquare - fillUpToX; i--) {
			utils.addDefiniteSquare({ x: i, y: yList }, figure.name, id);
		}
	}

	/**
	 * Растягивание фигур по вертикали Y
	 * @param {number} xSquare Координата x
	 * @param {number} yList Координата y
	 * @param {number} fillUpToY На сколько нужно растянуть по вертикали
	 * @param {string} figureName Имя фигуры
	 * @param {string} id Идентификатор
	 * @public
	 */
	drawStretchingY(xSquare, yList, fillUpToY, figureName, id) {
		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			utils.addDefiniteSquare({ x: xSquare, y: i }, figureName, id);
		}
	}

	/**
	 * Растягивание фигур по горизонтали X
	 * @param {object} side Объект стороны
	 * @param {number} fillUpToX На сколько нужно растянуть по горизонтали
	 * @param {string} figureName Имя фигуры
	 * @param {string} id Идентификатор 
	 * @public
	 */
	drawStretchingX(side, fillUpToX, figureName, id) {
		const { xSquare, yList } = side;

		for (let i = xSquare; i <= xSquare + fillUpToX; i++) {
			utils.addDefiniteSquare({ x: i, y: yList }, figureName, id);
		}
	}

	/**
	 * Рисование фигур кроме I типа
	 * @param {object} figure Объект фигуры
	 * @public
	 */
	drawOtherFigures(figure) {
		const id = utils.generateId();

		figure.sides.forEach((side) => {
			const { yList, xSquare, fillUpTo: { x: fillUpToX, y: fillUpToY } } = side;

			utils.addDefiniteSquare({ x: xSquare, y: yList }, figure.name, id);

			if (fillUpToX !== 0) this.drawStretchingX(side, fillUpToX, figure.name, id);
			if (fillUpToY !== 0) this.drawStretchingY(xSquare, yList, fillUpToY, figure.name, id);
		});
	}
}

export default Draw;