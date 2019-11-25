const db = require("../models");

module.exports = {
  // findAll: function(req, res) {
  //   db.Item.find(req.query)
  //     .sort({ date: -1 })
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },
  // findById: function(req, res) {
  //   db.Item.findById(req.params.id)
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // },
  create: function(req, res) {
    db.Item.create(req.body)
      .then(function(dbItem) {
        return db.Collection.findOneAndUpdate(
          //do I keep the return?
          { _id: req.body.collectionId }, //get the id from the collection I'm adding the item to
          { $push: { items: dbItem._id } },
          { new: true }
        );
      })
      .then(function(dbCollection) {
        res.json(dbCollection);
      })
      .catch(function(err) {
        res.json(err);
      });
  },
  update: function(req, res) {
    db.Item.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // remove: function(req, res) {
  //   db.Item.findById({ _id: req.params.id })
  //     .then(dbModel => dbModel.remove())
  //     .then(dbModel => res.json(dbModel))
  //     .catch(err => res.status(422).json(err));
  // }
  remove: function(req, res) {
    db.Collection.updateOne(
      { items: req.params.itemId },
      { $pull: { items: req.params.itemId } }
    )
      .then(res => console.log(res))
      .catch(err => console.log(err));
    db.Item.deleteOne({ _id: req.params.itemId })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
