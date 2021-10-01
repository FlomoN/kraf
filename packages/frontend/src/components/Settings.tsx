import react, { useState } from "react";
import "./settings.sass";
import UseAnimations from "react-useanimations";
import menu2 from "react-useanimations/lib/menu2";
import { useSpring, animated } from "react-spring";

//TODO: Add burger icon from react-useanimations
export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const animatedProps = useSpring({
    from: {
      width: 30,
      height: 30,
    },
    to: {
      width: menuOpen ? 400 : 30,
      height: menuOpen ? 800 : 30,
    },
  });

  return (
    <animated.div className="settings" style={animatedProps}>
      <UseAnimations
        animation={menu2}
        size={30}
        strokeColor="white"
        reverse={menuOpen}
        wrapperStyle={{ cursor: "pointer" }}
        onClick={() => setMenuOpen(!menuOpen)}
      />
    </animated.div>
  );
}
