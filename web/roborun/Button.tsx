import { useAudio } from "audio/useAudio";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({ children, className, ...props }: ComponentProps<"button">) => {
  const { sfx } = useAudio();

  return (
    <button
      className={twMerge("h-[80px] relative block roborun-button", className)}
      {...props}
      onPointerDown={() => sfx.play("buttonpress")}
    >
      <div
        className="absolute w-full top-0 left-0"
        style={{
          borderImageSource: "url(ui/menus/ButtonA.webp)",
          borderImageSlice: "50% 300",
          borderImageRepeat: "repeat",
          borderWidth: "40px 50px",
        }}
      />
      <div className="relative mx-[35px] top-[1px] font-roborun text-5xl text-roborun text-center">{children}</div>
    </button>
  );
};
