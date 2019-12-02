const randomColorRGB = function() {
	return Math.round(Math.random() * 1000) % 256;
}

const randomColor = () => {
	var red = randomColorRGB();
	var green = randomColorRGB();
	var blue = randomColorRGB();
	return `rgb(${red},${green}, ${blue})`;
};

module.exports = randomColor;