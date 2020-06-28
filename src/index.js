#! /usr/bin/env node

const inquirer = require('inquirer');
const clipboardy = require('clipboardy');
const chalk = require('chalk');
const Palette = require('./Palette');

inquirer
  .prompt([
    {
      name: 'primary',
      type: 'input',
      message: "What's your primary colour Hex value?",
      default() {
        return '#5a67d8';
      },
      filter(hex) {
        if (hex[0] !== '#') {
          return `#${hex}`;
        }
        return hex;
      },
      validate(hex) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
      },
    },
    {
      name: 'paletteName',
      type: 'input',
      message: 'What name do you want to give this palette?',
      default() {
        return 'primary';
      },
    },
    {
      name: 'grays',
      type: 'confirm',
      message: 'Would you like a complementary gray palette?',
      default() {
        return false;
      },
    },
    {
      name: 'utilities',
      type: 'confirm',
      message:
        'Would you like a set of utility colours (success, error, warning)?',
      default() {
        return false;
      },
    },
  ])
  .then(async (answers) => {
    const { primary, paletteName } = answers;
    const wantsGrays = answers.grays;
    const wantsUtilities = answers.utilities;

    const palette = await new Palette({
      primary,
      paletteName,
      wantsGrays,
      wantsUtilities,
    });
    const colours = palette.getColours();

    console.log(chalk.inverse.bold("Here's your palette:"));
    clipboardy.writeSync(JSON.stringify(colours, null, 2));
    console.log(JSON.stringify(colours, null, 2));
    return console.log(
      chalk.inverse.bold("We've copied that to your clipboard!")
    );
  });
