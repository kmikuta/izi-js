const path = require('path')
const tslint = path.resolve('node_modules', '.bin', 'tslint')

module.exports.tasks = {
  exec: {
    tslint: {
      command: tslint + ' -p ./tsconfig.json -c ./tslint.json'
    },

    tslintFix: {
      command: tslint + ' -p ./tsconfig.json -c ./tslint.json --fix'
    }
  }
}
