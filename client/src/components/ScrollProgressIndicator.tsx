import { useTransform, motion, MotionValue } from "framer-motion";

interface ScrollProgressIndicatorProps {
  scrollProgress: MotionValue<number>;
}

export default function ScrollProgressIndicator({ scrollProgress }: ScrollProgressIndicatorProps) {
  const circumference = 126;
  const strokeDashoffset = useTransform(scrollProgress, [0, 1], [circumference, 0]);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted-foreground/30"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-foreground" />
        </div>
      </div>
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Scroll
      </span>
    </div>
  );
}
