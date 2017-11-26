module.exports.tasks = {
  mochaTest: {
    test: {
      options: {
        require: 'ts-node/register'
      },
      src: 'src/test/**/**Spec.ts'
    }
  }
}
