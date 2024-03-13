import React, { useState, useEffect } from 'react';

type Post = {
    id: number;
    title: string;
};

export const CreatePost = () => {
    const [mergedPosts, setMergedPosts] = useState<Post[]>([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [editTitleId, setEditTitleId] = useState<number | null>(null);
    const [updatedTitle, setUpdatedTitle] = useState<string>('');

    useEffect(() => {
        fetchPosts();
    }, []);

    //Fetch or GET Operation...

    const url = 'https://jsonplaceholder.typicode.com';

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${url}/posts`);
            if (!response.ok) {
                throw new Error('Failed to Fetch Posts');
            }
            const data = await response.json();
            setMergedPosts(data);
        } catch (error) {
            console.log('Error Fetching Posts:', error);
        }
    };

    //POST or Create Operation
    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newPostTitle,
                    body: 'This is the body of the new post',
                    userId: 1,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to Create Post');
            }

            const data = await response.json();
            setMergedPosts([...mergedPosts, data]);
            setNewPostTitle('');
        } catch (error) {
            console.log('Error to create:', error);
        }
    };

    //PATCH OPERATION...

    const handleUpdatePost = async (id: number) => {
        try {
            const updatedPost = { title: updatedTitle }; // Create an object with the updated title
            const response = await fetch(`${url}/posts/${id}`, {
                method: 'PATCH', // Use PATCH method
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPost), // Send the updated post title in the request body
            });
    
            if (!response.ok) {
                throw new Error('Failed to Update Post');
            }
    
            // Refresh the list of posts after successful update
            // fetchPosts();

            const updatedPostData = await response.json();
            setMergedPosts(mergedPosts.map(post => post.id === id ? { ...post, title: updatedPostData.title } : post));

            setUpdatedTitle('')
            
        } catch (error) {
            console.log('Error updating post:', error);
        } finally {
            // Reset edit state after update attempt
            setEditTitleId(null);
        }
    };

    //DELETE Operation...

    const handleDeletePost = async (id: number) => {
        try{
            const response = await fetch(`${url}/posts/${id}`, {
                method: 'DELETE'
            })

            if(!response.ok){
                throw new Error('Failed to Delete Post')
            }

            setMergedPosts(mergedPosts.filter(post => post.id !== id))
        }
        catch(error) {
            console.log('Error Delete Post', error)
        }
    }

    return (
        <div>
            <form onSubmit={handleCreatePost}>
                <input
                    type="text"
                    placeholder="Enter the Post Title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <button type="submit">Create Post</button>
            </form>
            <ul>
                {mergedPosts.map((post: Post) => (
                    <li key={post.id}>
                        {editTitleId === post.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedTitle}
                                    onChange={(e) => setUpdatedTitle(e.target.value)}
                                />
                                <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                            </div>
                        ) : (
                            <div>
                                {post.title}
                                <button onClick={() => setEditTitleId(post.id)}>Update</button>
                                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
