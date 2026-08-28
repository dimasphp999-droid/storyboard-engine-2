import { useState, useEffect } from 'react';
import { Camera, Film, Save, Trash2, FileText, Settings, Image as ImageIcon, BookOpen, Download, AlertTriangle, FileUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('breakdown');
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [scriptInput, setScriptInput] = useState(localStorage.getItem('savedScript') || '');
  const [detectedElements, setDetectedElements] = useState(JSON.parse(localStorage.getItem('detectedElements')) || { characters: [], props: [], locations: [] });
  const [breakdownResults, setBreakdownResults] = useState([]);
  const [tags, setTags] = useState(JSON.parse(localStorage.getItem('assetTags')) || []);
  const [scenes, setScenes] = useState(JSON.parse(localStorage.getItem('sceneHistory')) || []);
  const [playbook, setPlaybook] = useState(localStorage.getItem('directorsPlaybook') || '');
  const [isLoading, setIsLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [startingFrame, setStartingFrame] = useState(null);
  const [formState, setFormState] = useState({
    level: '2',
    subject: '', action: '', setting: '', lighting: '', mood: '',
    shotType: '', angle: '', movement: '', lens: '',
    duration: '5s', aspect: '16:9',
    dialogue: '', audio: '',
    antiGlitch: false
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => { localStorage.setItem('geminiApiKey', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('savedScript', scriptInput); }, [scriptInput]);
  useEffect(() => { localStorage.setItem('detectedElements', JSON.stringify(detectedElements)); }, [detectedElements]);
  useEffect(() => { localStorage.setItem('assetTags', JSON.stringify(tags)); }, [tags]);
  useEffect(() => { localStorage.setItem('sceneHistory', JSON.stringify(scenes)); }, [scenes]);
  useEffect(() => { localStorage.setItem('directorsPlaybook', playbook); }, [playbook]);

  const callGemini = async (systemInstruction, userPrompt, imageObj = null) => {
    if (!apiKey) {
      showToast("Peringatan: Masukkan API Key Gemini di menu Pengaturan!");
      return null;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    let parts = [{ text: `${systemInstruction}\n\n${userPrompt}` }];
    
    if (imageObj) {
      parts.push({
        inline_data: {
          mime_type: imageObj.mimeType,
          data: imageObj.data
        }
      });
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return text;
    } catch (err) {
      showToast(`API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  };

  const handleAnalyzeScript = async () => {
    setIsLoading(true);
    const prompt = `Analisis naskah ini. Ekstrak menjadi JSON dengan format:
    {
      "characters": ["nama karakter 1", "nama karakter 2"],
      "props": ["properti 1", "properti 2"],
      "locations": ["lokasi 1"],
      "shots": [
        {"subject": "siapa", "action": "ngapain", "setting": "dimana", "lighting": "pencahayaan", "mood": "suasana fisik", "duration": "estimasi detik misal 5s"}
      ]
    }
    Naskah: ${scriptInput}`;

    const res = await callGemini("Kamu adalah asisten sutradara pintar. Balas HANYA dengan JSON valid.", prompt);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setDetectedElements({
          characters: parsed.characters || [],
          props: parsed.props || [],
          locations: parsed.locations || []
        });
        setBreakdownResults(parsed.shots || []);
        showToast("Naskah berhasil dianalisis!");
      } catch (err) {
        showToast("Gagal membaca format balasan AI. Silakan coba lagi.");
      }
    }
    setIsLoading(false);
  };

  const handleDirectorAI = async () => {
    setIsLoading(true);
    let instruction = `Kamu adalah Sutradara AI Profesional. Lengkapi parameter shot untuk adegan ini HANYA dengan JSON: {"shotType":"", "angle":"", "movement":"", "lens":"", "dialogue":"", "audio":""}. \nBeri dialog bahasa Indonesia natural jika ada subjek manusia. Racik SFX audio yang pas.`;
    
    let userPrompt = `Subjek: ${formState.subject}\nAksi: ${formState.action}\nLokasi: ${formState.setting}`;

    if (playbook) {
      userPrompt += `\n\n[BUKU PANDUAN SUTRADARA SAYA]:\n${playbook}\nMohon patuhi prinsip pergerakan kamera dan angle dari panduan ini!`;
    }

    if (startingFrame) {
      userPrompt += `\n\n[GAMBAR STARTING FRAME]: Saya melampirkan gambar referensi. Analisis ruang, komposisi, dan subjek di gambar ini untuk menentukan 'movement', 'angle', dan 'lens' yang paling epik secara sinematografi!`;
    }

    const res = await callGemini(instruction, userPrompt, startingFrame);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        setFormState(prev => ({ ...prev, ...parsed }));
        showToast("Sutradara AI berhasil merancang adegan!");
      } catch (err) {
        showToast("Gagal membaca respons AI Director.");
      }
    }
    setIsLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        setStartingFrame({
          data: base64data,
          mimeType: file.type,
          previewUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAssetPrompt = (type, name) => {
    let prompt = "";
    if (type === "character") {
      prompt = `A three-panel character reference sheet of ${name}, evenly spaced left to right, separated by thin vertical dividers, on a plain mid-grey seamless studio background. Panel one: headless full-body front view, collar edge crisp. Panel two: same body from behind. Panel three: chest-up front on looking forward. Photographic, sharp focus, 4k.`;
    } else {
      prompt = `A wide view of ${name}. The location is completely empty, no people anywhere, no figures, no subject. No readable text, no logos. Photographic, shot on a real camera, sharp focus, natural contrast, no CGI, 4K.`;
    }
    navigator.clipboard.writeText(prompt)
      .then(() => showToast("Prompt berhasil disalin ke clipboard! (Paste di Midjourney/GPT)"))
      .catch(() => showToast("Gagal menyalin prompt."));
  };

  const handleExportBackup = () => {
    const data = { scriptInput, detectedElements, tags, scenes, playbook };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Storyboard_Backup_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Proyek berhasil diekspor!");
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.scriptInput) setScriptInput(imported.scriptInput);
          if (imported.detectedElements) setDetectedElements(imported.detectedElements);
          if (imported.tags) setTags(imported.tags);
          if (imported.scenes) setScenes(imported.scenes);
          if (imported.playbook) setPlaybook(imported.playbook);
          showToast("Proyek berhasil direstore!");
        } catch (err) {
          showToast("File tidak valid atau rusak!");
        }
      };
      reader.readAsText(file);
    }
  };

  const [newTag, setNewTag] = useState({ tag: '', desc: '', type: 'character' });
  const handleAddTag = () => {
    if(newTag.tag && newTag.desc) {
       setTags([...tags, newTag]);
       setNewTag({ tag: '', desc: '', type: 'character' });
       showToast("Aset tag berhasil ditambahkan!");
    } else {
       showToast("Mohon isi nama tag dan deskripsinya.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans flex relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-bounce font-bold">
          {toastMessage}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-red-500 max-w-md text-center shadow-2xl">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Peringatan!</h3>
            <p className="text-gray-300 mb-8">{confirmAction.message}</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setConfirmAction(null)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition">Batal</button>
              <button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition">Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Film className="text-blue-500" /> Storyboard AI
        </h1>
        {[
          { id: 'breakdown', icon: FileText, label: '1. Naskah' },
          { id: 'assets', icon: Save, label: '2. Asset Library' },
          { id: 'builder', icon: Camera, label: '3. Scene Builder' },
          { id: 'history', icon: Film, label: '4. Timeline' },
          { id: 'settings', icon: Settings, label: 'Pengaturan' },
          { id: 'guide', icon: BookOpen, label: '5 Levels Guide' }
        ].map(menu => (
          <button 
            key={menu.id}
            onClick={() => setActiveTab(menu.id)}
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition ${activeTab === menu.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
          >
            <menu.icon size={18} /> {menu.label}
          </button>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        
        {}
        {activeTab === 'breakdown' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Breakdown Naskah</h2>
            <textarea 
              value={scriptInput} onChange={(e) => setScriptInput(e.target.value)}
              className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:border-blue-500 outline-none"
              placeholder="Tulis atau paste naskah Anda di sini..."
            />
            <button onClick={handleAnalyzeScript} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold w-full">
              {isLoading ? 'Menganalisis...' : 'Mulai Breakdown AI'}
            </button>

            {/* HASIL DETEKSI */}
            {detectedElements.characters.length > 0 && (
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-blue-400 font-bold mb-2">👤 Karakter Terdeteksi:</h4>
                  {detectedElements.characters.map((c, i) => <span key={i} className="block text-sm mb-1">• {c}</span>)}
                </div>
                <div>
                  <h4 className="text-green-400 font-bold mb-2">📍 Lokasi Terdeteksi:</h4>
                  {detectedElements.locations.map((l, i) => <span key={i} className="block text-sm mb-1">• {l}</span>)}
                </div>
                <div>
                  <h4 className="text-yellow-400 font-bold mb-2">🎒 Properti Terdeteksi:</h4>
                  {detectedElements.props.map((p, i) => <span key={i} className="block text-sm mb-1">• {p}</span>)}
                </div>
              </div>
            )}

            {/* HASIL SHOT */}
            <div className="space-y-4">
              {breakdownResults.map((shot, idx) => (
                <div key={idx} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded mr-2">Shot {idx + 1}</span>
                    <span className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded mr-2">⏱ {shot.duration}</span>
                    <p className="mt-2 text-sm text-gray-400"><b>Subjek:</b> {shot.subject} | <b>Aksi:</b> {shot.action} | <b>Lokasi:</b> {shot.setting}</p>
                  </div>
                  <button onClick={() => {
                    setFormState(prev => ({...prev, subject: shot.subject, action: shot.action, setting: shot.setting, lighting: shot.lighting, mood: shot.mood, duration: shot.duration}));
                    setActiveTab('builder');
                    showToast("Adegan dipindahkan ke Scene Builder.");
                  }} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm whitespace-nowrap">Bawa ke Builder</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Asset Library (@tags)</h2>
            <p className="text-gray-400 text-sm">Simpan elemen yang sering diulang agar kontinuitas terjaga.</p>
            
            {/* Form Tambah Tag Baru */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6 flex gap-4">
              <select value={newTag.type} onChange={e=>setNewTag({...newTag, type: e.target.value})} className="bg-black text-white p-2 rounded">
                 <option value="character">Karakter</option>
                 <option value="location">Lokasi/Properti</option>
              </select>
              <input placeholder="Nama @tag (misal: @ManBoxer)" value={newTag.tag} onChange={e=>setNewTag({...newTag, tag: e.target.value})} className="bg-black text-white p-2 rounded flex-1 outline-none" />
              <input placeholder="Deskripsi fisik/lokasi..." value={newTag.desc} onChange={e=>setNewTag({...newTag, desc: e.target.value})} className="bg-black text-white p-2 rounded flex-1 outline-none" />
              <button onClick={handleAddTag} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded font-bold">Tambah</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {tags.map((tagItem) => (
                <div key={tagItem.tag} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-400">{tagItem.tag}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{tagItem.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleGenerateAssetPrompt(tagItem.type, tagItem.tag)} className="text-yellow-500 hover:text-yellow-400" title="Copy Prompt 3-Panel"><ImageIcon size={18}/></button>
                    <button onClick={() => setTags(tags.filter((item) => item.tag !== tagItem.tag))} className="text-red-500 hover:text-red-400" title="Hapus Tag"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="max-w-5xl space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <h2 className="text-2xl font-bold text-white">Scene Builder</h2>
              <select value={formState.level} onChange={(e) => setFormState({...formState, level: e.target.value})} className="bg-gray-900 text-white p-2 rounded outline-none">
                <option value="1">Level 1: Lazy One-Liner</option>
                <option value="2">Level 2: Describe Shot</option>
                <option value="3">Level 3: Direct Camera</option>
                <option value="4">Level 4: Shot List</option>
                <option value="5">Level 5: Lock Character</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* KOLOM KIRI: INPUT */}
              <div className="space-y-4">
                
                {/* STARTING FRAME UPLOAD */}
                <div className="bg-gray-900 p-4 rounded-xl border border-dashed border-gray-700">
                  <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><ImageIcon size={16}/> Starting Frame (Opsional)</h4>
                  <p className="text-xs text-gray-500 mb-3">Upload sketsa/referensi frame awal agar AI Sutradara bisa menganalisis komposisinya.</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-400" />
                  {startingFrame && <img src={startingFrame.previewUrl} alt="Starting Frame Preview" className="mt-3 h-24 rounded object-cover border border-gray-700" />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Durasi (cth: 5s, 10s)" value={formState.duration} onChange={e=>setFormState({...formState, duration: e.target.value})} className="bg-gray-900 border border-gray-800 p-3 rounded text-white outline-none" />
                  <select value={formState.aspect} onChange={e=>setFormState({...formState, aspect: e.target.value})} className="bg-gray-900 border border-gray-800 p-3 rounded text-white outline-none">
                    <option value="16:9">16:9 (Cinematic/YouTube)</option>
                    <option value="9:16">9:16 (TikTok/Reels)</option>
                    <option value="21:9">21:9 (Ultrawide)</option>
                  </select>
                </div>

                <textarea placeholder="Subjek (@ManBoxer, Wanita, dll)" value={formState.subject} onChange={e=>setFormState({...formState, subject: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded text-white outline-none" rows="2" />
                <textarea placeholder="Aksi (Ngapain?)" value={formState.action} onChange={e=>setFormState({...formState, action: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded text-white outline-none" rows="2" />
                <textarea placeholder="Setting Tempat" value={formState.setting} onChange={e=>setFormState({...formState, setting: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded text-white outline-none" rows="2" />

                <div className="flex gap-2">
                  <button onClick={handleDirectorAI} disabled={isLoading} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white p-3 rounded font-bold shadow-lg shadow-yellow-900/50 flex justify-center items-center gap-2">
                    {isLoading ? 'Berpikir...' : '✨ AI Director (Bantu Isi Camera & Audio)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Shot Type (Close up, Wide)" value={formState.shotType} onChange={e=>setFormState({...formState, shotType: e.target.value})} className="bg-gray-800 p-2 rounded text-sm text-white outline-none" />
                  <input placeholder="Movement (Pan, Track)" value={formState.movement} onChange={e=>setFormState({...formState, movement: e.target.value})} className="bg-gray-800 p-2 rounded text-sm text-white outline-none" />
                  <input placeholder="Angle (Low, Eye-level)" value={formState.angle} onChange={e=>setFormState({...formState, angle: e.target.value})} className="bg-gray-800 p-2 rounded text-sm text-white outline-none" />
                  <input placeholder="Lens (50mm, Wide)" value={formState.lens} onChange={e=>setFormState({...formState, lens: e.target.value})} className="bg-gray-800 p-2 rounded text-sm text-white outline-none" />
                </div>
              </div>

              {/* KOLOM KANAN: OUTPUT */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col">
                <h3 className="font-bold text-white mb-4">Hasil Prompt</h3>
                
                <button onClick={() => {
                  let res = "";
                  if (formState.level === "1") res = `${formState.subject} ${formState.action} in ${formState.setting}, ${formState.aspect}`;
                  else if (formState.level === "2" || formState.level === "3") {
                    res = `${formState.subject}, ${formState.action}. Setting: ${formState.setting}. Lighting: ${formState.lighting}. Mood: ${formState.mood}. `;
                    if (formState.level === "3") res += `Camera: ${formState.shotType} on a ${formState.lens} lens, ${formState.angle} angle, ${formState.movement}. Single continuous take.`;
                  } else {
                    res = `SCENE\n${formState.subject} ${formState.action}.\n\nFRAME MAP\n[0-${formState.duration}] ${formState.subject} in frame, ${formState.setting}.\n\nSUBJECT LOCK\n${formState.subject}.\n\nCAMERA\n[0-${formState.duration}] ${formState.shotType}, ${formState.lens}, ${formState.angle}, ${formState.movement}.\n\nAUDIO\n${formState.audio}\n\nDIALOGUE\n${formState.dialogue}`;
                  }
                  if (formState.antiGlitch) res += `\n\nNEGATIVE PROMPT: morphing, extra fingers, cartoonish, blurred, text, watermark.`;
                  setGeneratedPrompt(res);
                  showToast(`Prompt Level ${formState.level} berhasil di-generate!`);
                }} className="bg-blue-600 hover:bg-blue-500 p-3 rounded font-bold text-white mb-4">
                  Generate Prompt (Level {formState.level})
                </button>

                <textarea value={generatedPrompt} readOnly className="flex-1 bg-black border border-gray-700 p-4 rounded text-green-400 font-mono text-sm outline-none" placeholder="Prompt akan muncul di sini siap di-copy..." />
                
                <button onClick={() => {
                   setScenes([...scenes, { prompt: generatedPrompt, id: Date.now() }]);
                   showToast("Adegan berhasil disimpan ke Timeline!");
                }} className="mt-4 bg-gray-800 hover:bg-gray-700 p-3 rounded text-white flex justify-center items-center gap-2">
                  <Save size={18} /> Simpan ke Timeline
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Timeline Produksi</h2>
            {scenes.length === 0 ? <p className="text-gray-500">Timeline kosong. Simpan adegan dari Scene Builder.</p> : (
              <div className="space-y-4">
                {scenes.map((s, i) => (
                  <div key={s.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-start gap-4">
                    <div className="bg-blue-900 text-blue-300 font-bold px-3 py-1 rounded">Shot {i+1}</div>
                    <p className="text-sm font-mono text-gray-300 flex-1 whitespace-pre-wrap">{s.prompt}</p>
                    <button onClick={() => setScenes(scenes.filter(item => item.id !== s.id))} className="text-red-500 hover:text-red-400"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Pengaturan Sistem</h2>
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="font-bold mb-2">Google Gemini API Key</h3>
              <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-black border border-gray-700 p-3 rounded text-white outline-none" />
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-indigo-900/50 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
              <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><BookOpen size={18}/> Buku Panduan Sutradara (Playbook)</h3>
              <p className="text-sm text-gray-400 mb-4">Tulis/Paste gaya kamera, rumus angle, atau ilmu sinematografi dari website favorit Anda. AI Sutradara akan membaca buku ini sebelum memberi saran di Scene Builder!</p>
              <textarea 
                value={playbook} onChange={e=>setPlaybook(e.target.value)} 
                placeholder="Contoh: Jika adegan aksi, gunakan 'Handheld tracking shot on wide lens'. Jika dialog sedih, gunakan 'Slow push-in on 85mm lens'..."
                className="w-full bg-black border border-gray-700 p-4 rounded text-indigo-200 text-sm outline-none" rows="6"
              />
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="font-bold text-white mb-4">Backup & Restore Proyek (.json)</h3>
              <div className="flex gap-4">
                <button onClick={handleExportBackup} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"><Download size={18}/> Ekspor Proyek (.json)</button>
                <label className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                  <FileUp size={18}/> Impor Proyek (.json)
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>

            <div className="bg-red-950/30 p-6 rounded-xl border border-red-900/50 mt-8">
              <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Danger Zone</h3>
              <button onClick={() => setConfirmAction({
                  message: "Anda yakin ingin menghapus SELURUH Naskah, Asset, dan Timeline? Tindakan ini tidak dapat dibatalkan.",
                  onConfirm: () => {
                    localStorage.clear();
                    window.location.reload();
                  }
              })} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded font-bold shadow-lg">Hapus Seluruh Data & Reset Aplikasi</button>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Panduan 5 Level AI Prompting (Youri van Hofwegen)</h2>
            <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="text-blue-400 font-bold">Level 1: The Lazy One-Liner</h3>
                <p className="text-sm">Hanya satu kalimat inti. (Contoh: &quot;Seorang petinju berjalan ke ring&quot;). Kekurangan: Model AI akan mengarang sisa visualnya. Hasil tidak akan pernah konsisten.</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="text-blue-400 font-bold">Level 2: Describe the Shot</h3>
                <p className="text-sm">Menambahkan 5 elemen kunci: <strong>Subjek, Aksi, Lokasi, Pencahayaan, dan Mood.</strong> Aturan emas Mood: Jangan sebut kata emosi (misal: &quot;tegang&quot;), tapi deskripsikan fisiknya (misal: &quot;rahang mengeras&quot;).</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="text-blue-400 font-bold">Level 3: Direct the Camera</h3>
                <p className="text-sm">Menambahkan spesifikasi kamera di akhir kalimat: Shot Type (Wide/Close up), Angle, Movement, dan Lensa (contoh: 50mm, anamorphic).</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="text-blue-400 font-bold">Level 4: Build a Shot List</h3>
                <p className="text-sm">Berhenti menggunakan paragraf panjang. Gunakan blok-blok spesifik dengan Label dan Timestamp (detik). (SCENE, FRAME MAP, CAMERA, AUDIO).</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <h3 className="text-blue-400 font-bold">Level 5: Lock the Character (@tags)</h3>
                <p className="text-sm">Berhenti mendeskripsikan ciri-ciri orang. Gunakan satu gambar referensi &quot;Character Reference Sheet&quot; 3-Panel yang bersih, lalu panggil dengan nama @tag (misal: @ManBoxer) di prompt Level 4.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
