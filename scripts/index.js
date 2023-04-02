const $field = document.querySelector(".field");

const field = new Field($field);
const figures = new Figures();

field.start();
figures.draw();