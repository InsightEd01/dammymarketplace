import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, User, X } from "lucide-react";
import { ChatMessage } from "@/types/supabase";
import { getChatMessages, sendChatMessage } from "@/lib/services/chatService";

interface ChatWidgetProps {
  chatId: string;
  userId: string;
  userType: "customer" | "rep" | "system";
  customerName?: string;
  repName?: string;
  onClose?: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatId,
  userId,
  userType,
  customerName = "Customer",
  repName = "Support Agent",
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const messagesData = await getChatMessages(chatId);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error loading chat messages:", error);
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [chatId, toast]);

  // Set up realtime subscription
  useEffect(() => {
    const subscription = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          // Add new message to the list
          const newMessage = payload.new as ChatMessage;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await sendChatMessage(chatId, userId, userType, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getMessageSender = (message: ChatMessage) => {
    if (message.sender_type === "customer") return customerName;
    if (message.sender_type === "rep") return repName;
    return "System";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="border-b bg-primary/5 flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-medium">Customer Support</CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
              <User className="h-12 w-12 mb-2 text-gray-400" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isSelf = message.sender_id === userId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex ${isSelf ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
                    >
                      {!isSelf && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={getMessageSender(message)} />
                          <AvatarFallback
                            className={
                              message.sender_type === "customer"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }
                          >
                            {getInitials(getMessageSender(message))}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        {!isSelf && (
                          <p className="text-xs text-gray-500 mb-1">
                            {getMessageSender(message)}
                          </p>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            isSelf
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatWidget;
