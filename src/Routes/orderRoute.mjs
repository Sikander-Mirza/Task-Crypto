import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../Controllers/orderController.mjs'; // Import the controllers

const router = express.Router();

// Create a new order
router.post('/orders', createOrder);

// Get all orders
router.get('/orders', getOrders);

// Get a single order by ID
router.get('/orders/:id', getOrderById);

// Update an order by ID
router.put('/orders/:id', updateOrder);

// Delete an order by ID
router.delete('/orders/:id', deleteOrder);

export default router;
