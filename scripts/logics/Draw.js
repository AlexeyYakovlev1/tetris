import Utils from "./Utils.js";

const utils = new Utils();

class Draw {
	// Рисование фигуры
	draw(figure) {
		// Проверка типа фигуры
		if (!Object.keys(figure).includes("sides")) {
			this.drawTypeI(figure);
		} else if (figure.sides.length >= 2) {
			this.drawOtherFigures(figure);
		}
	}

	// Рисование фигур типа I
	drawTypeI(figure) {
		const { yList, xSquare, fillUpTo: { y: fillUpToY } } = figure;

		utils.addDefiniteSquare({ x: xSquare, y: yList }, figure.name);

		for (let i = yList - 1; i >= yList - fillUpToY; i--) utils.addDefiniteSquare({ x: xSquare, y: i }, figure.name);
	}

	// Растягивание фигур по вертикали Y
	drawStretchingY(xSquare, yList, fillUpToY, figureName) {
		for (let i = yList - 1; i >= yList - fillUpToY; i--) utils.addDefiniteSquare({ x: xSquare, y: i }, figureName);
	}

	// Растягивание фигур по горизонтали X
	drawStretchingX(side, fillUpToX, figureName) {
		const { xSquare, yList } = side;
		for (let i = xSquare; i <= xSquare + fillUpToX; i++) utils.addDefiniteSquare({ x: i, y: yList }, figureName);
	}

	// Метод рисования фигур (кроме I типа)
	drawOtherFigures(figure) {
		figure.sides.forEach((side) => {
			const { yList, xSquare, fillUpTo: { x: fillUpToX, y: fillUpToY } } = side;

			utils.addDefiniteSquare({ x: xSquare, y: yList }, figure.name);

			if (fillUpToX !== 0) this.drawStretchingX(side, fillUpToX, figure.name);
			if (fillUpToY !== 0) this.drawStretchingY(xSquare, yList, fillUpToY, figure.name);
		});
	}
}

export default Draw;