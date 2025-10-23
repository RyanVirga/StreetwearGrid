import { useRef, ReactNode, Children } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollProgressIndicator from "./ScrollProgressIndicator";

interface HorizontalScrollSectionProps {
  children: ReactNode;
}

export default function HorizontalScrollSection({ children }: HorizontalScrollSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const childCount = Children.count(children);
  const endTranslation = `${-(childCount - 1) * 100}%`;
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", endTranslation]);

  return (
    <section ref={targetRef} className="relative h-[500vh]">
      <ScrollProgressIndicator scrollProgress={scrollYProgress} />
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex h-full items-center"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
