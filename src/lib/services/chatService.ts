
import { supabase } from "@/integrations/supabase/client";
import { Chat, ChatMessage, ChatStatus, SenderType } from "@/types/supabase";

// Function to get all chats
export const getAllChats = async (): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        customer:customer_id(full_name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      return [];
    }

    // Transform the data to match our Chat type
    return (data || []).map(chat => ({
      ...chat,
      status: chat.status as ChatStatus,
    }));
  } catch (error) {
    console.error("Unexpected error fetching chats:", error);
    return [];
  }
};

// Function to get open chats (unassigned)
export const getOpenChats = async (): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        customer:customer_id(full_name, email)
      `,
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching open chats:", error);
      return [];
    }

    // Transform the data to match our Chat type
    return (data || []).map(chat => ({
      ...chat,
      status: chat.status as ChatStatus,
    }));
  } catch (error) {
    console.error("Unexpected error fetching open chats:", error);
    return [];
  }
};

// Function to get assigned chats for a specific rep
export const getRepChats = async (repId: string): Promise<Chat[]> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        customer:customer_id(full_name, email)
      `,
      )
      .eq("rep_id", repId)
      .eq("status", "assigned")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching chats for rep ${repId}:`, error);
      return [];
    }

    // Transform the data to match our Chat type
    return (data || []).map(chat => ({
      ...chat,
      status: chat.status as ChatStatus,
    }));
  } catch (error) {
    console.error(`Unexpected error fetching chats for rep ${repId}:`, error);
    return [];
  }
};

// Function to get chat messages
export const getChatMessages = async (
  chatId: string,
): Promise<ChatMessage[]> => {
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

    // Transform the data to match our ChatMessage type
    return (data || []).map(message => ({
      ...message,
      sender_type: message.sender_type as SenderType,
    }));
  } catch (error) {
    console.error(
      `Unexpected error fetching messages for chat ${chatId}:`,
      error,
    );
    return [];
  }
};

// Function to send a message
export const sendChatMessage = async (
  chatId: string,
  senderId: string,
  senderType: SenderType,
  content: string,
): Promise<ChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        sender_type: senderType,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error sending message to chat ${chatId}:`, error);
      return null;
    }

    return {
      ...data,
      sender_type: data.sender_type as SenderType,
    };
  } catch (error) {
    console.error(`Unexpected error sending message to chat ${chatId}:`, error);
    return null;
  }
};

// Function to assign a rep to a chat
export const assignChatToRep = async (
  chatId: string,
  repId: string,
): Promise<Chat | null> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({
        rep_id: repId,
        status: "assigned" as ChatStatus,
      })
      .eq("id", chatId)
      .select()
      .single();

    if (error) {
      console.error(`Error assigning chat ${chatId} to rep ${repId}:`, error);
      return null;
    }

    return {
      ...data,
      status: data.status as ChatStatus,
    };
  } catch (error) {
    console.error(
      `Unexpected error assigning chat ${chatId} to rep ${repId}:`,
      error,
    );
    return null;
  }
};

// Function to close a chat
export const closeChat = async (chatId: string): Promise<Chat | null> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({
        status: "closed" as ChatStatus,
      })
      .eq("id", chatId)
      .select()
      .single();

    if (error) {
      console.error(`Error closing chat ${chatId}:`, error);
      return null;
    }

    return {
      ...data,
      status: data.status as ChatStatus,
    };
  } catch (error) {
    console.error(`Unexpected error closing chat ${chatId}:`, error);
    return null;
  }
};

// Function to create a new chat
export const createNewChat = async (
  customerId: string,
): Promise<Chat | null> => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        customer_id: customerId,
        status: "open" as ChatStatus,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating chat for customer ${customerId}:`, error);
      return null;
    }

    return {
      ...data,
      status: data.status as ChatStatus,
    };
  } catch (error) {
    console.error(
      `Unexpected error creating chat for customer ${customerId}:`,
      error,
    );
    return null;
  }
};
