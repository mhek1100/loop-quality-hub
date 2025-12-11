import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Role } from "@/lib/types";
import { users, roles } from "@/lib/mock/data";

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  userRoles: Role[];
  hasPermission: (permission: string) => boolean;
  canEdit: boolean;
  canReview: boolean;
  canSubmit: boolean;
  canConfigurePipeline: boolean;
  canViewAuditLogs: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Default to Morgan (QI Submitter) for demonstration
  const [currentUser, setCurrentUser] = useState<User>(users[4]);

  const userRoles = roles.filter(r => currentUser.roleIds.includes(r.id));
  
  const hasPermission = (permission: string) => 
    userRoles.some(r => r.permissions.includes(permission as any));

  const canEdit = hasPermission("EDIT_QUESTIONNAIRE");
  const canReview = hasPermission("REVIEW_SUBMISSION");
  const canSubmit = hasPermission("FINAL_SUBMIT_GOVERNMENT");
  const canConfigurePipeline = hasPermission("CONFIGURE_PIPELINE");
  const canViewAuditLogs = hasPermission("VIEW_AUDIT_LOGS");

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      userRoles,
      hasPermission,
      canEdit,
      canReview,
      canSubmit,
      canConfigurePipeline,
      canViewAuditLogs,
    }}>
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
