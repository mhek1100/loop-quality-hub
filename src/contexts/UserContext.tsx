import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, Role, Permission } from "@/lib/types";
import { users, roles } from "@/lib/mock/data";

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  userRoles: Role[];
  hasPermission: (permission: Permission) => boolean;
  canPostInProgress: boolean;
  canFinalSubmit: boolean;
  canEdit: boolean;
  canReview: boolean;
  availableUsers: User[];
  getGpmsHeaders: () => Record<string, string>;
  isAuthorizedSubmitter: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Default to Morgan - QI Submitter
  const [currentUser, setCurrentUser] = useState<User>(
    users.find((u) => u.id === "user-005") || users[0]
  );

  const userRoles = roles.filter((r) => currentUser.roleIds.includes(r.id));

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return userRoles.some((r) => r.permissions.includes(permission));
    },
    [userRoles]
  );

  const canPostInProgress =
    hasPermission("POST_IN_PROGRESS") ||
    hasPermission("REVIEW_SUBMISSION") ||
    hasPermission("FINAL_SUBMIT_GOVERNMENT");

  const canFinalSubmit = hasPermission("FINAL_SUBMIT_GOVERNMENT");

  const canEdit = hasPermission("EDIT_QUESTIONNAIRE");

  const canReview = hasPermission("REVIEW_SUBMISSION");

  const isAuthorizedSubmitter =
    canFinalSubmit && !!(currentUser.email || currentUser.federatedId);

  const getGpmsHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (currentUser.email) {
      headers["X-User-Email"] = currentUser.email;
    }
    if (currentUser.federatedId) {
      headers["X-Federated-Id"] = currentUser.federatedId;
    }
    return headers;
  }, [currentUser]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userRoles,
        hasPermission,
        canPostInProgress,
        canFinalSubmit,
        canEdit,
        canReview,
        availableUsers: users,
        getGpmsHeaders,
        isAuthorizedSubmitter,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
