var canvas = null, g = null, raf = 0;
function loop(ts) {
  if (!loop.last) loop.last = ts;
  var dt = ts - loop.last; loop.last = ts;
  Game.update(dt);
  if (g && canvas) UI.draw(g, canvas.width, canvas.height);
  UI.sync();
  raf = requestAnimationFrame(loop);
}
function mount(ctx) {
  Game.reset();
  canvas = document.createElement('canvas');
  canvas.width = ctx.bounds.w; canvas.height = ctx.bounds.h;
  canvas.style.position = 'absolute'; canvas.style.left = '0'; canvas.style.top = '0';
  ctx.stage.appendChild(canvas);
  g = canvas.getContext('2d');
  ctx.onBounds(function (b) { canvas.width = b.w; canvas.height = b.h; });
  UI.mount(ctx);
  if (typeof ctx.onKey === 'function') {
    ctx.onKey(function (e) {
      if (e.key === 'ArrowLeft') Game.move(-1);
      else if (e.key === 'ArrowRight') Game.move(1);
      else if (e.key === 'ArrowUp') Game.rotate();
      else if (e.key === 'ArrowDown') Game.update(1e6);
    });
  } else {
    mount._onKey = function (e) {
      if (e.key === 'ArrowLeft') Game.move(-1);
      else if (e.key === 'ArrowRight') Game.move(1);
      else if (e.key === 'ArrowUp') Game.rotate();
      else if (e.key === 'ArrowDown') Game.update(1e6);
    };
    document.addEventListener('keydown', mount._onKey);
  }
  raf = requestAnimationFrame(loop);
}
function destroy() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  if (mount._onKey) {
    document.removeEventListener('keydown', mount._onKey);
    mount._onKey = null;
  }
  canvas = null; g = null;
  UI.unmount();
}
Work.register({ name: '触屏俄罗斯方块', mount: mount, destroy: destroy });
