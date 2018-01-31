/**
 * @file
 * Handles importing gulpfile.yml and sets up global config.
 */

import yaml from 'js-yaml';
import fs from 'fs';
import PluginError from 'plugin-error';

let config = {};

try {
  config = yaml.safeLoad(fs.readFileSync('gulpfile.yml', 'utf8'), { json: true });
} catch (e) {
  throw new Error('gulpfile.yml not found!');
}

export default config;
