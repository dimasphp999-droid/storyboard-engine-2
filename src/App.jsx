import React, { useState, useEffect, useRef } from 'react';
import { 
    Sparkles, Wand2, FileText, ChevronRight, ChevronLeft, 
    Upload, List, Grid, Trash2, Plus, Film, FolderOpen, 
    Images, Box, Copy, Terminal, AlertCircle, History, 
    Save, Check, ChartPie, CheckCircle, RefreshCw, 
    Download, Printer, Share2, Lock, Loader2, PenTool,
    Settings, Camera, ImagePlus, Eye, Link as LinkIcon
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';

let app, auth, db, appId;
try {
    if (typeof __firebase_config !== 'undefined') {
        const firebaseConfig = JSON.parse(__firebase_config);
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    }
} catch (error) {
    console.warn("Firebase tidak terkonfigurasi. Fitur Cloud Share akan nonaktif.");
}

const callGeminiAPI = async (prompt, systemInstruction, schema = null, base64Image = null) => {
    const apiKey = ""; // API Key disuntikkan oleh environment
    // Menggunakan model flash terbaru untuk mendukung gambar (Vision) & teks
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const parts = [{ text: prompt }];
    
    if (base64Image) {
        const match = base64Image.match(/^data:(image\/[a-zA-Z]*);base64,([^\"]*)$/);
        if (match) {
            parts.push({
                inlineData: {
                    mimeType: match[1],
                    data: match[2]
                }
            });
        }
    }

    const payload = {
        contents: [{ role: "user", parts: parts }],
        generationConfig: {}
    };

    if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    if (schema) {
        payload.generationConfig.responseMimeType = "application/json";
        payload.generationConfig.responseSchema = schema;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error.message);
        }

        if (result.candidates && result.candidates.length > 0) {
            const textResponse = result.candidates[0].content.parts[0].text;
            if (schema) {
                let cleanJsonText = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();
                return JSON.parse(cleanJsonText);
            }
            return textResponse;
        }
        throw new Error("Respon tidak valid dari AI");
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

const extractPdfText = async (fileUrl) => {
    try {
        const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs';

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n\n";
        }
        return fullText;
    } catch (err) {
        console.error("Gagal membaca PDF:", err);
        throw new Error("Gagal membaca teks dari PDF.");
    }
};

const compressImage = (base64Str, maxWidth = 800) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7)); 
        };
        img.onerror = () => resolve(base64Str);
    });
};

const Button = ({ onClick, children, variant = 'primary', icon: Icon, loading, className = "", disabled }) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/50",
        secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
        danger: "bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500",
        ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-white"
    };
    return (
        <button onClick={onClick} disabled={loading || disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

const Input = ({ label, value, onChange, placeholder, type = "text", className = "", readOnly = false }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        {label && <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>}
        <input 
            type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
            className={`bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-zinc-600 transition-all ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
    </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3, className = "", readOnly = false, labelRight = null }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        {(label || labelRight) && (
            <div className="flex justify-between items-end">
                {label && <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>}
                {labelRight && <div>{labelRight}</div>}
            </div>
        )}
        <textarea 
            value={value} onChange={onChange} placeholder={placeholder} rows={rows} readOnly={readOnly}
            className={`bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-zinc-600 transition-all resize-y ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <span className="absolute top-0 right-0 p-1">✕</span>
                </button>
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const ScriptTab = ({ project, setProject, setActiveTab, isReadOnly }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isReadingPdf, setIsReadingPdf] = useState(false);
    const [idea, setIdea] = useState({ genre: '', characters: '', situation: '' });
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef(null);

    const handleGenerateScript = async () => {
        if (!idea.genre || !idea.situation) {
            setErrorMsg("Isi minimal genre dan situasi singkat.");
            return;
        }
        setIsGenerating(true);
        setErrorMsg("");
        try {
            const prompt = `Buat naskah film pendek berdasarkan ide ini: Genre: ${idea.genre}, Karakter: ${idea.characters}, Situasi: ${idea.situation}`;
            const systemMsg = "Kamu adalah penulis naskah film profesional. Kembangkan ide menjadi naskah film pendek lengkap dengan format standar (Scene Heading, Action, Character, Dialogue).";
            const schema = {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING", description: "Judul film yang menarik" },
                    logline: { type: "STRING", description: "Logline 1-2 kalimat" },
                    scriptText: { type: "STRING", description: "Naskah lengkap dengan format standar" }
                },
                required: ["title", "logline", "scriptText"]
            };

            const result = await callGeminiAPI(prompt, systemMsg, schema);
            setProject({ ...project, title: result.title, logline: result.logline, scriptText: result.scriptText });
        } catch (err) {
            setErrorMsg("Gagal menghasilkan naskah. Coba lagi.");
        }
        setIsGenerating(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type === "application/pdf") {
            setIsReadingPdf(true);
            try {
                const url = URL.createObjectURL(file);
                const text = await extractPdfText(url);
                setProject({ ...project, scriptText: text });
                URL.revokeObjectURL(url);
            } catch (err) {
                setErrorMsg("Gagal membaca file PDF.");
            }
            setIsReadingPdf(false);
        } else if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (ev) => setProject({ ...project, scriptText: ev.target.result });
            reader.readAsText(file);
        } else {
            setErrorMsg("Format tidak didukung. Gunakan .txt atau .pdf");
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-6">
                {!isReadOnly && (
                    <div className="w-full md:w-1/3 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg h-fit">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Wand2 className="text-indigo-400 w-5 h-5" /> AI Script Writer
                        </h2>
                        <div className="space-y-4">
                            <Input label="Genre" placeholder="Sci-fi thriller, Drama keluarga..." value={idea.genre} onChange={e => setIdea({...idea, genre: e.target.value})} />
                            <Input label="Karakter Utama" placeholder="Detektif paruh baya, robot usang..." value={idea.characters} onChange={e => setIdea({...idea, characters: e.target.value})} />
                            <Textarea label="Situasi Singkat / Premis" placeholder="Menemukan artefak alien di ruang bawah tanah..." value={idea.situation} onChange={e => setIdea({...idea, situation: e.target.value})} rows={4} />
                            
                            {errorMsg && <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded">{errorMsg}</div>}
                            <Button onClick={handleGenerateScript} loading={isGenerating} icon={PenTool} className="w-full">
                                {isGenerating ? 'Menulis Naskah...' : 'Generate Naskah'}
                            </Button>
                        </div>
                    </div>
                )}

                <div className={`w-full ${isReadOnly ? 'md:w-full' : 'md:w-2/3'} bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg flex flex-col`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="text-indigo-400 w-5 h-5" /> Naskah Final
                        </h2>
                        {!isReadOnly && (
                            <div>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf" className="hidden" />
                                <Button onClick={() => fileInputRef.current?.click()} variant="secondary" icon={Upload} loading={isReadingPdf} className="text-xs py-1 px-3 h-8">
                                    {isReadingPdf ? 'Membaca PDF...' : 'Upload Dokumen (.txt, .pdf)'}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4 flex-grow flex flex-col">
                        <Input label="Judul Proyek" placeholder="Judul Film..." value={project.title} onChange={e => setProject({...project, title: e.target.value})} readOnly={isReadOnly} />
                        <Textarea label="Logline" placeholder="Ringkasan satu kalimat..." value={project.logline} onChange={e => setProject({...project, logline: e.target.value})} rows={2} readOnly={isReadOnly} />
                        <div className="flex-grow flex flex-col gap-1 mt-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Isi Naskah</label>
                            <textarea 
                                value={project.scriptText} 
                                onChange={e => setProject({...project, scriptText: e.target.value})} 
                                readOnly={isReadOnly}
                                placeholder="Tempel naskah Anda di sini, ketik manual, upload, atau generate menggunakan AI di samping..."
                                className={`bg-zinc-950 border border-zinc-800 rounded-md p-5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-200 placeholder-zinc-600 flex-grow min-h-[400px] h-full resize-none font-mono leading-7 tracking-wide whitespace-pre-wrap overflow-y-auto shadow-inner ${isReadOnly ? 'opacity-90' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button onClick={() => setActiveTab('shotlist')} variant="primary">
                    Lanjut ke Shotlist <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

const ShotlistTab = ({ project, shots, setShots, assets, setActiveTab, isReadOnly }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [viewMode, setViewMode] = useState('list');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleGenerateShotlist = async () => {
        if (!project.scriptText) {
            setErrorMsg("Naskah masih kosong. Harap isi naskah di tab Script terlebih dahulu.");
            return;
        }
        setIsGenerating(true);
        setErrorMsg("");
        try {
            const prompt = `Berikut adalah naskah film pendek:\n\n${project.scriptText}`;
            const systemMsg = `Kamu adalah Sutradara dan DOP profesional. Tugasmu: pecah seluruh naskah ini menjadi shot list detail yang bisa dipakai sebagai blueprint produksi untuk film pendek AI-generated. JANGAN menulis ulang atau mengubah cerita — pertahankan urutan dan isi cerita asli. Untuk setiap shot, tentukan: durasi (hanya angka dalam detik, misal: 3, 5), deskripsi aksi/adegan detail, framing (close-up/medium/wide, dll), camera angle, dan instruksi pencahayaan/atmosfer untuk kesan cinematic.`;
            
            const schema = {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        duration: { type: "INTEGER", description: "Durasi dalam detik (angka saja, misal 3)" },
                        action: { type: "STRING", description: "Deskripsi detail apa yang terjadi dalam shot ini" },
                        framing: { type: "STRING", description: "Contoh: Close-up, Wide shot" },
                        angle: { type: "STRING", description: "Contoh: Low angle, Eye level" },
                        lighting: { type: "STRING", description: "Contoh: Moody cinematic lighting" }
                    },
                    required: ["duration", "action", "framing", "angle", "lighting"]
                }
            };

            const result = await callGeminiAPI(prompt, systemMsg, schema);
            
            const newShots = result.map((shot, index) => ({
                id: Date.now() + index,
                shotNumber: index + 1,
                status: 'pending',
                videoPrompt: '',
                negativePrompt: '',
                selectedAssets: [],
                aspectRatio: project.globalAspectRatio || '16:9',
                promptHistory: [],
                ...shot,
                duration: shot.duration.toString()
            }));
            setShots(newShots);
        } catch (err) {
            setErrorMsg(`Gagal memecah naskah. Pastikan naskah cukup panjang. Detail: ${err.message}`);
        }
        setIsGenerating(false);
    };

    const updateShot = (id, field, value) => {
        if(isReadOnly) return;
        setShots(shots.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const deleteShot = (id) => {
        if(isReadOnly) return;
        setShots(shots.filter(s => s.id !== id));
    };

    const clearAllShots = () => {
        setShots([]);
        setShowClearConfirm(false);
    };

    const addManualShot = () => {
        setShots([...shots, {
            id: Date.now(), shotNumber: shots.length + 1, duration: '3', action: '', framing: 'Medium Shot', angle: 'Eye Level', lighting: 'Natural', status: 'pending', videoPrompt: '', negativePrompt: '', selectedAssets: [], aspectRatio: project.globalAspectRatio || '16:9', promptHistory: []
        }]);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Shotlist Generator</h2>
                    <p className="text-sm text-zinc-400">Pecah naskah menjadi urutan shot yang siap dieksekusi.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-zinc-800 rounded-md p-1 mr-2">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}><List className="w-4 h-4"/></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}><Grid className="w-4 h-4"/></button>
                    </div>
                    
                    {!isReadOnly && (
                        <>
                            {shots.length > 0 && (
                                <Button onClick={() => setShowClearConfirm(true)} variant="danger" icon={Trash2} className="text-xs px-2 py-1.5 h-8">Kosongkan</Button>
                            )}
                            <Button onClick={addManualShot} variant="secondary" icon={Plus} className="text-xs px-2 py-1.5 h-8">Manual</Button>
                            <Button onClick={handleGenerateShotlist} loading={isGenerating} icon={Sparkles} className="text-xs py-1.5 h-8">
                                {isGenerating ? 'Menganalisis...' : 'Auto-Generate'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            
            {errorMsg && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{errorMsg}</div>}

            <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Hapus Semua Shot?">
                <p className="text-zinc-400 text-sm mb-6">Apakah Anda yakin ingin menghapus seluruh shotlist? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex justify-end gap-3">
                    <Button onClick={() => setShowClearConfirm(false)} variant="ghost">Batal</Button>
                    <Button onClick={clearAllShots} variant="danger">Ya, Hapus Semua</Button>
                </div>
            </Modal>

            <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0' : ''}`}>
                {shots.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-700 col-span-full">
                        <Film className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>Belum ada shot. Klik Generate atau Tambah Manual.</p>
                    </div>
                ) : (
                    shots.map((shot, idx) => (
                        <div key={shot.id} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-md flex gap-4 transition-all hover:border-zinc-500">
                            <div className="flex flex-col items-center justify-start w-12 border-r border-zinc-800 pr-4">
                                <span className="text-xl font-bold text-indigo-500">#{idx + 1}</span>
                                {!isReadOnly && (
                                    <button onClick={() => deleteShot(shot.id)} className="mt-4 text-zinc-500 hover:text-red-400 transition-colors" title="Hapus Shot">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className={`flex-grow ${viewMode === 'list' ? 'grid grid-cols-1 md:grid-cols-4 gap-4' : 'flex flex-col gap-3'}`}>
                                {viewMode === 'grid' && shot.selectedAssets?.length > 0 && (
                                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
                                        {shot.selectedAssets.map(assetId => {
                                            const asset = assets.find(a => a.id === assetId);
                                            return asset ? <img key={assetId} src={asset.fileUrl} alt={asset.name} className="w-12 h-12 rounded object-cover border border-zinc-700" title={asset.name} /> : null;
                                        })}
                                    </div>
                                )}
                                <div className={viewMode === 'list' ? 'md:col-span-4' : ''}>
                                    <Textarea label="Deskripsi Aksi" value={shot.action} onChange={(e) => updateShot(shot.id, 'action', e.target.value)} rows={viewMode==='grid'? 3: 2} readOnly={isReadOnly} />
                                </div>
                                <Input label="Framing" value={shot.framing} onChange={(e) => updateShot(shot.id, 'framing', e.target.value)} readOnly={isReadOnly} />
                                <Input label="Angle" value={shot.angle} onChange={(e) => updateShot(shot.id, 'angle', e.target.value)} readOnly={isReadOnly} />
                                <Input label="Lighting/Atmosfer" value={shot.lighting} onChange={(e) => updateShot(shot.id, 'lighting', e.target.value)} readOnly={isReadOnly} />
                                <Input label="Durasi (detik)" value={shot.duration} onChange={(e) => updateShot(shot.id, 'duration', e.target.value)} readOnly={isReadOnly} />
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="flex justify-between pt-4 border-t border-zinc-800">
                <Button onClick={() => setActiveTab('script')} variant="ghost">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Naskah
                </Button>
                <Button onClick={() => setActiveTab('assets')} variant="primary">
                    Lanjut ke Library Aset <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

const AssetsTab = ({ assets, setAssets, globalAssets, setGlobalAssets, setActiveTab, isReadOnly, showDialog }) => {
    const [newAsset, setNewAsset] = useState({ name: '', type: 'Character', details: '', fileUrl: null });
    const [isDetecting, setIsDetecting] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const compressedBase64 = await compressImage(ev.target.result);
                setNewAsset({ ...newAsset, fileUrl: compressedBase64 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAutoDetect = async () => {
        if (!newAsset.fileUrl) return;
        setIsDetecting(true);
        try {
            const prompt = `Analisis gambar ini secara detail. Tuliskan deskripsi visualnya dalam satu paragraf yang sangat spesifik dan deskriptif dalam bahasa Inggris (sangat cocok untuk prompt video generation AI). Fokus pada elemen pakaian, warna, fitur wajah/bentuk, tekstur, gaya, dan material. Jangan beri pengantar/kalimat pembuka, langsung mulai deskripsi padatnya.`;
            const description = await callGeminiAPI(prompt, "", null, newAsset.fileUrl);
            setNewAsset({ ...newAsset, details: description });
        } catch (err) {
            console.error(err);
            showDialog("Gagal mendeteksi gambar otomatis. Pastikan ukuran file sesuai atau coba lagi.");
        }
        setIsDetecting(false);
    };

    const handleAddAsset = () => {
        if (!newAsset.name || !newAsset.fileUrl) return;
        const assetObj = { id: Date.now(), ...newAsset };
        setAssets([...assets, assetObj]);
        
        if (!globalAssets.find(a => a.name === assetObj.name && a.type === assetObj.type)) {
            setGlobalAssets([...globalAssets, assetObj]);
        }
        
        setNewAsset({ name: '', type: 'Character', details: '', fileUrl: null });
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const deleteAsset = (id) => {
        if(isReadOnly) return;
        setAssets(assets.filter(a => a.id !== id));
    };

    const addFromGlobal = (globalAsset) => {
        if(isReadOnly) return;
        if (!assets.find(a => a.id === globalAsset.id)) {
            setAssets([...assets, { ...globalAsset, id: Date.now() }]);
        }
    };

    const typeColors = {
        Character: "bg-blue-900/30 text-blue-400 border-blue-800",
        Location: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
        Prop: "bg-amber-900/30 text-amber-400 border-amber-800"
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-6">
                {!isReadOnly && (
                    <div className="w-full md:w-1/3 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg h-fit">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FolderOpen className="text-amber-400 w-5 h-5" /> Tambah Aset Baru
                        </h2>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gambar Aset</label>
                                <div 
                                    className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-zinc-800 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {newAsset.fileUrl ? (
                                        <img src={newAsset.fileUrl} alt="Preview" className="h-32 mx-auto object-contain rounded" />
                                    ) : (
                                        <div className="text-zinc-500 py-4 flex flex-col items-center">
                                            <Upload className="w-8 h-8 mb-2" />
                                            <p className="text-sm">Klik untuk upload gambar</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>

                            <Input label="Nama Aset" placeholder="Misal: Detektif John, Mobil Tua..." value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Kategori</label>
                                <select 
                                    value={newAsset.type} 
                                    onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                                    className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                                >
                                    <option value="Character">Karakter</option>
                                    <option value="Location">Lokasi</option>
                                    <option value="Prop">Properti</option>
                                </select>
                            </div>

                            <Textarea 
                                label="Catatan Detail (Untuk Prompt)" 
                                placeholder="Misal: Pria usia 40an, memakai jas hujan basah..." 
                                value={newAsset.details} 
                                onChange={e => setNewAsset({...newAsset, details: e.target.value})} 
                                rows={4} 
                                labelRight={
                                    <button 
                                        onClick={handleAutoDetect}
                                        disabled={!newAsset.fileUrl || isDetecting}
                                        className="text-[10px] bg-indigo-900/50 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-indigo-800 disabled:opacity-50 transition-colors"
                                    >
                                        {isDetecting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                                        Auto Deteksi
                                    </button>
                                }
                            />
                            
                            <Button onClick={handleAddAsset} icon={Plus} className="w-full" disabled={!newAsset.name || !newAsset.fileUrl}>
                                Simpan Aset
                            </Button>
                        </div>
                        
                        {globalAssets.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <h3 className="text-sm font-semibold mb-3 text-zinc-400">Library Global (Pernah Diupload)</h3>
                                <div className="flex flex-wrap gap-2">
                                    {globalAssets.map(ga => (
                                        <button key={ga.id} onClick={() => addFromGlobal(ga)} className="text-xs bg-zinc-800 border border-zinc-700 hover:border-indigo-500 px-2 py-1.5 rounded flex items-center gap-2 transition-colors">
                                            <img src={ga.fileUrl} className="w-4 h-4 rounded-sm object-cover" />
                                            {ga.name} <Plus className="w-3 h-3 text-zinc-500" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className={`w-full ${isReadOnly ? 'md:w-full' : 'md:w-2/3'} bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg`}>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Images className="text-indigo-400 w-5 h-5" /> Galeri Aset Proyek Ini
                    </h2>
                    {assets.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-700 rounded-xl">
                            <Box className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p>Library aset proyek ini masih kosong.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {assets.map(asset => (
                                <div key={asset.id} className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 group relative shadow-md">
                                    <div className="h-32 bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                                        <img src={asset.fileUrl} alt={asset.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        {!isReadOnly && (
                                            <button onClick={() => deleteAsset(asset.id)} className="absolute top-2 right-2 bg-red-900/80 text-white p-1.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-sm truncate" title={asset.name}>{asset.name}</h3>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${typeColors[asset.type]}`}>
                                            {asset.type}
                                        </span>
                                        <p className="text-xs text-zinc-400 mt-2 line-clamp-3" title={asset.details}>{asset.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-zinc-800">
                <Button onClick={() => setActiveTab('shotlist')} variant="ghost">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Shotlist
                </Button>
                <Button onClick={() => setActiveTab('prompts')} variant="primary">
                    Lanjut ke Video Prompt <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

const PromptsTab = ({ project, shots, setShots, assets, setActiveTab, isReadOnly }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const [historyModal, setHistoryModal] = useState({ isOpen: false, shotId: null });

    const toggleAssetForShot = (shotId, assetId) => {
        if(isReadOnly) return;
        setShots(shots.map(s => {
            if (s.id === shotId) {
                const isSelected = s.selectedAssets.includes(assetId);
                const newAssets = isSelected ? s.selectedAssets.filter(id => id !== assetId) : [...s.selectedAssets, assetId];
                return { ...s, selectedAssets: newAssets };
            }
            return s;
        }));
    };

    const processGeneratePrompt = async (shot) => {
        const selectedAssetsDetails = assets
            .filter(a => shot.selectedAssets.includes(a.id))
            .map(a => `${a.type} "${a.name}": ${a.details}`)
            .join(" | ");

        const visualStyle = project.visualStyle ? `Visual Style/Mood: ${project.visualStyle}\n` : '';
        const aspectRatio = `Aspect Ratio: ${shot.aspectRatio || project.globalAspectRatio || '16:9'}`;

        const promptText = `Buatkan video generation prompt untuk shot ini:\nAksi: ${shot.action}\nFraming: ${shot.framing}\nAngle: ${shot.angle}\nLighting/Atmosfer: ${shot.lighting}\n\nAset Visual yang harus dimasukkan: ${selectedAssetsDetails ? selectedAssetsDetails : 'Tidak ada aset khusus.'}\n${visualStyle}${aspectRatio}`;
        
        const systemMsg = `Kamu adalah Prompt Engineer Ahli untuk Model AI Video. Tugasmu: Gabungkan deskripsi shot, style, dan detail aset menjadi SATU prompt video bahasa Inggris yang deskriptif, terstruktur, sinematik. Gunakan format kamera yang profesional. Sertakan perintah rasio aspek di ujung prompt (misal: --ar 16:9). Hasilkan juga Negative Prompt.`;

        const schema = {
            type: "OBJECT",
            properties: {
                prompt: { type: "STRING", description: "Prompt video bahasa Inggris yang siap pakai" },
                negativePrompt: { type: "STRING", description: "Negative prompt" }
            },
            required: ["prompt", "negativePrompt"]
        };

        return await callGeminiAPI(promptText, systemMsg, schema);
    };

    const generatePromptForShot = async (shot) => {
        if(isReadOnly) return;
        setLoadingId(shot.id);
        try {
            const result = await processGeneratePrompt(shot);
            saveHistory(shot.id); 
            setShots(shots.map(s => s.id === shot.id ? { 
                ...s, 
                videoPrompt: result.prompt, 
                negativePrompt: result.negativePrompt,
                status: 'prompt_ready'
            } : s));
        } catch (err) {
            console.error("Failed generating prompt", err);
        }
        setLoadingId(null);
    };

    const generateAllMissingPrompts = async () => {
        if(isReadOnly) return;
        setIsGeneratingAll(true);
        const missingShots = shots.filter(s => !s.videoPrompt);
        for (const shot of missingShots) {
            await generatePromptForShot(shot);
        }
        setIsGeneratingAll(false);
    };

    const copyAllPrompts = () => {
        const allText = shots.map((s, i) => `Shot ${i+1}:\n${s.videoPrompt}\nNegative: ${s.negativePrompt}\n`).join("\n");
        navigator.clipboard.writeText(allText);
    };

    const saveHistory = (id) => {
        if(isReadOnly) return;
        setShots(shots.map(s => {
            if (s.id === id && s.videoPrompt) {
                const newHistory = [...(s.promptHistory || []), { date: new Date().toISOString(), prompt: s.videoPrompt, negativePrompt: s.negativePrompt }];
                return { ...s, promptHistory: newHistory.slice(-5) }; 
            }
            return s;
        }));
    };

    const restoreHistory = (shotId, historyItem) => {
        if(isReadOnly) return;
        setShots(shots.map(s => s.id === shotId ? { ...s, videoPrompt: historyItem.prompt, negativePrompt: historyItem.negativePrompt } : s));
        setHistoryModal({ isOpen: false, shotId: null });
    };

    const updateShotStatus = (id, newStatus) => {
        if(isReadOnly) return;
        setShots(shots.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };
    
    const updatePromptText = (id, field, value) => {
        if(isReadOnly) return;
        setShots(shots.map(s => s.id === id ? { ...s, [field]: value } : s));
    };
    
    const updateShotRatio = (id, ratio) => {
        if(isReadOnly) return;
        setShots(shots.map(s => s.id === id ? { ...s, aspectRatio: ratio } : s));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Video Prompt Generator</h2>
                    <p className="text-sm text-zinc-400">Kaitkan aset dengan shot, lalu generate prompt siap pakai.</p>
                </div>
                {!isReadOnly && (
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={copyAllPrompts} variant="secondary" icon={Copy} className="text-xs h-9">Salin Semua Prompt</Button>
                        <Button onClick={generateAllMissingPrompts} loading={isGeneratingAll} icon={Sparkles} className="text-xs h-9">
                            {isGeneratingAll ? 'Memproses...' : 'Buat Semua Prompt Kosong'}
                        </Button>
                    </div>
                )}
            </div>

            {shots.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-700">
                    <Terminal className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>Shotlist kosong. Silakan buat shot di tab Shotlist terlebih dahulu.</p>
                </div>
            ) : (
                shots.map((shot, idx) => {
                    const mentionedAssets = assets.filter(a => shot.action.toLowerCase().includes(a.name.toLowerCase()) && !shot.selectedAssets.includes(a.id));
                    
                    return (
                        <div key={shot.id} className={`bg-zinc-900 border ${shot.status === 'generated' ? 'border-emerald-800/50' : 'border-zinc-700'} rounded-xl p-5 shadow-md flex flex-col gap-4 relative overflow-hidden transition-all`}>
                            {shot.status === 'generated' && <div className="absolute top-0 right-0 bg-emerald-600/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-l border-b border-emerald-800/50 uppercase">Video Selesai</div>}
                            {shot.status === 'prompt_ready' && <div className="absolute top-0 right-0 bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-l border-b border-indigo-800/50 uppercase">Prompt Siap</div>}
                            
                            <div className="flex gap-4">
                                <div className="text-xl font-bold text-zinc-500 w-8">#{idx + 1}</div>
                                <div className="flex-grow text-sm text-zinc-300">
                                    <p className="font-semibold text-white mb-1">{shot.action}</p>
                                    <p className="text-xs"><span className="text-zinc-500">Kamera:</span> {shot.framing}, {shot.angle} | <span className="text-zinc-500">Lighting:</span> {shot.lighting}</p>
                                </div>
                            </div>

                            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pilih Aset untuk Shot ini</label>
                                    {!isReadOnly && (
                                        <select 
                                            value={shot.aspectRatio || project.globalAspectRatio || '16:9'} 
                                            onChange={e => updateShotRatio(shot.id, e.target.value)}
                                            className="bg-zinc-800 border border-zinc-700 rounded text-xs px-2 py-1 text-white outline-none"
                                        >
                                            <option value="16:9">16:9 (Landscape)</option>
                                            <option value="9:16">9:16 (Portrait)</option>
                                        </select>
                                    )}
                                </div>
                                
                                {mentionedAssets.length > 0 && (
                                    <div className="text-[10px] bg-amber-900/30 text-amber-400 p-2 rounded mb-2 flex items-center gap-1 border border-amber-800/50">
                                        <AlertCircle className="w-3 h-3" /> Tip: Sepertinya "{mentionedAssets.map(a=>a.name).join(', ')}" ada di deskripsi tapi belum dipilih.
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                    {assets.length === 0 ? <span className="text-xs text-zinc-500 italic">Belum ada aset di library.</span> : 
                                        assets.map(asset => {
                                            const isSelected = shot.selectedAssets?.includes(asset.id);
                                            return (
                                                <button 
                                                    key={asset.id}
                                                    onClick={() => toggleAssetForShot(shot.id, asset.id)}
                                                    className={`text-xs px-2 py-1 rounded flex items-center gap-2 border transition-all ${isSelected ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                                                >
                                                    <img src={asset.fileUrl} className="w-4 h-4 object-cover rounded-sm" />
                                                    {asset.name}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mt-2">
                                {!isReadOnly && (
                                    <div className="md:w-1/4">
                                        <Button onClick={() => generatePromptForShot(shot)} loading={loadingId === shot.id} icon={Wand2} className="w-full text-xs py-3 h-full">
                                            {shot.videoPrompt ? 'Regenerate' : 'Buat Prompt Video'}
                                        </Button>
                                    </div>
                                )}
                                <div className={`md:w-3/4 space-y-3 ${isReadOnly ? 'w-full' : ''}`}>
                                    <div className="relative">
                                        <Textarea 
                                            label="Prompt Utama" 
                                            value={shot.videoPrompt} 
                                            onChange={e => updatePromptText(shot.id, 'videoPrompt', e.target.value)} 
                                            rows={3} 
                                            className="w-full" 
                                            placeholder="Prompt akan muncul di sini..." 
                                            readOnly={isReadOnly}
                                            labelRight={
                                                !isReadOnly && shot.videoPrompt && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setHistoryModal({isOpen: true, shotId: shot.id})} className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"><History className="w-3 h-3"/> Histori</button>
                                                        <button onClick={() => saveHistory(shot.id)} className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"><Save className="w-3 h-3"/> Simpan Editan</button>
                                                    </div>
                                                )
                                            }
                                        />
                                        {shot.videoPrompt && <button onClick={() => navigator.clipboard.writeText(shot.videoPrompt)} className="absolute top-6 right-2 text-zinc-400 hover:text-white p-2" title="Copy"><Copy className="w-4 h-4" /></button>}
                                    </div>
                                    <div className="relative">
                                        <Input label="Negative Prompt" value={shot.negativePrompt} onChange={e => updatePromptText(shot.id, 'negativePrompt', e.target.value)} placeholder="Negative prompt..." readOnly={isReadOnly} />
                                        {shot.negativePrompt && <button onClick={() => navigator.clipboard.writeText(shot.negativePrompt)} className="absolute top-6 right-2 text-zinc-400 hover:text-white p-2" title="Copy"><Copy className="w-4 h-4" /></button>}
                                    </div>
                                    
                                    {!isReadOnly && (
                                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                                            <button onClick={() => updateShotStatus(shot.id, 'pending')} className={`text-xs px-3 py-1 rounded-md border ${shot.status === 'pending' ? 'bg-zinc-700 text-white border-zinc-500' : 'text-zinc-500 border-zinc-800 hover:bg-zinc-800'}`}>Pending</button>
                                            <button onClick={() => updateShotStatus(shot.id, 'prompt_ready')} className={`text-xs px-3 py-1 rounded-md border ${shot.status === 'prompt_ready' ? 'bg-indigo-900/50 text-indigo-200 border-indigo-700' : 'text-zinc-500 border-zinc-800 hover:bg-zinc-800'}`}>Prompt Siap</button>
                                            <button onClick={() => updateShotStatus(shot.id, 'generated')} className={`text-xs px-3 py-1 rounded-md border ${shot.status === 'generated' ? 'bg-emerald-900/50 text-emerald-200 border-emerald-700' : 'text-zinc-500 border-zinc-800 hover:bg-zinc-800'}`}><Check className="w-3 h-3 inline mr-1" /> Video Selesai</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            <Modal isOpen={historyModal.isOpen} onClose={() => setHistoryModal({isOpen: false, shotId: null})} title="Riwayat Versi Prompt">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {shots.find(s => s.id === historyModal.shotId)?.promptHistory?.length > 0 ? 
                        shots.find(s => s.id === historyModal.shotId).promptHistory.map((h, i) => (
                            <div key={i} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs">
                                <div className="text-zinc-500 mb-1 flex justify-between">
                                    <span>{new Date(h.date).toLocaleString()}</span>
                                    <button onClick={() => restoreHistory(historyModal.shotId, h)} className="text-indigo-400 hover:text-indigo-300 font-bold">Restore</button>
                                </div>
                                <p className="text-zinc-300 line-clamp-3">{h.prompt}</p>
                            </div>
                        ))
                    : <p className="text-sm text-zinc-500">Belum ada histori tersimpan.</p>}
                </div>
            </Modal>
            
            <div className="flex justify-between pt-4 border-t border-zinc-800">
                <Button onClick={() => setActiveTab('assets')} variant="ghost">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Library Aset
                </Button>
                <Button onClick={() => setActiveTab('dashboard')} variant="primary">
                    Selesai & Lihat Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

const DashboardTab = ({ project, setProject, shots, setShots, assets, setAssets, isReadOnly, showDialog }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const totalShots = shots.length;
    const promptReady = shots.filter(s => s.status === 'prompt_ready').length;
    const videoGenerated = shots.filter(s => s.status === 'generated').length;
    const progress = totalShots === 0 ? 0 : Math.round((videoGenerated / totalShots) * 100);
    const estDuration = shots.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);

    const handleSaveProject = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({project, shots, assets}));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `${project.title || 'Untitled_Project'}.json`);
        dlAnchorElem.click();
    };

    const handleImportProject = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.project && data.shots && data.assets) {
                    setProject(data.project);
                    setShots(data.shots);
                    setAssets(data.assets);
                } else {
                    showDialog("Format file tidak valid.");
                }
            } catch (err) {
                showDialog("Gagal membaca file JSON.");
            }
        };
        reader.readAsText(file);
    };

    const applyGlobalRatio = () => {
        setShots(shots.map(s => ({ ...s, aspectRatio: project.globalAspectRatio || '16:9' })));
    };

    const handleShareLink = async () => {
        if (!db) {
            showDialog("Firebase tidak dikonfigurasi. Fitur Share dinonaktifkan.");
            return;
        }
        setIsSharing(true);
        try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
            
            const docRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'));
            
            await setDoc(docRef, {
                project,
                shots,
                assets, 
                createdAt: new Date().toISOString()
            });
            const url = `${window.location.origin}${window.location.pathname}?share=${docRef.id}`;
            setShareUrl(url);
        } catch (err) {
            console.error(err);
            showDialog("Gagal mengupload proyek ke Cloud. Pastikan ukuran total gambar tidak melebihi kuota 1MB Firestore.");
        }
        setIsSharing(false);
    };

    const printShotlistPDF = () => {
        const printWindow = window.open('', '', 'height=800,width=800');
        printWindow.document.write('<html><head><title>Shotlist - ' + (project.title || 'Project') + '</title>');
        printWindow.document.write('<style>body{font-family:sans-serif; padding:20px;} table{width:100%; border-collapse:collapse; margin-top:20px;} th,td{border:1px solid #ccc; padding:10px; text-align:left;} th{background:#eee;} h1,h3{margin:0 0 10px 0;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h1>${project.title || 'Untitled Project'}</h1>`);
        printWindow.document.write(`<h3>Logline: ${project.logline || '-'}</h3>`);
        printWindow.document.write('<table><tr><th>Shot</th><th>Action</th><th>Framing & Angle</th><th>Duration</th></tr>');
        shots.forEach((s, i) => {
            printWindow.document.write(`<tr><td>${i+1}</td><td>${s.action}</td><td>${s.framing}, ${s.angle}</td><td>${s.duration}s</td></tr>`);
        });
        printWindow.document.write('</table></body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const handleResetProject = () => {
        showDialog("Apakah Anda yakin ingin memulai proyek baru? Semua data yang belum disave ke .json akan hilang!", "confirm", () => {
            setProject({ title: '', logline: '', scriptText: '', globalAspectRatio: '16:9', visualStyle: '' });
            setShots([]);
            setAssets([]);
            setShareUrl("");
            try {
                const url = new URL(window.location);
                url.searchParams.delete('share');
                window.history.pushState({}, '', url);
            } catch (e) {
                console.warn("History API diblokir oleh sandbox environment.");
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {isReadOnly && (
                <div className="bg-indigo-900/50 border border-indigo-500 text-indigo-200 p-4 rounded-xl flex items-center justify-center gap-2 font-semibold">
                    <Eye className="w-5 h-5" /> Mode Tampilan (Read-Only). Anda sedang melihat proyek yang dibagikan.
                </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-lg text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{project.title || "Proyek Tanpa Judul"}</h1>
                <p className="text-zinc-400 max-w-2xl mx-auto italic">"{project.logline || "Logline belum ditentukan..."}"</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center">
                    <Film className="w-8 h-8 text-zinc-500 mb-3" />
                    <div className="text-3xl font-bold text-white">{totalShots}</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 text-center">Total Shot</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-white mb-2">{Math.floor(estDuration / 60)}m {estDuration % 60}s</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider text-center">Estimasi Durasi Video</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center">
                    <Box className="w-8 h-8 text-amber-500/50 mb-3" />
                    <div className="text-3xl font-bold text-white">{assets.length}</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 text-center">Aset Tersimpan</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center">
                    <Terminal className="w-8 h-8 text-indigo-500/50 mb-3" />
                    <div className="text-3xl font-bold text-white">{promptReady}</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1 text-center">Prompt Siap</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center border-b-4 border-b-emerald-600 col-span-2 md:col-span-1">
                    <CheckCircle className="w-8 h-8 text-emerald-500/50 mb-3" />
                    <div className="text-3xl font-bold text-emerald-400">{videoGenerated}</div>
                    <div className="text-[10px] text-emerald-500/70 uppercase tracking-wider mt-1 text-center">Video Selesai</div>
                </div>
            </div>

            {!isReadOnly && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2"><Settings className="w-5 h-5"/> Pengaturan Proyek</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-end">
                                <div className="flex-grow">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Global Aspect Ratio</label>
                                    <select 
                                        value={project.globalAspectRatio || '16:9'} 
                                        onChange={e => setProject({...project, globalAspectRatio: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white"
                                    >
                                        <option value="16:9">16:9 (YouTube / Layar Lebar)</option>
                                        <option value="9:16">9:16 (Reels / TikTok)</option>
                                    </select>
                                </div>
                                <Button onClick={applyGlobalRatio} variant="secondary" className="text-xs h-[38px] shrink-0">Terapkan ke Semua</Button>
                            </div>
                            <Textarea 
                                label="Preset Visual Style / Mood" 
                                placeholder="Misal: Cinematic, 35mm film, moody lighting, desaturated colors..." 
                                value={project.visualStyle || ''} 
                                onChange={e => setProject({...project, visualStyle: e.target.value})} 
                                rows={2} 
                            />
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2"><FolderOpen className="w-5 h-5"/> Manajemen File & Ekspor</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Button onClick={handleSaveProject} variant="secondary" icon={Download}>Save (.json)</Button>
                            <label className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
                                <Upload className="w-4 h-4" /> Import (.json)
                                <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Button onClick={printShotlistPDF} variant="secondary" icon={Printer}>Cetak Shotlist (PDF)</Button>
                            <Button onClick={handleShareLink} loading={isSharing} variant="primary" icon={Share2}>Buat Link Berbagi</Button>
                        </div>
                        <div className="pt-3 border-t border-zinc-800 mt-2">
                            <Button onClick={handleResetProject} variant="danger" icon={RefreshCw} className="w-full">Proyek Baru (Reset)</Button>
                        </div>

                        {shareUrl && (
                            <div className="mt-4 p-3 bg-zinc-950 border border-indigo-900/50 rounded-lg">
                                <p className="text-xs text-zinc-400 mb-2">Link Berbagi (Read-Only):</p>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value={shareUrl} className="flex-grow bg-zinc-900 border border-zinc-700 rounded px-2 text-xs text-white" />
                                    <Button onClick={() => navigator.clipboard.writeText(shareUrl)} variant="secondary" icon={Copy} className="px-2 py-1" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('script');
    
    const [project, setProject] = useState({ title: '', logline: '', scriptText: '', globalAspectRatio: '16:9', visualStyle: '' });
    const [shots, setShots] = useState([]);
    const [assets, setAssets] = useState([]);
    const [globalAssets, setGlobalAssets] = useState([]);
    
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [isLoadingCloud, setIsLoadingCloud] = useState(true);
    const [dialogConfig, setDialogConfig] = useState(null);

    const showDialog = (message, type = 'alert', onConfirm = null) => {
        setDialogConfig({ message, type, onConfirm });
    };

    useEffect(() => {
        const loadCloudProject = async () => {
            const params = new URLSearchParams(window.location.search);
            const shareId = params.get('share');
            if (shareId && db) {
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'projects', shareId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProject(data.project || {});
                        setShots(data.shots || []);
                        setAssets(data.assets || []);
                        setIsReadOnly(true);
                        setActiveTab('dashboard');
                    } else {
                        showDialog("Proyek tidak ditemukan di Cloud.");
                    }
                } catch (err) {
                    console.error("Gagal memuat proyek dari cloud", err);
                    showDialog("Terjadi kesalahan saat memuat proyek dari Cloud.");
                }
            } else {
                const savedData = localStorage.getItem('storyboard_studio_save');
                if (savedData) {
                    try {
                        const data = JSON.parse(savedData);
                        if (data.project) setProject(data.project);
                        if (data.shots) setShots(data.shots);
                        if (data.assets) setAssets(data.assets);
                        if (data.globalAssets) setGlobalAssets(data.globalAssets);
                    } catch (e) { console.error("Gagal load localStorage"); }
                }
            }
            setIsLoadingCloud(false);
        };
        loadCloudProject();
    }, []);

    useEffect(() => {
        if (!isReadOnly && !isLoadingCloud) {
            const dataToSave = { project, shots, assets, globalAssets };
            localStorage.setItem('storyboard_studio_save', JSON.stringify(dataToSave));
        }
    }, [project, shots, assets, globalAssets, isReadOnly, isLoadingCloud]);

    const tabs = [
        { id: 'script', label: '1. Script', icon: FileText },
        { id: 'shotlist', label: '2. Shotlist', icon: List },
        { id: 'assets', label: '3. Asset Library', icon: Images },
        { id: 'prompts', label: '4. Video Prompt', icon: Terminal },
        { id: 'dashboard', label: '5. Dashboard', icon: ChartPie }
    ];

    if (isLoadingCloud) {
        return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 bg-zinc-950 text-zinc-100">
            <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
                        <Film className="w-6 h-6 text-indigo-500" /> Storyboard Studio
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                        {isReadOnly ? <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded border border-indigo-700 flex items-center gap-1"><Lock className="w-3 h-3"/> Read Only</span> : 'AI Short Film Workflow'}
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
                                    activeTab === tab.id 
                                    ? 'border-indigo-500 text-indigo-400 bg-zinc-900/50' 
                                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                                }`}
                            >
                                <Icon className="w-4 h-4" /> {tab.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 relative">
                {activeTab === 'script' && <ScriptTab project={project} setProject={setProject} setActiveTab={setActiveTab} isReadOnly={isReadOnly} />}
                {activeTab === 'shotlist' && <ShotlistTab project={project} shots={shots} setShots={setShots} assets={assets} setActiveTab={setActiveTab} isReadOnly={isReadOnly} />}
                {activeTab === 'assets' && <AssetsTab assets={assets} setAssets={setAssets} globalAssets={globalAssets} setGlobalAssets={setGlobalAssets} setActiveTab={setActiveTab} isReadOnly={isReadOnly} showDialog={showDialog} />}
                {activeTab === 'prompts' && <PromptsTab project={project} shots={shots} setShots={setShots} assets={assets} setActiveTab={setActiveTab} isReadOnly={isReadOnly} />}
                {activeTab === 'dashboard' && <DashboardTab project={project} setProject={setProject} shots={shots} setShots={setShots} assets={assets} setAssets={setAssets} isReadOnly={isReadOnly} showDialog={showDialog} />}
                
                <Modal isOpen={!!dialogConfig} onClose={() => setDialogConfig(null)} title={dialogConfig?.type === 'confirm' ? 'Konfirmasi' : 'Pemberitahuan'}>
                    <p className="text-zinc-300 text-sm mb-6">{dialogConfig?.message}</p>
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setDialogConfig(null)} variant="ghost">{dialogConfig?.type === 'confirm' ? 'Batal' : 'Tutup'}</Button>
                        {dialogConfig?.type === 'confirm' && (
                            <Button onClick={() => { if(dialogConfig.onConfirm) dialogConfig.onConfirm(); setDialogConfig(null); }} variant="danger">Ya, Lanjutkan</Button>
                        )}
                    </div>
                </Modal>
            </main>
            
            <footer className="bg-zinc-950 border-t border-zinc-800 text-center py-4 text-xs text-zinc-600 mt-auto">
                Storyboard Studio — Phase 5: Production Ready &copy; 2026
            </footer>
        </div>
    );
};

export default App;
