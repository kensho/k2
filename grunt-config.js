module.exports = {
  nicePackage: {
    all: {
      options: {
        blankLine: true
      }
    }
  },

  'clean-console': {
    all: {
      options: {
        url: 'test/index.html',
        timeout: 1 // seconds to wait for any errors
      }
    }
  }
};
