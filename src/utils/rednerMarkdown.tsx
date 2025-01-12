import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Custom styles for links and code blocks
const RenderMarkdown = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {children}
          </a>
        ),
        //@ts-expect-error:ex
        code: ({
          inline,
          className,
          children,
        }: {
          inline?: boolean;
          className?: string;
          children: React.ReactNode;
        }) => {
          return inline ? (
            <code
              className={`bg-gray-200 rounded p-1 overflow-x-scroll ${className}`}
            >
              {children}
            </code>
          ) : (
            <pre className="bg-gray-800 text-white  p-3 rounded-md overflow-x-scroll">
              <code>{children}</code>
            </pre>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
