import { supabase } from "./supabase";

export async function fetchProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    try {
      console.log(products);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  return products;
}
