# Gulp monorepo parallelizator

[![npm version](https://badge.fury.io/js/gulp-monorepo-parallelizator.svg)](https://badge.fury.io/js/gulp-monorepo-parallelizator)

This utility allows automate paralelization of build and other actions in repositories with multiple projects depending from each other. 

Example output of `gulp --tasks` for such setup would look like this:

```bash
└─┬ buildAll
  └─┬ <series>
    ├─┬ <parallel>
    │ ├── build-dependency3     // depends on nothing
    │ └── build-dependency5     // depends on nothing
    ├── build-dependency4       // depends on 5
    ├─┬ <parallel>
    │ ├── build-dependency2     // depends on 4, 5
    │ └── build-dependency7     // depends on 4, 3
    ├─┬ <parallel>
    │ ├── build-dependency1     // depends on 2, 3
    │ └── build-dependency6     // depends on 2, 3
    └── build-dependency0       // depends on 1, 3
```

## Installation

```bash
npm i --save-dev gulp-monorepo-parallelizator
```

## Usage

All sub-peojects MUST have `package.json` file with other projects listed as either `dependencies` or `peerDependencies`.

Example `gulpfile.js`: 

```js
const gulp = require('gulp');
const gulpParallel = require('gulp-monorepo-parallelizator');

// Define array of task names and sub-project folders with package.json files
const buildProjects = [
    { task: 'build-dependency0', folder: '../../projects/dependency0' },
    { task: 'build-dependency1', folder: '../../projects/dependency1' },
    { task: 'build-dependency2', folder: '../../projects/dependency2' },
    { task: 'build-dependency3', folder: '../../projects/dependency3' },
    { task: 'build-dependency4', folder: '../../projects/dependency4' },
    { task: 'build-dependency5', folder: '../../projects/dependency5' },
    { task: 'build-dependency6', folder: '../../projects/dependency6' },
    { task: 'build-dependency7', folder: '../../projects/dependency7' },
];

// Setup build tasks for each project - in this case - run Angular CLI build as child process
buildProjects.forEach(v => {
    gulp.task(v.task, () => exec(`npm run ng -- build ${v.name}`))
});

// Setup 'buildAll' task which runs all non-dependant builds in parallel 
gulp.task('buildAll', gulpParallel(buildProjects));

```

## Created by

Karolis Jocevičius - [Twitter](https://twitter.com/kjocevicius)
