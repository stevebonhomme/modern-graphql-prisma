import uuidv4 from 'uuid/v4'

    const Mutation =  {
        createUser(parent, args, {db}, info) {
            const emailTaken = db.users.some(user => user.email === args.data.email);

            if (emailTaken) {
                throw new Error('Email taken');
            }

            //Using spread operator to pass all of the properties in args
       const user = {
            id: uuidv4(),
           ...args.data
        }
        db.users.push(user)
        return user
        },

        deleteUser(parent, args, {db}, info) {
            const userIndex = db.users.findIndex((user) => user.id === args.id)

            if (!userIndex === -1){
                throw new Error('User Not Found')
            }
            
            const deleteUsers =  db.users.splice(userIndex, 1)

            db.posts = db.posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    db.comments = db.comments.filter((comment) => comment.post !== post.id)
                }
                return !match
            })
            db.comments = db.comments.filter((comment) => comment.author !== args.id)
            return deleteUsers[0]

        },

        updateUser(parent, args, {db}, info) {
            const {id, data} = args
            const user = db.users.find(user => user.id === id)

            if (!user) {
                throw new Error('User not found')
            }
            if (typeof data.email === 'string') {
                const emailTaken = db.users.some(user => user.email === data.email)

                if (emailTaken) {
                    throw new Error('Email taken')
                }
                user.email = data.email
            }
            if (typeof data.name === 'string') {
                user.name = data.name
            }
            if (typeof data.age !== 'undefined') {
                user.age = data.age
            }

            return user
        },

        deletePost(parent, args, {db}, info) {
            const postIndex = db.posts.findIndex((post) => post.id === args.id)

            if (!postIndex === -1){
                throw new Error('Post Not Found')
            }
            
            const deletedPosts =  db.posts.splice(postIndex, 1)

           
            db.comments = db.comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]

        },

        deleteComment(parent, args, {db}, info) {
            const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

            if (!commentIndex === -1){
                throw new Error('Comment Not Found')
            }
            
            const deletedComments =  db.comments.splice(commentIndex, 1)                     

            return deletedComments[0]

        },

        createPost(parent, args, {db}, info) {
            const userExists = db.users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User Not Found')
            }

            const post = {
                id: uuidv4(),
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: args.data.author
            }

            db.posts.push(post)

            return post
        },

        createComment(parent, args, {db}, info) {
            const userExists = db.users.some((user) => user.id === args.data.author)
            const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

            if (!userExists || !postExists ) {
                throw new Error("Unable to find user and post")
            }

            const comment = {
                id: uuidv4(),
                text: args.data.text,
                author: args.data.author,
                post: args.data.post
            }

            db.comments.push(comment)

            return comment
        }

    }

    export { Mutation as default }
    