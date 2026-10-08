var UI = {
  panel: null, scoreEl: null, overEl: null, overScoreEl: null, tipEl: null, bound: false,
  draw: function (g, w, h) {
    g.clearRect(0, 0, w, h);
    var s = Game.S, ox = Math.floor((w - Game.W * s) / 2), oy = Math.floor((h - Game.H * s) / 2);
    if (oy < 40) oy = 40;
    g.fillStyle = '#12151c'; g.fillRect(ox, oy, Game.W * s, Game.H * s);
    g.strokeStyle = '#2a2f3a';
    for (var r = 0; r < Game.H; r++) {
      for (var c = 0; c < Game.W; c++) {
        g.strokeRect(ox + c * s, oy + r * s, s, s);
        if (Game.grid[r][c]) { g.fillStyle = '#4fd1c5'; g.fillRect(ox + c * s + 2, oy + r * s + 2, s - 4, s - 4); }
      }
    }
    if (Game.cur) {
      var m = Game.cur.m;
      g.fillStyle = '#f6ad55';
      for (var r2 = 0; r2 < m.length; r2++) {
        for (var c2 = 0; c2 < m[r2].length; c2++) {
          if (m[r2][c2]) g.fillRect(ox + (Game.cur.x + c2) * s + 2, oy + (Game.cur.y + r2) * s + 2, s - 4, s - 4);
        }
      }
    }
    g.strokeStyle = '#4a5568'; g.strokeRect(ox, oy, Game.W * s, Game.H * s);
  },
  mount: function (ctx) {
    var panel = document.createElement('div');
    panel.style.position = 'absolute'; panel.style.left = '0'; panel.style.top = '0';
    panel.style.width = '100%'; panel.style.height = '100%'; panel.style.pointerEvents = 'none';
    var score = document.createElement('div');
    score.style.cssText = 'position:absolute;top:8px;left:12px;color:#e2e8f0;font:14px sans-serif';
    panel.appendChild(score);
    var tip = document.createElement('div');
    tip.style.cssText = 'position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);color:#a0aec0;font:14px sans-serif;text-align:center;white-space:nowrap';
    tip.textContent = '键盘方向键或下方按钮操作 · 点击/触摸屏幕开始';
    panel.appendChild(tip);
    var over = document.createElement('div');
    over.style.cssText = 'position:absolute;left:50%;top:34%;transform:translate(-50%,-50%);color:#fc8181;font:bold 24px sans-serif;display:none;text-align:center';
    over.textContent = 'Game Over';
    panel.appendChild(over);
    var overScore = document.createElement('div');
    overScore.style.cssText = 'position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);color:#e2e8f0;font:16px sans-serif;display:none';
    panel.appendChild(overScore);
    var bar = document.createElement('div');
    bar.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:10px;pointer-events:auto';
    var self = this;
    [['◀', function () { Game.move(-1); }], ['▶', function () { Game.move(1); }], ['⟳', function () { Game.rotate(); }], ['▼', function () { Game.update(1e6); }], ['↻', function () { Game.reset(); self.hideTip(); }]].forEach(function (b) {
      var btn = document.createElement('button');
      btn.textContent = b[0];
      btn.style.cssText = 'width:52px;height:44px;font:18px sans-serif;border-radius:8px;border:1px solid #4a5568;background:#1a202c;color:#e2e8f0';
      btn.addEventListener('click', b[1]);
      bar.appendChild(btn);
    });
    panel.appendChild(bar);
    ctx.stage.appendChild(panel);
    this.panel = panel; this.scoreEl = score; this.overEl = over; this.overScoreEl = overScore; this.tipEl = tip;
    var start = function () { self.hideTip(); };
    ctx.stage.addEventListener('pointerdown', start);
    this._startHandler = start; this._stage = ctx.stage;
  },
  hideTip: function () {
    if (this.tipEl) this.tipEl.style.display = 'none';
  },
  sync: function () {
    if (this.scoreEl) this.scoreEl.textContent = '分数: ' + Game.score;
    if (this.overEl) this.overEl.style.display = Game.over ? 'block' : 'none';
    if (this.overScoreEl) {
      this.overScoreEl.textContent = Game.over ? '最终分数: ' + Game.score + '（点 ↻ 重新开始）' : '';
      this.overScoreEl.style.display = Game.over ? 'block' : 'none';
    }
  },
  unmount: function () {
    if (this._startHandler && this._stage) this._stage.removeEventListener('pointerdown', this._startHandler);
    this._startHandler = null; this._stage = null;
    if (this.panel && this.panel.parentNode) this.panel.parentNode.removeChild(this.panel);
    this.panel = null; this.scoreEl = null; this.overEl = null; this.overScoreEl = null; this.tipEl = null;
  }
};
