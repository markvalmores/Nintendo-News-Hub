import { useState, useEffect } from "react";
import { GamepadButtonState, GamepadStatus } from "../types";

export function useGamepad(onAction?: (action: string) => void) {
  const [gamepadState, setGamepadState] = useState<GamepadStatus>({
    connected: false,
    id: "",
    isJoycon: false,
    isJoycon1: false,
    isJoycon2: false,
    buttons: {
      a: false,
      b: false,
      x: false,
      y: false,
      dpadUp: false,
      dpadDown: false,
      dpadLeft: false,
      dpadRight: false,
      l: false,
      r: false,
      zl: false,
      zr: false,
      plus: false,
      minus: false,
      home: false,
      capture: false,
      leftStickPress: false,
      rightStickPress: false,
    },
    axes: [0, 0, 0, 0],
  });

  useEffect(() => {
    let animFrame: number;
    let prevButtons: Partial<GamepadButtonState> = {};
    let lastNavTime = 0;

    const checkGamepads = () => {
      if (typeof navigator === "undefined" || !navigator.getGamepads) return;

      const gamepads = navigator.getGamepads();
      let activePad: Gamepad | null = null;

      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && gamepads[i]!.connected) {
          activePad = gamepads[i];
          break;
        }
      }

      if (activePad) {
        const idLower = (activePad.id || "").toLowerCase();
        const isJoyconL = idLower.includes("joy-con (l)") || idLower.includes("joy-con l");
        const isJoyconR = idLower.includes("joy-con (r)") || idLower.includes("joy-con r");
        const isJoycon = isJoyconL || isJoyconR || idLower.includes("joy-con") || idLower.includes("joycon");
        const isJoycon1 = isJoycon && (isJoyconL || isJoyconR || idLower.includes("057e")); // 057e is Nintendo vendor ID

        const rawButtons = activePad.buttons;
        const b = (idx: number) => (rawButtons[idx] ? rawButtons[idx].pressed : false);

        // Map buttons according to standard Nintendo layout vs standard x-input
        const currentButtons: GamepadButtonState = {
          // Standard mapping: index 0 = B or A depending on browser mapping
          b: b(0),
          a: b(1),
          y: b(2),
          x: b(3),
          l: b(4),
          r: b(5),
          zl: b(6) || (activePad.axes[2] !== undefined && activePad.axes[2] > 0.5),
          zr: b(7) || (activePad.axes[5] !== undefined && activePad.axes[5] > 0.5),
          minus: b(8),
          plus: b(9),
          leftStickPress: b(10),
          rightStickPress: b(11),
          dpadUp: b(12),
          dpadDown: b(13),
          dpadLeft: b(14),
          dpadRight: b(15),
          home: b(16),
          capture: b(17),
        };

        const lx = activePad.axes[0] || 0;
        const ly = activePad.axes[1] || 0;
        const rx = activePad.axes[2] || 0;
        const ry = activePad.axes[3] || 0;

        // Threshold for joystick navigation
        const now = Date.now();
        if (now - lastNavTime > 220 && onAction) {
          if (currentButtons.dpadDown || ly > 0.5) {
            onAction("NAV_DOWN");
            lastNavTime = now;
          } else if (currentButtons.dpadUp || ly < -0.5) {
            onAction("NAV_UP");
            lastNavTime = now;
          } else if (currentButtons.dpadRight || lx > 0.5) {
            onAction("NAV_RIGHT");
            lastNavTime = now;
          } else if (currentButtons.dpadLeft || lx < -0.5) {
            onAction("NAV_LEFT");
            lastNavTime = now;
          } else if (currentButtons.a && !prevButtons.a) {
            onAction("SELECT_A");
            lastNavTime = now;
          } else if (currentButtons.b && !prevButtons.b) {
            onAction("BACK_B");
            lastNavTime = now;
          } else if (currentButtons.x && !prevButtons.x) {
            onAction("ACTION_X");
            lastNavTime = now;
          } else if (currentButtons.y && !prevButtons.y) {
            onAction("FILTER_Y");
            lastNavTime = now;
          } else if (currentButtons.l && !prevButtons.l) {
            onAction("PREV_TAB");
            lastNavTime = now;
          } else if (currentButtons.r && !prevButtons.r) {
            onAction("NEXT_TAB");
            lastNavTime = now;
          } else if (currentButtons.zl && !prevButtons.zl) {
            onAction("TOGGLE_MODE_PREV");
            lastNavTime = now;
          } else if (currentButtons.zr && !prevButtons.zr) {
            onAction("TOGGLE_MODE_NEXT");
            lastNavTime = now;
          } else if (currentButtons.plus && !prevButtons.plus) {
            onAction("TOGGLE_SETTINGS");
            lastNavTime = now;
          }
        }

        prevButtons = currentButtons;

        setGamepadState({
          connected: true,
          id: activePad.id || "Gamepad",
          isJoycon,
          isJoycon1,
          isJoycon2: isJoycon,
          buttons: currentButtons,
          axes: [lx, ly, rx, ry],
        });
      } else {
        setGamepadState(prev => (prev.connected ? { ...prev, connected: false } : prev));
      }

      animFrame = requestAnimationFrame(checkGamepads);
    };

    animFrame = requestAnimationFrame(checkGamepads);

    const onGamepadConn = () => checkGamepads();
    const onGamepadDisconn = () => checkGamepads();

    window.addEventListener("gamepadconnected", onGamepadConn);
    window.addEventListener("gamepaddisconnected", onGamepadDisconn);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("gamepadconnected", onGamepadConn);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconn);
    };
  }, [onAction]);

  return gamepadState;
}
