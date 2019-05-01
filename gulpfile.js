/* eslint-disable no-console */
const gulp = require('gulp');
const gulpParallel = require('./index');

const projects = [0, 1, 2, 3, 4, 5, 6, 7]
    .map(no => `dependency${no}`);

const buildProjects = projects.map(
    p => ({ task: `build-${p}`, folder: `./testProjects/${p}` })
);

// Prepare tasks
// eslint-disable-next-line no-unused-vars
buildProjects.forEach(p => gulp.task(p.task, (cb) => {
    console.log(`Building ${p.task}, doing nothing :)`);
    cb();
}));

gulp.task('default', gulpParallel(buildProjects));
