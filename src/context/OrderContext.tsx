"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  getOrderById: (id: string) => Order | undefined;
  getTotalOrders: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };



  const getTotalOrders = () => {
    return orders.length;
  };

  const value = {
    orders,
    addOrder,
    getOrderById,
    getTotalOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}