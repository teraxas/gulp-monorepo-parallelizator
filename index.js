const gulp = require('gulp');

function assertTruthy(object, errorText, ...properties) {
    if (!object) {
        throw new Error(errorText);
    }

    if (properties) {
        const missingProps = properties.filter(p => !object[p]);
        if (missingProps.length > 0) {
            throw new Error(`Properties is missing: ${JSON.stringify(missingProps)}`, object);
        }
    }
}

/**
 * @description Creates a new paralelized task
 * @argument projects Array of { task: string, folder: string }, where folder should contain package.json file
 * @returns gulp.series TaskFunction with paralelizations inside
 */
module.exports = (projects) => {
    const src = projects.map(v => {
        assertTruthy(v, 'Illegal projects list', 'folder', 'task');
        const r = Object.assign({}, v);
        r.package = require(`${r.folder}/package.json`);
        assertTruthy(r.package, 'Illegal package.json file', 'name');
        r.packageName = r.package.name;
        return r;
    });
    src.forEach(v => {
        v.packageDependencies = [];
        if (v.package.peerDependencies) {
            v.packageDependencies.push(...Object.keys(v.package.peerDependencies)
                .filter(
                    d => src.map(p => p.packageName).indexOf(d) > -1
                ));
        }
        if (v.package.dependencies) {
            v.packageDependencies.push(...Object.keys(v.package.dependencies)
                .filter(
                    d => src.map(p => p.packageName).indexOf(d) > -1
                ));
        }
    })

    const builtPackages = [];
    const packageNames = src.map(p => p.packageName);
    const parallelisations = [];
    while (!packageNames.every(p => builtPackages.indexOf(p) > -1)) {
        let nextBatch;
        if (builtPackages.length === 0) {
            nextBatch = src.filter(v => v.packageDependencies.length === 0);
        } else {
            nextBatch = src.filter(
                v => builtPackages.indexOf(v.packageName) === -1
                    && v.packageDependencies.every(d => builtPackages.indexOf(d) > -1)
            );
        }

        parallelisations.push(nextBatch.length > 1 ? gulp.parallel(nextBatch.map(b => b.task)) : nextBatch[0].task);
        builtPackages.push(...nextBatch.map(b => b.packageName));
    }

    return gulp.series(parallelisations);
};
