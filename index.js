#!/usr/bin/env node

const { Command } = require('commander');
const packageJson = require('./package.json');

const program = new Command()
  .name(packageJson.name)
  .version(packageJson.version);

program
  .command('rtall <aliases...>')
  .description('runs commands from your configuration file using aliases')
  .action((aliases) => {
    console.log(`Welcome to rtall! You want to run: ${aliases}`);
  });

program.parse(process.argv);
