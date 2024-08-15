export function isCursorInside(
  point: Electron.Point,
  bounds: Electron.Rectangle,
): boolean {
  if (
    point.x > bounds.x &&
    point.x < bounds.x + bounds.width &&
    point.y > bounds.y &&
    point.y < bounds.y + bounds.height
  )
    return true;
  return false;
}
