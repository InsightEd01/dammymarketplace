
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Chat } from "@/types/supabase";

type OpenChatsTabProps = {
  openChats: Chat[];
  handleAssignChat: (chatId: string) => void;
};

export const OpenChatsTab = ({ openChats, handleAssignChat }: OpenChatsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Support Requests</CardTitle>
        <CardDescription>
          Unassigned customer chats that need attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {openChats.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openChats.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell className="font-medium">
                    {chat.customer?.full_name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {new Date(chat.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                    >
                      Waiting
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleAssignChat(chat.id)}
                    >
                      Assign to me
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <p>No open chats at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
