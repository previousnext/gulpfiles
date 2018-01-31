/**
 * @file
 * Handles importing gulpfile.yml and sets up global config.
 */

import yaml from 'js-yaml';
import fs from 'fs';
import PluginError from 'plugin-error';

const config = {};

try {
  config = yaml.safeLoad(fs.readFileSync('gulpfile.yml', 'utf8'), { json: true });
} catch (e) {
  let err = new PluginError({
    plugin: 'gulpfiles-core',
    message: 'gulpfile.yml not found!'
  });
}

export default config;
