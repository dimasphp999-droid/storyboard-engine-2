import React, { useState, useEffect } from 'react';

const Icons = {
  Film: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>,
  LayoutDashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  FileText: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  FolderGit2: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Video: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Copy: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Image: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Layers: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Mic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
};

const DB_NAME = 'StoryboardStudioDB';
const DB_VERSION = 1;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets');
      if (!db.objectStoreNames.contains('scenes')) db.createObjectStore('scenes');
      if (!db.objectStoreNames.contains('history')) db.createObjectStore('history');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToDB = async (store, data) => {
  try {
    const db = await initDB();
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(data, 'data');
  } catch (err) { console.error('DB Save Error:', err); }
};

const getFromDB = async (store) => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get('data');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (err) { return null; }
};

const SAMPLE_ASSETS = [
  {
    id: 'asset-1', category: 'character', name: '@ManCool',
    description: 'A three-panel character reference sheet... [contoh format 3-panel]', images: ['']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Data
  const [assets, setAssets] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);

  // Script Analyzer
  const [scriptInput, setScriptInput] = useState(() => localStorage.getItem('sb_scriptInput') || '');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [isAnalyzingScript, setIsAnalyzingScript] = useState(false);
  const [detectedElements, setDetectedElements] = useState(() => {
    const saved = localStorage.getItem('sb_detectedElements');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Asset Management
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAutoDescribing, setIsAutoDescribing] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // Scene Builder
  const [promptLevel, setPromptLevel] = useState(5);
  const [sceneDuration, setSceneDuration] = useState(10);
  const [builderShot, setBuilderShot] = useState({
    lazyOneLiner: 'a car drifting around a corner',
    subject: 'Seorang pria berjaket',
    action: 'Mengemudi menyusuri jalan pegunungan',
    setting: 'Jalan pegunungan yang dikelilingi pohon cedar',
    lighting: 'Matahari sore menyinari sela-sela pohon',
    mood: 'Fokus dan tenang',
    cameraMotion: 'Low-angle tracking shot, kamera mengunci pada mobil, bergerak cepat',
    continuity: 'HARD CUT dari adegan sebelumnya.',
    dialogue: 'Eh, sebentar lagi sampai kok, santai aja.',
    selectedAssetIds: ['asset-1'],
    aspectRatio: '16:9',
    antiGlitch: true
  });
  
  const [generatedPromptResult, setGeneratedPromptResult] = useState(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isAiCinematicLoading, setIsAiCinematicLoading] = useState(false);

  useEffect(() => {
    const loadDB = async () => {
      const savedAssets = await getFromDB('assets');
      const savedScenes = await getFromDB('scenes');
      const savedHistory = await getFromDB('history');
      
      setAssets(savedAssets || SAMPLE_ASSETS);
      setScenes(savedScenes || []);
      setPromptHistory(savedHistory || []);
      setIsDbLoaded(true);
    };
    loadDB();
  }, []);

  useEffect(() => { if (isDbLoaded) saveToDB('assets', assets); }, [assets, isDbLoaded]);
  useEffect(() => { if (isDbLoaded) saveToDB('scenes', scenes); }, [scenes, isDbLoaded]);
  useEffect(() => { if (isDbLoaded) saveToDB('history', promptHistory); }, [promptHistory, isDbLoaded]);
  useEffect(() => { localStorage.setItem('sb_scriptInput', scriptInput); }, [scriptInput]);
  useEffect(() => { localStorage.setItem('sb_detectedElements', JSON.stringify(detectedElements)); }, [detectedElements]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Tersalin ke clipboard');
  };

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      return addToast('Browser Anda tidak mendukung fitur Dikte Suara (Gunakan Chrome/Edge)', 'error');
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => addToast('Mikrofon aktif. Silakan bicara...', 'success');
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + ' ';
      }
      if (finalTranscript) setScriptInput(prev => prev + ' ' + finalTranscript);
    };
    recognition.onerror = () => addToast('Gagal mendengarkan suara', 'error');
    recognition.start();
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return addToast('Hanya mendukung PDF', 'error');
    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setPdfFile(event.target.result.split(',')[1]);
    reader.readAsDataURL(file);
  };

  const clearPdf = () => { setPdfFile(null); setPdfName(''); };

  const handleAnalyzeScript = async () => {
    if (!scriptInput.trim() && !pdfFile) return addToast('Teks naskah atau file PDF kosong', 'error');
    setIsAnalyzingScript(true);
    setDetectedElements(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      let promptText = `Analisis naskah ini. Pecah menjadi scenes dan shots. Berikan juga estimasi durasi adegan dalam detik (duration).
Ekstrak elemen: Karakter, Properti (barang), dan Lokasi (environment).
Format WAJIB JSON Murni tanpa markdown:
{
  "detectedElements": {
    "characters": [{"name": "Nama", "description": "Detail fisik"}],
    "props": [{"name": "Barang", "description": "Detail bentuk/warna"}],
    "environments": [{"name": "Lokasi", "description": "Suasana/cahaya"}]
  },
  "scenes": [
    {
      "id": "scene-1", "title": "Judul", "summary": "Ringkasan", "duration": "10s",
      "shots": [
        {
          "id": "shot-1", "subject": "...", "action": "...", "setting": "...", "lighting": "...", "mood": "...", "cameraMotion": "..."
        }
      ]
    }
  ]
}`;

      const parts = [{ text: promptText + (scriptInput.trim() ? `\n\nNaskah:\n${scriptInput}` : '') }];
      if (pdfFile) parts.push({ inlineData: { mimeType: "application/pdf", data: pdfFile } });

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: "application/json" } })
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsedData = JSON.parse(cleanJson);
        
        if (parsedData.scenes) {
          setScenes(parsedData.scenes);
          if (parsedData.detectedElements) setDetectedElements(parsedData.detectedElements);
        } else if (Array.isArray(parsedData)) setScenes(parsedData);
        
        addToast('Naskah dan Elemen berhasil dianalisis!');
        if (!pdfFile) setScriptInput('');
      } else { throw new Error("No response"); }
    } catch (err) { addToast('Gagal menganalisis naskah', 'error'); } 
    finally { setIsAnalyzingScript(false); }
  };

  const handleGenerateAssetPrompt = async (assetData) => {
    setIsAutoDescribing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const isCharacter = assetData.category === 'character';
      const promptInstruction = isCharacter 
        ? `Buat Image Generation Prompt berbahasa Inggris berdasarkan deskripsi ini: "${assetData.description}".
           ATURAN WAJIB (Metode Youri): Buat format "A three-panel character reference sheet... on a plain mid-grey seamless studio background".
           Panel 1 (Kiri): "headless full-body front view". Panel 2 (Tengah): "same body full length seen from directly behind". Panel 3 (Kanan): "same chest-up, front on". Akhiri dengan: "Photographic, sharp focus, no CGI."`
        : `Buat Image Prompt (Inggris) untuk lokasi: "${assetData.description}".
           ATURAN WAJIB: Lokasi ini adalah background plate. Sisipkan instruksi tegas: "completely empty, no people in it, no figures, nobody. No readable text."`;

      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptInstruction }] }] }) });
      const data = await res.json();
      const promptResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (promptResult) {
        setEditingAsset(prev => ({ ...prev, description: `${prev.description}\n\n-- PROMPT GAMBAR (Midjourney) --\n${promptResult.replace(/```/g, '').trim()}` }));
        addToast('Prompt Referensi Standar Youri berhasil dibuat!');
      }
    } catch (err) { addToast('Gagal meracik prompt', 'error'); }
    finally { setIsAutoDescribing(false); }
  };

  const handleAutoDescribe = async (assetData) => {
    if (!assetData.images?.[0]) return addToast('Pilih gambar dulu', 'error');
    const imageString = assetData.images[0];
    const base64Data = imageString.includes(',') ? imageString.split(',')[1] : null;
    const mimeType = imageString.match(/data:(.*?);/)?.[1] || "image/jpeg";
    if (!base64Data) return addToast('Format gambar invalid', 'error');

    setIsAutoDescribing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Deskripsikan detail visual gambar ini." }, { inlineData: { mimeType, data: base64Data } }] }] })
      });
      const data = await res.json();
      const desc = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (desc) { setEditingAsset(prev => ({ ...prev, description: desc })); addToast('Deskripsi otomatis selesai'); }
    } catch (err) { addToast('Gagal auto-describe', 'error'); } 
    finally { setIsAutoDescribing(false); }
  };

  const handleAssetImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setEditingAsset(prev => ({ ...prev, images: [event.target.result] }));
    reader.readAsDataURL(file);
  };

  const saveAsset = () => {
    if (!editingAsset.name || !editingAsset.description) return addToast('Nama & Deskripsi wajib diisi', 'error');
    if (editingAsset.id) setAssets(assets.map(a => a.id === editingAsset.id ? editingAsset : a));
    else setAssets([...assets, { ...editingAsset, id: `asset-${Date.now()}` }]);
    setIsAssetModalOpen(false); addToast('Aset tersimpan');
  };

  const applyShotToBuilder = (shot) => {
    setBuilderShot(prev => ({
      ...prev,
      subject: shot.subject || '', action: shot.action || '', setting: shot.setting || '', lighting: shot.lighting || '', mood: shot.mood || '', cameraMotion: shot.cameraMotion || '',
      lazyOneLiner: `${shot.subject || 'Karakter'} ${shot.action || 'beraksi'} di ${shot.setting || 'lokasi'}`,
      dialogue: '', continuity: ''
    }));
    setPromptLevel(4); setActiveTab('builder'); addToast('Shot dimuat ke Builder');
  };

  const handleAiCinematicDirector = async () => {
    setIsAiCinematicLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const prompt = `Bertindaklah sebagai Sutradara. Konteks Naskah:
Subjek: ${builderShot.subject}
Aksi: ${builderShot.action}
Lokasi: ${builderShot.setting}

TUGAS: JANGAN merubah cerita dasar di atas. Lengkapi parameter sinematiknya.
Rasio Layar: ${builderShot.aspectRatio} (Sesuaikan angle jika vertikal 9:16).
Dialog: Buat bahasa Indonesia natural santai.
Format JSON Murni: { "cameraMotion": "...", "lighting": "...", "mood": "...", "dialogue": "...", "audioSFX": "..." }`;

      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }) });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let result = JSON.parse(rawJson.replace(/```json/gi, '').replace(/```/g, '').trim());
        setBuilderShot(prev => ({ ...prev, lighting: result.lighting, mood: result.mood, cameraMotion: result.cameraMotion, dialogue: result.dialogue, audioSFX: result.audioSFX }));
        addToast('Sutradara AI merancang angle & dialog!');
      } else { throw new Error("No response"); }
    } catch (err) { addToast('Gagal merancang adegan', 'error'); } 
    finally { setIsAiCinematicLoading(false); }
  };

  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      let tagsSummary = '';
      if (promptLevel === 5) {
        assets.filter(a => builderShot.selectedAssetIds.includes(a.id)).forEach(asset => {
          tagsSummary += `\n- Tag: ${asset.name} (Deskripsi: ${asset.description})`;
        });
      }

      const antiGlitchStr = builderShot.antiGlitch ? ", bad anatomy, missing fingers, morphing, glitch, text, watermark, slow motion" : "";

      const systemPrompt = `Anda Prompt Engineer AI Video (Metode 5 Levels Youri van Hofwegen). Level: ${promptLevel}. Durasi: ${sceneDuration}s.
ATURAN FORMAT:
- Level 1-3: Format paragraf biasa.
- Level 4-5 WAJIB BLOK KAKU:
SCENE
[1 kalimat ringkasan]
FRAME MAP
[Bagi durasi ${sceneDuration}s pakai timestamp, cth: [0-4s] Aksi. [4-10s] Aksi.]
SUBJECT LOCK
[Deskripsi/Tags Subjek. Level 5 WAJIB pakai @tags spt ${tagsSummary ? '@Nama' : '@Man'}]
CROSS-FRAME RULES
[Aturan kontinuitas]
LOCATION
[Level 5 WAJIB pakai @tags lokasi]
LIGHT
[Deskripsi cahaya]
MOVEMENT
[Timestamp aksi]
DIALOGUE
[Timestamp dialog]
CAMERA
[Timestamp kamera]
AUDIO
[SFX]

Hasilkan JSON Murni: { "positivePrompt": "...", "negativePrompt": "..." }`;

      const userPrompt = `INPUT: Lvl1: ${builderShot.lazyOneLiner} \nSubjek: ${builderShot.subject} \nAksi: ${builderShot.action} \nSetting: ${builderShot.setting} \nCahaya: ${builderShot.lighting} \nMood: ${builderShot.mood} \nKamera: ${builderShot.cameraMotion} \nDialog: ${builderShot.dialogue} \n@Tags Lvl5: ${tagsSummary || 'None'}`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: userPrompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] }, generationConfig: { responseMimeType: "application/json" } }) });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let cleanJson = JSON.parse(rawJson.replace(/```json/gi, '').replace(/```/g, '').trim());
        cleanJson.negativePrompt = (cleanJson.negativePrompt || '') + antiGlitchStr;
        setGeneratedPromptResult(cleanJson);
        addToast(`Prompt Lvl ${promptLevel} digenerate!`);
      } else { throw new Error("Empty Response"); }
    } catch (err) { addToast('Gagal merangkai prompt', 'error'); } 
    finally { setIsGeneratingPrompt(false); }
  };

  const handleDragStart = (e, index) => { e.dataTransfer.setData('histIndex', index); };
  const handleDrop = (e, index) => {
    const dragIndex = e.dataTransfer.getData('histIndex');
    const newHist = [...promptHistory];
    const dragItem = newHist[dragIndex];
    newHist.splice(dragIndex, 1);
    newHist.splice(index, 0, dragItem);
    setPromptHistory(newHist);
  };
  
  // FITUR BACKUP & RESTORE PROJECT (JSON)
  const handleExportProject = () => {
    const projectData = { assets, scenes, promptHistory, scriptInput, detectedElements };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Storyboard_Backup_${new Date().toISOString().slice(0,10)}.json`; a.click();
    addToast('Proyek berhasil di-backup (.json)');
  };

  const handleImportProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.assets) setAssets(data.assets);
        if (data.scenes) setScenes(data.scenes);
        if (data.promptHistory) setPromptHistory(data.promptHistory);
        if (data.scriptInput) setScriptInput(data.scriptInput);
        if (data.detectedElements) setDetectedElements(data.detectedElements);
        addToast('Proyek berhasil di-restore!');
      } catch (err) { addToast('File backup rusak/invalid', 'error'); }
    };
    reader.readAsText(file);
  };

  const handleResetData = async (type) => {
    if (type === 'history') {
      setPromptHistory([]); addToast('Riwayat dihapus');
    } else {
      setAssets([]); setScenes([]); setPromptHistory([]); setScriptInput(''); setDetectedElements(null);
      localStorage.removeItem('sb_scriptInput'); localStorage.removeItem('sb_detectedElements');
      const db = await initDB();
      ['assets', 'scenes', 'history'].forEach(store => db.transaction(store, 'readwrite').objectStore(store).clear());
      addToast('Seluruh data di-reset total');
    }
  };

  return (
    <div className="h-full min-h-screen flex flex-col md:flex-row font-sans bg-zinc-950 text-zinc-100 selection:bg-amber-500/30">
      
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border ${t.type === 'error' ? 'bg-red-950 border-red-800 text-red-200' : 'bg-emerald-950 border-emerald-800 text-emerald-200'} animate-fadeIn`}>
            <Icons.Check /> <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto print:hidden">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-zinc-800">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-teal-400 text-zinc-950 rounded-lg"><Icons.Film /></div>
            <div>
              <h1 className="font-bold tracking-wide text-sm">STORYBOARD</h1>
              <p className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Studio AI</p>
            </div>
          </div>
          <nav className="space-y-1">
            {[ 
              { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard }, 
              { id: 'guide', label: '5 Levels Guide', icon: Icons.Layers }, 
              { id: 'script', label: 'Naskah (Breakdown)', icon: Icons.FileText }, 
              { id: 'assets', label: 'Saved @tags', icon: Icons.FolderGit2 }, 
              { id: 'builder', label: 'Scene Builder', icon: Icons.Video }, 
              { id: 'history', label: 'Timeline & History', icon: Icons.History }, 
              { id: 'settings', label: 'Pengaturan', icon: Icons.Settings } 
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}>
                <item.icon /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full relative print:p-0 print:bg-white print:text-black">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {activeTab === 'dashboard' && (
            <div className="animate-fadeIn space-y-6 print:hidden">
              <div><h2 className="text-3xl font-bold">Halo, Sutradara!</h2><p className="text-zinc-400 mt-1">Alur kerja standar "5 Levels of AI Video Prompting".</p></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[ { v: '5', l: 'Levels Prompt', c: 'amber' }, { v: assets.length, l: 'Saved @tags', c: 'teal' }, { v: scenes.length, l: 'Scene Breakdown', c: 'sky' }, { v: promptHistory.length, l: 'Riwayat', c: 'indigo' } ].map((s,i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-center">
                    <span className={`text-3xl font-black text-${s.c}-400`}>{s.v}</span>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="animate-fadeIn space-y-6 print:hidden">
              <h2 className="text-2xl font-bold">5 Levels of AI Video Prompting</h2>
              <p className="text-sm text-zinc-400 mb-6">Metode standar industri berdasarkan panduan Youri van Hofwegen untuk mendapatkan kontrol absolut pada AI Video Generator.</p>
              
              <div className="space-y-4">
                {[
                  { lvl: 1, title: 'The Lazy One-Liner', desc: 'Ide utuh hanya dalam satu kalimat. Hasilnya sangat acak dan video tidak akan konsisten jika digenerate ulang, karena AI mengambil alih kontrol yang tidak Anda tulis.' },
                  { lvl: 2, title: 'Describe the Shot', desc: 'Tambahkan 5 unsur wajib yang tidak ada di Level 1: Subject, Action, Setting, Lighting, dan Mood. Peringatan: Jangan pernah menulis kata emosi abstrak seperti "tegang" (tense), tetapi deskripsikan lewat bahasa tubuh (misal: "rahang mengeras").' },
                  { lvl: 3, title: 'Direct the Camera', desc: 'Kendalikan kamera secara spesifik. Tentukan ukuran shot, angle, pergerakan, dan jenis lensa (contoh: "Medium shot on a wide lens, low angle, tracking behind him").' },
                  { lvl: 4, title: 'Build a Shot List', desc: 'Prompt berubah dari bentuk paragraf menjadi format "Blok Kaku" dengan timestamp [0-4s]. Gunakan instruksi HARD CUT untuk transisi antar shot di dalam satu durasi.' },
                  { lvl: 5, title: 'Lock the Character (@tags)', desc: 'Gunakan referensi visual karakter (3-Panel Character Sheet) yang dihubungkan dengan sebutan spesifik (seperti @ManCool). Hal ini memastikan wajah, pakaian, dan properti tidak pernah berubah-ubah sepanjang video berjalan.' }
                ].map(item => (
                  <div key={item.lvl} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex gap-5 items-start transition hover:bg-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl shrink-0 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                      {item.lvl}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="animate-fadeIn space-y-6 print:hidden">
              <h2 className="text-2xl font-bold">Breakdown Naskah Cerita</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <textarea value={scriptInput} onChange={e => setScriptInput(e.target.value)} placeholder="Tulis, Dikte, atau Upload PDF Naskah Anda..." className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500 resize-none mb-3 disabled:opacity-50" disabled={!!pdfFile} />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <button onClick={startSpeechRecognition} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><Icons.Mic /> Dikte Suara</button>
                    <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-2">
                      <Icons.FileText /> Upload PDF <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                    {pdfName && (<div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"><span>{pdfName}</span><button onClick={clearPdf}><Icons.X /></button></div>)}
                  </div>
                </div>

                <button onClick={handleAnalyzeScript} disabled={isAnalyzingScript || (!scriptInput.trim() && !pdfFile)} className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 px-5 rounded-xl text-sm disabled:opacity-50 flex justify-center items-center gap-2">
                  <Icons.Sparkles /> {isAnalyzingScript ? 'AI Sedang Membaca...' : 'Otomatis Pecah Jadi Shot List & Elemen'}
                </button>
              </div>

              {detectedElements && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-fadeIn">
                  <h3 className="font-bold text-teal-400 border-b border-zinc-800 pb-3 mb-4 flex items-center gap-2"><Icons.Sparkles /> Elemen Terdeteksi (@tags)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['characters', 'props', 'environments'].map((key) => (
                      <div key={key}>
                        <strong className="text-[10px] text-amber-400 uppercase tracking-widest block mb-2">{key}</strong>
                        <div className="space-y-2">
                          {detectedElements[key]?.map((el, i) => (
                            <div key={i} className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                              <strong className="text-zinc-100 block mb-1">{el.name}</strong><span className="text-[11px] text-zinc-500 line-clamp-3 mb-2">{el.description}</span>
                              <button onClick={() => { setEditingAsset({ category: key === 'characters' ? 'character' : key === 'environments' ? 'environment' : 'prop', name: `@${el.name.replace(/\s+/g, '')}`, description: el.description, images: [], tags: [] }); setIsAssetModalOpen(true); }} className="text-[10px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2 py-1.5 rounded w-full border border-amber-500/20 font-semibold">+ Simpan @tag</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {scenes?.map(scene => (
                  <div key={scene.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-amber-400">{scene.title}</h3>
                      <span className="text-xs text-zinc-500">⏱ Estimasi: {scene.duration}</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-4">{scene.summary}</p>
                    <div className="space-y-3">
                      {scene.shots?.map((shot, idx) => (
                        <div key={shot.id || idx} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex gap-4 justify-between items-center">
                          <div className="text-sm text-zinc-300 flex-1">
                            <div><strong className="text-teal-400">Shot {idx+1}:</strong> {shot.action}</div>
                          </div>
                          <button onClick={() => applyShotToBuilder(shot)} className="text-xs bg-teal-500/20 text-teal-400 px-4 py-2 rounded-lg shrink-0 font-bold">Bawa ke Builder</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="animate-fadeIn space-y-6 print:hidden">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Saved @tags (Level 5)</h2>
                <button onClick={() => { setEditingAsset({ category: 'character', name: '@', description: '', images: [] }); setIsAssetModalOpen(true); }} className="bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2"><Icons.Plus /> Tambah @tag</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4">
                    <div className="w-20 h-20 bg-zinc-950 rounded-lg shrink-0 overflow-hidden flex items-center justify-center border border-zinc-800">{asset.images?.[0] ? <img src={asset.images[0]} alt={asset.name} className="w-full h-full object-cover" /> : <Icons.Image />}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-amber-400">{asset.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{asset.description}</p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { setEditingAsset(asset); setIsAssetModalOpen(true); }} className="text-xs bg-zinc-800 px-3 py-1 rounded">Edit</button>
                        <button onClick={() => setAssets(assets.filter(a => a.id !== asset.id))} className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded"><Icons.Trash /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'builder' && (
            <div className="animate-fadeIn space-y-6 print:hidden">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Scene Builder</h2>
                <button onClick={handleAiCinematicDirector} disabled={isAiCinematicLoading} className="bg-gradient-to-r from-teal-500 to-sky-500 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <Icons.Sparkles /> {isAiCinematicLoading ? 'Merancang...' : 'Sutradara AI'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Level Prompt</label>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-zinc-400 uppercase">Rasio:</label>
                          <select value={builderShot.aspectRatio} onChange={e=>setBuilderShot({...builderShot, aspectRatio: e.target.value})} className="bg-zinc-950 border border-zinc-700 text-xs rounded p-1 text-white">
                            <option value="16:9">16:9 (YouTube)</option><option value="21:9">21:9 (Cinema)</option><option value="9:16">9:16 (TikTok)</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-zinc-400 uppercase">Durasi (s):</label>
                          <input type="number" value={sceneDuration} onChange={e=>setSceneDuration(e.target.value)} className="w-16 bg-zinc-950 border border-zinc-700 text-xs rounded p-1 text-center text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button key={lvl} onClick={() => setPromptLevel(lvl)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${promptLevel === lvl ? 'bg-amber-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'}`}>Lvl {lvl}</button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    {promptLevel >= 2 && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Subjek</label><input type="text" value={builderShot.subject} onChange={e=>setBuilderShot({...builderShot, subject: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Setting Tempat</label><input type="text" value={builderShot.setting} onChange={e=>setBuilderShot({...builderShot, setting: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                        </div>
                        <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Aksi</label><textarea value={builderShot.action} onChange={e=>setBuilderShot({...builderShot, action: e.target.value})} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1 resize-none" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Lighting</label><input type="text" value={builderShot.lighting} onChange={e=>setBuilderShot({...builderShot, lighting: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase flex justify-between">Mood <span title="Gunakan deskripsi fisik spt 'rahang mengeras', jangan 'tegang'" className="text-[8px] text-amber-500 cursor-help">ℹ️ Aturan Youri</span></label><input type="text" value={builderShot.mood} onChange={e=>setBuilderShot({...builderShot, mood: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                        </div>
                      </>
                    )}
                    {promptLevel >= 3 && (<div className="pt-3 border-t border-zinc-800"><label className="text-[10px] font-bold text-sky-400 uppercase">Pergerakan Kamera</label><input type="text" value={builderShot.cameraMotion} onChange={e=>setBuilderShot({...builderShot, cameraMotion: e.target.value})} className="w-full bg-sky-950/20 border border-sky-900/50 rounded-lg p-2.5 text-sm mt-1" /></div>)}
                    <div className="pt-3 border-t border-zinc-800"><label className="text-[10px] font-bold text-teal-400 uppercase">Dialog</label><input type="text" value={builderShot.dialogue} onChange={e=>setBuilderShot({...builderShot, dialogue: e.target.value})} className="w-full bg-teal-950/20 border border-teal-900/50 rounded-lg p-2.5 text-sm mt-1 text-teal-200" /></div>
                    {promptLevel === 5 && (
                      <div className="pt-3 border-t border-zinc-800">
                        <label className="text-[10px] font-bold text-teal-400 uppercase block mb-2">Saved @tags</label>
                        <div className="flex flex-wrap gap-2">{assets.map(asset => (
                          <button key={asset.id} onClick={() => { const isSel = builderShot.selectedAssetIds.includes(asset.id); setBuilderShot(prev => ({ ...prev, selectedAssetIds: isSel ? prev.selectedAssetIds.filter(id => id !== asset.id) : [...prev.selectedAssetIds, asset.id] })) }} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${builderShot.selectedAssetIds.includes(asset.id) ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'border-zinc-700 text-zinc-400 bg-zinc-950'}`}>{asset.name}</button>
                        ))}</div>
                      </div>
                    )}
                    <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                      <input type="checkbox" checked={builderShot.antiGlitch} onChange={e=>setBuilderShot({...builderShot, antiGlitch: e.target.checked})} className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-zinc-900" id="antiGlitch"/>
                      <label htmlFor="antiGlitch" className="text-xs text-zinc-400 font-bold">Aktifkan Anti-Glitch Matrix (Cegah jari rusak dll)</label>
                    </div>
                  </div>
                  <button onClick={handleGeneratePrompt} disabled={isGeneratingPrompt} className="w-full bg-gradient-to-r from-amber-500 to-teal-500 text-zinc-950 font-black py-4 px-6 rounded-2xl shadow-lg">
                    {isGeneratingPrompt ? 'Memproses...' : `GENERATE PROMPT LEVEL ${promptLevel}`}
                  </button>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sticky top-8">
                    <h3 className="font-bold text-sm text-amber-400 mb-4 flex items-center gap-2"><Icons.Film /> Hasil Prompt AI</h3>
                    {generatedPromptResult && (
                      <div className="space-y-4 animate-fadeIn">
                        <div>
                          <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-emerald-400 uppercase">Positive Prompt</span><button onClick={() => copyToClipboard(generatedPromptResult.positivePrompt)} className="text-zinc-400"><Icons.Copy /></button></div>
                          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">{generatedPromptResult.positivePrompt}</div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-rose-400 uppercase">Negative Prompt</span></div>
                          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 font-mono">{generatedPromptResult.negativePrompt}</div>
                        </div>
                        <button onClick={() => { setPromptHistory([{ id: Date.now().toString(), level: promptLevel, ...generatedPromptResult }, ...promptHistory]); addToast('Tersimpan di Timeline'); }} className="w-full bg-zinc-800 py-3 rounded-xl text-xs font-bold mt-2">Simpan ke Timeline</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex justify-between items-center print:hidden">
                <h2 className="text-2xl font-bold">Timeline & History</h2>
                <button onClick={() => window.print()} className="bg-amber-500 text-zinc-950 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"><Icons.FileText /> Cetak PDF</button>
              </div>
              
              <div className="print:block print:text-black hidden mb-6 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-black uppercase">Visual Storyboard</h1>
                <p className="text-sm font-bold text-gray-600">Generated via Storyboard Studio AI</p>
              </div>

              <div className="space-y-4 print:space-y-8">
                {promptHistory.map((hist, index) => (
                  <div key={hist.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, index)} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4 cursor-move print:bg-white print:border-gray-300 print:break-inside-avoid">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2 print:border-gray-300">
                      <span className="text-[10px] text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded print:text-black print:bg-gray-200">SHOT {promptHistory.length - index} | LEVEL {hist.level}</span>
                      <button onClick={() => copyToClipboard(hist.positivePrompt)} className="text-xs bg-zinc-800 px-3 py-1 rounded print:hidden">Copy</button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {hist.positivePrompt && (
                        <div className="w-full md:w-1/3 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 shrink-0 print:border-gray-300">
                          <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(hist.positivePrompt.substring(0,200))}?width=800&height=450&nologo=true`} alt="Storyboard Sketch" className="w-full object-cover aspect-video" />
                        </div>
                      )}
                      <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap print:text-black print:text-sm">{hist.positivePrompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fadeIn space-y-6 print:hidden">
              <h2 className="text-2xl font-bold">Pengaturan Aplikasi</h2>
              
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-8">
                
                {/* Fitur Backup & Restore JSON (Prominent) */}
                <div>
                  <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                    <Icons.FolderGit2 /> Backup & Restore Proyek
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Simpan seluruh progres Anda (Naskah, @tags, Scene Breakdown, dan Riwayat Prompt) ke dalam satu file <strong>.json</strong>. 
                    Anda bisa membawanya ke komputer lain atau membagikannya ke rekan tim Anda.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={handleExportProject} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-5 py-3 rounded-lg font-bold hover:bg-emerald-500/30 flex items-center gap-2 transition-colors">
                      <Icons.Save /> Ekspor Proyek (.json)
                    </button>
                    
                    <label className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs px-5 py-3 rounded-lg font-bold hover:bg-sky-500/30 flex items-center gap-2 cursor-pointer transition-colors">
                      <Icons.Download /> Impor Proyek (.json)
                      <input type="file" accept=".json" className="hidden" onChange={handleImportProject} />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <h3 className="text-red-400 font-bold mb-2">Hapus Riwayat Prompt</h3>
                  <p className="text-xs text-zinc-400 mb-3">Menghapus daftar riwayat di menu Timeline, tapi Naskah dan @tags Anda tetap aman.</p>
                  <button onClick={() => handleResetData('history')} className="bg-zinc-800 text-xs px-4 py-2 rounded-lg font-bold hover:bg-zinc-700">Kosongkan Riwayat</button>
                </div>
                
                <div className="pt-6 border-t border-zinc-800">
                  <h3 className="text-red-500 font-bold mb-2">Reset Total (Bahaya)</h3>
                  <p className="text-xs text-zinc-400 mb-3">Menghapus seluruh Naskah, @tags, dan Riwayat. Aplikasi akan kembali seperti baru.</p>
                  <button onClick={() => { if(window.confirm('Yakin hapus semua?')) handleResetData('all'); }} className="bg-red-500 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-red-600">Reset Semua Data</button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {isAssetModalOpen && editingAsset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl flex flex-col shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between bg-zinc-950">
              <h3 className="font-bold text-amber-400">{editingAsset.id ? 'Edit @tag' : 'Buat @tag Baru'}</h3>
              <button onClick={() => setIsAssetModalOpen(false)}><Icons.X /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-xs text-zinc-400 font-bold block mb-1">Nama Tag (pakai @)</label><input type="text" value={editingAsset.name} onChange={e=>setEditingAsset({...editingAsset, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm" /></div>
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-2">Gambar (Opsional)</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden shrink-0">{editingAsset.images?.[0] ? <img src={editingAsset.images[0]} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icons.Image /></div>}</div>
                  <input type="file" accept="image/*" onChange={handleAssetImageUpload} className="text-xs text-zinc-400" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="text-xs text-zinc-400 font-bold">Deskripsi</label>
                  <div className="flex gap-2">
                    <button onClick={()=>handleGenerateAssetPrompt(editingAsset)} disabled={isAutoDescribing || !editingAsset.description} className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-1 rounded border border-sky-500/30 font-bold" title="Standar Youri">3-Panel Prompt</button>
                    <button onClick={()=>handleAutoDescribe(editingAsset)} disabled={isAutoDescribing || !editingAsset.images?.[0]} className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-1 rounded border border-teal-500/30 font-bold">Auto-Describe</button>
                  </div>
                </div>
                <textarea value={editingAsset.description} onChange={e=>setEditingAsset({...editingAsset, description: e.target.value})} rows={5} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm resize-none" placeholder="Deskripsi fisik/pakaian secara spesifik..." />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button onClick={() => setIsAssetModalOpen(false)} className="px-5 py-2 text-sm text-zinc-400 font-medium">Batal</button>
              <button onClick={saveAsset} className="px-5 py-2 text-sm bg-teal-500 text-zinc-950 font-black rounded-xl">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
