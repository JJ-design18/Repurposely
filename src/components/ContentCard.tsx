"use client";

import { useState } from "react";
import { Copy, Check, Pencil, Save } from "lucide-react";

interface ContentCardProps {
  title: string;
  content: string;
  platform: string;
}

export default function ContentCard({
  title,
  content,
  platform,
}: ContentCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  async function handleCopy() {
    await navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    setEditing(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-primary-light uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {editing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs bg-success/10 text-success px-2.5 py-1 rounded-md hover:bg-success/20 transition-colors"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-muted px-2.5 py-1 rounded-md hover:bg-card-hover transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
              copied
                ? "bg-success/10 text-success"
                : "text-muted hover:bg-card-hover"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full bg-background border border-border rounded-lg p-3 text-sm leading-relaxed resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          aria-label={`Edit ${platform} content`}
        />
      ) : (
        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {editedContent}
        </div>
      )}
    </div>
  );
}
