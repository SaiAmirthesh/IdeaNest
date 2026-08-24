import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3Force from "d3-force";
import * as d3Zoom from "d3-zoom";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  Tag,
  Lightbulb,
} from "lucide-react";
import type { GraphData, GraphNode, GraphLink } from "@/features/graph/graphUtils";
import type { Note } from "@/features/notes/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KnowledgeGraphProps {
  data: GraphData;
  height?: number | string;
  className?: string;
  onSelectNote?: (note: Note) => void;
  onDoubleClickCanvas?: () => void;
  showControls?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function KnowledgeGraph({
  data,
  height = "100%",
  className = "",
  onSelectNote,
  onDoubleClickCanvas,
  showControls = true,
  isFullscreen = false,
  onToggleFullscreen,
}: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interaction State
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [showPhysicsPanel, setShowPhysicsPanel] = useState(false);

  // Physics parameter states
  const [repulsion, setRepulsion] = useState(-180);
  const [linkDistance, setLinkDistance] = useState(70);

  // Simulation & D3 refs
  const simulationRef = useRef<d3Force.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomBehaviorRef = useRef<d3Zoom.ZoomBehavior<HTMLCanvasElement, unknown> | null>(null);
  const currentTransformRef = useRef<d3Zoom.ZoomTransform>(d3Zoom.zoomIdentity);

  // Clone nodes and links for simulation so mutations don't corrupt props
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let nodes = data.nodes.map((n) => ({ ...n }));
    let links = data.links.map((l) => ({ ...l }));

    if (activeTagFilter) {
      // Find nodes connected to this tag
      const tagNodeId = `tag-${activeTagFilter}`;
      const connectedNodeIds = new Set<string>([tagNodeId]);
      links.forEach((l) => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        if (s === tagNodeId) connectedNodeIds.add(t);
        if (t === tagNodeId) connectedNodeIds.add(s);
      });

      nodes = nodes.filter((n) => connectedNodeIds.has(n.id));
      const validNodeIds = new Set(nodes.map((n) => n.id));
      links = links.filter((l) => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        return validNodeIds.has(s) && validNodeIds.has(t);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      nodes.forEach((n) => {
        if (n.label.toLowerCase().includes(q)) {
          n.val = (n.val || 10) + 4;
        }
      });
    }

    return { filteredNodes: nodes, filteredLinks: links };
  }, [data, activeTagFilter, searchQuery]);

  // Find neighbors of a node for spotlighting
  const getConnectedNodeIds = useCallback(
    (nodeId: string): Set<string> => {
      const connected = new Set<string>([nodeId]);
      filteredLinks.forEach((link) => {
        const s = typeof link.source === "object" ? link.source.id : link.source;
        const t = typeof link.target === "object" ? link.target.id : link.target;
        if (s === nodeId) connected.add(t);
        if (t === nodeId) connected.add(s);
      });
      return connected;
    },
    [filteredLinks]
  );

  // Setup simulation and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // D3 Force Simulation
    const simulation = d3Force
      .forceSimulation<GraphNode>(filteredNodes)
      .force(
        "link",
        d3Force
          .forceLink<GraphNode, GraphLink>(filteredLinks)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("charge", d3Force.forceManyBody().strength(repulsion))
      .force("center", d3Force.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3Force.forceCollide<GraphNode>().radius((d) => d.val + 6)
      )
      .alphaDecay(0.025);

    simulationRef.current = simulation;

    // Zoom behavior
    const zoom = d3Zoom
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        currentTransformRef.current = event.transform;
      });

    zoomBehaviorRef.current = zoom;
    const selection = d3Selection.select(canvas);
    selection.call(zoom);

    // Drag behavior
    const drag = d3Drag
      .drag<HTMLCanvasElement, unknown>()
      .subject((event) => {
        const transform = currentTransformRef.current;
        const x = transform.invertX(event.x);
        const y = transform.invertY(event.y);
        for (const node of filteredNodes) {
          if (node.x === undefined || node.y === undefined) continue;
          const dx = x - node.x;
          const dy = y - node.y;
          if (dx * dx + dy * dy < (node.val + 8) * (node.val + 8)) {
            return node;
          }
        }
        return null;
      })
      .on("start", (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        const transform = currentTransformRef.current;
        event.subject.fx = transform.invertX(event.x);
        event.subject.fy = transform.invertY(event.y);
      })
      .on("end", (event) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    selection.call(drag as unknown as (selection: d3Selection.Selection<HTMLCanvasElement, unknown, null, undefined>) => void);

    // Animation Loop
    let animationFrameId: number;

    const render = () => {
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, width, height);

      const transform = currentTransformRef.current;
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      const activeNeighbors = hoveredNode ? getConnectedNodeIds(hoveredNode.id) : null;

      // 1. Draw Links
      filteredLinks.forEach((link) => {
        const source = link.source as GraphNode;
        const target = link.target as GraphNode;
        if (source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined)
          return;

        const isHighlighted =
          hoveredNode &&
          (source.id === hoveredNode.id || target.id === hoveredNode.id);
        const isDimmed = hoveredNode && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isHighlighted) {
          ctx.strokeStyle = "#E5C887";
          ctx.lineWidth = 2.2 / transform.k;
          ctx.shadowColor = "rgba(229, 200, 135, 0.8)";
          ctx.shadowBlur = 8;
        } else if (isDimmed) {
          ctx.strokeStyle = "rgba(38, 38, 38, 0.25)";
          ctx.lineWidth = 0.8 / transform.k;
          ctx.shadowBlur = 0;
        } else {
          ctx.shadowBlur = 0;
          if (link.type === "HIERARCHY") {
            ctx.strokeStyle = "rgba(229, 200, 135, 0.22)";
            ctx.lineWidth = 1.4 / transform.k;
          } else if (link.type === "WIKILINK") {
            ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
            ctx.lineWidth = 1.2 / transform.k;
          } else {
            ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
            ctx.lineWidth = 1.0 / transform.k;
          }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Nodes
      filteredNodes.forEach((node) => {
        if (node.x === undefined || node.y === undefined) return;

        const isHovered = hoveredNode?.id === node.id;
        const isNeighbor = activeNeighbors?.has(node.id);
        const isDimmed = hoveredNode && !isHovered && !isNeighbor;

        const radius = (node.val || 10) * (isHovered ? 1.25 : 1.0);

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

        if (isHovered) {
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.glowColor;
          ctx.shadowBlur = 18;
        } else if (isNeighbor) {
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.glowColor;
          ctx.shadowBlur = 10;
        } else if (isDimmed) {
          ctx.fillStyle = "rgba(50, 50, 50, 0.4)";
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.glowColor;
          ctx.shadowBlur = 6;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Border ring
        ctx.lineWidth = 1.5 / transform.k;
        ctx.strokeStyle = isHovered
          ? "#FFFFFF"
          : node.type === "UNRESOLVED"
          ? "rgba(115, 115, 115, 0.6)"
          : "rgba(0, 0, 0, 0.5)";

        if (node.type === "UNRESOLVED") {
          ctx.setLineDash([3, 3]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Draw Node Labels
        const shouldShowLabel =
          transform.k > 0.65 || isHovered || isNeighbor || node.type === "IDEA";

        if (shouldShowLabel) {
          const fontSize = Math.max(9, Math.min(14, 11 / Math.sqrt(transform.k)));
          ctx.font = `${node.type === "IDEA" ? "bold" : "normal"} ${fontSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Text halo/outline for readability
          ctx.strokeStyle = "rgba(3, 3, 3, 0.85)";
          ctx.lineWidth = 3 / transform.k;
          ctx.strokeText(node.label, node.x, node.y + radius + 4);

          ctx.fillStyle = isHovered
            ? "#FFFFFF"
            : isDimmed
            ? "rgba(115, 115, 115, 0.4)"
            : node.type === "IDEA"
            ? "#F5F5F5"
            : "#A3A3A3";

          ctx.fillText(node.label, node.x, node.y + radius + 4);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, repulsion, linkDistance, hoveredNode, getConnectedNodeIds]);

  // Pointer Move for Hover & Cursor Detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const transform = currentTransformRef.current;
    const simX = transform.invertX(x);
    const simY = transform.invertY(y);

    let found: GraphNode | null = null;
    for (const node of filteredNodes) {
      if (node.x === undefined || node.y === undefined) continue;
      const dx = simX - node.x;
      const dy = simY - node.y;
      if (dx * dx + dy * dy < (node.val + 6) * (node.val + 6)) {
        found = node;
        break;
      }
    }

    setHoveredNode(found);
    canvas.style.cursor = found ? "pointer" : "default";
  };

  // Node Click handler
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const transform = currentTransformRef.current;
    const simX = transform.invertX(x);
    const simY = transform.invertY(y);

    for (const node of filteredNodes) {
      if (node.x === undefined || node.y === undefined) continue;
      const dx = simX - node.x;
      const dy = simY - node.y;
      if (dx * dx + dy * dy < (node.val + 6) * (node.val + 6)) {
        if (node.type === "NOTE" && node.data?.note && onSelectNote) {
          onSelectNote(node.data.note);
        } else if (node.type === "TAG" && node.data?.tag) {
          setActiveTagFilter(activeTagFilter === node.data.tag ? null : node.data.tag);
        }
        return;
      }
    }
  };

  // Zoom Button Handlers
  const handleZoomIn = () => {
    if (!canvasRef.current || !zoomBehaviorRef.current) return;
    zoomBehaviorRef.current.scaleBy(d3Selection.select(canvasRef.current), 1.35);
  };

  const handleZoomOut = () => {
    if (!canvasRef.current || !zoomBehaviorRef.current) return;
    zoomBehaviorRef.current.scaleBy(d3Selection.select(canvasRef.current), 0.75);
  };

  const handleResetZoom = () => {
    if (!canvasRef.current || !zoomBehaviorRef.current) return;
    zoomBehaviorRef.current.transform(d3Selection.select(canvasRef.current), d3Zoom.zoomIdentity);
  };

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`relative w-full bg-[#070707] border border-[#262626] rounded-none overflow-hidden select-none font-sans ${className}`}
    >
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onDoubleClick={onDoubleClickCanvas}
        className="w-full h-full block"
      />

      {/* Top HUD Controls Toolbar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Search Box */}
          <div className="pointer-events-auto flex items-center gap-2 bg-[#0A0A0A]/90 border border-[#262626] backdrop-blur-md p-1 px-2.5 shadow-lg">
            <Search className="size-3.5 text-[#737373]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search graph nodes..."
              className="bg-transparent border-none text-[#F5F5F5] placeholder-[#737373] text-xs h-7 w-36 sm:w-48 focus-visible:ring-0 p-0"
            />
          </div>

          {/* Action buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0A0A0A]/90 border border-[#262626] backdrop-blur-md p-1 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-7 w-7 p-0 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-7 w-7 p-0 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="h-7 w-7 p-0 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPhysicsPanel(!showPhysicsPanel)}
              className={`h-7 w-7 p-0 rounded-none cursor-pointer ${
                showPhysicsPanel
                  ? "bg-accent-gold text-black"
                  : "text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#161616]"
              }`}
              title="Physics Controls"
            >
              <Sliders className="size-3.5" />
            </Button>
            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-7 w-7 p-0 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tag Filter Pills */}
      {data.tags.length > 0 && showControls && (
        <div className="absolute top-14 left-3 flex flex-wrap gap-1.5 max-w-[70%] pointer-events-auto">
          {data.tags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
              className={`px-2 py-0.5 text-[10px] font-mono border rounded-none transition-all cursor-pointer ${
                activeTagFilter === tag
                  ? "bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-900/40"
                  : "bg-[#0A0A0A]/90 border-[#262626] text-[#A3A3A3] hover:border-purple-500 hover:text-white"
              }`}
            >
              #{tag}
            </button>
          ))}
          {activeTagFilter && (
            <button
              onClick={() => setActiveTagFilter(null)}
              className="px-1.5 py-0.5 text-[10px] font-mono bg-red-950/40 border border-red-800/60 text-red-300 rounded-none cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Physics Tuning Panel */}
      {showPhysicsPanel && (
        <div className="absolute top-14 right-3 w-56 bg-[#0A0A0A]/95 border border-[#262626] backdrop-blur-md p-3.5 shadow-2xl space-y-3 pointer-events-auto text-xs text-[#F5F5F5] animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2">
            <span className="font-semibold text-accent-gold text-[11px] flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Synaptic Physics
            </span>
            <span className="text-[10px] text-[#737373] font-mono">D3 Force</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#737373]">
              <span>Repulsion Strength</span>
              <span className="font-mono">{Math.abs(repulsion)}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              value={Math.abs(repulsion)}
              onChange={(e) => setRepulsion(-Number(e.target.value))}
              className="w-full h-1 bg-[#262626] accent-accent-gold rounded-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#737373]">
              <span>Link Distance</span>
              <span className="font-mono">{linkDistance}px</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              value={linkDistance}
              onChange={(e) => setLinkDistance(Number(e.target.value))}
              className="w-full h-1 bg-[#262626] accent-accent-gold rounded-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Legend & Stats at Bottom Left */}
      <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 border border-[#262626] backdrop-blur-md p-2 px-3 shadow-lg flex items-center gap-3 text-[10px] text-[#737373] pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#E5C887] shadow-[0_0_6px_#E5C887]" />
          <span>Idea</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
          <span>Attached Note</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4]" />
          <span>WikiLink Note</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
          <span>Tag Cluster</span>
        </div>
        <span className="font-mono text-neutral-400 pl-1 border-l border-[#262626]">
          {filteredNodes.length} Nodes • {filteredLinks.length} Edges
        </span>
      </div>

      {/* Hover Node Tooltip Card at Bottom Right */}
      {hoveredNode && (
        <div className="absolute bottom-3 right-3 max-w-xs bg-[#0A0A0A]/95 border border-[#262626] backdrop-blur-md p-3 shadow-2xl space-y-1.5 pointer-events-none animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            {hoveredNode.type === "IDEA" && <Lightbulb className="size-3.5 text-accent-gold" />}
            {hoveredNode.type === "NOTE" && <FileText className="size-3.5 text-emerald-400" />}
            {hoveredNode.type === "TAG" && <Tag className="size-3.5 text-purple-400" />}
            {hoveredNode.type === "UNRESOLVED" && <Layers className="size-3.5 text-neutral-400" />}
            <span className="text-xs font-bold text-[#F5F5F5] truncate">{hoveredNode.label}</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#737373] font-mono">
            <span className="uppercase">{hoveredNode.type}</span>
            <span>•</span>
            <span>{hoveredNode.linkCount || 0} Connections</span>
          </div>

          {hoveredNode.data?.note && (
            <p className="text-[11px] text-[#A3A3A3] line-clamp-2 leading-relaxed">
              {hoveredNode.data.note.content}
            </p>
          )}

          {hoveredNode.data?.idea && (
            <p className="text-[11px] text-[#A3A3A3] line-clamp-2 leading-relaxed">
              {hoveredNode.data.idea.description}
            </p>
          )}

          {hoveredNode.type === "NOTE" && (
            <span className="text-[9px] text-accent-gold font-mono block pt-0.5">
              Click node to open note editor →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
