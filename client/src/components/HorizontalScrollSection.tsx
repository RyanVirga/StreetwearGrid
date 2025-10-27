import { useRef, ReactNode, ReactElement, cloneElement, Children, useMemo } from "react";
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

  // Clone children with global scroll progress and their index
  // Each child can create its own transform without violating hooks rules
  const childrenWithProps = useMemo(() => {
    return Children.map(children, (child, index) => {
      if (!child || typeof child !== 'object' || !('props' in child)) {
        return child;
      }

      return cloneElement(child as ReactElement, {
        scrollProgress: scrollYProgress,
        productIndex: index,
        totalProducts: childCount,
      });
    });
  }, [children, scrollYProgress, childCount]);

  return (
    <section ref={targetRef} className="relative h-[500vh]">
      <ScrollProgressIndicator scrollProgress={scrollYProgress} />
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex h-full items-center"
        >
          {childrenWithProps}
        </motion.div>
      </div>
    </section>
  );
}
