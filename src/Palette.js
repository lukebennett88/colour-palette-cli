const convert = require('color-convert');

module.exports = class Palette {
  constructor({ primary, paletteName, wantsGrays, wantsUtilities }) {
    this.primary = primary;
    this.paletteName = paletteName;
    this.wantsGrays = wantsGrays;
    this.wantsUtilities = wantsUtilities;
    this.grays = {};
    this.primaries = {};
    this.utilities = {};

    return (async () => {
      await this.generatePrimaries();

      if (wantsGrays) {
        await this.generateGrays();
      }

      if (wantsUtilities) {
        await this.generateUtilities();
      }

      return this;
    })();
  }

  getColours() {
    let palette = { ...this.primaries };

    if (this.wantsGrays) {
      palette = { ...palette, ...this.grays };
    }

    if (this.wantsUtilities) {
      palette = { ...palette, ...this.utilities };
    }

    return palette;
  }

  async generatePrimaries() {
    const hex = this.primary;
    const hsl = convert.hex.hsl(hex);

    const hue = hsl[0];

    const hslArray = [
      [hue, 100, 97],
      [hue, 96, 89],
      [hue, 93, 77],
      [hue, 90, 65],
      [hue, 84, 57],
      [hue, 75, 50],
      [hue, 71, 44],
      [hue, 65, 37],
      [hue, 61, 30],
    ];

    const primaries = this.generateColourHash({
      hslArray,
      name: this.paletteName,
    });
    return (this.primaries = {
      [this.paletteName]: this.primary.toLowerCase(),
      ...primaries,
    });
  }

  async generateGrays() {
    const hex = this.primary;
    const hsl = convert.hex.hsl(hex);

    const hue = hsl[0];

    const hslArray = [
      [hue, 45, 98],
      [hue, 38, 95],
      [hue, 32, 91],
      [hue, 25, 84],
      [hue, 20, 69],
      [hue, 15, 52],
      [hue, 17, 35],
      [hue, 23, 23],
      [hue, 26, 24],
    ];

    return (this.grays = this.generateColourHash({ hslArray, name: 'gray' }));
  }

  // eslint-disable-next-line class-methods-use-this
  generateColourHash({ hslArray, name }) {
    return hslArray.reduce((object, colour, index) => {
      const identifier = `${name}-${index + 1}00`;
      const hex = convert.hsl.hex(colour);
      object[identifier] = `#${hex.toLowerCase()}`;
      return object;
    }, {});
  }

  async generateUtilities() {
    return (this.utilities = {
      success: '#1ac79e',
      error: '#e73434',
      warning: '#f1aa20',
    });
  }
};
