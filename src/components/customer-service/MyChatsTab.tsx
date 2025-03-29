
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MessageSquare } from "lucide-react";
import { Chat } from "@/types/supabase";
import ChatWidget from "@/components/ChatWidget";

type MyChatsTabProps = {
  myChats: Chat[];
  selectedChat: string | null;
  setSelectedChat: (chatId: string) => void;
  userId: string;
};

export const MyChatsTab = ({ myChats, selectedChat, setSelectedChat, userId }: MyChatsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>My Assigned Chats</CardTitle>
          <CardDescription>
            Chats you are currently handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myChats.length > 0 ? (
            <div className="space-y-4">
              {myChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedChat === chat.id ? "bg-primary/10 border-primary" : "hover:bg-muted"}`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {chat.customer?.full_name || "Unknown Customer"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {chat.customer?.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Started {new Date(chat.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p>You have no assigned chats</p>
              <p className="text-sm mt-1">
                Assign yourself to open chats from the Open Chats tab
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Chat Window</CardTitle>
          <CardDescription>Conversation with customer</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedChat ? (
            <ChatWidget
              chatId={selectedChat}
              userId={userId}
              userType="rep"
              repName="Support Agent"
            />
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p>Select a chat to view the conversation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
