module.exports.tasks = {
    exec: {
        jsduck: {
            cwd: 'docs',
            command: 'jsduck.exe --config=config.json --title=<%= pkg.name %>-<%= pkg.version %>'
        },

        // mvn install
        "maven-install": {
            cwd: 'webjar',
            command: 'mvn clean install'
        },

        // mvn deploy
        "maven-deploy": {
            cwd: 'webjar',
            command: 'mvn clean deploy'
        }
    }
};
