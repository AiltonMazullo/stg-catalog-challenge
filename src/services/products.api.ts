import { supabase } from "@/models/supabase";
import { Product } from "@/types";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }

    return products || [];
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return [];
  }
}
