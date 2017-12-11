# Gulpfiles

PreviousNext Gulpfiles allows you to rapidly setup a custom Gulp 4 workflow with
minimal fuss using ES6, NPM modules and configuration stored in YML.

## Requirements

NPM, Gulp 4.

## Workflow modules

Modules are used to build a complete Gulp workflow. You can use as few or as
many as you like. So far we have modules for:

*sass*
Compile multiple source directories in a project to multiple destination 
directories.

*es6*
Use Bable to transpile your ES6, Rollup to bundle your modules, and Uglify to
minify your projects JS.

*moderinzr*
Build a custom version of Modernizr suited to your project.

*svgo*
Optimise SVG files.

*svgsprite*
Build sprites from a folder of SVG files.

*lint*
Lint your JS and/or SASS.

*autoprefixer*
Apply browser prefixes to your CSS files.

*browsersync*
Spin up Browsersync with live reloading.

*kss*
Build a KSS style guide.

## Getting started

There are three components needed to setup a Gulpfiles workflow:

1. Load the desired workflow modules via `package.json`.
2. Configure each workflow module in your `gulpfiles.yml`.
3. Use ES6 `import` syntax to import those workflow modules into your custom `gulpfile.babel.js`.
  
To illustrate a standard but simple workflow for a project lets set one up that
does the following: 

* Use Sass to compile our CSS.
* Autoprefixer and Modernizr to ensure we can meet browser requirements.
* Svgo to optimise our SVG files.
* Browsersync to run a development environment for device testing.

### 1. Load modules 

Add each workflow module as a dev dependency like so:

```sh
npm install --save-dev gulpfiles-sass gulpfiles-es6 gulpfiles-svgo
```

### 2. Configure modules

Create a `gulpfiles.yml` file in your project root. Each module has its own
syntax for configuration.

*@todo create syntax documentation as part of sub modules*

```yml
sass:
  src:
    - path/to/sass/directories
    - path/to/sass/directories
  options:
    includePaths:
      - path/to/sass/module/directories
      - path/to/sass/module/directories
    eyeglass:
      httpRoot: /path/to/httpRoot

autoprefixer:
  src:
    - path/to/sass/directories
    - path/to/sass/directories
  browsers:
    - last 2 versions
    - ie >= 10
    - and_chr >= 2.3

modernizr:
  src:
    - path/to/sass/directories
    - path/to/js/directories
  dest: path/to/moderinzr/outputfile
  options:
    - prefixes
    - addTest
    - setClasses
    - testStyles
  tests:
    - details
    - inputtypes
    - touchevents
    - history
  excludeTests:
    - hidden
    - svg
    - input
    - sizes
    - json
    - search
    
svgo:
  src:
    - path/to/svg/directories
    - path/to/svg/directories
  plugins:
    removeDimensions: false
    removeViewbox: false    
    
browsersync:
  proxy: website.dev
  host: website.dev
  open: true
```

### 3. Write your gulpfile

So that you can tell gulp about our workflows, you'll need to create 
`gulpfile.babel.js` in your project root.

First, add your modules using es6 imports (that's where babel comes in!).

```js
import gulp from 'gulp';

import sass from '@gulpfiles/sass';
import autoprefixer from '@gulpfiles/autoprefixer';
import modernizr from '@gulpfiles/modernizr';
import svgo from '@gulpfiles/svgo';
import browsersync from '@gulpfiles/browsersync';
```

Running to `./node_modules/bin/gulp -T` from the command line will now list all available workflows. 

Next up we need to set a default workflow. Seeing as gulp is a _task runner_
let's run a few tasks at once. Your default workflow should (generally 
speaking) be the same as your production build task. For example CSS ready for 
production, no need for a development environment, and a minified version of
Modernizr, and all SVG files minified.

Using `gulp.parallel` and `gulp.series` we can run certain tasks at the same
time or one after another. For example tasks related to the output of CSS need
to be run in series.

```js
gulp.task('default', 
  gulp.parallel(
    gulp.series(
      'sass:production', 
      'autoprefixer'
    ), 
    'modernizr:production',
    'svgo:optimise'
  )
);
```

Running `./node_modules/bin/gulp` from the command line will start the default
workflow.

Finally we will need to tailor a custom watch task that will be used during
development. To do this we need to define which tasks we would like to run when
the watch tasks kicks off, and which tasks that will be watching.

```js
gulp.task('watch',
  gulp.series(
    // Define the "kick off" tasks.
    gulp.parallel(
      gulp.series(
        'sass:development', 
        'autoprefixer'
      ),
      'modernizr:development',
      'svgo:optimise'
    ),
    'browsersync:init'
    // Define the watch tasks.
    'sass:watch',
    'autoprefixer:watch',
    'moderinzr:watch',
    'svgo:watch'
  ),
);
```

Running `./node_modules/bin/gulp watch` from the command line will run the kick
off tasks and run each watch task for your workflows. A change to a sass file will
run the sass tasks, a change to a css file will run autoprefixer, a new SVG will
be optimised, and any changes to your moderinzr directories will build a new
version of modernizr.
