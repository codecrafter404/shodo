
export enum PrintMode {
  pdf = "pdf",
  paper = "paper",
}

export function get_current_print_mode(): PrintMode {
  let ls = localStorage.getItem("print_mode");
  let current_print_mode: PrintMode = PrintMode.pdf;
  if (ls !== null) {

    current_print_mode = ls as PrintMode;
  }
  return current_print_mode;
}
function set_print_mode(print_mode: PrintMode) {
  localStorage.setItem("print_mode", print_mode.toString());
}
export function apply_print_mode() {
  let to_remove = Object.entries(PrintMode).map((x) => x[1]);
  to_remove.forEach((x) => {
    document.documentElement.classList.remove(x);
  });
  let current = get_current_print_mode();
  document.documentElement.classList.add(current);
}

export function alternate_print_modes(): PrintMode {
  let current_print_mode = get_current_print_mode();
  let modes = [PrintMode.paper, PrintMode.pdf];
  let cidx = modes.findIndex((x) => x == current_print_mode);
  if (cidx + 1 >= modes.length) {
    cidx = 0;
  } else {
    cidx++;
  }
  current_print_mode = modes[cidx];
  set_print_mode(current_print_mode);
  return current_print_mode;
}
