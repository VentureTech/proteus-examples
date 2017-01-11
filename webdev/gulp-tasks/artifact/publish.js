/**
 * Created by aholt on 1/10/17.
 */
var gulp = require('gulp');
var gafu = require('gulp-artifactory-upload');
var projectInfo = require('../../package.json');
var stream = require('stream');
var gutil = require('gulp-util');

//noinspection JSUnresolvedVariable
var SERVER_URL = process.env.publish_venturetech_url,
    PUBLISH_USERNAME = process.env.publish_venturetech_username,
    PUBLISH_PASSWORD = process.env.publish_venturetech_password,
    parsedGroup = projectInfo.group.replace('.', '/');

var VERSION = `${projectInfo.version}`;
if(projectInfo.versionStatus == "SNAPSHOT")
    VERSION += "-SNAPSHOT";
var PUBLISH_METADATA_URL = `${SERVER_URL}/vt-snapshot-local/${parsedGroup}/${projectInfo.name}`;
var PUBLISH_URL = `${SERVER_URL}/vt-snapshot-local/${parsedGroup}/${projectInfo.name}/${VERSION}`;

gulp.task('publish', ['zip', 'publish:generate-maven-metadata'], function() {
    return gulp.src(`./artifact/${projectInfo.name}-${VERSION}.zip`)
        .pipe(gafu({
            url: PUBLISH_URL,
            username: PUBLISH_USERNAME,
            password: PUBLISH_PASSWORD
        }));
});

gulp.task('publish:generate-maven-metadata', ['zip'], function() {
    return templateAsFile('maven-metadata.xml',
        `<?xml version="1.0" encoding="UTF-8"?>
<metadata>
  <groupId>${projectInfo.group}</groupId>
  <artifactId>${projectInfo.name}</artifactId>
  <version>${VERSION}</version>
  <versioning>
    <latest>${VERSION}</latest>
    <versions>
      <version>${VERSION}</version>
    </versions>
    <lastUpdated>${new Date().toISOString()}</lastUpdated>
  </versioning>
</metadata>`).pipe(gafu({
        url: PUBLISH_METADATA_URL,
        username: PUBLISH_USERNAME,
        password: PUBLISH_PASSWORD
    }))
});

function templateAsFile(filename, template) {
    var src = stream.Readable({ objectMode: true });
    src._read = function() {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(template)
        }));
        this.push(null);
    };
    return src;
}