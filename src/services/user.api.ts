import { supabase } from "@/models/supabase";
import { UserProfile } from "@/types";

export async function fetchUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data: profile, error } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      return null;
    }

    return profile;
  } catch (err) {
    console.error("Erro ao buscar perfil do usuário:", err);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error?: any }> {
  try {
    // Primeiro, verificar se o usuário existe na tabela Users
    const { data: existingUser, error: fetchError } = await supabase
      .from("Users")
      .select("id")
      .eq("id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Erro ao verificar usuário existente:", fetchError);
      return { success: false, error: fetchError };
    }

    if (!existingUser) {
      // Usuário não existe, criar um novo registro
      console.log(
        "Usuário não encontrado na tabela Users, criando novo registro..."
      );
      const { error: insertError } = await supabase.from("Users").insert({
        id: userId,
        ...updates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Erro ao criar usuário na tabela Users:", insertError);
        return { success: false, error: insertError };
      }

      console.log("Usuário criado com sucesso na tabela Users");
      return { success: true };
    }

    // Usuário existe, atualizar o registro
    const { error } = await supabase
      .from("Users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Erro ao atualizar perfil do usuário:", error);
      return { success: false, error };
    }

    console.log("Usuário atualizado com sucesso na tabela Users");
    return { success: true };
  } catch (err) {
    console.error("Erro ao atualizar perfil do usuário:", err);
    return { success: false, error: err };
  }
}
