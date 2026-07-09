"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
  type FocusEvent as ReactFocusEvent,
} from "react";
import { useContent, useField } from "./contentStore";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type EditFieldProps = {
  path: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

export function EditField({
  path,
  as: Tag = "span",
  className,
  multiline = false,
  placeholder,
}: EditFieldProps) {
  const { editMode, set } = useContent();
  const value = useField(path);
  const ref = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value, editMode]);

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={`${className ?? ""} editable`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder ?? ""}
      onBlur={(e: ReactFocusEvent<HTMLElement>) =>
        set(path, e.currentTarget.textContent ?? "")
      }
      onKeyDown={(e: ReactKeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
}

type ListControlsProps = {
  path: string;
  index: number;
  length: number;
};

export function ListControls({ path, index, length }: ListControlsProps) {
  const { editMode, removeItem, moveItem } = useContent();
  if (!editMode) return null;
  return (
    <span className="rowControls" contentEditable={false}>
      <button
        type="button"
        onClick={() => moveItem(path, index, -1)}
        disabled={index === 0}
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => moveItem(path, index, 1)}
        disabled={index === length - 1}
        aria-label="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        className="del"
        onClick={() => removeItem(path, index)}
        aria-label="Delete"
      >
        ×
      </button>
    </span>
  );
}

type AddItemProps = {
  path: string;
  template: unknown;
  label?: string;
};

export function AddItem({ path, template, label = "+ Add item" }: AddItemProps) {
  const { editMode, addItem } = useContent();
  if (!editMode) return null;
  return (
    <button
      type="button"
      className="addItem"
      onClick={() => addItem(path, JSON.parse(JSON.stringify(template)))}
    >
      {label}
    </button>
  );
}

export function EditToolbar() {
  const { editMode, setEditMode, reset, exportContent } = useContent();
  return (
    <div className={`editToolbar ${editMode ? "on" : ""}`}>
      {editMode && (
        <>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              if (confirm("Reset all changes to defaults?")) reset();
            }}
          >
            Reset
          </button>
          <button type="button" className="ghost" onClick={exportContent}>
            Export
          </button>
        </>
      )}
      <button
        type="button"
        className={`editToggle ${editMode ? "on" : ""}`}
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Done" : "Edit"}
      </button>
    </div>
  );
}
