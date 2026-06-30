// src/mindcraft/mindserver.js
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs'; // Düzeltilmiş import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

// ============================================================
//  ANA SAYFA
// ============================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// ============================================================
//  API: Bot Ayarlarını Yönet (Web'den Güncelleme)
// ============================================================

// Mevcut ayarları oku (GET)
app.get('/api/config', (req, res) => {
  try {
    // settings.js dosyasını oku (require ile)
    const settingsPath = path.join(__dirname, '../../settings.js');
    if (!fs.existsSync(settingsPath)) {
      return res.status(404).json({ error: 'settings.js dosyası bulunamadı.' });
    }
    // settings.js bir ES Module olduğu için import() ile dinamik olarak yükle
    import(`file://${settingsPath}`)
      .then(module => {
        const settings = module.default || module;
        res.json(settings);
      })
      .catch(err => {
        console.error('Ayarlar okunamadı:', err.message);
        res.status(500).json({ error: 'Ayarlar okunamadı: ' + err.message });
      });
  } catch (error) {
    console.error('Ayarlar okunamadı:', error.message);
    res.status(500).json({ error: 'Ayarlar okunamadı: ' + error.message });
  }
});

// Yeni ayarları kaydet (POST)
app.post('/api/config', (req, res) => {
  try {
    const newSettings = req.body;

    // Gelen veriyi doğrula
    if (!newSettings.host || !newSettings.port) {
      return res.status(400).json({ error: 'Host ve port zorunludur.' });
    }

    // settings.js dosyasının yolu
    const settingsPath = path.join(__dirname, '../../settings.js');

    // Yeni ayarları settings.js'e yaz
    const fileContent = `export default ${JSON.stringify(newSettings, null, 2)};`;
    fs.writeFileSync(settingsPath, fileContent, 'utf8');

    console.log('✅ Ayarlar kaydedildi:', newSettings);

    // Başarılı yanıt
    res.json({
      success: true,
      message: 'Ayarlar kaydedildi. Bot yeniden başlatılıyor...'
    });

    // Botu yeniden başlat (Render'da otomatik yeniden başlatılır)
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
//  SOCKET.IO
// ============================================================
io.on('connection', (socket) => {
  console.log('✅ Yeni bir istemci bağlandı:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ İstemci ayrıldı:', socket.id);
  });

  // İstemciden gelen mesajları işle
  socket.on('message', (data) => {
    console.log('📩 Mesaj alındı:', data);
    // Tüm istemcilere yay
    io.emit('message', data);
  });
});

// ============================================================
//  SUNUCUYU BAŞLAT
// ============================================================
server.listen(PORT, HOST, () => {
  console.log(`🌐 MindServer http://${HOST}:${PORT} adresinde çalışıyor.`);
});

export default { app, server, io };
