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

	// отрисовка фигуры
	draw(figure = this.list[6]) {
		const figureHaveSides = Object.keys(figure).includes("sides");
		const { name } = figure;
		const cssClass = `figure__${name}`;

		// для фигуры I
		if (!figureHaveSides) {
			const { yList, xSquare, fillUpTo: { y: fillUpToY } } = figure;
			const $startSquare = this.getHTMLSquaresByCoords({ x: xSquare, y: yList })[0];

			$startSquare.classList.add(cssClass);

			for (let i = yList - 1; i >= yList - fillUpToY; i--) {
				const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: i })[0];
				$square.classList.add(cssClass);
			}
		} else if (figureHaveSides && figure.sides.length >= 2) { // для других фигур
			// фигуры состоят из нескольких сторон
			const { sides } = figure;

			sides.forEach((side) => {
				const { yList, xSquare, fillUpTo: { x: fillUpToX, y: fillUpToY } } = side;
				const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: yList })[0];
				const fillUpToXHaveWhere = Object.keys(fillUpToX).includes("where");

				$square.classList.add(cssClass);

				// каждая сторона может растягиваться в определенную сторону (LEFT, RIGHT)
				if (fillUpToX !== 0) {
					// если нужно растянуть в определенную сторону по x
					if (fillUpToXHaveWhere) {
						const where = fillUpToX.where.split(";");
						const value = fillUpToX.value;

						if (where.length === 1) {
							switch (where[0]) {
								case "RIGHT":
									for (let i = xSquare; i <= xSquare + value; i++) {
										const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
										$square.classList.add(cssClass);
									}
									break;
								case "LEFT":
									for (let i = xSquare - 1; i >= xSquare - value; i--) {
										const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
										$square.classList.add(cssClass);
									}
									break;
							}
						} else if (where.includes("RIGHT") && where.includes("LEFT")) { // если нужно растянуть сразу в две стороны с одинаковым значением
							// RIGHT
							for (let i = xSquare; i <= xSquare + value; i++) {
								const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
								$square.classList.add(cssClass);
							}

							// LEFT
							for (let i = xSquare - 1; i >= xSquare - value; i--) {
								const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
								$square.classList.add(cssClass);
							}
						}
					} else {
						for (let i = xSquare; i <= xSquare + fillUpToX; i++) {
							const $square = this.getHTMLSquaresByCoords({ x: i, y: yList })[0];
							$square.classList.add(cssClass);
						}
					}
				}

				if (fillUpToY !== 0) {
					for (let i = yList - 1; i >= yList - fillUpToY; i--) {
						const $square = this.getHTMLSquaresByCoords({ x: xSquare, y: i })[0];
						$square.classList.add(cssClass);
					}
				}
			});
		}
	}
}