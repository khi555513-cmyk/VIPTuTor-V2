import React, { useEffect, useRef, useMemo, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
}

declare global {
  interface Window {
    katex: any;
    hljs: any;
  }
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track KaTeX loading state to trigger re-render if script loads late
  const [katexLoaded, setKatexLoaded] = useState(false);

  useEffect(() => {
    // Check if KaTeX is already loaded
    if (window.katex) {
      setKatexLoaded(true);
    } else {
      // Poll for KaTeX since it's deferred
      const interval = setInterval(() => {
        if (window.katex) {
          setKatexLoaded(true);
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  const htmlContent = useMemo(() => {
    // 1. Math Tokenization
    // We replace math with placeholders to prevent 'marked' from destroying LaTeX syntax (e.g., underscores)
    const mathEntries: { placeholder: string; math: string; display: boolean }[] = [];
    let processedContent = content;

    const pushMath = (math: string, display: boolean) => {
      const placeholder = `%%%MATH_PLACEHOLDER_${mathEntries.length}%%%`;
      mathEntries.push({ placeholder, math, display });
      return placeholder;
    };

    // Replace display math $$...$$ and \[...\]
    processedContent = processedContent.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => pushMath(math, true));
    processedContent = processedContent.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => pushMath(math, true));

    // Replace inline math $...$ and \(...\)
    // Note: Regex avoids matching if $ is empty or spans too weirdly, simple greedy is usually ok for simple pairs
    processedContent = processedContent.replace(/\$([^$]+)\$/g, (_, math) => pushMath(math, false));
    processedContent = processedContent.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => pushMath(math, false));

    // 2. Parse Markdown to HTML
    const rawHtml = marked.parse(processedContent, { 
      breaks: true, 
      gfm: true,
      async: false 
    }) as string;

    // 3. Sanitize HTML
    let sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['iframe'], 
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    });

    // 4. Restore Math using KaTeX
    mathEntries.forEach(({ placeholder, math, display }) => {
      let rendered = placeholder;
      
      if (window.katex) {
        try {
          // Use renderToString which is robust against quirks mode and DOM issues
          rendered = window.katex.renderToString(math, {
            displayMode: display,
            throwOnError: false,
            output: 'html' // Outputting HTML is safer than MathML for compatibility
          });
        } catch (e) {
          console.error("KaTeX rendering error:", e);
          rendered = math; // Fallback to source
        }
      } else {
        // Fallback if KaTeX script hasn't loaded yet
        rendered = display ? `$$${math}$$` : `$${math}$`;
      }
      
      // Replace placeholder in the sanitized HTML
      sanitizedHtml = sanitizedHtml.replace(placeholder, rendered);
    });

    return sanitizedHtml;
  }, [content, katexLoaded]);

  // 5. Syntax Highlighting and Link targets
  useEffect(() => {
    if (containerRef.current) {
      // Highlight code blocks
      if (window.hljs) {
        containerRef.current.querySelectorAll('pre code').forEach((block) => {
          window.hljs.highlightElement(block as HTMLElement);
        });
      }

      // Open links in new tab
      containerRef.current.querySelectorAll('a').forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [htmlContent]);

  return (
    <div 
      ref={containerRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;