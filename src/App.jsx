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
Untuk setiap shot, ekstrak parameter untuk Level 2 dan 3: subject, action, setting, lighting, mood, cameraMotion.
Format output HARUS JSON Valid seperti ini (Tanpa markdown):
[
  {
    "id": "scene-1", "title": "Judul", "summary": "Ringkasan",
    "shots": [
      {
        "id": "shot-1", "subject": "...", "action": "...", "setting": "...", "lighting": "...", "mood": "...", "cameraMotion": "..."
      }
    ]
  }
]
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
        // Membersihkan markdown ```json jika AI membandel
        const cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        setScenes(JSON.parse(cleanJson));
        addToast('Naskah berhasil dianalisis!');
        setScriptInput('');
      }
    } catch (e) { 
      addToast('Gagal menganalisis naskah', 'error'); 
      console.error('Error saat parsing naskah:', e);
    } 
    finally { setIsAnalyzingScript(false); }
  };

  // 2. Auto-Describe Image (Menggunakan Gemini Vision)
  const handleAutoDescribe = async (assetData) => {
    if (!assetData.images || assetData.images.length === 0) return addToast('Pilih gambar dulu', 'error');
    const imageString = assetData.images[0];
    const base64Data = imageString.includes(',') ? imageString.split(',')[1] : null;
    const mimeType = imageString.match(/data:(.*?);/)?.[1] || "image/jpeg";
    if (!base64Data) return addToast('Format gambar tidak valid', 'error');

    setIsAutoDescribing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
// ... existing code ...
// 3. Generate Prompt Berdasarkan Level Terpilih
  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      let tagsSummary = '';
      if (promptLevel === 5) {
        const selectedAssetsObjects = assets.filter(a => builderShot.selectedAssetIds.includes(a.id));
        selectedAssetsObjects.forEach(asset => {
          tagsSummary += `\n- Tag: ${asset.name} (Deskripsi: ${asset.description})`;
        });
      }

      const systemPrompt = `Anda adalah Prompt Engineer Pakar AI Video (menguasai 5 Levels of AI Video Prompting oleh Youri van Hofwegen). 
Pengguna meminta prompt video untuk LEVEL ${promptLevel}.
Aturan:
- Level 1: Hanya 1 kalimat instan dari 'lazyOneLiner'.
- Level 2: Deskripsikan Subject, Action, Setting, Lighting, Mood (TANPA menggunakan kata 'tense', tunjukkan lewat fisik).
- Level 3: Tambahkan instruksi spesifik Camera Motion ke dalam deskripsi.
- Level 4: Buat ini terasa seperti bagian dari urutan film, gunakan "HARD CUT" jika ada instruksi transisi, gabungkan parameter sebelumnya.
- Level 5: Masukkan parameter sebelumnya, dan WAJIB ganti penyebutan subjek/objek dengan @tags yang diberikan. Di akhir prompt, beri instruksi tegas bahwa @tags tidak boleh berubah wujudnya di sepanjang video.

Selalu kembalikan JSON Murni tanpa format markdown: { "positivePrompt": "...", "negativePrompt": "..." }`;

      const userPrompt = `
DATA INPUT:
Level 1 (Lazy One Liner): ${builderShot.lazyOneLiner}
Level 2 (Subject): ${builderShot.subject}
Level 2 (Action): ${builderShot.action}
Level 2 (Setting): ${builderShot.setting}
Level 2 (Lighting): ${builderShot.lighting}
Level 2 (Mood): ${builderShot.mood}
Level 3 (Camera Motion): ${builderShot.cameraMotion}
Level 4 (Continuity/Transition): ${builderShot.continuity}
Dialog (Optional): ${builderShot.dialogue}
Level 5 (Aset @tags yg dipakai): ${tagsSummary || 'Tidak ada'}
`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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
        // Membersihkan markdown
        const cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        setGeneratedPromptResult(JSON.parse(cleanJson));
        addToast(`Prompt Level ${promptLevel} berhasil digenerate!`);
      } else throw new Error();
    } catch (err) { 
      addToast('Gagal merangkai prompt. Periksa API Key.', 'error'); 
      console.error('Error saat merangkai prompt:', err);
    } 
    finally { setIsGeneratingPrompt(false); }
  };

  const handleAssetImageUpload = (e) => {
// ... existing code ...
