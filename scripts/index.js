import Field from "./logics/Field.js";
import Control from "./logics/Control.js";

const $field = document.querySelector(".field");
const $btnStart = document.querySelector("#btn__start");
const $btnPause = document.querySelector("#btn__pause");

const field = new Field($field);
const control = new Control();

field.render();

document.addEventListener("keydown", (event) => {
	if (field.getGameStarted === true) {
		control.setActiveFigureData = field.getActiveFigureData;
		control.move(event.code);
	}
});

$btnStart.addEventListener("click", () => {
	field.startPlay();

	$btnStart.textContent = "Restart";
	$btnPause.classList.remove("hidden");
});

$btnPause.addEventListener("click", () => {
	if ($btnPause.textContent === "Play") {
		$btnPause.textContent = "Pause";
		field.continuePlay();
	} else if ($btnPause.textContent === "Pause") {
		field.pause();
		$btnPause.textContent = "Play";
	}
});