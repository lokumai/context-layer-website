"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface TerminalTypeProps {
  /** Ordered list of lines to type. Prefix with `$ ` for commands. */
  lines: readonly string[];
  /** Typing speed (ms per character). */
  speed?: number;
  /** Pause between lines (ms). */
  linePause?: number;
  className?: string;
}

export function TerminalType({
  lines,
  speed = 26,
  linePause = 500,
  className,
}: TerminalTypeProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay([...lines]);
      return;
    }
    if (currentLine >= lines.length) return;
    const fullLine = lines[currentLine];
    if (currentChar < fullLine.length) {
      const t = setTimeout(() => {
        setDisplay((prev) => {
          const next = [...prev];
          next[currentLine] = fullLine.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar((v) => v + 1);
      }, speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCurrentLine((v) => v + 1);
      setCurrentChar(0);
    }, linePause);
    return () => clearTimeout(t);
  }, [currentLine, currentChar, lines, speed, linePause, reduceMotion]);

  return (
    <pre
      className={`text-code bg-[#0a0a0a] text-white rounded-card p-5 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {display.map((line, i) => (
        <div key={`terminal-line-${i}`} className="whitespace-pre-wrap break-words">
          {line?.startsWith("$ ") ? <span className="text-[#89d185]">$ </span> : null}
          <span>{line?.startsWith("$ ") ? line.slice(2) : line}</span>
          {i === currentLine && !reduceMotion ? (
            <motion.span
              aria-hidden
              className="inline-block w-[0.5ch] h-[1em] bg-white align-[-0.15em] ml-[1px]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY }}
            />
          ) : null}
        </div>
      ))}
    </pre>
  );
}
