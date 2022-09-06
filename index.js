#!/usr/bin/env node

const { Command } = require('commander');
const { exec } = require('child_process');
const { saveConfigPath } = require('./saveConfigPath');
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

const program = new Command()
  .name(packageJson.name)
  .version(packageJson.version);

program
  .command('config <path>')
  .description(
    'Save path to a configuration. We use this path to find saved commands.'
  )
  .action(saveConfigPath);

program
  .command('run <commands...>')
  .description('runs provided commands from the configuration')
  .action(function (commandKeys) {
    const config = getSavedConfig();
    let validCommandKeys = [];
    let invalidCommandKeys = [];

    commandKeys.forEach((commandKey) => {
      if (config[commandKey]) {
        validCommandKeys = [...validCommandKeys, commandKey];
      } else {
        invalidCommandKeys = [...invalidCommandKeys, commandKey];
      }
    });

    if (validCommandKeys.length === 0) {
      console.log('You have not provided any valid commands.');
      process.exit(1);
    }

    if (invalidCommandKeys.length > 0) {
      console.log(
        'The following commands are invalid and will be ignored: ' +
          invalidCommandKeys.join(', ')
      );
    }

    // execute valid commands and notify the user
    validCommandKeys.forEach((commandKey) => {
      console.log('Running: ' + commandKey);
      const command = config[commandKey];

      exec(command, (err, stdout, stderr) => {
        console.log({ err, stdout, stderr });
      });
    });
  });

program.parse(process.argv);
