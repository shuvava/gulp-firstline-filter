# gulp-firstline-filter
Filter files by first line in a [gulp](https://github.com/gulpjs/vinyl) stream
Enables you to work on a subset of the original files by filtering them using glob patterns. When you're done and want all the original files back you just use the `restore` stream.


## Install

```
$ npm install --save-dev gulp-firstline-filter
```


## Usage

### Filter only

You may want to just filter the stream content:

```js
const gulp = require('gulp');
const babel = require('gulp-babel');
const filter = require('gulp-firstline-filter');

gulp.task('default', () => {
	// Create filter instance inside task function
	const f = filter(/es6/);

	return gulp.src('src/**/*.js')
		// Filter a subset of the files
		.pipe(f)
		// Run them through a plugin
		.pipe(babel())
		.pipe(gulp.dest('dist'));
});
```

### Restoring filtered files

```js
const gulp = require('gulp');
const babel = require('gulp-babel');
const filter = require('gulp-firstline-filter');

gulp.task('default', () => {
	// Create filter instance inside task function
	const f = filter(/es6/, {restore: true});

	return gulp.src('src/**/*.js')
		// Filter a subset of the files
		.pipe(f)
		// Run them through a plugin
		.pipe(babel())
		// Bring back the previously filtered out files (optional)
		.pipe(f.restore)
		.pipe(gulp.dest('dist'));
});
```

### using functions

```js
const gulp = require('gulp');
const babel = require('gulp-babel');
const filter = require('gulp-firstline-filter');

gulp.task('default', () => {
	// Create filter instance inside task function
	const f = filter((firstline) => !(/es6/.test(firstline)), {restore: true});

	return gulp.src('src/**/*.js')
		// Filter a subset of the files
		.pipe(f)
		// Run them through a plugin
		.pipe(babel())
		// Bring back the previously filtered out files (optional)
		.pipe(f.restore)
		.pipe(gulp.dest('dist'));
});
```

## API

### filter(pattern, [options])

Returns a [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform) with a [.restore](#optionsrestore) property.

#### pattern

Type: `RegExp` `Function`

Accepts a RegExp or function 

If you supply a function, you'll get a [vinyl file object](https://github.com/wearefractal/vinyl#file) as the first argument and you're expected to return a boolean of whether to include the file:

```js
filter(firstline => /unicorns/.test(firstline));
```

#### options

Type: `Object`

Accepts [minimatch options](https://github.com/isaacs/minimatch#options).

*Note:* Set `dot: true` if you need to match files prefixed with a dot (e.g. `.gitignore`).

##### restore

Type: `boolean`<br>
Default: `false`

Restore filtered files.

##### passthrough

Type: `boolean`<br>
Default: `true`

When set to `true`, filtered files are restored with a `PassThrough` stream, otherwise, when set to `false`, filtered files are restored as a `ReadableStream`.

When the stream is a `ReadableStream`, it ends by itself, but when it's `PassThrough`, you are responsible of ending the stream.
