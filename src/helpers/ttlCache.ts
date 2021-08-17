export const ttlCache = <K extends string, V = any>(params: { ttl?: number; maxSize?: number }) => {
  const { ttl = 10000, maxSize = 100 } = params;
  let cache: Record<K, { value: V; expiresAt: number } | undefined> = Object.create(null);
  return {
    set: (key: K, value: V) => {
      const keys = Object.keys(cache) as K[];
      if (maxSize && keys.length === maxSize) {
        delete cache[keys[0]];
      }

      cache[key] = { value, expiresAt: Date.now() + ttl };
    },
    get: (key: K) => {
      const entry = cache[key];
      if (!entry) {
        return undefined;
      }
      if (entry.expiresAt < Date.now()) {
        delete cache[key];
        return undefined;
      }

      return entry.value;
    },
    clear: () => (cache = Object.create(null)),
    delete: (key: K) => delete cache[key],
  };
};
