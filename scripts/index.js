import Field from "./logics/Field.js";

const $field = document.querySelector(".field");
const $btnStart = document.querySelector("#btn__start");
const $btnPause = document.querySelector("#btn__pause");

const field = new Field($field);

field.render();

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