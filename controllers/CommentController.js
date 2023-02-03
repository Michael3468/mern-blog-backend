import CommentModel from '../models/Comment.js';

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      postId: req.body.postId,
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
