#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const downloadRepo = require('./utils/downloadRepo');
// current dir
const cwd = process.cwd();

const REPOS_MAP = {
  'chrome+extension': 'https://github.com/yes1am/chrome-extension-starter/archive/master.zip',
  react: 'https://github.com/yes1am/express-react-boilerplate/archive/master.zip',
};

function cleanPackage(projectName) {
  try {
    const data = fs.readFileSync(path.resolve(cwd, `./${projectName}/package.json`), 'utf8');
    const packageJson = JSON.parse(data);
    packageJson.name = projectName;
    packageJson.version = '1.0.0';
    const newPackageJson = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync(path.resolve(cwd, `./${projectName}/package.json`), newPackageJson, 'utf8');
  } catch (error) {
    console.log(chalk.red('cleanPackage: ', error));
  }
}

async function generate(type, projectName) {
  const url = REPOS_MAP[type];
  if (!url) {
    console.log(chalk.red(`repo for command ${type} not found.`));
    return;
  }

  if (fs.existsSync(path.resolve(cwd, projectName))) {
    console.log(chalk.red(`${projectName} has already exist, try another name.`));
    return;
  }

  try {
    await downloadRepo(url, projectName);
    cleanPackage(projectName);
    console.log(chalk.green(`\nSuccessfully created project ${projectName}\n`));
  } catch (e) {
    console.log(chalk.red('error', e));
  }
}

program
  .version(require('../package').version)
  .usage('<command> [options]');

// cant add description in .command(, desc) : https://github.com/tj/commander.js/issues/1154
program
  .command('react <app-name>')
  .description('init react project')
  .action((projectName) => {
    generate('react', projectName);
  });

program
  .command('chrome+extension <app-name>')
  .description('init chrome extension project')
  .action((projectName) => {
    generate('chrome+extension', projectName);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
