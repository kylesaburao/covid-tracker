const storage = window.localStorage;

export function store(key, item, ttl = 1000 * 60) {
  const time = Date.now() + ttl;
  const data = { item: item, expiration: time };

  storage.setItem(key, JSON.stringify(data));
  console.log('Storing', key);
}

export function get(key) {
  const data = storage.getItem(key);

  if (!data) {
    return undefined;
  }

  const now = Date.now();
  const object = JSON.parse(data);

  if (object.expiration < now) {
    storage.removeItem(key);
    return undefined;
  }

  console.log('Cache hit', key);
  return object.item;
}
