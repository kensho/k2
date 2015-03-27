module.exports = function (grunt) {
  grunt.initConfig({
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
  });
  grunt.loadNpmTasks('grunt-nice-package');
  grunt.loadNpmTasks('grunt-clean-console');
  grunt.registerTask('nice-package', ['nicePackage']);
  // grunt.registerTask('test-page', ['clean-console']);

  grunt.registerTask('default', function () {
    var msg = 'DO NOT USE DIRECTLY\n' +
      'to build this project use "gulp"\n' +
      'these are just grunt tasks to be used from gulp.';
    console.error(msg);
    process.exit(-1);
  });
};
