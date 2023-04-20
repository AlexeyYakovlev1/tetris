import Field from "./logics/Field.js";
import Figures from "./logics/Figures.js";

const $field = document.querySelector(".field");
const $btnStart = document.querySelector("#btn__start");
const $btnPause = document.querySelector("#btn__pause");

const figures = new Figures();
const field = new Field($field);

field.render();

document.addEventListener("keydown", (event) => {
	if (field.getGameStarted === true) figures.move(event.code);
});

$btnStart.addEventListener("click", () => {
	if ($btnStart.textContent === "Restart") {
		window.location.reload();
	} else if ($btnStart.textContent === "Start") {
		field.startPlay();

		figures.renderRandomFigure();
		figures.setStopDropFigure = false;
		figures.dropFigureAfterSeconds();

		$btnStart.textContent = "Restart";
		$btnPause.classList.remove("hidden");
	}
});

$btnPause.addEventListener("click", () => {
	if ($btnPause.textContent === "Play") {
		$btnPause.textContent = "Pause";

		// Продолжаем играть после паузы
		field.continuePlay();
		figures.setStopDropFigure = false;
		figures.dropFigureAfterSeconds();
	} else if ($btnPause.textContent === "Pause") {
		// Пауза
		field.pause();
		figures.setStopDropFigure = true;

		$btnPause.textContent = "Play";
	}
});