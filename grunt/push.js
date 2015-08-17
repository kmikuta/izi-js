module.exports.tasks = {
    push: {
        options: {
            npmTag: 'latest',
            updateConfigs: ['pkg'] // we use `pkg` variable in docs generation
        }
    }
};