I implemented getHslFromColor() to convert CSS color values to HSL (Hue, Saturation, Lightness) format. This function temporarily applies the color to a DOM element to leverage the browser's ability to compute the style and extract RGB values.
My rgbToHsl() function accurately converts these RGB values into HSL.
I also designed HslToHex() to convert HSL values back to hexadecimal format for easy web use.
The removeRGB() function I wrote helps in cleaning up the RGB string by removing unnecessary characters and splitting it into its constituent numbers.
To enhance user interaction, I added getRandomColor(), which generates a random hex color string.
My isValidColor() function checks if a user-inputted string is a valid CSS color, enhancing the application's robustness.
For generating analogous color palettes, my generateAnalogousPalette() function calculates colors adjacent to the selected color on the color wheel.
In generateRelatedColorsPalette(), I explore variations by adjusting hue, saturation, and lightness.
My generatePalette() function serves as a wrapper to decide which type of palette to generate based on the user's choice.
I use generatePaletteHtml() to dynamically create and inject HTML for each color in a palette into the designated container. This function also converts colors to hex format using HslToHex() before displaying them, ensuring they are correctly formatted for user interaction.
I've added event listeners to enable interactive changes:
The keyup event on searchInput triggers palette updates as the user types a valid color.
change events on typeSelect and countSelect allow the user to adjust the palette type and size, which I handle by updating the displayed palettes accordingly.
The randomBtn click event offers a fun feature to generate and display a random color.
A toggle switch changes the application's theme between light and dark mode, which I manage with a simple change event listener.
Element Selection: I use document.querySelector() to select key DOM elements like inputs, buttons, and containers that will display color palettes.
State Variables: I manage the application's state using variables like currentColor, currentType, and currentCount to keep track of the user-selected color, the type of color palette, and the number of colors to display in each palette, respectively.
