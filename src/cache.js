// Cache for data from GitHub and PyPI.
// - Fresh entry: returned as is.
// - Old entry: returned at once, and refreshed in the background.
// - Refresh failed: the old entry keeps being served, so a GitHub hiccup never breaks the cards.
// Entries are saved to disk, so a restart does not start from zero.
import fs from 'node:fs';
import path from 'node:path';

const MAX_ENTRIES = 2000;

export class Cache {
  constructor(file) {
    this.file = file;
    this.map = new Map();
    this.inflight = new Map();
    this.saveTimer = null;
    if (file) {
      try {
        const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
        for (const [k, v] of Object.entries(saved)) this.map.set(k, v);
      } catch { /* no saved cache yet */ }
    }
  }

  /** Returns cached value for `key`, calling `load()` when missing or older than `ttl` ms. */
  async get(key, ttl, load) {
    const hit = this.map.get(key);
    const now = Date.now();
    if (hit && now - hit.at < ttl) return hit.value;
    if (hit) {
      this.refresh(key, load).catch(() => {});
      return hit.value;
    }
    return this.refresh(key, load);
  }

  refresh(key, load) {
    if (this.inflight.has(key)) return this.inflight.get(key);
    const p = (async () => {
      try {
        const value = await load();
        this.map.delete(key);
        this.map.set(key, { at: Date.now(), value });
        while (this.map.size > MAX_ENTRIES) this.map.delete(this.map.keys().next().value);
        this.scheduleSave();
        return value;
      } finally {
        this.inflight.delete(key);
      }
    })();
    this.inflight.set(key, p);
    return p;
  }

  scheduleSave() {
    if (!this.file || this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      try {
        fs.mkdirSync(path.dirname(this.file), { recursive: true });
        const tmp = this.file + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(Object.fromEntries(this.map)));
        fs.renameSync(tmp, this.file);
      } catch (e) {
        console.error('cache save failed:', e.message);
      }
    }, 5000);
    this.saveTimer.unref?.();
  }
}
