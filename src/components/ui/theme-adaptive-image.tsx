import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ThemeAdaptiveImageProps
  extends Omit<ImageProps, "src" | "alt"> {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  containerClassName?: string;
  priority?: boolean;
}

/**
 * Renders theme-adaptive images using zero-layout-shift CSS media selectors.
 * Both light and dark variants are rendered in markup with `block dark:hidden`
 * and `hidden dark:block` to eliminate hydration mismatch and theme toggle flashes.
 */
export function ThemeAdaptiveImage({
  lightSrc,
  darkSrc,
  alt,
  className,
  containerClassName,
  priority = false,
  ...props
}: ThemeAdaptiveImageProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        {...props}
        src={lightSrc}
        alt={`${alt} (light mode)`}
        priority={priority}
        className={cn("block dark:hidden", className)}
      />
      <Image
        {...props}
        src={darkSrc}
        alt={`${alt} (dark mode)`}
        priority={priority}
        className={cn("hidden dark:block", className)}
      />
    </div>
  );
}
