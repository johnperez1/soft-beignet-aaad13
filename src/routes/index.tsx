import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: GamePage,
});

function GamePage() {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const script = document.createElement("script");
    script.textContent = GAME_SCRIPT;
    document.body.appendChild(script);

    return () => {
      if ((window as any).game) {
        clearInterval((window as any).game.gameLoopInterval);
        (window as any).game = null;
      }
    };
  }, []);

  return (
    <>
      <style>{GAME_STYLES}</style>
      <div
        id="game-container"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />
      <div id="ui-overlay">
        <div className="glitch">✦ PIONEER_FIELDS_OS v1.0 ✦</div>
        <div id="stats">
          👤 <span id="player-name">Loading...</span>
          <br />
          🫐 <span id="berries">0</span> Berries | 🌱 <span id="seeds">0</span>{" "}
          Seeds
          <br />
          ⭐ Reputation: <span id="reputation">0</span> | 📊 Trades:{" "}
          <span id="trades">0</span>
        </div>
      </div>
      <div className="control-panel">
        <button onClick={() => (window as any).game?.showInventory()}>
          📦 INVENTORY
        </button>
        <button onClick={() => (window as any).game?.showMarketplace()}>
          🛒 MARKET
        </button>
        <button onClick={() => (window as any).game?.showNearbyPlayers()}>
          👥 NEARBY (0)
        </button>
      </div>
    </>
  );
}

const GAME_STYLES = `
  #game-container canvas { display: block; cursor: crosshair; }
  #ui-overlay {
    position: fixed; top: 20px; left: 20px; z-index: 2;
    background: rgba(0,0,0,0.9); padding: 15px 20px;
    border: 2px solid #00ff88; border-radius: 10px;
    backdrop-filter: blur(10px); pointer-events: none;
    box-shadow: 0 0 20px rgba(0,255,136,0.3);
    animation: glowPulse 2s infinite;
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 20px rgba(0,255,136,0.3); }
    50% { box-shadow: 0 0 40px rgba(0,255,136,0.6); }
  }
  .glitch {
    color: #00ff88; text-shadow: 2px 2px 0 #ff00ff, -2px -2px 0 #00ffff;
    font-size: 14px; letter-spacing: 2px; margin-bottom: 8px;
    animation: glitch 3s infinite; font-family: monospace;
  }
  @keyframes glitch {
    0%,100% { transform: skew(0deg); }
    95% { transform: skew(0deg); }
    96% { transform: skew(2deg); }
    97% { transform: skew(-2deg); }
    98% { transform: skew(1deg); }
    99% { transform: skew(-1deg); }
  }
  #stats { color: #0ff; font-size: 11px; font-weight: bold; line-height: 1.5; font-family: monospace; }
  #stats span { color: #ff00ff; }
  .control-panel {
    position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 2;
    display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; pointer-events: none;
  }
  .control-panel button {
    pointer-events: auto;
    background: linear-gradient(135deg, #00ff88, #00cc66);
    color: #000; border: none; padding: 12px 24px; font-weight: bold;
    font-family: monospace; font-size: 14px; cursor: pointer; border-radius: 8px;
    transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px;
    box-shadow: 0 0 15px rgba(0,255,136,0.5);
  }
  .control-panel button:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(0,255,136,0.8); }
  .control-panel button:active { transform: translateY(0); }
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.95); z-index: 1000;
    display: flex; justify-content: center; align-items: center;
    backdrop-filter: blur(8px); animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .barter-modal, .marketplace-modal, .inventory-modal {
    background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2a 100%);
    border: 2px solid #00ff88; border-radius: 15px; padding: 25px;
    min-width: 600px; max-width: 90vw; max-height: 80vh; overflow-y: auto;
    color: #0ff; box-shadow: 0 0 50px rgba(0,255,136,0.4);
    animation: slideUp 0.3s ease-out; font-family: monospace;
  }
  @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .barter-modal h2, .marketplace-modal h2, .inventory-modal h2 {
    color: #00ff88; margin-bottom: 20px; text-align: center;
    text-transform: uppercase; letter-spacing: 2px; font-size: 20px;
  }
  .trade-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
  .my-offer, .their-offer {
    border: 1px solid #ff00ff; padding: 15px; border-radius: 10px;
    background: rgba(0,255,136,0.05);
  }
  .my-offer h3, .their-offer h3 { color: #ff00ff; margin-bottom: 15px; font-size: 14px; }
  .items-list {
    min-height: 100px; margin-bottom: 15px; padding: 10px;
    background: rgba(0,0,0,0.5); border-radius: 5px; border: 1px solid #333;
  }
  .item-chip {
    display: inline-block; background: linear-gradient(135deg, #00ff88, #00cc66);
    color: #000; padding: 4px 10px; margin: 4px; border-radius: 20px;
    font-size: 11px; font-weight: bold; transition: all 0.2s;
  }
  .modal-select, .modal-input {
    background: #000; border: 1px solid #00ff88; color: #0ff;
    padding: 8px 12px; margin: 5px; font-family: monospace; border-radius: 5px; outline: none;
  }
  .modal-select:focus, .modal-input:focus { border-color: #ff00ff; }
  .modal-btn {
    background: linear-gradient(135deg, #00ff88, #00cc66); color: #000; border: none;
    padding: 10px 20px; margin: 5px; font-weight: bold; cursor: pointer;
    font-family: monospace; border-radius: 5px; transition: all 0.2s;
  }
  .modal-btn:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(0,255,136,0.5); }
  .modal-btn-secondary { background: linear-gradient(135deg, #666, #444) !important; color: #fff !important; }
  .trade-actions { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
  .marketplace-grid, .inventory-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px; margin: 20px 0; max-height: 400px; overflow-y: auto; padding: 10px;
  }
  .listing-card, .inventory-card {
    background: rgba(0,0,0,0.8); border: 1px solid #ff00ff;
    padding: 15px; border-radius: 8px; cursor: pointer; transition: all 0.2s;
  }
  .listing-card:hover, .inventory-card:hover {
    transform: translateY(-3px); border-color: #00ff88;
    box-shadow: 0 5px 20px rgba(0,255,136,0.2);
  }
  .listing-card h3, .inventory-card h3 { color: #00ff88; margin-bottom: 10px; font-size: 16px; }
  .listing-card p, .inventory-card p { margin: 5px 0; font-size: 11px; color: #ccc; }
  .notification {
    position: fixed; top: 20px; right: 20px;
    background: linear-gradient(135deg, #1a1a2a, #0a0a1a);
    border-left: 4px solid #00ff88; padding: 15px 20px; margin: 10px;
    border-radius: 8px; z-index: 2000; animation: slideIn 0.3s ease-out;
    max-width: 350px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    font-weight: bold; font-family: monospace; color: #0ff;
  }
  .notification-success { border-left-color: #00ff88; }
  .notification-error { border-left-color: #ff0044; }
  .notification-info { border-left-color: #00ffff; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .close-btn { float: right; cursor: pointer; font-size: 24px; color: #ff00ff; margin-top: -10px; }
  .close-btn:hover { color: #00ff88; }
  .floating-text {
    position: fixed; animation: floatUp 1s ease-out forwards;
    pointer-events: none; font-weight: bold; font-size: 14px;
    z-index: 100; font-family: monospace;
  }
  @keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-50px); opacity: 0; } }
  .empty-market { color: #666; text-align: center; padding: 20px; grid-column: 1/-1; }
  @media (max-width: 768px) {
    .control-panel button { padding: 8px 16px; font-size: 11px; }
    .barter-modal, .marketplace-modal { min-width: 95vw; padding: 15px; }
    .trade-grid { grid-template-columns: 1fr; gap: 15px; }
  }
`;

const GAME_SCRIPT = `
(function() {
  if (window._ogpunkzLoaded) return;
  window._ogpunkzLoaded = true;

  class Game {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.width = 0;
      this.height = 0;
      this.player = {
        id: null, name: null, x: 400, y: 300,
        berries: 100, seeds: 10, reputation: 0, tradesCompleted: 0,
        inventory: [
          { name: 'Berry', quantity: 5, type: 'crop' },
          { name: 'Seed', quantity: 10, type: 'resource' }
        ]
      };
      this.otherPlayers = {};
      this.keys = {};
      this.gameLoopInterval = null;
      this.activeModal = null;
      this.nearbyRange = 150;
      this.camera = { x: 0, y: 0 };
      this.worldSize = 2000;
      this.resources = [];
      this.currentTradeData = null;
    }

    async init() {
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      const container = document.getElementById('game-container');
      if (!container) return;
      container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.loadPlayer();
      this.setupControls();
      this.spawnResources(20);
      this.gameLoopInterval = setInterval(() => this.update(), 1000/60);
      setInterval(() => { if (this.resources.length < 30) this.spawnResources(5); }, 10000);
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      if (this.canvas) { this.canvas.width = this.width; this.canvas.height = this.height; }
    }

    loadPlayer() {
      try {
        const saved = localStorage.getItem('ogpunkz_player');
        if (saved) Object.assign(this.player, JSON.parse(saved));
      } catch(e) {}
      if (!this.player.id) {
        this.player.id = 'player_' + Math.random().toString(36).substr(2, 9);
        this.player.name = 'Pioneer_' + Math.floor(Math.random() * 1000);
      }
      this.savePlayer();
      this.updateUI();
    }

    savePlayer() {
      try { localStorage.setItem('ogpunkz_player', JSON.stringify(this.player)); } catch(e) {}
    }

    setupControls() {
      window.addEventListener('keydown', (e) => {
        this.keys[e.key] = true;
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      });
      window.addEventListener('keyup', (e) => { this.keys[e.key] = false; });
      this.canvas.addEventListener('click', (e) => {
        if (this.activeModal) return;
        const rect = this.canvas.getBoundingClientRect();
        const cx = (e.clientX - rect.left) + this.camera.x;
        const cy = (e.clientY - rect.top) + this.camera.y;
        for (let i = 0; i < this.resources.length; i++) {
          const r = this.resources[i];
          if (Math.hypot(cx - r.x, cy - r.y) < 30) { this.collectResource(i); return; }
        }
        for (let id in this.otherPlayers) {
          const o = this.otherPlayers[id];
          if (Math.hypot(cx - o.x, cy - o.y) < 50) { this.openTradeWindow(o); return; }
        }
      });
    }

    update() {
      let dx = 0, dy = 0, speed = 5;
      if (this.keys['ArrowUp'] || this.keys['w']) dy -= speed;
      if (this.keys['ArrowDown'] || this.keys['s']) dy += speed;
      if (this.keys['ArrowLeft'] || this.keys['a']) dx -= speed;
      if (this.keys['ArrowRight'] || this.keys['d']) dx += speed;
      if (dx !== 0 || dy !== 0) {
        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
        this.player.x = Math.max(50, Math.min(this.worldSize - 50, this.player.x + dx));
        this.player.y = Math.max(50, Math.min(this.worldSize - 50, this.player.y + dy));
      }
      this.camera.x = Math.max(0, Math.min(this.worldSize - this.width, this.player.x - this.width / 2));
      this.camera.y = Math.max(0, Math.min(this.worldSize - this.height, this.player.y - this.height / 2));
      this.simulateAI();
      this.updateUI();
      this.render();
    }

    simulateAI() {
      if (Object.keys(this.otherPlayers).length < 5) {
        const names = ['CryptoFarmer','NeonHarvester','PixelTrader','CyberGardener','DataSower'];
        for (let i = 0; i < 3; i++) {
          const id = 'ai_' + Math.random().toString(36).substr(2,6);
          this.otherPlayers[id] = {
            id, name: names[Math.floor(Math.random() * names.length)],
            x: Math.random() * this.worldSize, y: Math.random() * this.worldSize, isAI: true
          };
        }
      }
      for (let id in this.otherPlayers) {
        const ai = this.otherPlayers[id];
        if (ai.isAI) {
          ai.x = Math.max(50, Math.min(this.worldSize-50, ai.x + (Math.random()-0.5)*3));
          ai.y = Math.max(50, Math.min(this.worldSize-50, ai.y + (Math.random()-0.5)*3));
        }
      }
    }

    spawnResources(count) {
      for (let i = 0; i < count; i++) {
        this.resources.push({
          x: 100 + Math.random() * (this.worldSize - 200),
          y: 100 + Math.random() * (this.worldSize - 200),
          type: Math.random() > 0.7 ? 'seed' : 'berry'
        });
      }
    }

    collectResource(index) {
      const res = this.resources[index];
      if (res.type === 'berry') { this.player.berries += 5; this.showFloatingText('+5 Berries!', res.x, res.y, '#00ff88'); }
      else { this.player.seeds += 2; this.showFloatingText('+2 Seeds!', res.x, res.y, '#ff00ff'); }
      this.resources.splice(index, 1);
      this.savePlayer(); this.updateUI();
      this.showNotification('Gathered ' + (res.type === 'berry' ? 'Berries' : 'Seeds') + '!', 'success');
    }

    showFloatingText(text, wx, wy, color) {
      const div = document.createElement('div');
      div.className = 'floating-text'; div.textContent = text; div.style.color = color;
      div.style.left = (wx - this.camera.x) + 'px'; div.style.top = (wy - this.camera.y) + 'px';
      document.body.appendChild(div); setTimeout(() => div.remove(), 1000);
    }

    render() {
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.clearRect(0, 0, this.width, this.height);
      const gs = 50, sx = Math.floor(this.camera.x/gs)*gs, sy = Math.floor(this.camera.y/gs)*gs;
      for (let x = sx; x < this.camera.x + this.width + gs; x += gs) {
        for (let y = sy; y < this.camera.y + this.height + gs; y += gs) {
          const ex = x - this.camera.x, ey = y - this.camera.y;
          ctx.fillStyle = ((x/gs)+(y/gs)) % 2 === 0 ? '#1a3a2a' : '#2a4a3a';
          ctx.fillRect(ex, ey, gs-1, gs-1);
          ctx.strokeStyle = '#3a5a4a'; ctx.lineWidth = 1;
          ctx.strokeRect(ex, ey, gs-1, gs-1);
        }
      }
      for (const res of this.resources) {
        const ex = res.x - this.camera.x, ey = res.y - this.camera.y;
        ctx.beginPath(); ctx.arc(ex, ey, 12, 0, Math.PI*2);
        ctx.fillStyle = res.type === 'berry' ? '#ff3366' : '#ffcc33';
        ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        ctx.fillText(res.type === 'berry' ? '🫐' : '🌱', ex, ey+4);
      }
      for (let id in this.otherPlayers) {
        const o = this.otherPlayers[id];
        const ex = o.x - this.camera.x, ey = o.y - this.camera.y;
        if (ex > -50 && ex < this.width+50 && ey > -50 && ey < this.height+50) {
          ctx.beginPath(); ctx.arc(ex, ey, 20, 0, Math.PI*2);
          ctx.fillStyle = o.isAI ? '#8844aa' : '#44aa88'; ctx.fill();
          ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(ex-8, ey-5, 4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(ex+8, ey-5, 4, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.arc(ex-8, ey-5, 2, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(ex+8, ey-5, 2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#00ff88'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
          ctx.fillText(o.name, ex, ey-25);
          if (o.isAI) { ctx.fillStyle = '#ff00ff'; ctx.font = '10px monospace'; ctx.fillText('💱', ex+15, ey-10); }
        }
      }
      const px = this.player.x - this.camera.x, py = this.player.y - this.camera.y;
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI*2);
      ctx.fillStyle = '#00ff88'; ctx.fill();
      ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(px-8, py-5, 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(px+8, py-5, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(px-7, py-5, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(px+9, py-5, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(px, py+5, 10, 0.1, Math.PI-0.1);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#ff00ff'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
      ctx.fillText(this.player.name, px, py-30);
      const ep = Math.min(1, this.player.berries/500);
      ctx.fillStyle = '#333'; ctx.fillRect(px-25, py-40, 50, 6);
      ctx.fillStyle = '#00ff88'; ctx.fillRect(px-25, py-40, 50*ep, 6);
    }

    updateUI() {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('player-name', this.player.name);
      set('berries', this.player.berries);
      set('seeds', this.player.seeds);
      set('reputation', this.player.reputation);
      set('trades', this.player.tradesCompleted);
      const nc = Object.values(this.otherPlayers).filter(p =>
        Math.hypot(p.x - this.player.x, p.y - this.player.y) < this.nearbyRange
      ).length;
      const nb = document.querySelector('.control-panel button:last-child');
      if (nb) nb.innerHTML = '👥 NEARBY (' + nc + ')';
    }

    showNotification(msg, type = 'info') {
      const div = document.createElement('div');
      div.className = 'notification notification-' + type;
      div.innerHTML = msg; document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }

    closeModal() {
      if (this.activeModal) { this.activeModal.remove(); this.activeModal = null; }
    }

    showInventory() {
      this.closeModal();
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="inventory-modal">' +
        '<span class="close-btn" onclick="window.game.closeModal()">×</span>' +
        '<h2>📦 INVENTORY</h2>' +
        '<div class="inventory-grid">' +
        '<div class="inventory-card"><h3>🫐 Berries</h3><p>Amount: ' + this.player.berries + '</p><p>Pioneer Fields currency</p></div>' +
        '<div class="inventory-card"><h3>🌱 Seeds</h3><p>Amount: ' + this.player.seeds + '</p><p>Plant to grow crops</p>' +
        '<button class="modal-btn" onclick="window.game.useSeed()">Plant Seed</button></div>' +
        this.player.inventory.map(item =>
          '<div class="inventory-card"><h3>' + item.name + '</h3><p>Qty: ' + item.quantity + '</p><p>Type: ' + item.type + '</p></div>'
        ).join('') +
        '</div><div style="text-align:center;margin-top:20px;">' +
        '<button class="modal-btn modal-btn-secondary" onclick="window.game.closeModal()">Close</button></div></div>';
      document.body.appendChild(modal);
      this.activeModal = modal;
    }

    useSeed() {
      if (this.player.seeds > 0) {
        this.player.seeds--;
        this.showFloatingText('🌱 Planted!', this.player.x, this.player.y, '#00ff88');
        this.showNotification('Seed planted! It will grow soon.', 'success');
        this.savePlayer(); this.updateUI();
      }
      this.closeModal();
    }

    async showMarketplace() {
      this.closeModal();
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="marketplace-modal">' +
        '<span class="close-btn" onclick="window.game.closeModal()">×</span>' +
        '<h2>🛒 PIONEER MARKETPLACE</h2>' +
        '<div id="marketplace-listings" class="marketplace-grid">' +
        '<div style="color:#666;text-align:center;padding:20px;grid-column:1/-1;">Loading listings...</div>' +
        '</div><div style="margin-top:20px;text-align:center;">' +
        '<button class="modal-btn" onclick="window.game.showSellForm()">Sell Item</button>' +
        '<button class="modal-btn modal-btn-secondary" onclick="window.game.closeModal()">Close</button>' +
        '</div></div>';
      document.body.appendChild(modal);
      this.activeModal = modal;
      await this.refreshMarketplace();
    }

    async refreshMarketplace() {
      const container = document.getElementById('marketplace-listings');
      if (!container) return;
      try {
        const res = await fetch('/api/listings');
        const listings = await res.json();
        if (!Array.isArray(listings) || listings.length === 0) {
          container.innerHTML = '<div class="empty-market">No listings yet. Be the first to sell!</div>'; return;
        }
        container.innerHTML = listings.map(l =>
          '<div class="listing-card"><h3>' + l.itemName + '</h3>' +
          '<p>📦 Qty: ' + l.quantity + '</p><p>💰 Price: ' + l.priceBerries + ' 🫐</p>' +
          '<p>👤 ' + l.sellerName + '</p>' +
          '<button class="modal-btn" onclick="window.game.buyItem(' + l.id + ')">Buy Now</button></div>'
        ).join('');
      } catch(e) {
        container.innerHTML = '<div class="empty-market">Failed to load listings.</div>';
      }
    }

    showSellForm() {
      this.closeModal();
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="barter-modal">' +
        '<span class="close-btn" onclick="window.game.closeModal()">×</span>' +
        '<h2>💰 SELL ITEM</h2><div style="padding:20px;">' +
        '<div style="margin:15px 0;"><label style="color:#0ff;">Item:</label><br>' +
        '<select id="sell-item" class="modal-select">' +
        '<option value="Berry">Berry (You have ' + this.player.berries + ')</option>' +
        '<option value="Seed">Seed (You have ' + this.player.seeds + ')</option>' +
        '</select></div>' +
        '<div style="margin:15px 0;"><label style="color:#0ff;">Quantity:</label><br>' +
        '<input type="number" id="sell-quantity" class="modal-input" min="1" value="1"></div>' +
        '<div style="margin:15px 0;"><label style="color:#0ff;">Price per item (Berries):</label><br>' +
        '<input type="number" id="sell-price" class="modal-input" min="1" value="10"></div>' +
        '<div style="text-align:center;margin-top:20px;">' +
        '<button class="modal-btn" onclick="window.game.listItem()">List on Market</button>' +
        '<button class="modal-btn modal-btn-secondary" onclick="window.game.closeModal()">Cancel</button>' +
        '</div></div></div>';
      document.body.appendChild(modal);
      this.activeModal = modal;
    }

    async listItem() {
      const itemEl = document.getElementById('sell-item');
      const qtyEl = document.getElementById('sell-quantity');
      const priceEl = document.getElementById('sell-price');
      if (!itemEl || !qtyEl || !priceEl) return;
      const item = itemEl.value;
      const qty = parseInt(qtyEl.value);
      const priceEach = parseInt(priceEl.value);
      if (item === 'Berry' && this.player.berries < qty) { this.showNotification('Not enough berries!', 'error'); return; }
      if (item === 'Seed' && this.player.seeds < qty) { this.showNotification('Not enough seeds!', 'error'); return; }
      if (item === 'Berry') this.player.berries -= qty;
      else this.player.seeds -= qty;
      try {
        const res = await fetch('/api/listings', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sellerId: this.player.id, sellerName: this.player.name,
            itemName: item, quantity: qty, priceBerries: priceEach * qty })
        });
        if (!res.ok) throw new Error();
        this.savePlayer(); this.updateUI();
        this.showNotification('Listed ' + qty + 'x ' + item + ' for ' + (priceEach*qty) + ' berries!', 'success');
        this.showMarketplace();
      } catch(e) {
        if (item === 'Berry') this.player.berries += qty; else this.player.seeds += qty;
        this.showNotification('Failed to list item.', 'error');
      }
    }

    async buyItem(listingId) {
      try {
        const res = await fetch('/api/listings');
        const listings = await res.json();
        const listing = listings.find(l => l.id === listingId);
        if (!listing) { this.showNotification('Listing no longer available!', 'error'); this.refreshMarketplace(); return; }
        if (this.player.berries < listing.priceBerries) {
          this.showNotification('You need ' + listing.priceBerries + ' berries!', 'error'); return;
        }
        const delRes = await fetch('/api/listings/' + listingId, { method: 'DELETE' });
        if (!delRes.ok) { this.showNotification('Purchase failed.', 'error'); return; }
        this.player.berries -= listing.priceBerries;
        if (listing.itemName === 'Berry') this.player.berries += listing.quantity;
        else if (listing.itemName === 'Seed') this.player.seeds += listing.quantity;
        this.player.tradesCompleted++; this.player.reputation += 2;
        this.savePlayer(); this.updateUI();
        this.showNotification('Bought ' + listing.quantity + 'x ' + listing.itemName + '!', 'success');
        this.refreshMarketplace();
      } catch(e) { this.showNotification('Purchase failed.', 'error'); }
    }

    openTradeWindow(targetPlayer) {
      this.closeModal();
      this.currentTradeData = { targetPlayer, myOffer: [], theirRequest: [] };
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = '<div class="barter-modal">' +
        '<span class="close-btn" onclick="window.game.closeModal()">×</span>' +
        '<h2>💱 TRADE WITH ' + targetPlayer.name + '</h2>' +
        '<div class="trade-grid">' +
        '<div class="my-offer"><h3>📤 Your Offer</h3>' +
        '<div id="my-offer-items" class="items-list"></div>' +
        '<select id="offer-item" class="modal-select">' +
        '<option value="Berry">Berry (' + this.player.berries + ')</option>' +
        '<option value="Seed">Seed (' + this.player.seeds + ')</option>' +
        '</select>' +
        '<input type="number" id="offer-qty" class="modal-input" min="1" value="1" style="width:80px;">' +
        '<button class="modal-btn" onclick="window.game.addToOffer()">+ Add</button></div>' +
        '<div class="their-offer"><h3>📥 Their Request</h3>' +
        '<div id="their-offer-items" class="items-list"></div>' +
        '<select id="request-item" class="modal-select">' +
        '<option value="Berry">Berry</option><option value="Seed">Seed</option>' +
        '</select>' +
        '<input type="number" id="request-qty" class="modal-input" min="1" value="1" style="width:80px;">' +
        '<button class="modal-btn" onclick="window.game.addToRequest()">+ Add</button></div>' +
        '</div><div class="trade-actions">' +
        '<button class="modal-btn" onclick="window.game.sendTrade()">SEND TRADE</button>' +
        '<button class="modal-btn modal-btn-secondary" onclick="window.game.closeModal()">CANCEL</button>' +
        '</div></div>';
      document.body.appendChild(modal);
      this.activeModal = modal;
    }

    addToOffer() {
      const item = document.getElementById('offer-item').value;
      const qty = parseInt(document.getElementById('offer-qty').value);
      if (item === 'Berry' && this.player.berries < qty) { this.showNotification('Not enough berries!', 'error'); return; }
      if (item === 'Seed' && this.player.seeds < qty) { this.showNotification('Not enough seeds!', 'error'); return; }
      const ex = this.currentTradeData.myOffer.find(i => i.name === item);
      if (ex) ex.quantity += qty; else this.currentTradeData.myOffer.push({ name: item, quantity: qty });
      this.updateTradeDisplay();
    }

    addToRequest() {
      const item = document.getElementById('request-item').value;
      const qty = parseInt(document.getElementById('request-qty').value);
      const ex = this.currentTradeData.theirRequest.find(i => i.name === item);
      if (ex) ex.quantity += qty; else this.currentTradeData.theirRequest.push({ name: item, quantity: qty });
      this.updateTradeDisplay();
    }

    updateTradeDisplay() {
      const mc = document.getElementById('my-offer-items');
      const tc = document.getElementById('their-offer-items');
      if (mc) mc.innerHTML = this.currentTradeData.myOffer.map(i => '<div class="item-chip">' + i.quantity + 'x ' + i.name + '</div>').join('');
      if (tc) tc.innerHTML = this.currentTradeData.theirRequest.map(i => '<div class="item-chip">' + i.quantity + 'x ' + i.name + '</div>').join('');
    }

    sendTrade() {
      if (!this.currentTradeData.myOffer.length) { this.showNotification('Add items to offer!', 'error'); return; }
      let valid = true;
      for (const o of this.currentTradeData.myOffer) {
        if (o.name === 'Berry' && this.player.berries < o.quantity) valid = false;
        if (o.name === 'Seed' && this.player.seeds < o.quantity) valid = false;
      }
      if (!valid) { this.showNotification("Not enough items!", 'error'); return; }
      for (const o of this.currentTradeData.myOffer) {
        if (o.name === 'Berry') this.player.berries -= o.quantity;
        if (o.name === 'Seed') this.player.seeds -= o.quantity;
      }
      for (const r of this.currentTradeData.theirRequest) {
        if (r.name === 'Berry') this.player.berries += r.quantity;
        if (r.name === 'Seed') this.player.seeds += r.quantity;
      }
      this.player.reputation += 5; this.player.tradesCompleted++;
      this.savePlayer(); this.updateUI();
      this.showNotification('Trade with ' + this.currentTradeData.targetPlayer.name + ' complete! +5 Rep', 'success');
      this.closeModal();
    }

    showNearbyPlayers() {
      const nearby = Object.values(this.otherPlayers).filter(p =>
        Math.hypot(p.x - this.player.x, p.y - this.player.y) < this.nearbyRange
      );
      this.closeModal();
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      let cards = nearby.map(p =>
        '<div class="listing-card"><h3>' + p.name + '</h3><p>' +
        (p.isAI ? '🤖 AI Trader' : '👤 Pioneer') + '</p>' +
        '<button class="modal-btn" onclick=\'window.game.openTradeWindow(' + JSON.stringify(p) + ')\'>Trade</button></div>'
      ).join('');
      if (!cards) cards = '<div class="empty-market">No players nearby. Move closer!</div>';
      modal.innerHTML = '<div class="marketplace-modal">' +
        '<span class="close-btn" onclick="window.game.closeModal()">×</span>' +
        '<h2>👥 NEARBY PLAYERS</h2>' +
        '<div class="marketplace-grid">' + cards + '</div>' +
        '<div style="text-align:center;margin-top:20px;">' +
        '<button class="modal-btn modal-btn-secondary" onclick="window.game.closeModal()">Close</button>' +
        '</div></div>';
      document.body.appendChild(modal);
      this.activeModal = modal;
    }
  }

  function startGame() {
    if (!window.game) {
      window.game = new Game();
      window.game.init();
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', startGame);
  } else {
    startGame();
  }
})();
`;
