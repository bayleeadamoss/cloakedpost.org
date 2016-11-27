## Cloaked Post
## Installing

Dependencies:

~~~
brew install postgresql
~~~

Install and start the server:

~~~
npm install
npm run db
npm run build
npm start
~~~

## Development

In one tab, watch and recompile the react frontend:

~~~
npm run watch
~~~

Keep the server open in another tab. Server updates will require to restart this
process:

~~~
npm start
~~~

## Post as cURL Example

~~~
curl -i 'http://localhost:3000/post' -H 'content-type: application/json' --data-binary '{"title":"Your post title","name":"username#password","agreed":true,"content":"This is your post content"}' --compressed
~~~
