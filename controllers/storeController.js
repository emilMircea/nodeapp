const mongoose = require('mongoose');
const Store = mongoose.model('Store');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true)
    } else {
      next({message: `That filetype isn't allowed`}, false)
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home page'})
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add store'})
};
// uploading photos
exports.upload = multer(multerOptions).single('photo');
// resize photos
exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return
  }
  const extension = req.file.mimetype.split('/')[1]
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to filesystem, keep going
  next()
}

exports.createStore = async (req, res) => {
  const store = await( new Store(req.body).save() )
  req.flash('success', `Succesfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // query the db for a list of all stores
  const stores = await Store.find();
  res.render('stores', {title: 'stores', stores: stores});
};

exports.editStore = async (req, res) => {
  // find store by id
  const store = await Store.findOne({_id: req.params.id})
  res.render('editStore', {title: `Edit ${store.name}`, store: store});
  // confirm owner of store to update

  // render edit form
};

exports.updateStore  = async (req, res) => {
  // set location data to be point after each update
  // req.body.location.type = 'Point';
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
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  res.render('store', {store: store, title: store.name})
}
