// ... existing code ...
  const [assets, setAssets] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [detectedElements, setDetectedElements] = useState(null);
  const [promptHistory, setPromptHistory] = useState([]);

  // Script Analyzer
// ... existing code ...
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Tersalin ke clipboard');
  };

  // 1. Analisis Naskah ke Shot List
  const handleAnalyzeScript = async () => {
    if (!scriptInput.trim()) return addToast('Naskah kosong', 'error');
    setIsAnalyzingScript(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const prompt = `Analisis naskah ini berdasarkan materi "5 Levels of AI Video Prompting". 
Pecah cerita menjadi scenes, dan dalam setiap scene buat daftar "shots" (Level 4 Continuity).
SELAIN ITU, ekstrak semua elemen yang terlibat dalam cerita: Karakter, Properti (barang), dan Lokasi (environment).
Format output HARUS JSON Valid Murni tanpa markdown dengan struktur persis seperti ini:
{
  "detectedElements": {
    "characters": [{"name": "Nama Karakter", "description": "Deskripsi ciri fisik secara detail"}],
    "props": [{"name": "Nama Barang", "description": "Deskripsi bentuk, warna, dan material"}],
    "environments": [{"name": "Nama Lokasi", "description": "Deskripsi detail suasana dan cahaya"}]
  },
  "scenes": [
    {
      "id": "scene-1", "title": "Judul", "summary": "Ringkasan",
      "shots": [
        {
          "id": "shot-1", "subject": "...", "action": "...", "setting": "...", "lighting": "...", "mood": "...", "cameraMotion": "..."
        }
      ]
    }
  ]
}
Naskah: ${scriptInput}`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        let cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsedData = JSON.parse(cleanJson);
        
        if (parsedData.scenes) {
          setScenes(parsedData.scenes);
          setDetectedElements(parsedData.detectedElements);
        } else if (Array.isArray(parsedData)) {
          setScenes(parsedData);
        }
        
        addToast('Naskah beserta Elemen berhasil dianalisis!');
        setScriptInput('');
      } else {
        throw new Error("No response");
      }
    } catch (e) { 
      console.error(e);
      addToast('Gagal menganalisis naskah. AI memberikan format tidak sesuai.', 'error'); 
    } 
    finally { setIsAnalyzingScript(false); }
  };

  // 2. Auto-Describe Image (Menggunakan Gemini 2.5 Flash Vision)
// ... existing code ...
          {/* TAB 3: NASKAH / SCRIPT */}
          {activeTab === 'script' && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-2xl font-bold">Breakdown Naskah Cerita</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <textarea
                  value={scriptInput} onChange={e => setScriptInput(e.target.value)}
                  placeholder="Paste naskah kasar Anda di sini..."
                  className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500 resize-none mb-3"
                />
                <button onClick={handleAnalyzeScript} disabled={isAnalyzingScript} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-2 px-5 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2">
                  <Icons.Sparkles /> {isAnalyzingScript ? 'Menganalisis...' : 'Otomatis Pecah Jadi Shot List'}
                </button>
              </div>

              {/* PANEL ELEMEN TERDETEKSI (BARU) */}
              {detectedElements && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-fadeIn">
                  <h3 className="font-bold text-teal-400 border-b border-zinc-800 pb-3 mb-4 flex items-center gap-2">
                    <Icons.Sparkles /> Elemen Terdeteksi (Siap Dijadikan @tags)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Kolom Karakter */}
                    <div>
                      <strong className="text-[10px] text-amber-400 uppercase tracking-widest block mb-2">👤 Karakter</strong>
                      <div className="space-y-2">
                        {detectedElements.characters?.map((c, i) => (
                          <div key={i} className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <strong className="text-zinc-100 block mb-1">{c.name}</strong>
                            <span className="text-[11px] text-zinc-500 line-clamp-3 mb-2">{c.description}</span>
                            <button onClick={() => {
                              setEditingAsset({ category: 'character', name: `@${c.name.replace(/\s+/g, '')}`, description: c.description, images: [], tags: [] });
                              setIsAssetModalOpen(true);
                            }} className="text-[10px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2 py-1.5 rounded w-full border border-amber-500/20 transition-colors font-semibold">
                              + Simpan sbg @tag
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kolom Properti */}
                    <div>
                      <strong className="text-[10px] text-sky-400 uppercase tracking-widest block mb-2">📦 Properti Barang</strong>
                      <div className="space-y-2">
                        {detectedElements.props?.map((p, i) => (
                          <div key={i} className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <strong className="text-zinc-100 block mb-1">{p.name}</strong>
                            <span className="text-[11px] text-zinc-500 line-clamp-3 mb-2">{p.description}</span>
                            <button onClick={() => {
                              setEditingAsset({ category: 'prop', name: `@${p.name.replace(/\s+/g, '')}`, description: p.description, images: [], tags: [] });
                              setIsAssetModalOpen(true);
                            }} className="text-[10px] bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-2 py-1.5 rounded w-full border border-sky-500/20 transition-colors font-semibold">
                              + Simpan sbg @tag
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kolom Lingkungan / Set */}
                    <div>
                      <strong className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-2">🌍 Lokasi (Set)</strong>
                      <div className="space-y-2">
                        {detectedElements.environments?.map((e, i) => (
                          <div key={i} className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <strong className="text-zinc-100 block mb-1">{e.name}</strong>
                            <span className="text-[11px] text-zinc-500 line-clamp-3 mb-2">{e.description}</span>
                            <button onClick={() => {
                              setEditingAsset({ category: 'environment', name: `@${e.name.replace(/\s+/g, '')}`, description: e.description, images: [], tags: [] });
                              setIsAssetModalOpen(true);
                            }} className="text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-2 py-1.5 rounded w-full border border-emerald-500/20 transition-colors font-semibold">
                              + Simpan sbg @tag
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div className="space-y-4">
                {scenes.map(scene => (
// ... existing code ...
```

**Penjelasan Singkat Perubahannya:**
1. Ada tambahan state baru (`detectedElements`) untuk menyimpan objek-objek hasil deteksi.
2. Perintah AI dimodifikasi agar mewajibkan AI memisahkan "Karakter", "Properti", dan "Environment" pada balasan JSON.
3. Di dalam antarmuka UI (tepat di atas daftar Scene), akan muncul deretan kotak 3 kolom berisikan profil semua elemen, beserta tombol **"+ Simpan sbg @tag"** yang jika ditekan akan langsung membuka jendela modal siap pakai.
