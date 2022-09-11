#!/usr/bin/env node

const { writeFile } /****************/ = require('fs').promises;
const { resolve } /******************/ = require('path');
const { spawn } /********************/ = require('child_process');
const { Command } /******************/ = require('commander');
const { cosmiconfig } /**************/ = require('cosmiconfig');
const packageJson /******************/ = require('./package.json');

const explorer = cosmiconfig(packageJson.name);

const program = new Command()
  .name(packageJson.name)
  .version(packageJson.version);

program
  .arguments('<aliases...>')
  .description('runs commands from your configuration file using aliases')
  .action((aliases) => {
    explorer
      // load path to users config
      .load('config.json')
      .then((result) => result.config.path)
      // load users config
      .then(explorer.load)
      .then((result) => result.config)
      // collect commands
      .then((config) =>
        aliases.reduce((commands, alias) => {
          const command = config[alias];
          if (command) return [...commands, command];
          // don't omit a command
          else {
            console.log(`Terminating. Couldn't find matching command ${alias}`);
            process.exit(1);
          }
        }, [])
      )
      // run all commands
      .then((commands) =>
        commands.forEach((command) =>
          spawn(command, { shell: true, stdio: 'inherit' })
        )
      );
  });

program
  .command('config <path>')
  .description('saves path to your configuration file')
  // create cli configuration and save absolute path to users configuration
  .action((path) => {
    const absolutePath = resolve(path);
    const config = { path: absolutePath };

    writeFile('config.json', JSON.stringify(config)).then(() =>
      console.log(
        `Successfully saved path. Path to your configuration file is: ${config.path}`
      )
    );
  });

program.parse(process.argv);
