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
		const $startSquare = utils.getHTMLSquaresByCoords({ x: xSquare, y: yList });

		const cssClass = `figure__${figure.name}`;

		$startSquare.classList.add(cssClass, "figure");

		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			const $square = utils.getHTMLSquaresByCoords({ x: xSquare, y: i });

			$square.classList.add(cssClass, "figure");
		}
	}

	// Растягивание фигур по вертикали Y
	drawStretchingY(xSquare, yList, fillUpToY, cssClass) {
		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			const $square = utils.getHTMLSquaresByCoords({ x: xSquare, y: i });

			$square.classList.add(cssClass);
		}
	}

	// Растягивание фигур по горизонтали X
	drawStretchingX(side, fillUpToX, cssClass) {
		const { xSquare, yList } = side;

		for (let i = xSquare; i <= xSquare + fillUpToX; i++) {
			const $square = utils.getHTMLSquaresByCoords({ x: i, y: yList });

			$square.classList.add(cssClass);
		}
	}

	// Метод рисования фигур (кроме I типа)
	drawOtherFigures(figure) {
		const cssClass = `figure__${figure.name}`;

		figure.sides.forEach((side) => {
			const { yList, xSquare, fillUpTo: { x: fillUpToX, y: fillUpToY } } = side;
			const $square = utils.getHTMLSquaresByCoords({ x: xSquare, y: yList });

			$square.classList.add(cssClass);

			if (fillUpToX !== 0) {
				this.drawStretchingX(side, fillUpToX, cssClass);
			}

			if (fillUpToY !== 0) {
				this.drawStretchingY(xSquare, yList, fillUpToY, cssClass);
			}
		});
	}
}

export default Draw;