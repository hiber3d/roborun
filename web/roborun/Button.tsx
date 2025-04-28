import { ComponentProps } from "react";

export const Button = (props: ComponentProps<"button">) => (
  <div
    className="h-[0px]"
    style={{
      borderImageSource: "url(ui/menus/ButtonA.webp)",
      borderImageSlice: "50% 300",
      borderImageRepeat: "repeat",
      borderWidth: "40px 50px",
    }}
  >
    <button className="px-8 -mt-[40px] top-[-1px] relative font-roborun text-5xl text-roborun -mx-[40px]" {...props} />
  </div>
);
