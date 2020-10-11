var express = require('express');
var router = express.Router();

//Require controller modules
var user_controller = require('../controllers/userController');
var bus_controller = require('../controllers/busController');
var route_controller = require('../controllers/routeController');

//USER ROUTES
router.get('/', user_controller.index);
router.post('/', user_controller.user_signIn_post);
router.get('/user/signup', user_controller.user_signUp_get);
router.post('/user/signup', user_controller.user_signUp_post);
router.get('/user/logout', user_controller.user_logout);

//BUS ROUTES
router.get('/bus/dashboard', bus_controller.bus_dashboard);
router.get('/bus/create', bus_controller.bus_create_get);
router.post('/bus/create', bus_controller.bus_create_post);
router.get('/buses', bus_controller.bus_list);
router.get('/bus/:id', bus_controller.bus_detail);
router.get('/bus/:id/realTime', bus_controller.bus_realTime);
router.get('/bus/:id/travelHistory', bus_controller.bus_travelHistory_get);
router.post('/bus/:id/travelHistory', bus_controller.bus_travelHistory_post);
router.get('/bus/:id/edit', bus_controller.bus_edit_get);
router.post('/bus/:id/edit', bus_controller.bus_edit_post);

//BUSROUTE ROUTES
router.get('/route/create', route_controller.route_create_get);
router.post('/route/create', route_controller.route_create_post);
router.get('/routes', route_controller.route_list);
router.get('/route/:id', route_controller.route_detail);

module.exports = router;