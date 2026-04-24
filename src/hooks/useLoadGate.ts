/**
 * Legacy nav load gate.
 *
 * The cinematic loader was removed, but `Nav` still reads this hook after the
 * manual rollback. Keep the hook as a stable compatibility shim.
 */
export function useLoadGate(): boolean {
  return true;
}
