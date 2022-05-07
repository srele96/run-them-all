#!/usr/bin/env node

const { program } = require('commander');
const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { exec } = require('child_process');
const packageJson = require('./package.json');

function getSavedConfig() {
  let config = null;
  // if reading saved configuration fails, for example invalid JSON
  // it is not clear what json is invalid and why
  // let the user know that saved configuration is invalid
  try {
    config = require('./sk-cli.config.json');
  } catch (err) {
    throw new Error(
      'Something went wrong while trying to read saved configuration.\n' +
        err.message
    );
  }

  return config;
}

program.name(packageJson.name).version(packageJson.version);

program
  .command('config')
  .description('manage configuration')
  .option('--set <fileName>', 'save provided configuration')
  .option('--read', 'view saved configuration')
  .action(function (args) {
    const { set: fileName, read } = args;

    if (fileName) {
      if (!fileName.endsWith('.json')) {
        console.log("Error! The file name doesn't end with .json");
        process.exit(1);
      }

      // user configuration should be read from the directory that ran cli command
      const configPath = resolve(process.cwd(), fileName);
      const config = require(configPath);

      // save configuration to local module directory
      writeFileSync(
        resolve(__dirname, 'sk-cli.config.json'),
        JSON.stringify(config, null, 2),
        { encoding: 'utf8' }
      );

      console.log('Configuration saved successfully.');
    }

    if (read) {
      const config = getSavedConfig();

      console.log('Your saved configuration is:');
      console.log(JSON.stringify(config, null, 2));
    }
  });

program
  .command('run <commands...>')
  .description('runs provided commands from the configuration')
  .action(function (commands) {
    const config = getSavedConfig();
    const validCommands = {};
    const invalidCommands = [];

    commands.forEach((command) => {
      if (config[command]) {
        validCommands[command] = config[command];
      } else {
        invalidCommands.push(command);
      }
    });

    const validCommandsKeys = Object.keys(validCommands);

    if (validCommandsKeys.length === 0) {
      console.log('You have not provided any valid commands.');
      process.exit(1);
    }

    if (invalidCommands.length > 0) {
      console.log(
        'The following commands are invalid and will be ignored: ' +
          invalidCommands.join(', ')
      );
    }

    // execute valid commands and notify the user
    validCommandsKeys.forEach((command) => {
      console.log('Running: ' + command);

      const commands = validCommands[command].join(' & ');
      // execute the merged commands in new cmd and keep the cmd running
      exec('start cmd /k"' + commands + '"', (err, stdout, stderr) => {
        console.log({ err, stdout, stderr });
      });
    });
  });

program.parse(process.argv);
