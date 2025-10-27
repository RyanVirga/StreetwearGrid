import { useRef, ReactNode, ReactElement, cloneElement, Children } from "react";
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

  // Calculate individual scroll progress for each child
  const childrenWithProps = Children.map(children, (child, index) => {
    if (!child || typeof child !== 'object' || !('props' in child)) {
      return child;
    }

    // Calculate this product's scroll progress
    // Each product gets 1/childCount of the total scroll
    const startProgress = index / childCount;
    const endProgress = (index + 1) / childCount;
    
    // Create a transform that goes from 0 to 1 for this specific product
    const productScrollProgress = useTransform(
      scrollYProgress,
      [startProgress, endProgress],
      [0, 1]
    );

    return cloneElement(child as ReactElement, {
      scrollProgress: productScrollProgress,
    });
  });

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
