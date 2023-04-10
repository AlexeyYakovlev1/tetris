import Field from "./logics/Field.js";

const $field = document.querySelector(".field");
const field = new Field($field);

field.start();