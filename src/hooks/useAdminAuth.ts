
import { useRoleAuth } from "./useRoleAuth";

export const useAdminAuth = () => {
  const { isLoading, hasRole: isAdmin, userId } = useRoleAuth({
    role: "admin",
    redirectPath: "/",
    roleName: "an admin"
  });

  return { isLoading, isAdmin, userId };
};

export const useCustomerServiceAuth = () => {
  const { isLoading, hasRole: isCustomerService, userId } = useRoleAuth({
    role: "customer_service",
    redirectPath: "/",
    roleName: "a customer service representative"
  });

  return { isLoading, isCustomerService, userId };
};

export const useCashierAuth = () => {
  const { isLoading, hasRole: isCashier, userId } = useRoleAuth({
    role: "cashier",
    redirectPath: "/",
    roleName: "a cashier"
  });

  return { isLoading, isCashier, userId };
};
