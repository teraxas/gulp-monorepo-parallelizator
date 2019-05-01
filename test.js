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
}));

gulp.task('buildAll', gulpParallel(buildProjects));

const taskTree = gulp.tree({ deep: true });
const buildAllNodes = taskTree.nodes.find(n => n.label === 'buildAll').nodes;

if (buildAllNodes.length !== 1) {
    throw new Error('incorect buildAllNodes count');
}

const buildAllSeriesNodes = buildAllNodes.find(n => n.label === '<series>').nodes;

if (buildAllSeriesNodes.length !== 5) {
    throw new Error('incorect buildAllSeriesNodes count');
}

[
    { label: '<parallel>', nodes: 2 },
    { label: 'build-dependency4', nodes: null },
    { label: '<parallel>', nodes: 2 },
    { label: '<parallel>', nodes: 2 },
    { label: 'build-dependency0', nodes: null },
].forEach((v, i) => {
    // eslint-disable-next-line no-extra-parens
    if (buildAllSeriesNodes[i].label !== v.label || (v.nodes !== null && v.nodes !== buildAllSeriesNodes[i].nodes.length)) {
        throw new Error('Incorrect results!')
    }
});

console.log('OK!');
