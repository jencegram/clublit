const Post = require('../models/Post');
const Forum = require('../models/Forum');

/**
 * Creates a new post in a specific forum by a user.
 * This function verifies the existence of the forum before allowing the post creation.
 * It extracts the club ID from the forum details to associate the post accordingly.
 * @param {object} req - The request object containing user and post details.
 * @param {object} res - The response object to send back the newly created post.
 */
exports.createPost = async (req, res) => {
  const { forumId, content } = req.body;
  const authorUserId = req.user.userId;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).send('Forum not found');
    }

    const clubId = forum.clubid;

    const newPost = await Post.create({ clubId, forumId, authorUserId, content });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieves all posts for a specific forum.
 * This function is useful for displaying all discussions within a particular forum.
 * @param {object} req - The request object containing the forum ID as a URL parameter.
 * @param {object} res - The response object to send back the list of posts.
 */
exports.getPostsByForumId = async (req, res) => {
  const { forumId } = req.params;

  try {
    const posts = await Post.findByForumId(forumId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Server error');
  }
};