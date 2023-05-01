import Field from "./logics/Field.js";
import Figures from "./logics/Figures.js";

const $field = document.querySelector(".field");
const $btnStart = document.querySelector("#btn__start");
const $gameOverContentRestart = document.querySelector(".gameOver__content--restart");
const $gameStartModal = document.querySelector("#gameStartModal");

const field = new Field($field);

field.render();

const figures = new Figures(
	field.getEndOfField,
	field.finishGameOver,
	field.updateScores
);

figures.defineEndOfField();

document.addEventListener("keydown", (event) => {
	if (field.getGameStarted === true && field.getGameOver === false) {
		figures.move(event.code);
	}
});

$gameOverContentRestart.addEventListener("click", () => window.location.reload());

$btnStart.addEventListener("click", () => {
	$gameStartModal.classList.add("hidden");
	field.startPlay();

	figures.renderRandomFigure();
	figures.setStopDropFigure = false;
	figures.dropFigureAfterSeconds();
});