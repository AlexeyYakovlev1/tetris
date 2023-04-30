/**
 * Начальные координаты для фигур и растягивания их сторон
 */

const figures = [
	{
		color: "#FAFF00",
		name: "O",
		sides: [
			{
				yList: 20,
				xSquare: 5,
				fillUpTo: {
					y: 1,
					x: 0
				}
			},
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 1,
					x: 0
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
					y: 1,
					x: 0
				}
			},
			{
				yList: 20,
				xSquare: 7,
				fillUpTo: {
					y: 0,
					x: 0
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
	{
		color: "#69B625",
		name: "Z",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 1,
					x: 0
				}
			},
			{
				yList: 20,
				xSquare: 5,
				fillUpTo: {
					y: 0,
					x: 0
				}
			},
			{
				yList: 19,
				xSquare: 7,
				fillUpTo: {
					y: 0,
					x: 0
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
					y: 1,
					x: 0
				}
			},
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 0
				}
			},
			{
				yList: 20,
				xSquare: 4,
				fillUpTo: {
					y: 0,
					x: 0
				}
			}
		]
	},
];

export default figures;