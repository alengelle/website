#! /bin/bash

# this needs `npm install uglify-js browserify -g`

mkdir -p ./dist/js
mkdir -p ./dist/node_modules/materialize-css/dist/css
mkdir -p ./dist/node_modules/materialize-css/dist/js
mkdir -p ./dist/node_modules/materialize-css/dist/fonts/roboto
mkdir -p ./dist/node_modules/angular
mkdir -p ./dist/node_modules/angularfire/dist

cp -R css img partials favicon.png index.html ./dist/
rm -f ./dist/img/_* ./dist/img/*.psd
cp ./node_modules/materialize-css/dist/css/materialize.css ./dist/node_modules/materialize-css/dist/css/
cp ./node_modules/materialize-css/dist/js/materialize.min.js ./dist/node_modules/materialize-css/dist/js/
cp ./node_modules/materialize-css/dist/fonts/roboto/Roboto-*.woff2 ./dist/node_modules/materialize-css/dist/fonts/roboto/
cp ./node_modules/angular/angular.min.js ./dist/node_modules/angular/
cp ./node_modules/angularfire/dist/angularfire.min.js ./dist/node_modules/angularfire/dist/
touch ./dist/.nojekyll
browserify ./js/app.js -o ./dist/js/app.js
uglifyjs ./dist/js/app.js --compress --screw-ie8 -o ./dist/js/app.js