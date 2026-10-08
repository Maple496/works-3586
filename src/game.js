var Game = {
  W: 10, H: 20, S: 24,
  grid: [], cur: null, score: 0, over: false, dropAcc: 0, dropMs: 500,
  shapes: [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]]
  ],
  reset: function () {
    this.grid = [];
    for (var r = 0; r < this.H; r++) { this.grid.push(new Array(this.W).fill(0)); }
    this.score = 0; this.over = false; this.dropAcc = 0; this.cur = null; this.spawn();
  },
  spawn: function () {
    var s = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    this.cur = { m: s, x: Math.floor((this.W - s[0].length) / 2), y: 0 };
    if (this.hit(this.cur.m, this.cur.x, this.cur.y)) { this.over = true; }
  },
  hit: function (m, x, y) {
    for (var r = 0; r < m.length; r++) {
      for (var c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        var nx = x + c, ny = y + r;
        if (nx < 0 || nx >= this.W || ny >= this.H) return true;
        if (ny >= 0 && this.grid[ny][nx]) return true;
      }
    }
    return false;
  },
  move: function (dx) {
    if (this.over || !this.cur) return;
    if (!this.hit(this.cur.m, this.cur.x + dx, this.cur.y)) this.cur.x += dx;
  },
  rotate: function () {
    if (this.over || !this.cur) return;
    var m = this.cur.m, rm = [];
    for (var c = 0; c < m[0].length; c++) {
      var row = [];
      for (var r = m.length - 1; r >= 0; r--) row.push(m[r][c]);
      rm.push(row);
    }
    if (!this.hit(rm, this.cur.x, this.cur.y)) this.cur.m = rm;
  },
  update: function (dt) {
    if (this.over || !this.cur) return;
    this.dropAcc += dt;
    if (this.dropAcc < this.dropMs) return;
    this.dropAcc = 0;
    if (!this.hit(this.cur.m, this.cur.x, this.cur.y + 1)) { this.cur.y++; return; }
    this.lock();
  },
  lock: function () {
    var m = this.cur.m, x = this.cur.x, y = this.cur.y;
    for (var r = 0; r < m.length; r++) {
      for (var c = 0; c < m[r].length; c++) {
        if (m[r][c] && y + r >= 0) this.grid[y + r][x + c] = 1;
      }
    }
    this.clearLines();
    this.spawn();
  },
  clearLines: function () {
    var kept = [];
    for (var r = 0; r < this.H; r++) {
      var full = true;
      for (var c = 0; c < this.W; c++) { if (!this.grid[r][c]) { full = false; break; } }
      if (!full) kept.push(this.grid[r]);
    }
    var n = this.H - kept.length;
    this.score += n * 100;
    while (kept.length < this.H) kept.unshift(new Array(this.W).fill(0));
    this.grid = kept;
  }
};
