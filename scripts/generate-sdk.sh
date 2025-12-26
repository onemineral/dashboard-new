#!/bin/sh

php ../app.onemineral.com/artisan schema:export > ./sdk/js-sdk/data/schema.json

#cd sdk/generator
#npm i
#cd ../../

cd sdk/js-sdk
#npm i
npm run generate