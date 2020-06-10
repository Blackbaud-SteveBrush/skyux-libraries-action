// import { checkScreenshots } from './visual-baselines';

import * as core from '@actions/core';
import spawn from 'cross-spawn';
import * as path from 'path';
import { execute } from './execute';

function runSkyUxCommand(command: string, args?: string): Promise<string> {
  return execute('npx', `-p @skyux-sdk/cli@next skyux ${command} --logFormat none --platform travis ${args}`);
}

async function installCerts(): Promise<void> {
  await runSkyUxCommand('certs', 'install');
}

async function install(): Promise<void> {
  await execute('npm', 'ci');
  await execute('npm', 'install --no-save --no-package-lock blackbaud/skyux-sdk-builder-config');
}

async function build() {
  await runSkyUxCommand('build');
}

async function coverage() {
  await runSkyUxCommand('test', '--coverage library');
  await execute('bash', '<(curl -s https://codecov.io/bash)', {
    spawnOptions: {
      cwd: process.cwd()
    }
  }).catch(() => {
    console.log('Coverage failed!');
    return Promise.resolve();
  });
  // spawn.sync('bash <(curl -s https://codecov.io/bash)', {
  //   stdio: 'inherit',
  //   cwd: path.resolve(process.cwd(), core.getInput('working-directory'))
  // });
}

async function visual() {
  await runSkyUxCommand('e2e');
  // await checkScreenshots();

  // execute('node', path.resolve(process.cwd(), './node_modules/@skyux-sdk/builder-config/scripts/visual-baselines.js'));
  // execute('node', path.resolve(process.cwd(), './node_modules/@skyux-sdk/builder-config/scripts/visual-failures.js'));
}

async function buildLibrary() {
  await runSkyUxCommand('build-public-library');

  /**
   * const npmTag = 'latest';
   * npm publish --access public --tag $npmTag;
   * notifySlack();
   */
}

async function run(): Promise<void> {
  try {
    await install();
    await installCerts();
    await build();
    await coverage();
    await visual();
    await buildLibrary();
  } catch (error) {
    // core.setFailed(error.message);
    console.log('ERROR:', error);
    process.exit(1);
  }
}

run();
