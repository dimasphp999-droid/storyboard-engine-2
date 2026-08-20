import React, { useState, useEffect, useRef } from 'react';

// --- ICONS (SVG) ---
const Icons = {
  Film: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    </svg>
  ),
  LayoutDashboard: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  List: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  Download: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  ),
  FileText: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  FolderGit2: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  Video: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  History: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Settings: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Sparkles: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  Copy: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Camera: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Image: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  X: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  MessageSquare: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  Grid: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
};

// --- INDEXEDDB SETUP ---
const DB_NAME = 'StoryboardStudioDB';
const DB_VERSION = 1;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('assets'))
        db.createObjectStore('assets');
      if (!db.objectStoreNames.contains('scenes'))
        db.createObjectStore('scenes');
      if (!db.objectStoreNames.contains('history'))
        db.createObjectStore('history');
      if (!db.objectStoreNames.contains('settings'))
        db.createObjectStore('settings');
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
  } catch (e) {
    console.error('DB Save Error:', e);
  }
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
  } catch (e) {
    return null;
  }
};

// Default Sample Assets
const SAMPLE_ASSETS = [
  {
    id: 'asset-1',
    category: 'character',
    name: 'Renn (Protagonis)',
    description:
      'Pria usia 28 tahun, rambut hitam bergelombang pendek acak-acakan, mata cokelat tajam, rahang tegas dengan bekas luka kecil di pipi kiri. Menggunakan jaket kulit hitam lusuh dengan aksen neon biru di kerah, kaos abu-abu, tubuh tinggi atletis.',
    tags: ['protagonis', 'cyberpunk', 'pria'],
    images: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231e293b"/><circle cx="100" cy="80" r="45" fill="%2338bdf8"/><path d="M40 180 C40 130 160 130 160 180 Z" fill="%230284c7"/><text x="100" y="190" text-anchor="middle" fill="white" font-size="12">Renn Avatar</text></svg>',
    ],
  },
  {
    id: 'asset-2',
    category: 'environment',
    name: 'Atap Gedung Neo-Jakarta',
    description:
      'Atap pencakar langit gaya cyberpunk futuristik di malam hari. Hujan gerimis memantulkan cahaya neon merah teal dari papan iklan hologram raksasa di latar belakang. Lantai beton basah bergenang air, pipa-pipa uap berhembus samar.',
    tags: ['malam', 'cyberpunk', 'hujan', 'outdoor'],
    images: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23090d16"/><rect x="20" y="40" width="160" height="120" fill="%231e1b4b"/><circle cx="60" cy="80" r="25" fill="%23f43f5e" opacity="0.6"/><circle cx="140" cy="90" r="30" fill="%2314b8a6" opacity="0.6"/><text x="100" y="180" text-anchor="middle" fill="%2394a3b8" font-size="12">Neo Jakarta Rooftop</text></svg>',
    ],
  },
];

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [storyboardView, setStoryboardView] = useState('list'); // 'list' | 'grid'

  // Application Data States
  const [assets, setAssets] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);
  const [settings, setSettings] = useState({
    defaultLanguage: 'en',
    defaultStyle: 'Cinematic realistic',
    defaultDuration: 8,
    theme: 'dark',
  });

  // UI States
  const [toasts, setToasts] = useState([]);
  const [scriptInput, setScriptInput] = useState('');
  const [isAnalyzingScript, setIsAnalyzingScript] = useState(false);

  // Asset Modal States
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAutoDescribing, setIsAutoDescribing] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('all');

  // Scene Builder States
  const [builderShot, setBuilderShot] = useState({
    sceneName: '',
    actionDescription: '',
    dialogue: '',
    selectedAssetIds: [],
    camera: {
      shotType: 'Close-Up',
      angle: 'Eye-level',
      movement: 'Static',
      lens: 'Shallow depth of field',
    },
    lighting: {
      time: 'Malam',
      mood: 'Soft/Diffused',
      source: 'Artificial/practical lights',
      temperature: 'Cool',
    },
    style: 'Cinematic realistic',
    duration: 8,
  });
  const [generatedPromptResult, setGeneratedPromptResult] = useState(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isTuning, setIsTuning] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadDB = async () => {
      const savedAssets = await getFromDB('assets');
      const savedScenes = await getFromDB('scenes');
      const savedHistory = await getFromDB('history');
      const savedSettings = await getFromDB('settings');

      setAssets(savedAssets || SAMPLE_ASSETS);
      setScenes(savedScenes || []);
      setPromptHistory(savedHistory || []);
      if (savedSettings) setSettings(savedSettings);

      setIsDbLoaded(true);
    };
    loadDB();
  }, []);

  // Save to DB on change
  useEffect(() => {
    if (isDbLoaded) saveToDB('assets', assets);
  }, [assets, isDbLoaded]);
  useEffect(() => {
    if (isDbLoaded) saveToDB('scenes', scenes);
  }, [scenes, isDbLoaded]);
  useEffect(() => {
    if (isDbLoaded) saveToDB('history', promptHistory);
  }, [promptHistory, isDbLoaded]);
  useEffect(() => {
    if (isDbLoaded) saveToDB('settings', settings);
  }, [settings, isDbLoaded]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Tersalin ke clipboard');
  };

  const handleAnalyzeScript = async () => {
    if (!scriptInput.trim()) return addToast('Naskah kosong', 'error');
    setIsAnalyzingScript(true);
    try {
      const prompt = `Analisis naskah berikut dan pecah menjadi scenes dan shots untuk video generation.
Kembalikan HANYA JSON valid dengan struktur:
[
  {
    "id": "scene-1",
    "title": "Judul Scene",
    "summary": "Ringkasan",
    "location": "Lokasi",
    "suggestedShotCount": 2,
    "shots": [
      {
        "id": "shot-1",
        "description": "Aksi spesifik dalam shot ini",
        "selectedAssetIds": [],
        "camera": {"shotType": "Wide", "angle": "Eye-level", "movement": "Static", "lens": ""},
        "lighting": {"time": "Siang", "mood": "Natural", "source": "Sunlight", "temperature": "Warm"},
        "style": "Cinematic",
        "duration": 8
      }
    ]
  }
]
Naskah:
${scriptInput}
`;
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        setScenes(JSON.parse(rawJson));
        addToast('Naskah berhasil dianalisis!');
        setScriptInput('');
      }
    } catch (e) {
      addToast('Gagal menganalisis naskah', 'error');
    } finally {
      setIsAnalyzingScript(false);
    }
  };

  const handleAutoDescribe = async (assetData) => {
    if (!assetData.images || assetData.images.length === 0)
      return addToast('Pilih gambar dulu', 'error');

    // Extract base64 part
    const imageString = assetData.images[0];
    const base64Data = imageString.includes(',')
      ? imageString.split(',')[1]
      : null;
    const mimeType = imageString.match(/data:(.*?);/)?.[1] || 'image/jpeg';

    if (!base64Data) return addToast('Format gambar tidak valid', 'error');

    setIsAutoDescribing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Deskripsikan gambar ini secara detail secara visual untuk keperluan prompt AI Video Generator. Jelaskan ciri fisik, gaya rambut, pakaian, warna, postur tubuh, pencahayaan, atau detail lingkungan dengan bahasa Indonesia yang jelas. Jangan sertakan opini.`,
                },
                { inlineData: { mimeType: mimeType, data: base64Data } },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      const desc = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (desc) {
        setEditingAsset((prev) => ({ ...prev, description: desc }));
        addToast('Deskripsi otomatis berhasil dibuat');
      }
    } catch (e) {
      addToast('Gagal auto-describe', 'error');
    } finally {
      setIsAutoDescribing(false);
    }
  };

  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const selectedAssetsObjects = assets.filter((a) =>
        builderShot.selectedAssetIds.includes(a.id)
      );
      let referenceTagsHeader = '';
      let assetDescriptionsList = '';

      selectedAssetsObjects.forEach((asset, index) => {
        const refTag = `<IMAGE_REF_${index}>`;
        referenceTagsHeader += `[# References ${refTag}@${asset.name.replace(
          /\s+/g,
          '_'
        )}] `;
        assetDescriptionsList += `\n- ${refTag} (${asset.name}): ${asset.description}`;
      });

      const lang =
        settings.defaultLanguage === 'id' ? 'Bahasa Indonesia' : 'English';
      const systemPrompt = `Anda adalah Prompt Engineer Senior pakar AI Video Generation (khususnya Google Flow / Omni Flash). Tugas Anda merangkai Positive Video Prompt terstruktur yang presisi menggunakan format Tag Referensi Gambar [ # References <IMAGE_REF_N>@Nama ] serta Negative Prompt.`;

      const userPrompt = `
Aset Referensi yang digunakan:
${assetDescriptionsList || 'Tidak ada aset gambar khusus dipilih.'}

Konteks Aksi Shot: ${builderShot.actionDescription}
Dialog yang Diucapkan: "${builderShot.dialogue || 'TIDAK ADA DIALOG'}"

Jenis Shot: ${builderShot.camera.shotType}
Sudut Kamera: ${builderShot.camera.angle}
Pergerakan Kamera: ${builderShot.camera.movement}
Pencahayaan: ${builderShot.lighting.time}, Mood: ${builderShot.lighting.mood}
Gaya Visual: ${builderShot.style}

Aturan Output:
1. Mulai dengan tag referensi header contoh: "${referenceTagsHeader}".
2. Sebutkan tag <IMAGE_REF_N> secara eksplisit dalam adegan.
3. JIKA ADA DIALOG: Analisis intonasi dari teks dialog tersebut. JANGAN tuliskan teks dialog di dalam prompt. Sebaliknya, ubah intonasi tersebut menjadi deskripsi visual spesifik dari gerakan bibir (lip-sync realistis) dan ekspresi otot wajah (misal: "bibir bergerak cepat menahan amarah dengan dahi berkerut", atau "bibir terbuka lebar berteriak dengan mata melotot").
4. Sertakan instruksi kamera dan lighting di bagian akhir.
5. Sertakan "Guiding Instruction" wajib di akhir prompt:
"Use these images as visual references for this video. Do not use as a literal frame — maintain character, environment, and prop details strictly as shown in reference images."
6. "negativePrompt": Daftar atribut buruk yang dihindari (distortion, flickering, bad lip-sync, unnatural mouth, bad anatomy).
7. Bahasa Prompt Utama: ${lang}.

Kembalikan JSON valid:
{
  "positivePrompt": "...",
  "negativePrompt": "..."
}
`;
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawJson) {
        setGeneratedPromptResult(JSON.parse(rawJson));
        addToast('Prompt video berhasil digenerate!');
      } else throw new Error();
    } catch (err) {
      addToast('Gagal merangkai prompt.', 'error');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleTunePrompt = async (modifier) => {
    if (!generatedPromptResult) return;
    setIsTuning(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Tweak the following video prompt to make it "${modifier}". Keep ALL the reference tags (e.g. [# References <IMAGE_REF...>@...]) and the guiding instruction at the end EXACTLY as they are. Only modify the descriptive text to fit the new mood/style.\n\nPrompt:\n${generatedPromptResult.positivePrompt}`,
                },
              ],
            },
          ],
        }),
      });
      const data = await response.json();
      const newPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (newPrompt) {
        setGeneratedPromptResult((prev) => ({
          ...prev,
          positivePrompt: newPrompt,
        }));
        addToast(`Prompt disesuaikan: ${modifier}`);
      }
    } catch (e) {
      addToast('Gagal menyesuaikan prompt', 'error');
    } finally {
      setIsTuning(false);
    }
  };

  const savePromptToHistory = () => {
    if (!generatedPromptResult) return;
    const newEntry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...generatedPromptResult,
      usedAssetIds: builderShot.selectedAssetIds,
    };
    setPromptHistory([newEntry, ...promptHistory]);
    addToast('Prompt tersimpan di riwayat');
  };

  const handleAssetImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) =>
      setEditingAsset((prev) => ({ ...prev, images: [event.target.result] }));
    reader.readAsDataURL(file);
  };

  const saveAsset = () => {
    if (!editingAsset.name || !editingAsset.description)
      return addToast('Nama & Deskripsi wajib diisi', 'error');
    if (editingAsset.id) {
      setAssets(
        assets.map((a) => (a.id === editingAsset.id ? editingAsset : a))
      );
    } else {
      setAssets([...assets, { ...editingAsset, id: `asset-${Date.now()}` }]);
    }
    setIsAssetModalOpen(false);
    addToast('Aset berhasil disimpan');
  };

  const exportCSV = () => {
    const headers = [
      'ID',
      'Waktu Dibuat',
      'Positive Prompt',
      'Negative Prompt',
    ];
    const rows = promptHistory.map((p) => [
      p.id,
      p.createdAt,
      `"${p.positivePrompt.replace(/"/g, '""')}"`,
      `"${p.negativePrompt.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'storyboard_prompts.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Mengekspor CSV');
  };

  const handleExportWorkspace = () => {
    const workspaceData = { assets, scenes, promptHistory, settings };
    const blob = new Blob([JSON.stringify(workspaceData)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StoryboardStudio_Workspace_${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Workspace berhasil diekspor!');
  };

  const handleImportWorkspace = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.assets) setAssets(importedData.assets);
        if (importedData.scenes) setScenes(importedData.scenes);
        if (importedData.promptHistory)
          setPromptHistory(importedData.promptHistory);
        if (importedData.settings) setSettings(importedData.settings);
        addToast('Workspace berhasil diimpor!');
      } catch (error) {
        addToast('Gagal memuat file! Pastikan format JSON benar.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-zinc-950 text-zinc-100">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border bg-emerald-950 border-emerald-800 text-emerald-200 animate-fadeIn"
          >
            <Icons.Check /> <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-zinc-800">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-teal-400 text-zinc-950 rounded-xl">
              <Icons.Film />
            </div>
            <div>
              <h1 className="font-bold tracking-wider text-base">STORYBOARD</h1>
              <p className="text-xs text-amber-400 font-semibold tracking-widest">
                STUDIO AI
              </p>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              {
                id: 'dashboard',
                label: 'Beranda / Dashboard',
                icon: Icons.LayoutDashboard,
              },
              {
                id: 'script',
                label: 'Naskah & Storyboard',
                icon: Icons.FileText,
              },
              { id: 'assets', label: 'Asset Library', icon: Icons.FolderGit2 },
              { id: 'builder', label: 'Scene Builder', icon: Icons.Video },
              { id: 'history', label: 'Riwayat Prompt', icon: Icons.History },
              { id: 'settings', label: 'Pengaturan', icon: Icons.Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <item.icon /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Export Actions Sidebar */}
        <div className="border-t border-zinc-800 pt-4 space-y-2">
          <button
            onClick={exportCSV}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"
          >
            <Icons.Download /> Ekspor CSV (Prompt)
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-bold">Beranda</h2>
              <p className="text-zinc-400 mt-1">
                Ringkasan proyek naskah dan aset Anda yang tersimpan di memori
                lokal (IndexedDB).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-amber-400">
                  {scenes.length}
                </span>
                <span className="text-sm text-zinc-400 mt-2 uppercase tracking-wider font-semibold">
                  Scene Naskah
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-teal-400">
                  {assets.length}
                </span>
                <span className="text-sm text-zinc-400 mt-2 uppercase tracking-wider font-semibold">
                  Total Aset Visual
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-sky-400">
                  {promptHistory.length}
                </span>
                <span className="text-sm text-zinc-400 mt-2 uppercase tracking-wider font-semibold">
                  Prompt Tersimpan
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NASKAH & STORYBOARD */}
        {activeTab === 'script' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">Naskah & Storyboard</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Ubah teks naskah menjadi breakdown scene dan shot secara
                  otomatis menggunakan Gemini AI.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setStoryboardView('list')}
                  className={`p-2 rounded ${
                    storyboardView === 'list'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500'
                  }`}
                >
                  <Icons.List />
                </button>
                <button
                  onClick={() => setStoryboardView('grid')}
                  className={`p-2 rounded ${
                    storyboardView === 'grid'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500'
                  }`}
                >
                  <Icons.Grid />
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <textarea
                value={scriptInput}
                onChange={(e) => setScriptInput(e.target.value)}
                placeholder="Paste naskah cerita Anda di sini..."
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
              <button
                onClick={handleAnalyzeScript}
                disabled={isAnalyzingScript}
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-2.5 px-6 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Icons.Sparkles />{' '}
                {isAnalyzingScript
                  ? 'Menganalisis Naskah...'
                  : 'Analisis Naskah dengan AI'}
              </button>
            </div>

            <div
              className={
                storyboardView === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }
            >
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-amber-400">{scene.title}</h3>
                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                      {scene.location}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-4">{scene.summary}</p>

                  <div className="space-y-3">
                    {scene.shots.map((shot, idx) => (
                      <div
                        key={shot.id}
                        className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-zinc-500">
                            SHOT {idx + 1}
                          </span>
                          <button
                            onClick={() => {
                              setBuilderShot({
                                ...builderShot,
                                sceneName: scene.title,
                                actionDescription: shot.description,
                                camera: shot.camera,
                                lighting: shot.lighting,
                              });
                              setActiveTab('builder');
                            }}
                            className="text-xs bg-teal-500/20 text-teal-400 px-3 py-1 rounded-lg hover:bg-teal-500/30"
                          >
                            Ke Scene Builder
                          </button>
                        </div>
                        <p className="text-sm mt-2">{shot.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASSET LIBRARY */}
        {activeTab === 'assets' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">Asset Library</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Kelola karakter, environment, dan properti agar konsisten di
                  setiap video.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingAsset({
                    category: 'character',
                    name: '',
                    description: '',
                    images: [],
                    tags: [],
                  });
                  setIsAssetModalOpen(true);
                }}
                className="bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center gap-2"
              >
                <Icons.Plus /> Tambah Aset
              </button>
            </div>

            <div className="flex gap-2">
              {['all', 'character', 'environment', 'prop'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAssetCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize ${
                    assetCategoryFilter === cat
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {assets
                .filter(
                  (a) =>
                    assetCategoryFilter === 'all' ||
                    a.category === assetCategoryFilter
                )
                .map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="h-40 bg-zinc-950 flex items-center justify-center overflow-hidden">
                      {asset.images?.[0] ? (
                        <img
                          src={asset.images[0]}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icons.Image />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                        {asset.category}
                      </span>
                      <h3 className="font-bold text-sm mt-1 mb-2 line-clamp-1">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-3 mb-4 flex-1">
                        {asset.description}
                      </p>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => {
                            setEditingAsset(asset);
                            setIsAssetModalOpen(true);
                          }}
                          className="text-xs bg-zinc-800 px-3 py-1.5 rounded flex-1 hover:bg-zinc-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setAssets(assets.filter((a) => a.id !== asset.id))
                          }
                          className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded hover:bg-red-500/20"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCENE BUILDER & DIALOGUE */}
        {activeTab === 'builder' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold">
                Scene Builder & Prompt Generator
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Atur aspek sinematik shot (kamera, pencahayaan, dialog) untuk
                menghasilkan prompt video.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Konteks Aksi & Dialog */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-zinc-800 pb-2">
                    <Icons.FileText /> <span>1. Konteks Aksi & Dialog</span>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Aksi Spesifik Shot Ini
                    </label>
                    <textarea
                      value={builderShot.actionDescription}
                      onChange={(e) =>
                        setBuilderShot({
                          ...builderShot,
                          actionDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500 resize-none mt-1"
                    />
                  </div>

                  <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                        <Icons.MessageSquare /> Dialog Karakter (Opsional)
                      </label>
                      <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
                        Auto Intonation AI
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      AI akan menganalisis intonasi dari kalimat ini dan
                      menginstruksikan model video untuk membuat pergerakan
                      bibir dan ekspresi wajah yang realistis (misal: berteriak,
                      berbisik).
                    </p>
                    <textarea
                      value={builderShot.dialogue}
                      onChange={(e) =>
                        setBuilderShot({
                          ...builderShot,
                          dialogue: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="'Aku tidak percaya kamu melakukan ini!'"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-amber-100 focus:border-teal-500 resize-none mt-1"
                    />
                  </div>
                </div>

                {/* 2. Pilih Aset */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm border-b border-zinc-800 pb-2">
                    <Icons.FolderGit2 />{' '}
                    <span>2. Pilih Karakter/Aset Referensi</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => {
                          const isSel = builderShot.selectedAssetIds.includes(
                            asset.id
                          );
                          setBuilderShot((prev) => ({
                            ...prev,
                            selectedAssetIds: isSel
                              ? prev.selectedAssetIds.filter(
                                  (id) => id !== asset.id
                                )
                              : [...prev.selectedAssetIds, asset.id],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-semibold ${
                          builderShot.selectedAssetIds.includes(asset.id)
                            ? 'bg-sky-900/40 border-sky-500 text-sky-300'
                            : 'border-zinc-700 text-zinc-400 bg-zinc-950'
                        }`}
                      >
                        {asset.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Kontrol Kamera & Lighting */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-zinc-800 pb-2">
                    <Icons.Camera /> <span>3. Kamera & Pencahayaan</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                    <div>
                      <label className="text-zinc-500">Jenis Shot</label>
                      <select
                        value={builderShot.camera.shotType}
                        onChange={(e) =>
                          setBuilderShot({
                            ...builderShot,
                            camera: {
                              ...builderShot.camera,
                              shotType: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 mt-1"
                      >
                        {['Wide', 'Medium', 'Close-Up', 'Extreme Close-Up'].map(
                          (o) => (
                            <option key={o}>{o}</option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-500">Angle Kamera</label>
                      <select
                        value={builderShot.camera.angle}
                        onChange={(e) =>
                          setBuilderShot({
                            ...builderShot,
                            camera: {
                              ...builderShot.camera,
                              angle: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 mt-1"
                      >
                        {['Eye-level', 'Low Angle', 'High Angle'].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-500">Waktu (Lighting)</label>
                      <select
                        value={builderShot.lighting.time}
                        onChange={(e) =>
                          setBuilderShot({
                            ...builderShot,
                            lighting: {
                              ...builderShot.lighting,
                              time: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 mt-1"
                      >
                        {[
                          'Pagi',
                          'Siang',
                          'Sore/Golden Hour',
                          'Malam',
                          'Studio',
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-500">Mood (Lighting)</label>
                      <select
                        value={builderShot.lighting.mood}
                        onChange={(e) =>
                          setBuilderShot({
                            ...builderShot,
                            lighting: {
                              ...builderShot.lighting,
                              mood: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 mt-1"
                      >
                        {[
                          'Soft/Diffused',
                          'Hard/Dramatic',
                          'Neon/Colorful',
                          'Low-key',
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePrompt}
                  disabled={isGeneratingPrompt}
                  className="w-full bg-gradient-to-r from-amber-500 to-teal-500 text-zinc-950 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2"
                >
                  {isGeneratingPrompt
                    ? 'Merangkai Prompt...'
                    : 'Generate Google Flow Prompt'}
                </button>
              </div>

              {/* Generated Result Display & Tuner */}
              <div className="lg:col-span-5">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sticky top-6 space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2 border-b border-zinc-800 pb-3">
                    <Icons.Film /> Hasil Prompt
                  </h3>
                  {!generatedPromptResult ? (
                    <div className="text-center py-12 text-zinc-600 text-xs">
                      Atur shot dan klik Generate.
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Prompt Tuner */}
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleTunePrompt('Lebih Cinematic')}
                          disabled={isTuning}
                          className="flex-1 text-[10px] bg-indigo-500/10 text-indigo-400 py-1.5 rounded-lg border border-indigo-500/20"
                        >
                          ✨ Cinematic
                        </button>
                        <button
                          onClick={() =>
                            handleTunePrompt('Lebih Gelap/Misterius')
                          }
                          disabled={isTuning}
                          className="flex-1 text-[10px] bg-zinc-800 text-zinc-300 py-1.5 rounded-lg border border-zinc-700"
                        >
                          🌙 Darker
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-emerald-400">
                            Positive Prompt
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                generatedPromptResult.positivePrompt
                              )
                            }
                            className="text-zinc-400"
                          >
                            <Icons.Copy />
                          </button>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono max-h-60 overflow-y-auto whitespace-pre-wrap">
                          {generatedPromptResult.positivePrompt}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-rose-400">
                            Negative Prompt
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                generatedPromptResult.negativePrompt
                              )
                            }
                            className="text-zinc-400"
                          >
                            <Icons.Copy />
                          </button>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono">
                          {generatedPromptResult.negativePrompt}
                        </div>
                      </div>
                      <button
                        onClick={savePromptToHistory}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-sm py-2 rounded-xl"
                      >
                        Simpan ke Riwayat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Riwayat Prompt</h2>
            <div className="space-y-4">
              {promptHistory.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Belum ada prompt tersimpan.
                </p>
              ) : (
                promptHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <span className="text-xs text-zinc-500">
                        {new Date(hist.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => copyToClipboard(hist.positivePrompt)}
                        className="text-xs bg-zinc-800 px-3 py-1 rounded"
                      >
                        Copy Pos
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 line-clamp-3">
                      {hist.positivePrompt}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold">Pengaturan & Kolaborasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolaborasi Tim */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-2">
                  <Icons.FolderGit2 />{' '}
                  <h3 className="font-bold">Kolaborasi Tim (Ekspor/Impor)</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Gunakan fitur ini untuk memindahkan atau membagikan seluruh
                  proyek Anda (Naskah, Aset, Riwayat) ke rekan kerja Anda.
                </p>

                <button
                  onClick={handleExportWorkspace}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Icons.Download /> Ekspor Workspace (.json)
                </button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportWorkspace}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 border border-zinc-700">
                    <Icons.Plus /> Impor Workspace (.json)
                  </button>
                </div>
              </div>

              {/* Pengaturan Default */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-2">
                  <Icons.Settings />{' '}
                  <h3 className="font-bold">Pengaturan Aplikasi</h3>
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Bahasa Output Default
                  </label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultLanguage: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 p-2 rounded-lg border border-zinc-800 mt-1 text-sm focus:border-amber-500"
                  >
                    <option value="en">English (Direkomendasikan)</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Hapus semua data (Aset, Naskah, Riwayat)? Pastikan Anda sudah Export Workspace!'
                      )
                    ) {
                      setAssets([]);
                      setScenes([]);
                      setPromptHistory([]);
                    }
                  }}
                  className="w-full border border-red-900/50 text-red-400 py-2 rounded-xl mt-4 text-sm hover:bg-red-900/20"
                >
                  Reset Semua Data Lokal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL ASSET */}
      {isAssetModalOpen && editingAsset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="font-bold">
                {editingAsset.id ? 'Edit Aset' : 'Tambah Aset Baru'}
              </h3>
              <button
                onClick={() => setIsAssetModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <Icons.X />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400">Nama Aset</label>
                  <input
                    type="text"
                    value={editingAsset.name}
                    onChange={(e) =>
                      setEditingAsset({ ...editingAsset, name: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg mt-1 text-sm"
                    placeholder="Contoh: Baju Zirah Hitam"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Kategori</label>
                  <select
                    value={editingAsset.category}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg mt-1 text-sm"
                  >
                    <option value="character">Character</option>
                    <option value="environment">Environment</option>
                    <option value="prop">Prop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Gambar Referensi (Opsional namun disarankan)
                </label>
                <div className="flex gap-4 items-end">
                  {editingAsset.images?.[0] && (
                    <img
                      src={editingAsset.images[0]}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-zinc-700"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAssetImageUpload}
                    className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-zinc-400">
                    Deskripsi Visual (Untuk Prompt)
                  </label>
                  <button
                    onClick={() => handleAutoDescribe(editingAsset)}
                    disabled={isAutoDescribing}
                    className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-1 rounded border border-teal-500/30 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Icons.Sparkles />{' '}
                    {isAutoDescribing ? 'Menganalisis...' : 'Auto-Describe'}
                  </button>
                </div>
                <textarea
                  value={editingAsset.description}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm"
                  placeholder="Deskripsikan bentuk fisik, warna, dll secara rinci..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
              <button
                onClick={() => setIsAssetModalOpen(false)}
                className="px-5 py-2 text-sm text-zinc-400"
              >
                Batal
              </button>
              <button
                onClick={saveAsset}
                className="px-5 py-2 text-sm bg-teal-500 text-zinc-950 font-bold rounded-xl"
              >
                Simpan Aset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
