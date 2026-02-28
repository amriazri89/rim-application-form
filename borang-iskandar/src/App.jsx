import { useState, useEffect } from "react";

/* ─── responsive hook ─── */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
};

/* ─── constants ─── */
const STEPS = [
  { id: 1, title: "Pilihan Unit",      short: "Unit"     },
  { id: 2, title: "Butiran Pemohon",   short: "Pemohon"  },
  { id: 3, title: "Butiran Pasangan",  short: "Pasangan" },
  { id: 4, title: "Maklumat Tambahan", short: "Tambahan" },
  { id: 5, title: "Dokumen",           short: "Dokumen"  },
];

const HOUSE_OPTIONS = {
  "3 Bilik Tidur": [
    { label: "Tingkat Bawah", price: "RM700/bulan" },
    { label: "Tingkat Satu",  price: "RM680/bulan" },
    { label: "Tingkat Dua",   price: "RM620/bulan" },
    { label: "Tingkat Tiga",  price: "RM600/bulan" },
  ],
  "4 Bilik Tidur": [
    { label: "Tingkat Bawah", price: "RM880/bulan" },
    { label: "Tingkat Satu",  price: "RM840/bulan" },
    { label: "Tingkat Dua",   price: "RM770/bulan" },
    { label: "Tingkat Tiga",  price: "RM740/bulan" },
  ],
};

/* ─── design tokens ─── */
const C = {
  green:     "#1a6b3c",
  greenMid:  "#2d9e5f",
  greenLight:"#edf7f1",
  greenBorder:"#6ee7a0",
  bg:        "#f0f4f8",
  white:     "#ffffff",
  border:    "#dde1e8",
  label:     "#5c6470",
  text:      "#1a1f2e",
  muted:     "#9ca3af",
  amber:     "#fffbeb",
  amberBorder:"#fbbf24",
  amberText: "#78350f",
  amberLabel:"#92400e",
  error:     "#c0392b",
};

/* ─── shared components ─── */
const inputBase = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: `1.5px solid ${C.border}`,
  borderRadius: "8px",
  fontSize: "0.95rem",
  color: C.text,
  background: "#f9fafb",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const focusStyle = (e) => {
  e.target.style.borderColor = C.green;
  e.target.style.boxShadow = "0 0 0 3px rgba(26,107,60,0.12)";
  e.target.style.background = C.white;
};
const blurStyle = (e) => {
  e.target.style.borderColor = C.border;
  e.target.style.boxShadow = "none";
  e.target.style.background = "#f9fafb";
};

function InputField({ label, required, type = "text", placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: "1.3rem" }}>
      <label style={{ display:"block", fontSize:"0.73rem", fontWeight:600, letterSpacing:"0.06em", color:C.label, marginBottom:"0.4rem", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
        {label} {required && <span style={{ color: C.error }}>*</span>}
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
        style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
    </div>
  );
}

function TextareaField({ label, required, placeholder, value, onChange, hint }) {
  return (
    <div style={{ marginBottom: "1.3rem" }}>
      <label style={{ display:"block", fontSize:"0.73rem", fontWeight:600, letterSpacing:"0.06em", color:C.label, marginBottom:"0.4rem", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
        {label} {required && <span style={{ color: C.error }}>*</span>}
      </label>
      {hint && <p style={{ fontSize:"0.75rem", color:C.muted, fontFamily:"'DM Sans',sans-serif", marginBottom:"0.4rem" }}>{hint}</p>}
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={4}
        style={{ ...inputBase, resize:"vertical" }} onFocus={focusStyle} onBlur={blurStyle} />
    </div>
  );
}

function RadioGroup({ label, required, options, name, value, onChange }) {
  return (
    <div style={{ marginBottom: "1.3rem" }}>
      <label style={{ display:"block", fontSize:"0.73rem", fontWeight:600, letterSpacing:"0.06em", color:C.label, marginBottom:"0.6rem", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
        {label} {required && <span style={{ color: C.error }}>*</span>}
      </label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
        {options.map(opt => {
          const active = value === opt;
          return (
            <label key={opt} style={{
              display:"flex", alignItems:"center", gap:"0.45rem",
              padding:"0.45rem 0.9rem", border:`1.5px solid ${active ? C.green : C.border}`,
              borderRadius:"6px", cursor:"pointer", fontSize:"0.88rem",
              color: active ? C.green : "#3a3f4b",
              background: active ? C.greenLight : "#f9fafb",
              fontWeight: active ? 600 : 400,
              fontFamily:"'DM Sans',sans-serif",
              transition:"all 0.15s",
            }}>
              <input type="radio" name={name} value={opt} checked={active} onChange={() => onChange(opt)} style={{ display:"none" }} />
              {active && <span style={{ fontSize:"0.75rem" }}>✓</span>}
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ─── person fields (pemohon / pasangan) ─── */
function PersonFields({ prefix, data, onChange }) {
  const f = (k) => data[k] || "";
  const s = (k) => (e) => onChange(k, e.target.value);
  const sv = (k) => (v) => onChange(k, v);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"0 1.2rem" }}>
        <InputField label="Nama" required value={f("nama")} onChange={s("nama")} placeholder="Nama penuh" />
        <InputField label="No. Kad Pengenalan" required value={f("noKP")} onChange={s("noKP")} placeholder="XXXXXXXXXXXXXX" />
        <InputField label="No. Telefon" required type="tel" value={f("noTel")} onChange={s("noTel")} placeholder="+60XXXXXXXX" />
        <InputField label="Umur" type="number" value={f("umur")} onChange={s("umur")} placeholder="Umur" />
        <InputField label="Nama Jawatan" required value={f("jawatan")} onChange={s("jawatan")} placeholder="Contoh: Jurutera" />
        <InputField label="Nama Jabatan / Syarikat" required value={f("jabatan")} onChange={s("jabatan")} placeholder="Nama syarikat atau jabatan" />
      </div>
      <InputField label="Alamat Tempat Kerja (Baris 1)" required value={f("alamatKerja1")} onChange={s("alamatKerja1")} placeholder="No. jalan, nama jalan" />
      <InputField label="Alamat Tempat Kerja (Baris 2)" value={f("alamatKerja2")} onChange={s("alamatKerja2")} placeholder="Bandar, poskod, negeri" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0 1.2rem" }}>
        <InputField label="Pendapatan" required value={f("pendapatan")} onChange={s("pendapatan")} placeholder="RM XXXX" />
        <InputField label="No. Telefon Pejabat" required type="tel" value={f("noTelPejabat")} onChange={s("noTelPejabat")} placeholder="+603XXXXXXXX" />
      </div>
      <RadioGroup label="Kewarganegaraan" name={`${prefix}_warga`}
        options={["Warganegara","Bukan Warganegara"]}
        value={f("kewarganegaraan")} onChange={sv("kewarganegaraan")} />
      <RadioGroup label="Jantina" name={`${prefix}_jantina`}
        options={["Lelaki","Perempuan"]}
        value={f("jantina")} onChange={sv("jantina")} />
      <RadioGroup label="Bangsa" name={`${prefix}_bangsa`}
        options={["Bumiputera","Bukan Bumiputera"]}
        value={f("bangsa")} onChange={sv("bangsa")} />
    </div>
  );
}

/* ─── main app ─── */
export default function App() {
  const isMobile = useIsMobile();
  const [step, setStep]         = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [unitType, setUnitType]  = useState("");
  const [unitLevel, setUnitLevel] = useState("");
  const [pemohon, setPemohon]    = useState({});
  const [pasangan, setPasangan]  = useState({});
  const [tambahan, setTambahan]  = useState({});
  const [dokumen, setDokumen]    = useState(null);

  const up = (setter) => (k, v) => setter(p => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 1) return unitType && unitLevel;
    return true;
  };

  /* ── success screen ── */
  if (submitted) {
    return (
      <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, #0d3b26 0%, ${C.green} 50%, ${C.greenMid} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ background:C.white, borderRadius:"20px", padding: isMobile ? "2.5rem 1.5rem" : "4rem 3rem", textAlign:"center", maxWidth:"480px", width:"100%", boxShadow:"0 30px 80px rgba(0,0,0,0.3)" }}>
          <div style={{ width:"72px", height:"72px", background:`linear-gradient(135deg,${C.green},${C.greenMid})`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", fontSize:"1.8rem", color:"#fff" }}>✓</div>
          <h2 style={{ color:C.green, fontSize:"1.5rem", marginBottom:"0.7rem", fontFamily:"'Lora',serif" }}>Permohonan Berjaya Dihantar!</h2>
          <p style={{ color:"#6b7280", lineHeight:1.7, marginBottom:"2rem", fontSize:"0.9rem" }}>
            Terima kasih atas permohonan anda. Pihak kami akan menghubungi anda dalam masa terdekat untuk tindakan lanjut.
          </p>
          <div style={{ background:C.greenLight, borderRadius:"10px", padding:"1rem 1.2rem", textAlign:"left", fontSize:"0.88rem", color:"#374151", lineHeight:1.8 }}>
            <div><strong>Unit:</strong> Rumah {unitType}</div>
            <div><strong>Tingkat:</strong> {unitLevel}</div>
            <div><strong>Pemohon:</strong> {pemohon.nama || "—"}</div>
          </div>
          <button onClick={() => { setStep(1); setSubmitted(false); setUnitType(""); setUnitLevel(""); setPemohon({}); setPasangan({}); setTambahan({}); setDokumen(null); }}
            style={{ marginTop:"1.5rem", padding:"0.7rem 2rem", background:`linear-gradient(135deg,${C.green},${C.greenMid})`, color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.9rem" }}>
            Permohonan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── header ── */}
      <header style={{ background:`linear-gradient(135deg, #0d3b26 0%, ${C.green} 100%)`, padding: isMobile ? "1.4rem 1rem 2rem" : "2rem 2rem 3rem", color:"#fff" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto", display:"flex", alignItems:"center", gap:"1rem" }}>
          <div style={{ width:"44px", height:"44px", minWidth:"44px", background:"rgba(255,255,255,0.15)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem" }}>🏠</div>
          <div>
            <div style={{ fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.75, marginBottom:"0.15rem" }}>Iskandar Malaysia</div>
            <h1 style={{ fontSize: isMobile ? "1rem" : "1.3rem", fontWeight:700, fontFamily:"'Lora',serif", lineHeight:1.3 }}>
              Borang Permohonan Penyewaan Rumah
            </h1>
          </div>
        </div>
      </header>

      {/* ── progress bar ── */}
      <nav style={{ background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"0 0.5rem", display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", flex:1, minWidth:0 }}>
              <button
                onClick={() => step > s.id && setStep(s.id)}
                disabled={step <= s.id}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  padding: isMobile ? "0.7rem 0.3rem" : "0.9rem 0.5rem",
                  background:"transparent", border:"none", cursor: step > s.id ? "pointer" : "default",
                  flex:1, minWidth:0,
                }}>
                <div style={{
                  width:"26px", height:"26px", borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.72rem", fontWeight:700, marginBottom:"0.25rem",
                  background: step === s.id ? C.green : step > s.id ? C.greenMid : "#e5e9f0",
                  color: step >= s.id ? "#fff" : C.muted,
                  transition:"all 0.3s",
                  flexShrink:0,
                }}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span style={{ fontSize:"0.64rem", fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.green : step > s.id ? C.greenMid : C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"100%", textAlign:"center" }}>
                  {isMobile ? s.short : s.title}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ height:"2px", flex:"0 0 8px", background: step > s.id ? C.greenMid : "#e5e9f0", transition:"background 0.3s" }} />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ── form body ── */}
      <main style={{ maxWidth:"720px", margin:"0 auto", padding: isMobile ? "1.2rem 0.75rem 5rem" : "2rem 1.5rem 4rem" }}>
        <div style={{ background:C.white, borderRadius:"16px", padding: isMobile ? "1.4rem 1rem" : "2rem", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", border:`1px solid ${C.border}` }}>

          {/* STEP 1 — unit selection */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize:"1.15rem", color:C.text, marginBottom:"0.25rem", fontFamily:"'Lora',serif" }}>Kategori Pilihan Unit Rumah</h2>
              <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1.8rem" }}>Sila pilih jenis rumah dan tingkat yang dikehendaki.</p>
              {Object.entries(HOUSE_OPTIONS).map(([type, levels]) => (
                <div key={type} style={{ marginBottom:"1.8rem" }}>
                  {/* type selector */}
                  <div
                    role="button" tabIndex={0}
                    onClick={() => { setUnitType(type); setUnitLevel(""); }}
                    onKeyDown={e => e.key === "Enter" && setUnitType(type)}
                    style={{
                      display:"flex", alignItems:"center", gap:"0.8rem",
                      marginBottom:"0.9rem", padding:"0.8rem 1rem",
                      background: unitType === type ? C.greenLight : "#f9fafb",
                      border:`2px solid ${unitType === type ? C.green : C.border}`,
                      borderRadius:"10px", cursor:"pointer", transition:"all 0.2s",
                    }}>
                    <div style={{ width:"20px", height:"20px", borderRadius:"50%", border:`2px solid ${unitType === type ? C.green : "#d1d5db"}`, background: unitType === type ? C.green : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {unitType === type && <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#fff" }} />}
                    </div>
                    <div>
                      <span style={{ fontWeight:700, color:C.text }}>Rumah {type}</span>
                      <span style={{ color:C.muted, fontSize:"0.82rem", marginLeft:"0.5rem" }}>
                        {levels[0].price.replace(/\d+/, levels[levels.length-1].price.match(/\d+/)[0] + "–" + levels[0].price.match(/\d+/)[0])}
                      </span>
                    </div>
                  </div>
                  {/* level cards */}
                  {unitType === type && (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"0.65rem", paddingLeft: isMobile ? 0 : "1rem" }}>
                      {levels.map(lvl => (
                        <div key={lvl.label} role="button" tabIndex={0}
                          onClick={() => setUnitLevel(lvl.label)}
                          onKeyDown={e => e.key === "Enter" && setUnitLevel(lvl.label)}
                          style={{
                            padding:"1rem", borderRadius:"10px", cursor:"pointer",
                            border:`2px solid ${unitLevel === lvl.label ? C.green : C.border}`,
                            background: unitLevel === lvl.label ? C.greenLight : "#f9fafb",
                            transition:"all 0.2s", textAlign:"center",
                          }}>
                          <div style={{ fontWeight:600, color:C.text, fontSize:"0.88rem" }}>{lvl.label}</div>
                          <div style={{ color:C.green, fontSize:"0.85rem", fontWeight:700, marginTop:"0.25rem" }}>{lvl.price}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 2 — pemohon */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize:"1.15rem", color:C.text, marginBottom:"0.25rem", fontFamily:"'Lora',serif" }}>Butiran Pemohon</h2>
              <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1.8rem" }}>Sila isikan maklumat peribadi pemohon utama.</p>
              <PersonFields prefix="pemohon" data={pemohon} onChange={up(setPemohon)} />
            </div>
          )}

          {/* STEP 3 — pasangan */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize:"1.15rem", color:C.text, marginBottom:"0.25rem", fontFamily:"'Lora',serif" }}>Butiran Pasangan</h2>
              <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1.8rem" }}>Sila isikan maklumat peribadi pasangan (jika berkenaan).</p>
              <PersonFields prefix="pasangan" data={pasangan} onChange={up(setPasangan)} />
            </div>
          )}

          {/* STEP 4 — tambahan */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize:"1.15rem", color:C.text, marginBottom:"0.25rem", fontFamily:"'Lora',serif" }}>Butiran Tambahan</h2>
              <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1.8rem" }}>Maklumat latar belakang dan status semasa.</p>
              <InputField label="Alamat Surat-Menyurat" value={tambahan.alamatSurat||""} onChange={e=>up(setTambahan)("alamatSurat",e.target.value)} placeholder="Alamat lengkap" />
              <TextareaField
                label="Senarai Tanggungan"
                hint="Format: Nama - No. KP - Hubungan. Contoh: 1. Ahmad Bin Ali - 150101XXXXXX - Anak"
                placeholder="Senaraikan tanggungan di sini..."
                value={tambahan.tanggungan||""}
                onChange={e=>up(setTambahan)("tanggungan",e.target.value)}
              />
              <RadioGroup label="Taraf Perkahwinan" name="tarafKahwin"
                options={["Berkahwin","Duda / Janda / Balu Menanggung Anak","Tidak Berkahwin Tetapi Mempunyai Keluarga"]}
                value={tambahan.tarafKahwin||""} onChange={v=>up(setTambahan)("tarafKahwin",v)} />
              <RadioGroup label="Tempat Tinggal Sekarang" name="tempatTinggal"
                options={["Rumah Sewa","Rumah Keluarga","Rumah Majikan","Rumah Sendiri","Tumpang","Kuaters Kerajaan"]}
                value={tambahan.tempatTinggal||""} onChange={v=>up(setTambahan)("tempatTinggal",v)} />
              <InputField label="Lokasi Tempat Tinggal Sekarang" value={tambahan.lokasiTinggal||""} onChange={e=>up(setTambahan)("lokasiTinggal",e.target.value)} placeholder="Bandar / kawasan" />
              <RadioGroup label="Status OKU" name="statusOKU"
                options={["Kecacatan Fizikal (Terlantar / Berkerusi Roda)","Kecacatan Lain (Boleh Berjalan)","Tidak berkenaan"]}
                value={tambahan.statusOKU||""} onChange={v=>up(setTambahan)("statusOKU",v)} />
              <RadioGroup label="Pemilikan Rumah" name="pemilikanRumah"
                options={["Telah memiliki rumah","Telah Memiliki Rumah Tetapi Dalam Proses Pembinaan","Belum Memiliki Rumah"]}
                value={tambahan.pemilikanRumah||""} onChange={v=>up(setTambahan)("pemilikanRumah",v)} />
              {(tambahan.pemilikanRumah==="Telah memiliki rumah"||tambahan.pemilikanRumah==="Telah Memiliki Rumah Tetapi Dalam Proses Pembinaan") && (
                <InputField label="Lokasi Rumah & Tarikh Jangkaan Siap" value={tambahan.lokasiRumahMilik||""} onChange={e=>up(setTambahan)("lokasiRumahMilik",e.target.value)} placeholder="Lokasi dan tarikh jangkaan siap (jika berkenaan)" />
              )}
              {/* declaration */}
              <div style={{ background:C.amber, border:`1px solid ${C.amberBorder}`, borderRadius:"10px", padding:"1.2rem", marginTop:"1.5rem" }}>
                <div style={{ fontSize:"0.8rem", fontWeight:700, color:C.amberLabel, marginBottom:"0.5rem" }}>⚠ Akuan Pemohon</div>
                <p style={{ fontSize:"0.82rem", color:C.amberText, lineHeight:1.65, margin:0 }}>
                  Saya mengaku bahawa semua maklumat yang diberikan adalah benar. Saya juga bersetuju dan faham bahawa permohonan yang mengandungi maklumat palsu atau tidak lengkap berhak untuk tidak diluluskan atau tidak diproses.
                </p>
                <label style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem", marginTop:"0.9rem", cursor:"pointer", fontSize:"0.85rem", color:C.amberText, fontWeight:600 }}>
                  <input type="checkbox" checked={tambahan.akuan||false} onChange={e=>up(setTambahan)("akuan",e.target.checked)}
                    style={{ width:"16px", height:"16px", marginTop:"2px", accentColor:C.green, flexShrink:0 }} />
                  Ya, saya bersetuju dengan akuan di atas
                </label>
              </div>
            </div>
          )}

          {/* STEP 5 — documents */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize:"1.15rem", color:C.text, marginBottom:"0.25rem", fontFamily:"'Lora',serif" }}>Muat Naik Dokumen</h2>
              <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1.8rem" }}>Sila muat naik semua dokumen yang diperlukan.</p>
              <div style={{ background:C.greenLight, border:`1px solid ${C.greenBorder}`, borderRadius:"10px", padding:"1.2rem", marginBottom:"1.8rem" }}>
                <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#065f46", marginBottom:"0.5rem" }}>📋 Senarai Dokumen Wajib</div>
                {["Salinan Kad Pengenalan","Pengesahan Pekerjaan","Pengesahan Status Perkahwinan","Dokumen Tambahan"].map((d,i)=>(
                  <div key={d} style={{ fontSize:"0.85rem", color:"#065f46", marginBottom:"0.25rem" }}>{i+1}. {d}</div>
                ))}
              </div>
              <div>
                <label style={{ display:"block", fontSize:"0.73rem", fontWeight:600, letterSpacing:"0.06em", color:C.label, marginBottom:"0.6rem", textTransform:"uppercase" }}>
                  Muat Naik Dokumen <span style={{ color:C.error }}>*</span>
                </label>
                <div
                  role="button" tabIndex={0}
                  onClick={() => document.getElementById("fileInput").click()}
                  onKeyDown={e => e.key === "Enter" && document.getElementById("fileInput").click()}
                  style={{
                    border:`2px dashed ${dokumen ? C.green : "#d1d5db"}`,
                    borderRadius:"12px", padding: isMobile ? "2rem 1rem" : "2.5rem",
                    textAlign:"center", background: dokumen ? C.greenLight : "#f9fafb",
                    cursor:"pointer", transition:"all 0.2s",
                  }}>
                  {dokumen ? (
                    <div>
                      <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>✅</div>
                      <div style={{ fontWeight:600, color:C.green, fontSize:"0.9rem", wordBreak:"break-word" }}>{dokumen.name}</div>
                      <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:"0.3rem" }}>Klik untuk tukar fail</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize:"2.2rem", marginBottom:"0.6rem" }}>📎</div>
                      <div style={{ fontWeight:600, color:"#374151", fontSize:"0.9rem", marginBottom:"0.25rem" }}>Klik untuk pilih fail</div>
                      <div style={{ fontSize:"0.78rem", color:C.muted }}>PDF, dokumen, atau imej — Maks 100 MB</div>
                    </div>
                  )}
                  <input id="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display:"none" }} onChange={e => setDokumen(e.target.files[0]||null)} />
                </div>
              </div>
            </div>
          )}

          {/* ── navigation ── */}
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            marginTop:"2rem", paddingTop:"1.5rem", borderTop:`1px solid ${C.border}`,
            gap:"0.75rem",
          }}>
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              style={{
                padding:"0.7rem 1.4rem", borderRadius:"8px",
                border:`1.5px solid ${C.border}`,
                background:C.white, color: step===1 ? C.muted : "#374151",
                cursor: step===1 ? "default" : "pointer",
                fontSize:"0.88rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                opacity: step===1 ? 0.5 : 1,
              }}>
              ← Kembali
            </button>
            <span style={{ fontSize:"0.75rem", color:C.muted }}>
              {step} / {STEPS.length}
            </span>
            {step < STEPS.length ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                style={{
                  padding:"0.7rem 1.6rem", borderRadius:"8px", border:"none",
                  background: canNext() ? `linear-gradient(135deg,${C.green},${C.greenMid})` : "#e5e9f0",
                  color: canNext() ? "#fff" : C.muted,
                  cursor: canNext() ? "pointer" : "default",
                  fontSize:"0.88rem", fontWeight:700, fontFamily:"'DM Sans',sans-serif",
                  boxShadow: canNext() ? "0 4px 12px rgba(26,107,60,0.3)" : "none",
                  transition:"all 0.2s",
                }}>
                Seterusnya →
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                style={{
                  padding:"0.7rem 1.8rem", borderRadius:"8px", border:"none",
                  background:`linear-gradient(135deg,${C.green},${C.greenMid})`,
                  color:"#fff", cursor:"pointer", fontSize:"0.88rem", fontWeight:700,
                  fontFamily:"'DM Sans',sans-serif",
                  boxShadow:"0 4px 12px rgba(26,107,60,0.3)",
                }}>
                Hantar Permohonan ✓
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
