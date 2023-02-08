import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
  const postId = req.body.postId;

  try {
    const doc = new CommentModel({
      postId: postId,
      user: req.userId,
      text: req.body.text,
    });

    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Create comment failed',
    });
  }

  updatePostCommentsCount(postId);
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({ postId: postId })
      .populate('user')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Fetch comments failed',
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').limit(5).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Fetch comments failed',
    });
  }
};

export const removePostComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await CommentModel.find({ postId: postId });

    if (!comments) return;

    comments.forEach((item) => {
      CommentModel.findOneAndDelete(
        {
          postId: item.postId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              message: 'Remove comment failed',
            });
          }

          if (!doc) {
            return res.status(404).json({
              message: 'Find comment failed',
            });
          }
        },
      );
    });

    res.json({
      message: 'Comment(s) deleted',
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Remove comments failed',
    });
  }
};

/**
 * example:
 *
 * updatePostCommentsCount(postId);
 *
 * updatePostCommentsCount(postId, -1)
 *
 * @param {*} postId
 * @param {number} updateValue - 1 to increment, -1 to decrement
 */
const updatePostCommentsCount = (postId, updateValue = 1) => {
  try {
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { commentsCount: updateValue },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: 'Return post failed',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Find post failed',
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
};
