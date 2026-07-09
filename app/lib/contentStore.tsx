"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { content as defaultContent, type SiteContent } from "../content";

type Ctx = {
  content: SiteContent;
  editMode: boolean;
  saveState: "saved" | "saving" | "error";
  savedAt: Date | null;
  setEditMode: (v: boolean) => void;
  set: (path: string, value: unknown) => void;
  addItem: (path: string, item: unknown) => void;
  removeItem: (path: string, index: number) => void;
  moveItem: (path: string, index: number, delta: number) => void;
  reset: () => void;
  saveNow: () => Promise<boolean>;
  importContent: (value: unknown) => boolean;
  exportContent: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function getByPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc == null ? acc : (acc as Record<string, unknown>)[key],
      obj,
    );
}

function setByPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const next = deepClone(obj) as unknown as Record<string, unknown>;
  let cur: Record<string, unknown> = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return next as unknown as T;
}

export function ContentProvider({
  children,
  initialContent = defaultContent,
  initialEditMode = false,
  saveMode = "none",
}: {
  children: ReactNode;
  initialContent?: SiteContent;
  initialEditMode?: boolean;
  saveMode?: "none" | "server";
}) {
  const [content, setContent] = useState<SiteContent>(() =>
    deepClone(initialContent),
  );
  const [editMode, setEditMode] = useState(initialEditMode);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">(
    "saved",
  );
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(async (value: SiteContent) => {
    if (saveMode !== "server") return true;
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (!response.ok) throw new Error("Save failed");
      setSavedAt(new Date());
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, [saveMode]);

  useEffect(() => {
    if (saveMode !== "server") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void persist(content), 650);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [content, persist, saveMode]);

  const set = useCallback((path: string, value: unknown) => {
    setSaveState("saving");
    setContent((c) => setByPath(c, path, value));
  }, []);

  const addItem = useCallback((path: string, item: unknown) => {
    setSaveState("saving");
    setContent((c) => {
      const arr = getByPath(c, path);
      if (!Array.isArray(arr)) return c;
      return setByPath(c, path, [...arr, item]);
    });
  }, []);

  const removeItem = useCallback((path: string, index: number) => {
    setSaveState("saving");
    setContent((c) => {
      const arr = getByPath(c, path);
      if (!Array.isArray(arr)) return c;
      return setByPath(c, path, arr.filter((_, i) => i !== index));
    });
  }, []);

  const moveItem = useCallback((path: string, index: number, delta: number) => {
    setSaveState("saving");
    setContent((c) => {
      const arr = getByPath(c, path);
      if (!Array.isArray(arr)) return c;
      const newIndex = index + delta;
      if (newIndex < 0 || newIndex >= arr.length) return c;
      const next = [...arr];
      const [moved] = next.splice(index, 1);
      next.splice(newIndex, 0, moved);
      return setByPath(c, path, next);
    });
  }, []);

  const reset = useCallback(() => {
    setSaveState("saving");
    setContent(deepClone(defaultContent));
  }, []);

  const saveNow = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    return persist(content);
  }, [content, persist]);

  const importContent = useCallback((value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }
    const candidate = value as Partial<SiteContent>;
    if (
      !candidate.meta ||
      !candidate.sidebar ||
      !candidate.hero ||
      !candidate.work ||
      !candidate.writing ||
      !candidate.contact ||
      !candidate.footer ||
      !Array.isArray(candidate.nav)
    ) {
      return false;
    }
    setSaveState("saving");
    setContent(deepClone(candidate as SiteContent));
    return true;
  }, []);

  const exportContent = useCallback(() => {
    const body = JSON.stringify(content, null, 2);
    const blob = new Blob([body], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tucker-site-content.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [content]);

  return (
    <ContentContext.Provider
      value={{
        content,
        editMode,
        saveState,
        savedAt,
        setEditMode,
        set,
        addItem,
        removeItem,
        moveItem,
        reset,
        saveNow,
        importContent,
        exportContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

export function useField(path: string): string {
  const { content } = useContent();
  const value = getByPath(content, path);
  return typeof value === "string" ? value : "";
}
