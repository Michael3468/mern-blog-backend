import PostModel from '../models/Post.js';

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Update post failed',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
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

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Remove post failed',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
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

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Fetch post failed',
    });
  }
};

export const getAllSortedByDate = async (req, res) => {
  try {
    // TODO delete passwordHash (network tab, /new-posts request)
    const posts = await PostModel.find().populate('user').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Fetch posts failed',
    });
  }
};

export const getAllSortedByPopularity = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').sort({ viewsCount: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Fetch posts failed',
    });
  }
};

export const getAllWithTagByDate = async (req, res) => {
  try {
    const tagname = req.params.tagname;

    const posts = await PostModel.find({ tags: tagname }).populate('user').sort({ viewsCount: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fetch posts failed',
    });
  }
};

/**
 * @deprecated since version 0.13.0.
 * Will be deleted in version 2.x.x
 * Use '.getAllSortedByDate' instead
 * */
export const getAll = async (req, res) => {
  console.warn('WARNING! Calling deprecated function!');
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Fetch posts failed',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fetch tags failed',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Create post failed',
    });
  }
};
