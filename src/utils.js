export const PI2 = Math.PI * 2;

export function colorToRGB(color) {
  const colorName = color.toLowerCase();

  if (colorName.includes('rgb')) {
    const openBracketIndex = colorName.indexOf('(');
    const closeBracketIndex = colorName.indexOf(')');

    const colorList = colorName
      .substring(openBracketIndex + 1, closeBracketIndex)
      .split(', ');

    return {
      r: colorList[0],
      g: colorList[1],
      b: colorList[2],
    };
  }
}
