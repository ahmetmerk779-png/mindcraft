const settings = {
  "minecraft_version": "1.8.9", // AesirMC için 1.8.9
  "host": "aesirmc.com", // Sunucu IP'n
  "port": 25565, // Sunucu portu
  "auth": "offline", // Offline mod

  // MindServer ayarları
  "mindserver_port": 8080,
  "auto_open_ui": true,

  // Profil
  "base_profile": "assistant",
  "profiles": [
    "./andy.json"
    // "./profiles/mistral.json" // İstersen mistral profilini aktif et
  ],

  // Hafıza ve başlangıç
  "load_memory": false,
  "init_message": "Merhaba! Ben yapay zeka botuyum.",

  // Sohbet ayarları
  "only_chat_with": [],
  "speak": false,
  "chat_ingame": true,
  "language": "en",

  // Görüntü ve güvenlik
  "render_bot_view": false,
  "allow_insecure_coding": false,
  "allow_vision": false,

  // Komut ve zaman aşımı
  "blocked_actions": ["!checkBlueprint", "!checkBlueprintLevel", "!getBlueprint", "!getBlueprintLevel"],
  "code_timeout_mins": -1,
  "relevant_docs_count": 5,
  "max_messages": 15,
  "num_examples": 2,
  "max_commands": -1,
  "show_command_syntax": "full",
  "narrate_behavior": true,
  "chat_bot_messages": true,
  "spawn_timeout": 30,
  "block_place_delay": 0,
  "log_all_prompts": false
};

export default settings;
