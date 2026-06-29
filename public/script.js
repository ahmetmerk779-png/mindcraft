document.getElementById('botSettings').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    username: document.getElementById('botName').value,
    host: document.getElementById('serverHost').value,
    port: parseInt(document.getElementById('serverPort').value),
    minecraft_version: document.getElementById('version').value,
    auth: document.getElementById('authType').value
  };
  
  const response = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    alert('Ayarlar kaydedildi! Bot yeniden başlatılıyor...');
    setTimeout(() => location.reload(), 3000);
  }
});
