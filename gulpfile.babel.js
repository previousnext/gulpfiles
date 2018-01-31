/**
 * @file
 * Defines tasks from imported functions.
 */

'use strict';

import gulp from 'gulp';
import config from 'pnx-gulpfiles-core';

/**
 * Test config script.
 */
const build = function() {
  console.log(config.hello);
};
build.description = 'Build all styles and styleguide (for production).';
gulp.task('build', build);

// Set the default task to build.
gulp.task('default', build);
