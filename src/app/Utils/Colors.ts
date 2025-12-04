const Colors = {
  // Brand
  primary: import.meta.env.VITE_COLOR_PRIMARY || "#fae74d",
  primaryLight: import.meta.env.VITE_COLOR_PRIMARY_LIGHT || "#fff27a",
  primaryDark: import.meta.env.VITE_COLOR_PRIMARY_DARK || "#c4b533",

  secondary: import.meta.env.VITE_COLOR_SECONDARY || "#4d9dfa",
  secondaryLight: import.meta.env.VITE_COLOR_SECONDARY_LIGHT || "#80bbff",
  secondaryDark: import.meta.env.VITE_COLOR_SECONDARY_DARK || "#2f6eb2",

  // Neutrals (dark mode backgrounds)
  background: import.meta.env.VITE_COLOR_BACKGROUND || "#121212", // main app background
  backgroundAlt: import.meta.env.VITE_COLOR_BACKGROUND_ALT || "#2b2b2bff", // secondary background (sidebars, panels)
  surface: import.meta.env.VITE_COLOR_SURFACE || "#1e1e1e", // cards, modals
  surfaceAlt: import.meta.env.VITE_COLOR_SURFACE_ALT || "#242424", // elevated card / popover
  inputBackground: import.meta.env.VITE_COLOR_INPUT_BACKGROUND || "#2a2a2a", // input fields
  overlay: import.meta.env.VITE_COLOR_OVERLAY || "rgba(0,0,0,0.6)", // modal overlay

  // Text
  text: import.meta.env.VITE_COLOR_TEXT || "#f5f5f5", // primary text
  textLight: import.meta.env.VITE_COLOR_TEXT_LIGHT || "#aaaaaa", // secondary text
  textMuted: import.meta.env.VITE_COLOR_TEXT_MUTED || "#777777", // disabled/less important

  // Borders
  borderLight: import.meta.env.VITE_COLOR_BORDER_LIGHT || "#2a2a2a",
  border: import.meta.env.VITE_COLOR_BORDER || "#3d3d3d",
  borderDark: import.meta.env.VITE_COLOR_BORDER_DARK || "#5a5a5a",
  borderFocus: import.meta.env.VITE_COLOR_BORDER_FOCUS || "#4d9dfa",
  borderError: import.meta.env.VITE_COLOR_BORDER_ERROR || "#f44336",
  borderSuccess: import.meta.env.VITE_COLOR_BORDER_SUCCESS || "#4caf50",

  // Status
  success: import.meta.env.VITE_COLOR_SUCCESS || "#4caf50",
  warning: import.meta.env.VITE_COLOR_WARNING || "#ffb74d",
  error: import.meta.env.VITE_COLOR_ERROR || "#ef5350",
  info: import.meta.env.VITE_COLOR_INFO || "#29b6f6",

  // Utility
  black: import.meta.env.VITE_COLOR_BLACK || "#000000",
  white: import.meta.env.VITE_COLOR_WHITE || "#ffffff",
};
export default Colors;
