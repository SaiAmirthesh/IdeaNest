import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ObsidianMarkdownRendererProps {
  content: string;
  onWikiLinkClick?: (targetTitle: string) => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function ObsidianMarkdownRenderer({
  content,
  onWikiLinkClick,
  onTagClick,
  className = "",
}: ObsidianMarkdownRendererProps) {
  // Pre-process content to transform [[WikiLinks]] and #tags into custom link schemes
  const processedContent = useMemo(() => {
    if (!content) return "";

    // Replace [[Note Title]] or [[Note Title|Alias]] with [Alias](wikilink:Note%20Title)
    let processed = content.replace(/\[\[([^[\]]+)\]\]/g, (_match, raw) => {
      const parts = raw.split("|");
      const target = parts[0]?.trim() || "";
      const alias = parts[1]?.trim() || target;
      return `[${alias}](wikilink:${encodeURIComponent(target)})`;
    });

    // Replace #tag (when not inside code or headings) with [#tag](tag:tag)
    processed = processed.replace(
      /(^|\s)#([a-zA-Z0-9_\-/]+)(?=\s|$|[.,;:!?])/g,
      (_match, prefix, tag) => {
        return `${prefix}[#${tag}](tag:${encodeURIComponent(tag)})`;
      }
    );

    return processed;
  }, [content]);

  return (
    <div className={`prose prose-invert max-w-none text-[#E5E5E5] font-sans ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // H1 Banner (Styled matching the screenshot's top teal banner)
          h1: ({ children }) => (
            <h1 className="bg-[#0e4b50] text-[#E6FFFA] font-bold text-xl sm:text-2xl px-3 py-1.5 rounded-none mt-6 mb-4 tracking-tight shadow-sm">
              {children}
            </h1>
          ),
          // H2 Banner (Styled matching the screenshot's emerald/teal section header)
          h2: ({ children }) => (
            <h2 className="bg-[#00875A] text-[#F0FFF4] font-bold text-lg sm:text-xl px-3 py-1.5 rounded-none mt-6 mb-3 tracking-tight shadow-sm">
              {children}
            </h2>
          ),
          // H3 Banner (Subtle dark emerald)
          h3: ({ children }) => (
            <h3 className="bg-[#0B3D2E] text-[#68D391] font-semibold text-base px-2.5 py-1 rounded-none mt-5 mb-2.5 tracking-tight border-l-2 border-[#38A169]">
              {children}
            </h3>
          ),
          // Paragraphs with relaxed leading
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-[#D4D4D4] my-2 font-normal">
              {children}
            </p>
          ),
          // Bullet lists matching the screenshot with round dot markers
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 text-sm text-[#D4D4D4] my-2 pl-1 marker:text-[#737373]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#D4D4D4] my-2 pl-1 marker:text-accent-gold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed text-[#D4D4D4]">
              {children}
            </li>
          ),
          // Links: Check if it's a wikilink (green underline like the user's screenshot) or tag
          a: ({ href, children }) => {
            if (href?.startsWith("wikilink:")) {
              const targetTitle = decodeURIComponent(href.replace("wikilink:", ""));
              return (
                <button
                  type="button"
                  onClick={() => onWikiLinkClick?.(targetTitle)}
                  className="inline-flex items-center text-[#2ecc71] hover:text-[#48bb78] underline underline-offset-4 decoration-[#2ecc71]/60 hover:decoration-[#48bb78] font-medium transition-colors cursor-pointer bg-[#2ecc71]/10 px-1.5 py-0.5 rounded-none mx-0.5"
                  title={`Open note [[${targetTitle}]]`}
                >
                  {children}
                </button>
              );
            }
            if (href?.startsWith("tag:")) {
              const tag = decodeURIComponent(href.replace("tag:", ""));
              return (
                <button
                  type="button"
                  onClick={() => onTagClick?.(tag)}
                  className="inline-flex items-center text-[#9F7AEA] hover:text-[#B794F4] font-mono text-xs bg-[#211832] border border-[#3C285A] px-1.5 py-0.5 rounded-none mx-0.5 cursor-pointer"
                  title={`Filter #${tag}`}
                >
                  {children}
                </button>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#63B3ED] hover:underline underline-offset-4 font-medium"
              >
                {children}
              </a>
            );
          },
          // Code inline
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-[#1C1C1C] border border-[#262626] text-[#E5C887] font-mono text-xs px-1.5 py-0.5 rounded-none mx-0.5">
                  {children}
                </code>
              );
            }
            return (
              <div className="bg-[#0E0E0E] border border-[#262626] rounded-none p-3.5 my-3 overflow-x-auto font-mono text-xs text-[#F5F5F5] leading-relaxed">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            );
          },
          // Blockquotes / Callouts
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-gold bg-[#111111]/80 text-[#D4D4D4] pl-4 py-2 my-3 italic text-sm">
              {children}
            </blockquote>
          ),
          // Horizontal Rules
          hr: () => <hr className="border-[#262626] my-6" />,
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-[#262626]">
              <table className="w-full text-xs text-left divide-y divide-[#262626]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#161616] text-[#F5F5F5] font-mono uppercase font-semibold">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="px-3 py-2">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border-t border-[#262626]/60">{children}</td>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
