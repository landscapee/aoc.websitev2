import { isString } from 'lodash';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_FONTSIZE = 16;
var currentScreenFontSize;

const p2r = (valueOfPX, sizePx) => {
	let valueOfREM = isString(valueOfPX) && valueOfPX.indexOf('px') > 0 ? parseInt(valueOfPX, 10) / sizePx + 'rem' : valueOfPX / sizePx;
	return valueOfREM;
};

export const selfAdaption = () => {
	let screenWidth = window.innerWidth;
	let screenHeight = window.innerHeight;
	let x, y, radioX, radioY;

	radioX = DEFAULT_WIDTH / DEFAULT_FONTSIZE;
	x = screenWidth / radioX;

	radioY = DEFAULT_HEIGHT / DEFAULT_FONTSIZE;
	y = screenHeight / radioY;
	// y = 16;

	currentScreenFontSize = Math.min(x, y);
	window.document.documentElement.style.fontSize = currentScreenFontSize + 'px';
};

/**
 * 基于设计稿的转换
 */
export const pxtorem = (valueOfPX) => {
	return p2r(valueOfPX, DEFAULT_FONTSIZE);
};

/**
 * 基于当前屏幕的像素转rem
 * @param valueOfPX
 */
export const pxtoremByCS = (valueOfPX) => {
	return p2r(valueOfPX, currentScreenFontSize);
};

/**
 * 基于当前屏幕的rem转px
 * @param valueOfRem
 * @returns {number}
 */
export const remtopxByCS = (valueOfRem) => {
	!currentScreenFontSize && selfAdaption();
    console.log(currentScreenFontSize);
    return valueOfRem * currentScreenFontSize;
};

/**
 * 设计稿px转当前屏幕px
 * @param valueOfRem
 * @returns {number}
 */
export const fixPx = (valueOfPX) => {
	if (!currentScreenFontSize) {
		selfAdaption();
	}
	return (currentScreenFontSize / DEFAULT_FONTSIZE) * valueOfPX;
};
