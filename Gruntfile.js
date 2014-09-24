module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat : {
			options : {
				separator : ';'
			},
			js : {
				src : ['bower_components/jquery/dist/jquery.js'
				],
				dest : 'assets/js/<%= pkg.name %>.js'
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist : {
				files : {
					'assets/js/<%= pkg.name %>.min.js' : ['<%= concat.js.dest %>']
				}
			}
		},
		jshint : {
			files : ['Gruntfile.js'],
			options : {
				// options here to override JSHint defaults
				globals : {
					jQuery : true,
					console : true,
					module : true,
					document : true
				}
			}
		},
		sass : {
			dist : {
				options : {
					style : 'compressed'
				},
				files : {
					'assets/css/<%= pkg.name %>.css' : 'assets/css/styles.scss'
				}
			}
		},
		watch : {
			files : ['Gruntfile.js', 'assets/css/*.scss', 'assets/js/vendor/*.js', 'assets/js/main.js', 'assets/js/portfolio.js'],
			tasks : ['build'],
			options : {
				livereload : true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');


	grunt.registerTask('test', ['jshint', 'concat']);
	grunt.registerTask('default', [ 'jshint', 'sass', 'concat']);
	grunt.registerTask('build', ['jshint', 'sass', 'concat', 'uglify']);
	grunt.registerTask('cssonly', ['sass']);
};
