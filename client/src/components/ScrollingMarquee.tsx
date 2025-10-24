import { motion } from "framer-motion";

interface ScrollingMarqueeProps {
  text: string;
}

export default function ScrollingMarquee({ text }: ScrollingMarqueeProps) {
  return (
    <div className="absolute top-8 left-0 w-full overflow-hidden pointer-events-none z-30">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        <span className="text-6xl md:text-8xl lg:text-9xl font-bold italic text-white/10 uppercase tracking-wider">
          {text} // {text} // {text} // {text}
        </span>
      </motion.div>
    </div>
  );
}
