const mongoose = require('mongoose');
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home page'})
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add store'})
}

exports.createStore = async (req, res) => {
  const store = await( new Store(req.body).save() )
  req.flash('success', `Succesfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  // query the db for a list of all stores
  const stores = await Store.find();
  res.render('stores', {title: 'stores', stores: stores});
}

exports.editStore = async (req, res) => {
  // find store by id
  const store = await Store.findOne({_id: req.params.id})
  res.render('editStore', {title: `Edit ${store.name}`, store: store});
  // confirm owner of store to update

  // render edit form
}

exports.updateStore  = async (req, res) => {
  // find and update the store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true, // return the new store instead of old one
      runValidators: true
    }
  ).exec();
  req.flash('success', `Succesfully updated <strong>${store.name}</strong>. <a href='/stores/${store.slug}'>View Store</a>`)
  res.redirect(`/stores/${store._id}/edit`)
}
