import Utils from "./Utils.js";

const utils = new Utils();

class Control {
	allowedCodes = ["ArrowRight", "ArrowLeft", "ArrowDown"];
	activeFigureData = {};

	set setActiveFigureData(value) {
		this.activeFigureData = value;
	}

	// Проверка кликов
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

	// Правая стрелка
	// right() {
	// 	const { coordinatesOfAllActiveSquares, activeFigure, activeFigureHaveSides } = this.activeFigureData;
	// 	const cssClass = `figure__${activeFigure.name}`;
	// 	console.log("===================");
	// 	coordinatesOfAllActiveSquares.forEach((coord) => {
	// 		// Перемещаем вправо на 1
	// 		coord.x += 1;

	// 		const { x: activeSquareX, y: activeSquareY } = coord;

	// 		// Удаляем текущий квадрат
	// 		const $removedSquare = this.getHTMLSquaresByCoords(coord)[0];
	// 		$removedSquare.classList.remove(cssClass, "figure");

	// 		// Добавляем активный квадрат
	// 		if (activeFigureHaveSides) {
	// 			const findSide = activeFigure.sides.filter(({ xSquare, yList }) => {
	// 				return xSquare.toString() === activeSquareX.toString() && yList.toString() === activeSquareY.toString();
	// 			})[0];

	// 			if (findSide !== undefined) {
	// 				this.changeXCoordFromSide(coord, 2);
	// 			}
	// 		}

	// 		console.log(
	// 			`Координаты при нажатии на правую стрелку:`, coord
	// 		);
	// 		debugger

	// 		const $newSquare = this.getHTMLSquaresByCoords(coord)[0];
	// 		$newSquare.classList.add(cssClass, "figure");
	// 	});
	// }

	right() {
		console.log(this.activeFigureData);

	}

	// Изменить координату X опредленной стороны
	changeXCoordFromSide(coordsForFind, newValue) {
		const { activeFigure } = this.activeFigureData;
		const { x, y } = coordsForFind;
		const findSide = activeFigure.sides.find((s) => s.xSquare === x && s.yList === y);

		if (findSide) {
			activeFigure.sides.find((s) => s.xSquare === x && s.yList === y).xSquare = newValue;
		}
	}

	// Левая стрелка
	left() {
		console.log("left click");
	}

	// Нижняя стрелка
	down() {
		console.log("down click");
	}
}

export default Control;