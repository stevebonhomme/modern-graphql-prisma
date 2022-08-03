//Demo user data
const users = [{
    id: '1',
    name: 'John Doe',
    email: 'steve@hotmail.com',
    age: 27
},
{   id: '2',
    name: 'Jane Doe',
    email: 'jane@hotmail.com',
    age: 25
},
{   id: '3',
    name: 'Steve Doe',
    email: 'fake@email.com',
    age: 30

}];

//Demp comments data
const comments = [{
    id: '6',
    text: 'This is a comment',
    author: '1',
    post: '1'
},
{   id: '7',
    text: 'This is another comment',
    author: '1',
    post: '1'
},
{   id: '8',
    text: 'This is a third comment',
    author: '2',
    post: '2'
},
{   id: '9',
    text: 'This is a fourth comment',
    author: '3',
    post: '3'

}];

//Demo posts data
const posts = [{
    id: '1',
    title: 'My first post',
    body: 'This is my first post',
    published: true,
    author: "1"
},
{   id: '2',
    title: 'My second post',
    body: 'This is my second post',
    published: false,
    author: "1"

},  {   id: '3',
    title: 'My third post',
    body: 'This is my third post',
    published: true,
    author: "2"

}];

const db = {
    posts,
    comments,
    users
}

export { db as default }