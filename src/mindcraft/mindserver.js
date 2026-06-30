import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ============================================================
//  API: Bot Ayarlarını Yönet (Web'den Güncelleme)
// ============================================================

// Mevcut ayarları oku (GET)
app.get('/api/config', (req, res) => {
  try {
    const settings = require('../../settings.js');
    res.json(settings);
  } catch (error) {
    console.error('Ayarlar okunamadı:', error.message);
    res.status(500).json({ error: 'Ayarlar okunamadı' });
  }
});

// Yeni ayarları kaydet (POST)
app.post('/api/config', (req, res) => {
  try {
    const newSettings = req.body;
    if (!newSettings.host || !newSettings.port) {
      return res.status(400).json({ error: 'Host ve port zorunludur.' });
    }
    const settingsPath = path.join(__dirname, '../../settings.js');
    const fileContent = `module.exports = ${JSON.stringify(newSettings, null, 2)};`;
    fs.writeFileSync(settingsPath, fileContent, 'utf8');
    console.log('✅ Ayarlar kaydedildi:', newSettings);
    res.json({
      success: true,
      message: 'Ayarlar kaydedildi. Bot yeniden başlatılıyor...'
    });
    setTimeout(() => {
      console.log('🔄 Bot yeniden başlatılıyor...');
      process.exit(0);
    }, 1500);
  } catch (error) {
    console.error('Ayarlar kaydedilemedi:', error.message);
    res.status(500).json({ error: 'Ayarlar kaydedilemedi: ' + error.message });
  }
});

// ============================================================
//  MindServer Ana Mantığı
// ============================================================

let agents = {};

export function logoutAgent(agentName) {
  if (agents[agentName]) {
    delete agents[agentName];
    console.log(`Agent ${agentName} çıkış yaptı.`);
    return true;
  }
  return false;
}

export function getAgents() {
  return agents;
}

export function addAgent(agentName, agentData) {
  agents[agentName] = agentData;
}

// Vite ile geliştirme sunucusu (opsiyonel)
async function startVite() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);
}

// Statik dosyalar
app.use(express.static(path.join(__dirname, '../../public')));

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Sunucuyu başlat
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MindServer running on port ${PORT} on host 0.0.0.0`);
});

// Eğer geliştirme ortamındaysa Vite'ı başlat
if (process.env.NODE_ENV === 'development') {
  startVite();
}

export default app;
