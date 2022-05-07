#!/usr/bin/env node

const exec = require('child_process').exec;
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;
const args = process.argv.slice(2);
const arg = args[0];

function getSavedConfig() {
  let config = null;
  // if reading saved configuration fails, for example invalid JSON
  // it is not clear what json is invalid and why
  // let the user know that saved configuration is invalid
  try {
    // saved configuration should be read from the local module directory
    config = require(resolve(__dirname, 'sk-cli.config.json'));
  } catch (err) {
    throw new Error(
      'Something went wrong while trying to read saved configuration.\n' +
        err.message
    );
  }

  return config;
}

if (!arg) {
  console.log('Error! No argument provided.');
  process.exit(1);
} else if (arg === 'config') {
  const flag = args[1];
  if (!flag) {
    console.log('Error! Please provide the configuration flag.');
    process.exit(1);
  } else if (flag === '--set') {
    const configFile = args[2];

    if (!configFile) {
      console.log('Error! Please provide a configuration file.');
      process.exit(1);
    }

    if (!configFile.endsWith('.json')) {
      console.log("Error! The file name doesn't end with .json");
      process.exit(1);
    }

    // user configuration should be read from the directory that ran cli command
    const configPath = resolve(process.cwd(), configFile);
    const config = require(configPath);

    // save configuration to local module directory
    writeFileSync(
      resolve(__dirname, 'sk-cli.config.json'),
      JSON.stringify(config, null, 2),
      {
        encoding: 'utf8',
      }
    );

    console.log(
      'Configuration saved successfully. ' +
        'Type "sk-cli config --read" to view the configuration.'
    );
  } else if (flag === '--read') {
    const config = getSavedConfig();

    console.log('Your saved configuration is:');
    console.log(config);
  } else {
    console.log(flag + '" is not a valid flag.');
    process.exit(1);
  }
} else {
  const config = getSavedConfig();
  const validCommands = {};
  const invalidCommands = [];

  // store the valid commands from the configuration, save the invalid ones
  args.forEach((command) => {
    if (config[command]) {
      validCommands[command] = config[command];
    } else {
      invalidCommands.push(command);
    }
  });

  const validCommandsKeys = Object.keys(validCommands);

  if (validCommandsKeys.length === 0) {
    console.log(
      'Process terminated. You have ran invalid commands.\n' +
        'To see valid commands, run "sk-cli config --read"'
    );
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
}
