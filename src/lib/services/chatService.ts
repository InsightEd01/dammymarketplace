
import { supabase } from "@/integrations/supabase/client";
import { Chat, ChatMessage, SenderType } from "@/types/supabase";

/**
 * Fetch all open chats (status = 'open')
 */
export const getOpenChats = async (): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(`
        *,
        customer:customer_id(id, full_name, email)
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching open chats:", error);
      return [];
    }

    // Type cast to match Chat interface
    return (data || []) as Chat[];
  } catch (error) {
    console.error("Unexpected error fetching open chats:", error);
    return [];
  }
};

/**
 * Fetch all chats assigned to a specific rep (customer service rep)
 */
export const getRepChats = async (repId: string): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(`
        *,
        customer:customer_id(id, full_name, email)
      `)
      .eq("rep_id", repId)
      .eq("status", "assigned")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching rep chats for ${repId}:`, error);
      return [];
    }

    // Type cast to match Chat interface
    return (data || []) as Chat[];
  } catch (error) {
    console.error(`Unexpected error fetching rep chats for ${repId}:`, error);
    return [];
  }
};

/**
 * Fetch all chats for a specific customer
 */
export const getCustomerChats = async (customerId: string): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(`
        *,
        customer:customer_id(id, full_name, email)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching customer chats for ${customerId}:`, error);
      return [];
    }

    // Type cast to match Chat interface
    return (data || []) as Chat[];
  } catch (error) {
    console.error(`Unexpected error fetching customer chats for ${customerId}:`, error);
    return [];
  }
};

/**
 * Fetch messages for a specific chat
 */
export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(`Error fetching messages for chat ${chatId}:`, error);
      return [];
    }

    // Type cast to match ChatMessage interface
    return (data || []) as ChatMessage[];
  } catch (error) {
    console.error(`Unexpected error fetching messages for chat ${chatId}:`, error);
    return [];
  }
};

/**
 * Send a message in a chat
 */
export const sendChatMessage = async (
  chatId: string,
  senderId: string,
  senderType: SenderType,
  content: string
): Promise<ChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        sender_type: senderType,
        content: content,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error sending message in chat ${chatId}:`, error);
      return null;
    }

    // Type cast to match ChatMessage interface
    return data as ChatMessage;
  } catch (error) {
    console.error(`Unexpected error sending message in chat ${chatId}:`, error);
    return null;
  }
};

/**
 * Create a new chat for a customer
 */
export const createChat = async (customerId: string): Promise<Chat | null> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        customer_id: customerId,
        status: "open" as const,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating chat for customer ${customerId}:`, error);
      return null;
    }

    // Type cast to match Chat interface
    return data as Chat;
  } catch (error) {
    console.error(`Unexpected error creating chat for customer ${customerId}:`, error);
    return null;
  }
};

/**
 * Assign a chat to a customer service rep
 */
export const assignChat = async (chatId: string, repId: string): Promise<Chat | null> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({
        rep_id: repId,
        status: "assigned" as const,
      })
      .eq("id", chatId)
      .select()
      .single();

    if (error) {
      console.error(`Error assigning chat ${chatId} to rep ${repId}:`, error);
      return null;
    }

    // Type cast to match Chat interface
    return data as Chat;
  } catch (error) {
    console.error(`Unexpected error assigning chat ${chatId} to rep ${repId}:`, error);
    return null;
  }
};

/**
 * Close a chat (change status to 'closed')
 */
export const closeChat = async (chatId: string): Promise<Chat | null> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({
        status: "closed" as const,
      })
      .eq("id", chatId)
      .select()
      .single();

    if (error) {
      console.error(`Error closing chat ${chatId}:`, error);
      return null;
    }

    // Type cast to match Chat interface
    return data as Chat;
  } catch (error) {
    console.error(`Unexpected error closing chat ${chatId}:`, error);
    return null;
  }
};
