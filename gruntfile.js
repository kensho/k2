module.exports = function (grunt) {
  grunt.initConfig({
    nicePackage: {
      all: {
        options: {
          blankLine: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-nice-package');
  grunt.registerTask('nice-package', ['nicePackage']);

  grunt.registerTask('default', function () {
    var msg = 'DO NOT USE DIRECTLY\n' +
      'to build this project use "gulp"\n' +
      'these are just grunt tasks to be used from gulp.';
    console.error(msg);
    process.exit(-1);
  });
};
