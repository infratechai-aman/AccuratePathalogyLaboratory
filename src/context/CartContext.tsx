'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Test, CartItem } from '@/lib/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Test }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { testId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  addToCart: (test: Test) => void;
  removeFromCart: (testId: string) => void;
  updateQuantity: (testId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (testId: string) => boolean;
} | null>(null);

function calculateTotals(items: CartItem[]): Omit<CartState, 'items'> {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.test.price * item.quantity, 0),
    totalDiscount: items.reduce(
      (sum, item) => sum + (item.test.originalPrice - item.test.price) * item.quantity,
      0
    ),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.test.id === action.payload.id);
      if (existing) {
        newItems = state.items.map((item) =>
          item.test.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { test: action.payload, quantity: 1 }];
      }
      return { items: newItems, ...calculateTotals(newItems) };
    }
    case 'REMOVE_ITEM':
      newItems = state.items.filter((item) => item.test.id !== action.payload);
      return { items: newItems, ...calculateTotals(newItems) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter((item) => item.test.id !== action.payload.testId);
      } else {
        newItems = state.items.map((item) =>
          item.test.id === action.payload.testId
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      return { items: newItems, ...calculateTotals(newItems) };
    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0, totalDiscount: 0 };
    case 'LOAD_CART':
      return { items: action.payload, ...calculateTotals(action.payload) };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    totalDiscount: 0,
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accuratelabs-cart');
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch { /* ignore */ }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('accuratelabs-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (test: Test) => dispatch({ type: 'ADD_ITEM', payload: test });
  const removeFromCart = (testId: string) => dispatch({ type: 'REMOVE_ITEM', payload: testId });
  const updateQuantity = (testId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { testId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const isInCart = (testId: string) => state.items.some((item) => item.test.id === testId);

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
