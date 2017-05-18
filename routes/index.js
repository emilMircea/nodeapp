const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// routes
router.get('/', catchErrors( storeController.getStores ) );
router.get('/stores', catchErrors( storeController.getStores ) );

router.get('/add', storeController.addStore);
// add new resource
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
// update resource
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
// edit resource
router.get('/stores/:id/edit', catchErrors(storeController.editStore) )


module.exports = router;
