import react, { useState } from "react";
import "./settings.sass";
import UseAnimations from "react-useanimations";
import menu2 from "react-useanimations/lib/menu2";
import { useSpring, animated } from "react-spring";
import { useStore } from "../../util/store";

//TODO: Add burger icon from react-useanimations
export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const types = useStore((state: any) => state.nodeTypes);
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
      {menuOpen && (
        <div>
          <h2>Settings</h2>
          <h3>Elements</h3>
          <div>
            {/*
             * List of types -> saved in zustand -> extracted from query
             * list elements = own component with color circle in front and behavior
             * zustand save current selection settings and apply to forcegraph
             */}
            {types.map((elem) => (
              <p key={elem}>{elem}</p>
            ))}
          </div>
        </div>
      )}
    </animated.div>
  );
}
