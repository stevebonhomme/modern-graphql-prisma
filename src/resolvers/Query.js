const Query = {
    me() {
        return {
            id: '1234',
            name: 'Mike',
            email: 'mike@hotmail.com',
            age: 30
        }
    },

    post() {
        return {
            id: '1234',
            title: 'My first post',
            body: 'This is my first post',
            published: true
        }
    },        

    add(parent, args) {
        if(args.numbers.length === 0) {
            return 0;
        }
        return args.numbers.reduce((acc, curr) => acc + curr);
    },

    grades(parent, args, context, info) {
        return [1, 2, 3, 4, 5]
    },

    users(parent, args, {db}, info) {
        if(!args.query) {
            return db.users;
        }
        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },

    posts(parent, args, {db}, info) {
        if(!args.query) {
            return db.posts;
        }
        return db.posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()) && post.body.toLowerCase().includes(args.query.toLowerCase()));
      
    },

    comments(parent, args, {db}, info) {
        return db.comments;
    },

    greeting(parent, args, context, info) {
        if(args.name && args.position) {
        return `'Hello!' ${args.name} This is my favorite ${args.position}`;
    } else {
        return 'Hello!';
    }
},
}

export { Query as default };