function canVibrate(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function hapticLight() {
  if (canVibrate()) navigator.vibrate(10);
}

export function hapticMedium() {
  if (canVibrate()) navigator.vibrate([20, 30, 20]);
}
