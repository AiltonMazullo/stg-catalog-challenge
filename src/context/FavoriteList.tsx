"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FavoriteListContextType } from "@/types";
import { Product } from "@/types";

const FavoriteListContext = createContext<FavoriteListContextType | undefined>(undefined);

export function FavoriteListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addToFavoriteList = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return currentItems; 
      }
      
      return [...currentItems, product];
    });
  };

  const removeFromFavoriteList = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const isInFavoriteList = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearFavoriteList = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const value = {
    items,
    addToFavoriteList,
    removeFromFavoriteList,
    isInFavoriteList,
    clearFavoriteList,
    getTotalItems,
  };

  return (
    <FavoriteListContext.Provider value={value}>{children}</FavoriteListContext.Provider>
  );
}

export function useFavoriteList() {
  const context = useContext(FavoriteListContext);
  if (context === undefined) {
    throw new Error("useFavoriteList must be used within a FavoriteListProvider");
  }
  return context;
}