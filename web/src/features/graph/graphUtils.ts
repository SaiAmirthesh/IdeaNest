import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import type { Idea } from "../ideas/types";
import type { Note } from "../notes/types";

export type GraphNodeType = "IDEA" | "NOTE" | "TAG" | "UNRESOLVED";

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  type: GraphNodeType;
  val: number; // Node visual weight / radius
  color: string;
  glowColor: string;
  data?: {
    idea?: Idea;
    note?: Note;
    tag?: string;
    unresolvedTitle?: string;
  };
  linkCount?: number;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: "HIERARCHY" | "WIKILINK" | "TAG";
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  tags: string[];
}

/**
 * Extract Obsidian-style [[WikiLinks]] from markdown content
 * e.g., "See [[Database Architecture]] and [[User Flow]]" -> ["Database Architecture", "User Flow"]
 */
export function extractWikiLinks(content: string): string[] {
  if (!content) return [];
  const regex = /\[\[([^[\]]+)\]\]/g;
  const links: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const rawTarget = match[1]?.trim();
    if (rawTarget) {
      // Support alias syntax [[Note Title|Custom Alias]]
      const noteTitle = rawTarget.split("|")[0]?.trim();
      if (noteTitle && !links.includes(noteTitle)) {
        links.push(noteTitle);
      }
    }
  }

  return links;
}

/**
 * Extract #tags from markdown content
 * e.g., "Discussing #backend and #ai-agent architecture" -> ["backend", "ai-agent"]
 */
export function extractTags(content: string): string[] {
  if (!content) return [];
  // Match #tag while excluding color hexes or headers (# Title is at start of line)
  const regex = /(?:^|\s)#([a-zA-Z0-9_\-/]+)(?=\s|$|[.,;:!?])/g;
  const tags: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const tag = match[1]?.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags;
}

/**
 * Build graph data for a single Idea, its attached notes, wikilinks, and tag clusters.
 */
export function buildLocalIdeaGraph(
  idea: Idea,
  notes: Note[],
  allNotesInVault: Note[] = notes
): GraphData {
  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];
  const tagsSet = new Set<string>();

  // 1. Core Idea Node
  const ideaNodeId = `idea-${idea.id}`;
  nodesMap.set(ideaNodeId, {
    id: ideaNodeId,
    label: idea.title,
    type: "IDEA",
    val: 18,
    color: "#E5C887",
    glowColor: "rgba(229, 200, 135, 0.45)",
    data: { idea },
  });

  // Map for fast title lookup
  const noteTitleMap = new Map<string, Note>();
  allNotesInVault.forEach((n) => {
    noteTitleMap.set(n.title.trim().toLowerCase(), n);
  });

  // 2. Note Nodes for this Idea
  notes.forEach((note) => {
    const noteNodeId = `note-${note.id}`;
    if (!nodesMap.has(noteNodeId)) {
      nodesMap.set(noteNodeId, {
        id: noteNodeId,
        label: note.title,
        type: "NOTE",
        val: 11,
        color: "#10B981",
        glowColor: "rgba(16, 185, 129, 0.35)",
        data: { note },
      });
    }

    // Connect Note -> Core Idea
    links.push({
      source: noteNodeId,
      target: ideaNodeId,
      type: "HIERARCHY",
    });

    // 3. Parse WikiLinks from this Note
    const wikiLinks = extractWikiLinks(note.content);
    wikiLinks.forEach((targetTitle) => {
      const lower = targetTitle.toLowerCase();
      const targetNote = noteTitleMap.get(lower);

      if (targetNote) {
        const targetNodeId = `note-${targetNote.id}`;
        if (!nodesMap.has(targetNodeId)) {
          nodesMap.set(targetNodeId, {
            id: targetNodeId,
            label: targetNote.title,
            type: "NOTE",
            val: 10,
            color: "#06B6D4",
            glowColor: "rgba(6, 182, 212, 0.35)",
            data: { note: targetNote },
          });
        }
        links.push({
          source: noteNodeId,
          target: targetNodeId,
          type: "WIKILINK",
          label: "wikilink",
        });
      } else {
        // Unresolved / Phantom Node
        const phantomNodeId = `unresolved-${lower}`;
        if (!nodesMap.has(phantomNodeId)) {
          nodesMap.set(phantomNodeId, {
            id: phantomNodeId,
            label: targetTitle,
            type: "UNRESOLVED",
            val: 7,
            color: "#737373",
            glowColor: "rgba(115, 115, 115, 0.2)",
            data: { unresolvedTitle: targetTitle },
          });
        }
        links.push({
          source: noteNodeId,
          target: phantomNodeId,
          type: "WIKILINK",
          label: "unresolved",
        });
      }
    });

    // 4. Parse #Tags from this Note
    const tags = extractTags(note.content);
    tags.forEach((tag) => {
      tagsSet.add(tag);
      const tagNodeId = `tag-${tag}`;
      if (!nodesMap.has(tagNodeId)) {
        nodesMap.set(tagNodeId, {
          id: tagNodeId,
          label: `#${tag}`,
          type: "TAG",
          val: 8,
          color: "#A855F7",
          glowColor: "rgba(168, 85, 247, 0.3)",
          data: { tag },
        });
      }
      links.push({
        source: noteNodeId,
        target: tagNodeId,
        type: "TAG",
      });
    });
  });

  // Calculate link counts for dynamic scaling
  const nodes = Array.from(nodesMap.values());
  const linkCounts = new Map<string, number>();
  links.forEach((l) => {
    const s = typeof l.source === "string" ? l.source : l.source.id;
    const t = typeof l.target === "string" ? l.target : l.target.id;
    linkCounts.set(s, (linkCounts.get(s) || 0) + 1);
    linkCounts.set(t, (linkCounts.get(t) || 0) + 1);
  });

  nodes.forEach((n) => {
    n.linkCount = linkCounts.get(n.id) || 0;
  });

  return {
    nodes,
    links,
    tags: Array.from(tagsSet).sort(),
  };
}

/**
 * Build global vault-wide graph data across all Ideas, Notes, and Tag clusters.
 */
export function buildGlobalVaultGraph(ideas: Idea[], notes: Note[]): GraphData {
  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];
  const tagsSet = new Set<string>();

  // 1. Add all Idea nodes
  ideas.forEach((idea) => {
    const ideaNodeId = `idea-${idea.id}`;
    nodesMap.set(ideaNodeId, {
      id: ideaNodeId,
      label: idea.title,
      type: "IDEA",
      val: 16,
      color: "#E5C887",
      glowColor: "rgba(229, 200, 135, 0.45)",
      data: { idea },
    });
  });

  // Title lookup
  const noteTitleMap = new Map<string, Note>();
  notes.forEach((n) => {
    noteTitleMap.set(n.title.trim().toLowerCase(), n);
  });

  // 2. Add all Note nodes & hierarchy links
  notes.forEach((note) => {
    const noteNodeId = `note-${note.id}`;
    if (!nodesMap.has(noteNodeId)) {
      nodesMap.set(noteNodeId, {
        id: noteNodeId,
        label: note.title,
        type: "NOTE",
        val: 10,
        color: note.ideaId ? "#10B981" : "#06B6D4",
        glowColor: note.ideaId
          ? "rgba(16, 185, 129, 0.35)"
          : "rgba(6, 182, 212, 0.35)",
        data: { note },
      });
    }

    // Connect to parent idea if present
    if (note.ideaId) {
      const ideaNodeId = `idea-${note.ideaId}`;
      if (nodesMap.has(ideaNodeId)) {
        links.push({
          source: noteNodeId,
          target: ideaNodeId,
          type: "HIERARCHY",
        });
      }
    }

    // 3. WikiLinks
    const wikiLinks = extractWikiLinks(note.content);
    wikiLinks.forEach((targetTitle) => {
      const lower = targetTitle.toLowerCase();
      const targetNote = noteTitleMap.get(lower);

      if (targetNote) {
        const targetNodeId = `note-${targetNote.id}`;
        if (!nodesMap.has(targetNodeId)) {
          nodesMap.set(targetNodeId, {
            id: targetNodeId,
            label: targetNote.title,
            type: "NOTE",
            val: 10,
            color: "#06B6D4",
            glowColor: "rgba(6, 182, 212, 0.35)",
            data: { note: targetNote },
          });
        }
        links.push({
          source: noteNodeId,
          target: targetNodeId,
          type: "WIKILINK",
          label: "wikilink",
        });
      } else {
        const phantomNodeId = `unresolved-${lower}`;
        if (!nodesMap.has(phantomNodeId)) {
          nodesMap.set(phantomNodeId, {
            id: phantomNodeId,
            label: targetTitle,
            type: "UNRESOLVED",
            val: 7,
            color: "#737373",
            glowColor: "rgba(115, 115, 115, 0.2)",
            data: { unresolvedTitle: targetTitle },
          });
        }
        links.push({
          source: noteNodeId,
          target: phantomNodeId,
          type: "WIKILINK",
          label: "unresolved",
        });
      }
    });

    // 4. Tags
    const tags = extractTags(note.content);
    tags.forEach((tag) => {
      tagsSet.add(tag);
      const tagNodeId = `tag-${tag}`;
      if (!nodesMap.has(tagNodeId)) {
        nodesMap.set(tagNodeId, {
          id: tagNodeId,
          label: `#${tag}`,
          type: "TAG",
          val: 8,
          color: "#A855F7",
          glowColor: "rgba(168, 85, 247, 0.3)",
          data: { tag },
        });
      }
      links.push({
        source: noteNodeId,
        target: tagNodeId,
        type: "TAG",
      });
    });
  });

  const nodes = Array.from(nodesMap.values());
  const linkCounts = new Map<string, number>();
  links.forEach((l) => {
    const s = typeof l.source === "string" ? l.source : l.source.id;
    const t = typeof l.target === "string" ? l.target : l.target.id;
    linkCounts.set(s, (linkCounts.get(s) || 0) + 1);
    linkCounts.set(t, (linkCounts.get(t) || 0) + 1);
  });

  nodes.forEach((n) => {
    n.linkCount = linkCounts.get(n.id) || 0;
  });

  return {
    nodes,
    links,
    tags: Array.from(tagsSet).sort(),
  };
}
