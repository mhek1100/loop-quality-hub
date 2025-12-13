import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Submission } from "@/lib/types";

const STORAGE_KEY = "loop.submissions.created.v1";

interface SubmissionsStoreContextType {
  createdSubmissions: Submission[];
  isStoreBacked: (id: string) => boolean;
  getCreatedById: (id: string) => Submission | undefined;
  createSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, updater: (prev: Submission) => Submission) => void;
  clearCreatedSubmissions: () => void;
}

const SubmissionsStoreContext = createContext<SubmissionsStoreContextType | undefined>(undefined);

const safeParse = (raw: string | null): Submission[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Submission[];
  } catch {
    return [];
  }
};

export function SubmissionsStoreProvider({ children }: { children: React.ReactNode }) {
  const [createdSubmissions, setCreatedSubmissions] = useState<Submission[]>(() =>
    safeParse(localStorage.getItem(STORAGE_KEY))
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(createdSubmissions));
  }, [createdSubmissions]);

  const isStoreBacked = useCallback(
    (id: string) => createdSubmissions.some((s) => s.id === id),
    [createdSubmissions]
  );

  const getCreatedById = useCallback(
    (id: string) => createdSubmissions.find((s) => s.id === id),
    [createdSubmissions]
  );

  const createSubmission = useCallback((submission: Submission) => {
    setCreatedSubmissions((prev) => [submission, ...prev]);
  }, []);

  const updateSubmission = useCallback((id: string, updater: (prev: Submission) => Submission) => {
    setCreatedSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return updater(s);
      })
    );
  }, []);

  const clearCreatedSubmissions = useCallback(() => {
    setCreatedSubmissions([]);
  }, []);

  const value = useMemo(
    () => ({
      createdSubmissions,
      isStoreBacked,
      getCreatedById,
      createSubmission,
      updateSubmission,
      clearCreatedSubmissions,
    }),
    [createdSubmissions, isStoreBacked, getCreatedById, createSubmission, updateSubmission, clearCreatedSubmissions]
  );

  return <SubmissionsStoreContext.Provider value={value}>{children}</SubmissionsStoreContext.Provider>;
}

export function useSubmissionsStore() {
  const context = useContext(SubmissionsStoreContext);
  if (!context) {
    throw new Error("useSubmissionsStore must be used within SubmissionsStoreProvider");
  }
  return context;
}
