import { useState, useEffect } from 'react';

// --- ICONS (SVG INTERNAL, 100% AMAN DARI ERROR DEPENDENCY) ---
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
  BookOpen: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  FileUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  AlertTriangle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

// --- INDEXEDDB SETUP (Aman memori besar) ---
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
  } catch (err) { void err; }
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
  } catch (err) { void err; return null; }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Data Global
  const [assets, setAssets] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);
  
  // Settings & Playbook
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [playbook, setPlaybook] = useState(localStorage.getItem('directorsPlaybook') || '');

  // Script Analyzer
  const [scriptInput, setScriptInput] = useState(localStorage.getItem('savedScript') || '');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [isAnalyzingScript, setIsAnalyzingScript] = useState(false);
  const [detectedElements, setDetectedElements] = useState(JSON.parse(localStorage.getItem('detectedElements')) || null);
  
  // Asset Management
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAutoDescribing, setIsAutoDescribing] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // Scene Builder
  const [promptLevel, setPromptLevel] = useState(5);
  const [startingFrame, setStartingFrame] = useState(null);
  const [builderShot, setBuilderShot] = useState({
    lazyOneLiner: '', subject: '', action: '', setting: '', lighting: '', mood: '', cameraMotion: '', continuity: '', dialogue: '', selectedAssetIds: [],
  });
  const [generatedPromptResult, setGeneratedPromptResult] = useState(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isAiCinematicLoading, setIsAiCinematicLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Auto-save Setup
  useEffect(() => { localStorage.setItem('geminiApiKey', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('directorsPlaybook', playbook); }, [playbook]);
  useEffect(() => { localStorage.setItem('savedScript', scriptInput); }, [scriptInput]);
  useEffect(() => { localStorage.setItem('detectedElements', JSON.stringify(detectedElements)); }, [detectedElements]);

  useEffect(() => {
    const loadDB = async () => {
      const savedAssets = await getFromDB('assets');
      const savedScenes = await getFromDB('scenes');
      const savedHistory = await getFromDB('history');
      setAssets(savedAssets || []);
      setScenes(savedScenes || []);
      setPromptHistory(savedHistory || []);
      setIsDbLoaded(true);
    };
    loadDB();
  }, []);

  useEffect(() => { if (isDbLoaded) saveToDB('assets', assets); }, [assets, isDbLoaded]);
  useEffect(() => { if (isDbLoaded) saveToDB('scenes', scenes); }, [scenes, isDbLoaded]);
  useEffect(() => { if (isDbLoaded) saveToDB('history', promptHistory); }, [promptHistory, isDbLoaded]);

  // Toast System
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Tersalin ke clipboard');
  };

  // Naskah Handlers
  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      return addToast('Hanya mendukung format PDF', 'error');
    }
    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result.split(',')[1];
      setPdfFile(base64);
    };
    reader.readAsDataURL(file);
  };
  const clearPdf = () => { setPdfFile(null); setPdfName(''); };

  const handleAnalyzeScript = async () => {
    if (!apiKey) return addToast('API Key Gemini diperlukan di Pengaturan', 'error');
    if (!scriptInput.trim() && !pdfFile) return addToast('Teks naskah atau file PDF kosong', 'error');
    setIsAnalyzingScript(true);
    
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      let promptText = `Analisis naskah ini berdasarkan materi "5 Levels of AI Video Prompting". 
Pecah cerita menjadi scenes, dan dalam setiap scene buat daftar "shots".
Ekstrak semua elemen: Karakter, Properti (barang), dan Lokasi (environment).
Format output HARUS JSON Valid Murni tanpa markdown dengan struktur:
{"detectedElements": {"characters": [{"name": "", "description": ""}], "props": [{"name": "", "description": ""}], "environments": [{"name": "", "description": ""}]}, "scenes": [{"id": "scene-1", "title": "", "summary": "", "shots": [{"id": "shot-1", "subject": "", "action": "", "setting": "", "lighting": "", "mood": "", "cameraMotion": ""}]}]}`;

      if (scriptInput.trim()) promptText += `\n\nNaskah:\n${scriptInput}`;
      else promptText += `\n\nAnalisis dokumen PDF yang dilampirkan ini secara saksama.`;

      const parts = [{ text: promptText }];
      if (pdfFile) parts.push({ inlineData: { mimeType: "application/pdf", data: pdfFile } });

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: parts }], generationConfig: { responseMimeType: "application/json" } })
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsedData = JSON.parse(cleanJson);
        if (parsedData.scenes) {
          setScenes(parsedData.scenes);
          if (parsedData.detectedElements) setDetectedElements(parsedData.detectedElements);
        }
        addToast('Naskah berhasil dianalisis!');
      }
    } catch (e) { 
      void e;
      addToast('Gagal menganalisis naskah.', 'error'); 
    } finally { 
      setIsAnalyzingScript(false); 
    }
  };

  // Sutradara AI + Starting Frame
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64data = event.target.result.split(',')[1];
        setStartingFrame({ data: base64data, mimeType: file.type, previewUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiCinematicDirector = async () => {
    if (!apiKey) return addToast('API Key Gemini diperlukan', 'error');
    setIsAiCinematicLoading(true);
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      let promptText = `Bertindaklah sebagai Sutradara Film Profesional. Berdasarkan ide dasar: "${builderShot.action || builderShot.lazyOneLiner || 'sebuah adegan'}".
Buatlah rancangan parameter sinematik yang sangat detail.
KHUSUS UNTUK DIALOG: Buat dialog bahasa Indonesia yang natural, mengalir, santai.`;

      if (playbook) promptText += `\n\n[PANDUAN SUTRADARA]:\n${playbook}\nPatuhi prinsip pergerakan kamera dari panduan ini.`;
      if (startingFrame) promptText += `\n\n[REFERENSI VISUAL]: Analisis gambar starting frame yang dilampirkan untuk menentukan 'cameraMotion' yang epik.`;

      promptText += `\n\nKembalikan HANYA JSON Valid Murni: {"subject": "", "action": "", "setting": "", "lighting": "", "mood": "", "cameraMotion": "", "dialogue": ""}`;

      const parts = [{ text: promptText }];
      if (startingFrame) parts.push({ inlineData: { mimeType: startingFrame.mimeType, data: startingFrame.data } });

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: "application/json" } })
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let result = JSON.parse(rawJson.replace(/```json/gi, '').replace(/```/g, '').trim());
        setBuilderShot(prev => ({
          ...prev, ...result, lazyOneLiner: `${result.subject} ${result.action} di ${result.setting}`
        }));
        addToast('Sutradara AI telah merancang adegan!');
      }
    } catch (e) {
      void e;
      addToast('Gagal merancang adegan', 'error');
    } finally {
      setIsAiCinematicLoading(false);
    }
  };

  // Asset Handlers
  const handleAssetImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setEditingAsset(prev => ({ ...prev, images: [event.target.result] }));
      reader.readAsDataURL(file);
    }
  };

  const handleAutoDescribe = async (assetData) => {
    if (!apiKey) return addToast('API Key Gemini diperlukan', 'error');
    if (!assetData.images || assetData.images.length === 0) return addToast('Pilih gambar dulu', 'error');
    const imageString = assetData.images[0];
    const base64Data = imageString.includes(',') ? imageString.split(',')[1] : null;
    const mimeType = imageString.match(/data:(.*?);/)?.[1] || "image/jpeg";
    if (!base64Data) return addToast('Format gambar tidak valid', 'error');

    setIsAutoDescribing(true);
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [
              { text: `Deskripsikan gambar ini sangat detail untuk digunakan sebagai @tags konsisten dalam AI Video Prompting.` },
              { inlineData: { mimeType: mimeType, data: base64Data } }
          ]}]
        })
      });
      const data = await res.json();
      const desc = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (desc) {
        setEditingAsset(prev => ({ ...prev, description: desc }));
        addToast('Deskripsi visual dibuat');
      }
    } catch (e) { 
      void e;
      addToast('Gagal auto-describe', 'error'); 
    } finally { 
      setIsAutoDescribing(false); 
    }
  };

  const saveAsset = () => {
    if (!editingAsset.name || !editingAsset.description) return addToast('Nama & Deskripsi wajib diisi', 'error');
    if (editingAsset.id) setAssets(assets.map(a => a.id === editingAsset.id ? editingAsset : a));
    else setAssets([...assets, { ...editingAsset, id: `asset-${Date.now()}` }]);
    setIsAssetModalOpen(false);
    addToast('Aset berhasil disimpan');
  };

  // Generate Prompt Video
  const handleGeneratePrompt = async () => {
    if (!apiKey) return addToast('API Key Gemini diperlukan', 'error');
    setIsGeneratingPrompt(true);
    try {
      let tagsSummary = '';
      if (promptLevel === 5) {
        const selectedAssetsObjects = assets.filter(a => builderShot.selectedAssetIds.includes(a.id));
        selectedAssetsObjects.forEach(asset => { tagsSummary += `\n- Tag: ${asset.name} (Deskripsi: ${asset.description})`; });
      }

      const systemPrompt = `Anda adalah Prompt Engineer AI Video profesional. Pengguna meminta prompt LEVEL ${promptLevel}.
Aturan:
- Level 1: Hanya 1 kalimat instan.
- Level 2: Deskripsikan Subject, Action, Setting, Lighting, Mood.
- Level 3: Tambahkan instruksi Camera Motion.
- Level 4: Buat format blok: SCENE, FRAME MAP, SUBJECT LOCK, CROSS-FRAME RULES, CAMERA, AUDIO, NEGATIVE PROMPT.
- Level 5: Masukkan parameter sebelumnya, ganti nama dengan @tags.
Kembalikan JSON Murni: { "positivePrompt": "...", "negativePrompt": "..." }`;

      const userPrompt = `
DATA INPUT:
Level 1: ${builderShot.lazyOneLiner}
Level 2: Subjek: ${builderShot.subject} | Aksi: ${builderShot.action} | Setting: ${builderShot.setting} | Light: ${builderShot.lighting} | Mood: ${builderShot.mood}
Level 3: Camera Motion: ${builderShot.cameraMotion}
Level 4: Continuity: ${builderShot.continuity}
Dialog: ${builderShot.dialogue}
Level 5 @tags: ${tagsSummary || 'Tidak ada'}
`;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        setGeneratedPromptResult(JSON.parse(cleanJson));
        addToast(`Prompt Level ${promptLevel} berhasil digenerate!`);
      }
    } catch (e) { 
      void e;
      addToast('Gagal merangkai prompt', 'error'); 
    } finally { 
      setIsGeneratingPrompt(false); 
    }
  };

  // Export / Import Backup JSON
  const handleExportBackup = () => {
    const data = { assets, scenes, history: promptHistory };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Storyboard_Backup.json`; a.click();
    addToast('Proyek berhasil diekspor!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.assets) setAssets(imported.assets);
          if (imported.scenes) setScenes(imported.scenes);
          if (imported.history) setPromptHistory(imported.history);
          addToast("Proyek direstore!");
        } catch (err) {
          void err;
          addToast("File tidak valid!", 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const executeReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="h-full min-h-screen flex flex-col md:flex-row font-sans bg-zinc-950 text-zinc-100 selection:bg-amber-500/30">
      
      {/* TOAST SYSTEM */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border ${t.type === 'error' ? 'bg-red-950 border-red-800 text-red-200' : 'bg-emerald-950 border-emerald-800 text-emerald-200'} animate-fadeIn`}>
            <Icons.Check /> <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* CONFIRMATION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-red-900 p-6 rounded-xl max-w-sm text-center">
            <div className="flex justify-center text-red-500 mb-4"><Icons.AlertTriangle /></div>
            <h3 className="font-bold text-white mb-2">Hapus Semua Data?</h3>
            <p className="text-sm text-zinc-400 mb-6">Tindakan ini akan menghapus semua naskah, aset, dan riwayat secara permanen dari browser.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700">Batal</button>
              <button onClick={executeReset} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 font-bold">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
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
              { id: 'history', label: 'Riwayat Prompts', icon: Icons.History },
              { id: 'settings', label: 'Pengaturan', icon: Icons.Settings }
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}>
                <item.icon /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full relative">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="animate-fadeIn space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Halo, Sutradara!</h2>
                <p className="text-zinc-400 mt-1">Alur kerja ini disesuaikan 100% dengan panduan <strong>&quot;5 Levels of AI Video Prompting&quot;</strong>.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-center"><span className="text-3xl font-black text-amber-400">5</span><p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Levels Prompt</p></div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-center"><span className="text-3xl font-black text-teal-400">{assets.length}</span><p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Saved @tags</p></div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-center"><span className="text-3xl font-black text-sky-400">{scenes.length}</span><p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Scene Breakdown</p></div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-center"><span className="text-3xl font-black text-indigo-400">{promptHistory.length}</span><p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">Riwayat</p></div>
              </div>
              <div className="bg-teal-950 border border-teal-900 p-5 rounded-2xl flex items-start gap-4">
                <Icons.Sparkles />
                <div>
                  <h3 className="font-bold text-teal-300">Alur Kerja yang Disarankan:</h3>
                  <ol className="list-decimal ml-4 mt-2 text-sm text-teal-100/80 space-y-1">
                    <li>Pecah naskah atau PDF Anda di menu <strong>Naskah (Breakdown)</strong>.</li>
                    <li>Gunakan <strong>Scene Builder</strong> dengan fitur <em>Sutradara AI</em> untuk otomatis merancang angle kamera.</li>
                    <li>Gunakan Saved @tags untuk konsistensi karakter absolut.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GUIDE */}
          {activeTab === 'guide' && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-2xl font-bold">5 Levels of AI Video Prompting</h2>
              <div className="space-y-3">
                {[
                  { lvl: 1, title: 'The Lazy One-Liner', desc: 'Ide utuh dalam satu kalimat. Hasilnya acak dan tidak konsisten jika digenerate ulang.' },
                  { lvl: 2, title: 'Describe the Shot', desc: 'Tambahkan 5 unsur: Subject, Action, Setting, Lighting, dan Mood. (Hindari emosi abstrak, gambarkan lewat fisik).' },
                  { lvl: 3, title: 'Define the Motion', desc: 'Kendalikan kamera. Tentukan pergerakan (pan, tracking, push-in) dan kecepatannya.' },
                  { lvl: 4, title: 'Shot List & Continuity', desc: 'Pecah adegan jadi urutan shot. Gunakan instruksi HARD CUT antar shot untuk membangun transisi.' },
                  { lvl: 5, title: 'Saved Elements & @tags', desc: 'Gunakan referensi wajah/objek konsisten dengan format @NamaTag (misal: @ManCool). Kontrol absolut.' }
                ].map(item => (
                  <div key={item.lvl} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">{item.lvl}</div>
                    <div><h3 className="font-bold text-zinc-200">{item.title}</h3><p className="text-sm text-zinc-400 mt-1">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NASKAH BREAKDOWN */}
          {activeTab === 'script' && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-2xl font-bold">Breakdown Naskah Cerita & PDF</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <textarea value={scriptInput} onChange={e => setScriptInput(e.target.value)} placeholder="Paste naskah kasar Anda di sini..." className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500 resize-none mb-3 disabled:opacity-50" disabled={!!pdfFile} />
                <div className="flex items-center justify-between gap-4 mb-4 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                      <Icons.FileText /> Upload Naskah PDF
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                    {pdfName && <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"><span>{pdfName}</span><button onClick={clearPdf} className="hover:text-amber-200 flex items-center"><Icons.X /></button></div>}
                  </div>
                  <div className="text-[10px] text-zinc-500">*AI akan menganalisis teks atau dokumen secara mendalam.</div>
                </div>
                <button onClick={handleAnalyzeScript} disabled={isAnalyzingScript || (!scriptInput.trim() && !pdfFile)} className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 px-5 rounded-xl text-sm disabled:opacity-50 flex justify-center items-center gap-2"><Icons.Sparkles /> {isAnalyzingScript ? 'AI Sedang Membaca Naskah...' : 'Otomatis Pecah Jadi Shot List & Elemen'}</button>
              </div>

              {detectedElements && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-fadeIn">
                  <h3 className="font-bold text-teal-400 border-b border-zinc-800 pb-3 mb-4 flex items-center gap-2"><Icons.Sparkles /> Elemen Terdeteksi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <strong className="text-[10px] text-amber-400 uppercase tracking-widest block mb-2">Karakter</strong>
                      <div className="space-y-2">{detectedElements.characters?.map((c, i) => (
                          <div key={`c-${i}`} className="text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <strong className="text-zinc-100 block">{c.name}</strong><span className="text-[11px] text-zinc-500 line-clamp-3 mb-2 block">{c.description}</span>
                            <button onClick={() => { setEditingAsset({ category: 'character', name: `@${c.name.replace(/\s+/g, '')}`, description: c.description, images: [] }); setIsAssetModalOpen(true); }} className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1.5 rounded w-full border border-amber-500/20 font-semibold">+ Simpan @tag</button>
                          </div>
                      ))}</div>
                    </div>
                    <div>
                      <strong className="text-[10px] text-sky-400 uppercase tracking-widest block mb-2">Properti</strong>
                      <div className="space-y-2">{detectedElements.props?.map((p, i) => (
                          <div key={`p-${i}`} className="text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <strong className="text-zinc-100 block">{p.name}</strong><span className="text-[11px] text-zinc-500 line-clamp-3 mb-2 block">{p.description}</span>
                            <button onClick={() => { setEditingAsset({ category: 'prop', name: `@${p.name.replace(/\s+/g, '')}`, description: p.description, images: [] }); setIsAssetModalOpen(true); }} className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-1.5 rounded w-full border border-sky-500/20 font-semibold">+ Simpan @tag</button>
                          </div>
                      ))}</div>
                    </div>
                    <div>
                      <strong className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-2">Lokasi</strong>
                      <div className="space-y-2">{detectedElements.environments?.map((e, i) => (
                          <div key={`e-${i}`} className="text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <strong className="text-zinc-100 block">{e.name}</strong><span className="text-[11px] text-zinc-500 line-clamp-3 mb-2 block">{e.description}</span>
                            <button onClick={() => { setEditingAsset({ category: 'environment', name: `@${e.name.replace(/\s+/g, '')}`, description: e.description, images: [] }); setIsAssetModalOpen(true); }} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1.5 rounded w-full border border-emerald-500/20 font-semibold">+ Simpan @tag</button>
                          </div>
                      ))}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {scenes?.map(scene => (
                  <div key={scene.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <h3 className="font-bold text-amber-400">{scene.title}</h3>
                    <p className="text-sm text-zinc-300 mb-4">{scene.summary}</p>
                    <div className="space-y-3">
                      {scene.shots?.map((shot, idx) => (
                        <div key={shot.id || idx} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-center gap-4">
                          <div className="text-sm text-zinc-300 space-y-1"><strong className="text-teal-400">Shot {idx+1}:</strong> {shot.action} <br/><span className="text-xs text-zinc-500">Cam: {shot.cameraMotion}</span></div>
                          <button onClick={() => { setBuilderShot(prev => ({...prev, ...shot})); setActiveTab('builder'); addToast('Bawa ke Builder'); }} className="text-xs bg-teal-500/20 text-teal-400 px-4 py-2 rounded-lg font-bold whitespace-nowrap">Bawa ke Builder</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASSET LIBRARY */}
          {activeTab === 'assets' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Saved @tags</h2>
                <button onClick={() => { setEditingAsset({ category: 'character', name: '@', description: '', images: [], tags: [] }); setIsAssetModalOpen(true); }} className="bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2"><Icons.Plus /> Tambah @tag</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.length === 0 ? <p className="text-sm text-zinc-500">Belum ada aset dibuat.</p> : assets.map(asset => (
                  <div key={asset.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4">
                    <div className="w-20 h-20 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 overflow-hidden">{asset.images?.[0] ? <img src={asset.images[0]} alt={asset.name} className="w-full h-full object-cover" /> : <Icons.Image />}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-amber-400">{asset.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{asset.description}</p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { setEditingAsset(asset); setIsAssetModalOpen(true); }} className="text-xs bg-zinc-800 px-3 py-1 rounded hover:bg-zinc-700">Edit</button>
                        <button onClick={() => setAssets(assets.filter(a => a.id !== asset.id))} className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded"><Icons.Trash /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SCENE BUILDER */}
          {activeTab === 'builder' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Scene Builder</h2>
                <button onClick={handleAiCinematicDirector} disabled={isAiCinematicLoading} className="bg-gradient-to-r from-teal-500 to-sky-500 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"><Icons.Sparkles /> {isAiCinematicLoading ? 'Sutradara AI Merancang...' : 'Sutradara AI (Auto Cinematic & Dialog)'}</button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* UPLOAD STARTING FRAME */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <label className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block mb-2">Starting Frame (Opsional)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-zinc-400 w-full" />
                    {startingFrame && <img src={startingFrame.previewUrl} alt="Preview" className="mt-3 h-24 rounded object-cover border border-zinc-700" />}
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-3">Tentukan Kedalaman Prompt (Level 1-5)</label>
                    <div className="flex gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button key={lvl} onClick={() => setPromptLevel(lvl)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${promptLevel === lvl ? 'bg-amber-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>Lvl {lvl}</button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    {promptLevel === 1 && (
                      <div><label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Ide Instan (Satu Kalimat)</label><input type="text" value={builderShot.lazyOneLiner} onChange={e=>setBuilderShot({...builderShot, lazyOneLiner: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500" placeholder="contoh: a car drifting around a corner" /></div>
                    )}
                    {promptLevel >= 2 && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Subjek</label><input type="text" value={builderShot.subject} onChange={e=>setBuilderShot({...builderShot, subject: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Setting Tempat</label><input type="text" value={builderShot.setting} onChange={e=>setBuilderShot({...builderShot, setting: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                        </div>
                        <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Aksi (Action)</label><textarea value={builderShot.action} onChange={e=>setBuilderShot({...builderShot, action: e.target.value})} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1 resize-none" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Lighting</label><input type="text" value={builderShot.lighting} onChange={e=>setBuilderShot({...builderShot, lighting: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                          <div><label className="text-[10px] font-bold text-zinc-400 uppercase">Mood</label><input type="text" value={builderShot.mood} onChange={e=>setBuilderShot({...builderShot, mood: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm mt-1" /></div>
                        </div>
                      </>
                    )}
                    {promptLevel >= 3 && (
                      <div className="pt-3 border-t border-zinc-800"><label className="text-[10px] font-bold text-sky-400 uppercase">Camera Motion</label><input type="text" value={builderShot.cameraMotion} onChange={e=>setBuilderShot({...builderShot, cameraMotion: e.target.value})} className="w-full bg-sky-950/20 border border-sky-900/50 rounded-lg p-2.5 text-sm mt-1" /></div>
                    )}
                    <div className="pt-3 border-t border-zinc-800"><label className="text-[10px] font-bold text-teal-400 uppercase">Dialog Bahasa Indonesia</label><input type="text" value={builderShot.dialogue} onChange={e=>setBuilderShot({...builderShot, dialogue: e.target.value})} className="w-full bg-teal-950/20 border border-teal-900/50 rounded-lg p-2.5 text-sm mt-1 text-teal-200" /></div>
                    {promptLevel >= 4 && (
                      <div className="pt-3 border-t border-zinc-800"><label className="text-[10px] font-bold text-indigo-400 uppercase">Kontinuitas</label><input type="text" value={builderShot.continuity} onChange={e=>setBuilderShot({...builderShot, continuity: e.target.value})} className="w-full bg-indigo-950/20 border border-indigo-900/50 rounded-lg p-2.5 text-sm mt-1" /></div>
                    )}
                    {promptLevel === 5 && (
                      <div className="pt-3 border-t border-zinc-800">
                        <label className="text-[10px] font-bold text-teal-400 uppercase block mb-2">Gunakan Saved @tags</label>
                        <div className="flex flex-wrap gap-2">
                          {assets.map(asset => (
                            <button key={`btn-${asset.id}`} onClick={() => {
                              const isSel = builderShot.selectedAssetIds.includes(asset.id);
                              setBuilderShot(prev => ({ ...prev, selectedAssetIds: isSel ? prev.selectedAssetIds.filter(id => id !== asset.id) : [...prev.selectedAssetIds, asset.id] }))
                            }} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${builderShot.selectedAssetIds.includes(asset.id) ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'border-zinc-700 text-zinc-400 bg-zinc-950 hover:bg-zinc-800'}`}>{asset.name}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={handleGeneratePrompt} disabled={isGeneratingPrompt} className="w-full bg-gradient-to-r from-amber-500 to-teal-500 text-zinc-950 font-black py-4 px-6 rounded-2xl">{isGeneratingPrompt ? 'Memproses Prompt AI...' : `GENERATE PROMPT LEVEL ${promptLevel}`}</button>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sticky top-8">
                    <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4"><Icons.Film /> Hasil Prompt Video AI</h3>
                    {!generatedPromptResult ? <div className="text-center py-12 text-zinc-600 text-xs italic">Isi form dan Generate.</div> : (
                      <div className="space-y-4 animate-fadeIn">
                        <div><div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-emerald-400 uppercase">Positive Prompt</span><button onClick={() => copyToClipboard(generatedPromptResult.positivePrompt)} className="text-zinc-400 hover:text-white"><Icons.Copy /></button></div><div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{generatedPromptResult.positivePrompt}</div></div>
                        <div><div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-rose-400 uppercase">Negative Prompt</span><button onClick={() => copyToClipboard(generatedPromptResult.negativePrompt)} className="text-zinc-400 hover:text-white"><Icons.Copy /></button></div><div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 font-mono leading-relaxed">{generatedPromptResult.negativePrompt || 'None'}</div></div>
                        <button onClick={() => { setPromptHistory([{ id: Date.now().toString(), level: promptLevel, ...generatedPromptResult }, ...promptHistory]); addToast('Tersimpan di Riwayat'); }} className="w-full bg-zinc-800 hover:bg-zinc-700 font-bold text-xs py-3 rounded-xl">Simpan ke Riwayat</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RIWAYAT TIMELINE */}
          {activeTab === 'history' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Riwayat Prompt</h2>
                <button onClick={() => {
                  const headers = ['Level', 'Positive Prompt', 'Negative Prompt'];
                  const rows = promptHistory.map(p => [p.level, `"${p.positivePrompt.replace(/"/g, '""')}"`, `"${(p.negativePrompt || '').replace(/"/g, '""')}"`]);
                  const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = 'prompts.csv'; a.click();
                }} className="bg-zinc-800 hover:bg-zinc-700 text-xs px-4 py-2 rounded-lg flex gap-2 items-center"><Icons.Download /> Ekspor CSV</button>
              </div>
              <div className="space-y-4">
                {promptHistory.map(hist => (
                  <div key={hist.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2"><span className="text-[10px] text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded">LEVEL {hist.level}</span><button onClick={() => copyToClipboard(hist.positivePrompt)} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded">Copy</button></div>
                    <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{hist.positivePrompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PENGATURAN */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Pengaturan Sistem</h2>
              
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h3 className="font-bold mb-2">Google Gemini API Key</h3>
                <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-amber-500" />
              </div>

              <div className="bg-zinc-900 p-6 rounded-xl border border-indigo-900/50 shadow-lg">
                <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><Icons.BookOpen/> Buku Panduan Sutradara</h3>
                <p className="text-sm text-zinc-400 mb-4">Paste ilmu sinematografi dari website favorit Anda. AI Sutradara akan membacanya sebelum memberi saran!</p>
                <textarea value={playbook} onChange={e=>setPlaybook(e.target.value)} placeholder="Contoh: Jika adegan aksi, gunakan 'Handheld tracking shot'..." className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-lg text-indigo-200 text-sm outline-none resize-none" rows="6" />
              </div>

              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h3 className="font-bold text-white mb-4">Backup & Restore Proyek (.json)</h3>
                <div className="flex gap-4">
                  <button onClick={handleExportBackup} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"><Icons.Download/> Ekspor Proyek</button>
                  <label className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold cursor-pointer"><Icons.FileUp/> Impor Proyek<input type="file" accept=".json" onChange={handleImportBackup} className="hidden" /></label>
                </div>
              </div>

              <div className="bg-red-950/30 p-6 rounded-xl border border-red-900/50 mt-8">
                <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2"><Icons.AlertTriangle/> Danger Zone</h3>
                <button onClick={() => setIsConfirmModalOpen(true)} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold mt-2">Hapus Seluruh Data & Reset</button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL ASSET */}
      {isAssetModalOpen && editingAsset && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl flex flex-col">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center"><h3 className="font-bold text-amber-400">{editingAsset.id ? 'Edit @tag' : 'Buat @tag Baru'}</h3><button onClick={() => setIsAssetModalOpen(false)} className="text-zinc-500 hover:text-white"><Icons.X /></button></div>
            <div className="p-5 space-y-4">
              <div><label className="text-xs text-zinc-400 font-bold block mb-1">Nama Tag</label><input type="text" value={editingAsset.name} onChange={e=>setEditingAsset({...editingAsset, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm" placeholder="contoh: @ManCool" /></div>
              <div><label className="text-xs text-zinc-400 font-bold block mb-2">Gambar Referensi</label><div className="flex gap-4 items-center"><div className="w-16 h-16 bg-zinc-950 rounded-lg overflow-hidden shrink-0">{editingAsset.images?.[0] ? <img src={editingAsset.images[0]} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Icons.Image /></div>}</div><input type="file" accept="image/*" onChange={handleAssetImageUpload} className="text-xs text-zinc-400 w-full" /></div></div>
              <div>
                <div className="flex justify-between items-end mb-1"><label className="text-xs text-zinc-400 font-bold block">Deskripsi Detail</label><button onClick={()=>handleAutoDescribe(editingAsset)} disabled={isAutoDescribing || !editingAsset.images?.[0]} className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"><Icons.Sparkles /> {isAutoDescribing ? 'Berpikir...' : 'Isi Otomatis'}</button></div>
                <textarea value={editingAsset.description} onChange={e=>setEditingAsset({...editingAsset, description: e.target.value})} rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm resize-none" placeholder="Jelaskan detail fisik..." />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3"><button onClick={() => setIsAssetModalOpen(false)} className="px-5 py-2 text-sm text-zinc-400 font-medium">Batal</button><button onClick={saveAsset} className="px-5 py-2 text-sm bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl">Simpan @tag</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
