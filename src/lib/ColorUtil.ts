export function apply_color_scheme() {
  let ls = localStorage.getItem("color_scheme");
  if (ls !== null) {
    switch (ls.trim()) {
      case "dark":
        document.documentElement?.classList.add("dark")
        console.debug("selected dark color scheme");
        return;
      case "light":
        console.debug("selected light color scheme");
        document.documentElement?.classList.remove("dark");
        return;
      default:
        break;
    }
  }

  console.debug("Defaulting to system color scheme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement?.classList.add("dark")
  }
}
export function is_darkmode(): boolean {
  return document.documentElement?.classList.contains("dark");
}
export function switch_darkmode(): boolean {
  let state = is_darkmode();
  state = !state;
  localStorage.setItem("color_scheme", state ? "dark" : "light");
  return state;
}