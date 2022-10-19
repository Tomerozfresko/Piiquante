const Sauce = require("../models/sauce");
const fs = require("fs"); //Node handle files system

//Create sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({
        message: `This is the saved sauce ${sauce}`,
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

// Get one sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  console.log(req.file);
  if (req.file) {
    Sauce.findOne({
      _id: req.params.id,
    }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlinkSync(`images/${filename}`); //delete img
    }),
      (sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });
  } else {
    sauceObject = {
      ...req.body,
    };
  }
  Sauce.updateOne(
    {
      _id: req.params.id,
    },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() =>
      res.status(200).json({
        message: "Sauce updated successfully!",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

// Delete Sauce
exports.deleteSauce = (req, res, next) => {
  const id = { _id: req.params.id };
  Sauce.findOne(id).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1]; //delete file
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne(id).then(() => {
        res.status(200).json({
          message: "Sauce deleted successfully",
        });
      });
    });
  });
};

// Get all sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeSauce = async (req, res, next) => {
  const id = { _id: req.params.id };
  const action = req.body.like;
  const like = {
    $inc: { likes: action },
    $push: { usersLiked: req.body.userId },
  };
  const disLike = {
    $inc: { dislikes: action * -1 },
    $push: { usersDisliked: req.body.userId },
  };
  const cancelLike = {
    $pull: { usersLiked: req.body.userId },
    $inc: { likes: -1 },
  };

  const cancelDisLike = {
    $pull: { usersDisliked: req.body.userId },
    $inc: { dislikes: -1 },
  };

  const success = () => {
    res.status(200).json({ message: "Done successfully" });
  };

  const failure = (error) => {
    res.status(400).json({ error });
  };

  switch (action) {
    case 1:
      Sauce.updateOne(id, like).then(success).catch(failure);
      return;
    case -1:
      Sauce.updateOne(id, disLike).then(success).catch(failure);
      return;
    case 0:
      let currentSauce = await Sauce.findOne(id);
      if (currentSauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(id, cancelLike).then(success).catch(failure);
        return;
      }
      if (currentSauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(id, cancelDisLike).then(success).catch(failure);
        return;
      }

    default:
      return;
  }
};
