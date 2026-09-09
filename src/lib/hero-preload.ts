export async function preloadHeroVideos(
  videos: HTMLVideoElement[],
  signal: AbortSignal,
) {
  const controller = new AbortController();
  const combined = AbortSignal.any([signal, controller.signal]);
  const urls: string[] = [];
  const timeout = window.setTimeout(() => controller.abort(), 60000);
  const dispose = () => {
    for (const url of urls) URL.revokeObjectURL(url);
  };
  try {
    await Promise.all(
      videos.map(async (video) => {
        const response = await fetch(video.dataset.src!, { signal: combined });
        if (!response.ok)
          throw new Error(`Hero video: HTTP ${response.status}`);
        const blob = await response.blob();
        combined.throwIfAborted();
        const url = URL.createObjectURL(blob);
        urls.push(url);
        // Fetch the entire file before assigning it: preload="auto" alone is a hint.
        await new Promise<void>((resolve, reject) => {
          const cleanup = () => {
            video.removeEventListener('canplay', ready);
            video.removeEventListener('error', error);
            combined.removeEventListener('abort', aborted);
          };
          const ready = () => {
            cleanup();
            resolve();
          };
          const error = () => {
            cleanup();
            reject(new Error('Hero video decode failed'));
          };
          const aborted = () => {
            cleanup();
            reject(combined.reason);
          };
          video.addEventListener('canplay', ready, { once: true });
          video.addEventListener('error', error, { once: true });
          combined.addEventListener('abort', aborted, { once: true });
          video.muted = true;
          video.preload = 'auto';
          video.src = url;
          video.load();
        });
      }),
    );
    signal.addEventListener('abort', dispose, { once: true });
  } catch (error) {
    controller.abort();
    dispose();
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
