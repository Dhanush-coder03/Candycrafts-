const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  notifyOrderWhatsApp
} = require('../controllers/orderController');

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .delete(deleteOrder);

router.route('/:id/status')
  .put(updateOrderStatus);

router.route('/:id/notify-whatsapp')
  .post(notifyOrderWhatsApp);

module.exports = router;
