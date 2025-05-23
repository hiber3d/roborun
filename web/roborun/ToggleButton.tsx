import { useAudio } from "audio/useAudio";
import { ReactNode } from "react";

export const ToggleButton = ({
  minimal = false,
  onClick,
  children,
}: {
  minimal?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => {
  const { sfx } = useAudio();

  return (
    <div
      className="pointer-events-auto flex flex-col gap-2 text-roborun shrink-0 roborun-button"
      style={
        minimal
          ? { color: "white" }
          : {
              aspectRatio: "1.208",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: "url(ui/menus/ButtonB.webp)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
      }
      onClick={onClick}
      onPointerDown={() => sfx.play("buttonpress")}
    >
      {children}
    </div>
  );
};
