## Data

db.posts.keys():
- name
- passkey
- title
- content
- tags[] // not mvp
- created_at

db.replies.keys():
- post_id
- name
- passkey
- comment
- created_at

## App Endpoints

* GET /#/
* GET /#/post/{id}/{title}
* GET /#/post/new
* POST /#/search/tag // not mvp

## Server Endpoints

* GET /
* GET /post/:id
* POST /post
* POST /post/:id/comment
* GET /search/:tag // not mvp

## Home

* List recent posts
* List common tags
* Search box
* Staying Anonymous
