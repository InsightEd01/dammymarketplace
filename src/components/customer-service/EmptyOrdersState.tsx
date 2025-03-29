
import { ShoppingCart } from "lucide-react";

type EmptyOrdersStateProps = {
  searchQuery: string;
  selectedStatus: string;
};

export const EmptyOrdersState = ({
  searchQuery,
  selectedStatus
}: EmptyOrdersStateProps) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <ShoppingCart className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
      <p>No orders found</p>
      {(searchQuery || selectedStatus) && (
        <p className="mt-2">
          Try adjusting your search or filter criteria
        </p>
      )}
    </div>
  );
};
