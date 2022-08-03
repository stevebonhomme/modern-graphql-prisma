const Subscription = {
count: {
    subscribe: (parent, args, { pubsub }) => {
        let count = 0;

        setInterval(() => {
            count++;
            pubsub.publish('count', {
                count
            });
        }, 1000);

        return pubsub.asyncIterator('count');
}
},
comment: {
    subscribe(parent, args, {db, pubsub }, info){
        const { postId } = args;
        const post = db.posts.find(post => post.id === postId && post.published);

        if (!post) {
            throw new Error('Post not found');
        }

        return pubsub.asyncIterator(`comment ${postId}`);
    }
},
post: {
    subscribe(parent, args, {db, pubsub}, info){
        return pubsub.asyncIterator('post');
    }
}
};

export default Subscription;