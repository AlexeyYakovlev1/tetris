class Figures extends Field {
	list = [
		{
			color: "#FAFF00",
			name: "O",
			sides: [
				{
					yList: 20,
					xSquare: 5,
					fillUpTo: {
						y: 0,
						x: 1
					}
				},
				{
					yList: 19,
					xSquare: 5,
					fillUpTo: {
						y: 0,
						x: 1
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
						y: 0,
						x: {
							where: "RIGHT",
							value: 1
						}
					}
				},
				{
					yList: 19,
					xSquare: 6,
					fillUpTo: {
						y: 0,
						x: {
							where: "LEFT",
							value: 1
						}
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
						y: 0,
						x: {
							where: "LEFT",
							value: 1
						}
					}
				},
				{
					yList: 19,
					xSquare: 6,
					fillUpTo: {
						y: 0,
						x: {
							where: "RIGHT",
							value: 1
						}
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
						y: 0,
						x: {
							where: "RIGHT;LEFT",
							value: 1
						}
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
	];

	// Рисование фигуры
	draw(figure = this.list[6]) {
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
		const $startSquare = this.getHTMLSquaresByCoords({ x: xSquare, y: yList })[0];
		const cssClass = `figure__${figure.name}`;

		$startSquare.classList.add(cssClass);

		for (let i = yList - 1; i >= yList - fillUpToY; i--) {
			const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: i })[0];
			$square.classList.add(cssClass);
		}
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

	// Метод растягивания фигур в опредленную сторону (RIGHT, LEFT)
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
}