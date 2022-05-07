# run-them-all

**IMPORTANT! THIS PACKAGE IS IN THE EXPERIMENTAL STAGES.**

Allows you to save the series of commands to a configuration and run them all easily.

## Installation

My intention for this package was to install it globally.
The advantage of the global installation is that it can be run anywhere.

Using npm `npm install -g run-them-all`.

## Getting started

Create a configuration file with the name `config.json`.

Add the following content to it:

```json
{
  "COMMAND_ONE": ["echo one", "echo two", "echo three"],
  "COMMAND_TWO": ["echo four", "echo five", "echo six"]
}
```

1. Install the package globally `npm install -g run-them-all`.
2. Create a configuration file.
3. Set the configuration: `run-them-all config --set config.json`.
4. Verify that the configuration is set: `run-them-all config --read`.
5. Run the commands: `run-them-all COMMAND_ONE COMMAND_TWO`.

You should see the two command prompts opened.

One should have the following output:

```cmd
one
two
three
```

The other should have the following output:

```
four
five
six
```

## Command line usage

```
run-them-all
```

This package works only on Windows and uses command prompt by default.

## Available commands

```
run-them-all run <commands...>              Runs the commands.
run-them-all config --read                  Reads the configuration and prints
                                            it to the console.
run-them-all config --set <fileName>        Reads the content of your configuration
                                            file and saves it.
```
