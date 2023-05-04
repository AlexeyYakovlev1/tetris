/**
 * Начальные координаты для фигур и растягивания их сторон (массив для значения по умолчанию)
 */

const figuresForDefault = [
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
		color: "#00E4FF",
		name: "I-rotate-1",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 3
				}
			}
		]
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
		color: "#F60000",
		name: "S-rotate-1",
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
				yList: 19,
				xSquare: 5,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#F60000",
		name: "S-rotate-2",
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
				yList: 19,
				xSquare: 6,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#F60000",
		name: "S-rotate-3",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 1
				}
			},
			{
				yList: 19,
				xSquare: 7,
				fillUpTo: {
					y: 0,
					x: 1
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
		color: "#69B625",
		name: "Z-rotate-1",
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
				yList: 19,
				xSquare: 5,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#69B625",
		name: "Z-rotate-2",
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
				yList: 19,
				xSquare: 7,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#69B625",
		name: "Z-rotate-3",
		sides: [
			{
				yList: 20,
				xSquare: 6,
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
		color: "#FF8D00",
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
				xSquare: 5,
				fillUpTo: {
					y: 0,
					x: 0
				}
			}
		]
	},
	{
		color: "#FF8D00",
		name: "J-rotate-1",
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
		color: "#FF8D00",
		name: "J-rotate-2",
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
				yList: 19,
				xSquare: 4,
				fillUpTo: {
					y: 0,
					x: 1
				}
			}
		]
	},
	{
		color: "#FF8D00",
		name: "J-rotate-3",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 1
				}
			},
			{
				yList: 19,
				xSquare: 7,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#FF8D00",
		name: "J-rotate-4",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 1
				}
			},
			{
				yList: 19,
				xSquare: 6,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#FF51BC",
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
				xSquare: 7,
				fillUpTo: {
					y: 0,
					x: 0
				}
			}
		]
	},
	{
		color: "#FF51BC",
		name: "L-rotate-1",
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
		name: "L-rotate-2",
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
				yList: 19,
				xSquare: 4,
				fillUpTo: {
					y: 0,
					x: 1
				}
			}
		]
	},
	{
		color: "#FF51BC",
		name: "L-rotate-3",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 1
				}
			},
			{
				yList: 19,
				xSquare: 7,
				fillUpTo: {
					y: 1,
					x: 0
				}
			}
		]
	},
	{
		color: "#FF51BC",
		name: "L-rotate-4",
		sides: [
			{
				yList: 20,
				xSquare: 6,
				fillUpTo: {
					y: 0,
					x: 1
				}
			},
			{
				yList: 19,
				xSquare: 6,
				fillUpTo: {
					y: 1,
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
	{
		color: "#9F0096",
		name: "T-rotate-1",
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
		color: "#9F0096",
		name: "T-rotate-2",
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
				yList: 19,
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
		color: "#9F0096",
		name: "T-rotate-3",
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
				yList: 19,
				xSquare: 7,
				fillUpTo: {
					y: 0,
					x: 0
				}
			}
		]
	}
];

export default figuresForDefault;