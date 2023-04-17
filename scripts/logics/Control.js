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
	right() {
		console.log(this.activeFigureData.coordinatesOfAllActiveSquares);
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