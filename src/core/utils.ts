export const sleep = <T>(ctx: T, ms: number, deviation: number = 1) =>
  new Promise<T>((resolve) =>
    setTimeout(() => resolve(ctx), (Math.random() * deviation + 1) * ms)
  );
