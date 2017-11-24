module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'React3dModel',
      externals: {
        react: 'React'
      }
    }
  }
}
