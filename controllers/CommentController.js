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
      message: 'Не удалось создать комментарий',
    });
  }
};
