import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

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

const C = {
  bg:          "#f7f7f5",
  white:       "#ffffff",
  border:      "#e4e4e0",
  borderFocus: "#4f6ef7",
  accent:      "#4f6ef7",
  accentBg:    "#eef1fe",
  text:        "#18181b",
  sub:         "#71717a",
  muted:       "#a1a1aa",
  label:       "#52525b",
  warnBg:      "#fffbeb",
  warnBdr:     "#fde68a",
  warnText:    "#78350f",
  warnLabel:   "#92400e",
  error:       "#ef4444",
  headerBg:    "#f97b14",
};

const inputBase = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  border: `1px solid ${C.border}`,
  borderRadius: "6px",
  fontSize: "0.93rem",
  color: C.text,
  background: C.white,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.15s, box-shadow 0.15s",
  lineHeight: 1.5,
};

const onFocus = e => {
  e.target.style.borderColor = C.borderFocus;
  e.target.style.boxShadow = "0 0 0 3px rgba(79,110,247,0.12)";
};
const onBlur = e => {
  e.target.style.borderColor = C.border;
  e.target.style.boxShadow = "none";
};

function Label({ children, required }) {
  return (
    <label style={{ display:"block", fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.05em", color:C.label, marginBottom:"0.35rem", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
      {children}{required && <span style={{ color:C.error, marginLeft:"2px" }}>*</span>}
    </label>
  );
}

function InputField({ label, required, type="text", placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom:"1.2rem" }}>
      <Label required={required}>{label}</Label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={inputBase} onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
}

function TextareaField({ label, required, placeholder, value, onChange, hint }) {
  return (
    <div style={{ marginBottom:"1.2rem" }}>
      <Label required={required}>{label}</Label>
      {hint && <p style={{ fontSize:"0.75rem", color:C.muted, fontFamily:"'DM Sans',sans-serif", marginBottom:"0.35rem", lineHeight:1.5 }}>{hint}</p>}
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={4}
        style={{ ...inputBase, resize:"vertical" }} onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
}

function RadioGroup({ label, required, options, name, value, onChange }) {
  return (
    <div style={{ marginBottom:"1.2rem" }}>
      <Label required={required}>{label}</Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
        {options.map(opt => {
          const active = value === opt;
          return (
            <label key={opt} style={{
              display:"flex", alignItems:"center", gap:"0.4rem",
              padding:"0.38rem 0.8rem",
              border:`1px solid ${active ? C.accent : C.border}`,
              borderRadius:"4px", cursor:"pointer", fontSize:"0.875rem",
              color: active ? C.accent : C.sub,
              background: active ? C.accentBg : C.white,
              fontWeight: active ? 600 : 400,
              fontFamily:"'DM Sans',sans-serif",
              transition:"all 0.12s",
              userSelect:"none",
            }}>
              <input type="radio" name={name} value={opt} checked={active} onChange={() => onChange(opt)} style={{ display:"none" }} />
              {active && <span style={{ fontSize:"0.65rem" }}>●</span>}
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", margin:"1.4rem 0 1.2rem" }}>
      <div style={{ flex:1, height:"1px", background:C.border }} />
      <span style={{ fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.08em", color:C.muted, textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" }}>{label}</span>
      <div style={{ flex:1, height:"1px", background:C.border }} />
    </div>
  );
}

function StepHeader({ title, desc }) {
  return (
    <div style={{ marginBottom:"1.75rem" }}>
      <h2 style={{ fontSize:"1.05rem", fontWeight:700, color:C.text, marginBottom:"0.2rem", fontFamily:"'DM Sans',sans-serif", letterSpacing:"-0.01em" }}>{title}</h2>
      <p style={{ fontSize:"0.84rem", color:C.sub, lineHeight:1.6 }}>{desc}</p>
    </div>
  );
}

function PersonFields({ prefix, data, onChange }) {
  const f = k => data[k] || "";
  const s = k => e => onChange(k, e.target.value);
  const sv = k => v => onChange(k, v);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"0 1rem" }}>
        <InputField label="Nama Penuh" required value={f("nama")} onChange={s("nama")} placeholder="Nama penuh" />
        <InputField label="No. Kad Pengenalan" required value={f("noKP")} onChange={s("noKP")} placeholder="XXXXXXXXXXXXXX" />
        <InputField label="No. Telefon" required type="tel" value={f("noTel")} onChange={s("noTel")} placeholder="+60XXXXXXXX" />
        <InputField label="Umur" type="number" value={f("umur")} onChange={s("umur")} placeholder="Tahun" />
      </div>
      <Divider label="Pekerjaan" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"0 1rem" }}>
        <InputField label="Nama Jawatan" required value={f("jawatan")} onChange={s("jawatan")} placeholder="Contoh: Jurutera" />
        <InputField label="Jabatan / Syarikat" required value={f("jabatan")} onChange={s("jabatan")} placeholder="Nama syarikat" />
        <InputField label="Pendapatan" required value={f("pendapatan")} onChange={s("pendapatan")} placeholder="RM XXXX" />
        <InputField label="No. Telefon Pejabat" required type="tel" value={f("noTelPejabat")} onChange={s("noTelPejabat")} placeholder="+603XXXXXXXX" />
      </div>
      <InputField label="Alamat Tempat Kerja (Baris 1)" required value={f("alamatKerja1")} onChange={s("alamatKerja1")} placeholder="No. jalan, nama jalan" />
      <InputField label="Alamat Tempat Kerja (Baris 2)" value={f("alamatKerja2")} onChange={s("alamatKerja2")} placeholder="Bandar, poskod, negeri" />
      <Divider label="Maklumat Diri" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0 2rem" }}>
        <RadioGroup label="Kewarganegaraan" name={`${prefix}_warga`} options={["Warganegara","Bukan Warganegara"]} value={f("kewarganegaraan")} onChange={sv("kewarganegaraan")} />
        <RadioGroup label="Jantina" name={`${prefix}_jantina`} options={["Lelaki","Perempuan"]} value={f("jantina")} onChange={sv("jantina")} />
        <RadioGroup label="Bangsa" name={`${prefix}_bangsa`} options={["Bumiputera","Bukan Bumiputera"]} value={f("bangsa")} onChange={sv("bangsa")} />
      </div>
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [unitType, setUnitType]   = useState("");
  const [unitLevel, setUnitLevel] = useState("");
  const [pemohon, setPemohon]     = useState({});
  const [pasangan, setPasangan]   = useState({});
  const [tambahan, setTambahan]   = useState({});
  const [dokumen, setDokumen]     = useState(null);

  const up = setter => (k, v) => setter(p => ({ ...p, [k]: v }));
  const canNext = () => step === 1 ? (unitType && unitLevel) : true;

  if (submitted) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ background:C.white, borderRadius:"10px", padding: isMobile ? "2rem 1.5rem" : "3rem", maxWidth:"420px", width:"100%", border:`1px solid ${C.border}`, textAlign:"center" }}>
          <div style={{ width:"48px", height:"48px", background:C.accentBg, border:`1px solid ${C.accent}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", fontSize:"1.2rem", color:C.accent }}>✓</div>
          <h2 style={{ fontSize:"1.15rem", fontWeight:700, color:C.text, marginBottom:"0.5rem", letterSpacing:"-0.01em" }}>Permohonan Dihantar</h2>
          <p style={{ color:C.sub, fontSize:"0.87rem", lineHeight:1.7, marginBottom:"1.75rem" }}>
            Terima kasih. Pihak kami akan menghubungi anda dalam masa terdekat.
          </p>
          <div style={{ background:C.bg, borderRadius:"8px", padding:"0.9rem 1.1rem", textAlign:"left", fontSize:"0.84rem", color:C.sub, lineHeight:2, border:`1px solid ${C.border}`, marginBottom:"1.5rem" }}>
            <div><span style={{ color:C.muted, fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Unit</span><br /><strong style={{ color:C.text }}>Rumah {unitType} — {unitLevel}</strong></div>
            <div style={{ marginTop:"0.4rem" }}><span style={{ color:C.muted, fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Pemohon</span><br /><strong style={{ color:C.text }}>{pemohon.nama || "—"}</strong></div>
          </div>
          <button onClick={() => { setStep(1); setSubmitted(false); setUnitType(""); setUnitLevel(""); setPemohon({}); setPasangan({}); setTambahan({}); setDokumen(null); }}
            style={{ padding:"0.62rem 1.6rem", background:C.accent, color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:600, fontSize:"0.87rem", fontFamily:"'DM Sans',sans-serif" }}>
            Permohonan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>

      {/* header */}
      <header style={{ background:C.headerBg, padding: isMobile ? "1.1rem 1rem" : "1.25rem 2rem" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto", display:"flex", alignItems:"center", gap:"0.9rem" }}>
          <div style={{ width:"34px", height:"34px", minWidth:"34px", background:"rgba(250, 248, 248, 0.2)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🏠</div>
          <div>
            <div style={{ fontSize:"0.63rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:"0.1rem" }}>Iskandar Malaysia</div>
            <h1 style={{ fontSize: isMobile ? "0.92rem" : "1rem", fontWeight:600, color:"#fff", letterSpacing:"-0.01em", lineHeight:1.3 }}>
              Borang Permohonan Penyewaan Rumah
            </h1>
          </div>
        </div>
      </header>

      {/* progress */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"0 0.5rem", display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", flex:1, minWidth:0 }}>
              <button
                onClick={() => step > s.id && setStep(s.id)}
                disabled={step <= s.id}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", padding: isMobile ? "0.6rem 0.2rem" : "0.7rem 0.4rem", background:"transparent", border:"none", cursor: step > s.id ? "pointer" : "default", flex:1, minWidth:0, gap:"0.18rem" }}>
                <div style={{
                  width:"22px", height:"22px", borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.68rem", fontWeight:700,
                  background: step === s.id ? C.accent : step > s.id ? C.accentBg : C.bg,
                  color: step === s.id ? "#fff" : step > s.id ? C.accent : C.muted,
                  border: step === s.id ? `2px solid ${C.accent}` : step > s.id ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
                  transition:"all 0.2s", flexShrink:0,
                }}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span style={{ fontSize:"0.6rem", fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.accent : step > s.id ? C.accent : C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"100%" }}>
                  {isMobile ? s.short : s.title}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ height:"1px", flex:"0 0 6px", background: step > s.id ? C.accent : C.border, opacity: step > s.id ? 0.35 : 1 }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ height:"2px", background:C.border }}>
          <div style={{ height:"100%", width:`${((step-1)/(STEPS.length-1))*100}%`, background:C.accent, transition:"width 0.3s ease" }} />
        </div>
      </div>

      {/* body */}
      <main style={{ maxWidth:"720px", margin:"0 auto", padding: isMobile ? "1.2rem 0.75rem 5rem" : "2rem 1.5rem 4rem" }}>
        <div style={{ background:C.white, borderRadius:"10px", padding: isMobile ? "1.4rem 1rem" : "2rem", border:`1px solid ${C.border}` }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <StepHeader title="Kategori Pilihan Unit Rumah" desc="Sila pilih jenis rumah dan tingkat yang dikehendaki." />
              {Object.entries(HOUSE_OPTIONS).map(([type, levels]) => (
                <div key={type} style={{ marginBottom:"1.5rem" }}>
                  <div role="button" tabIndex={0}
                    onClick={() => { setUnitType(type); setUnitLevel(""); }}
                    onKeyDown={e => e.key === "Enter" && setUnitType(type)}
                    style={{
                      display:"flex", alignItems:"center", gap:"0.7rem",
                      padding:"0.8rem 1rem", marginBottom:"0.65rem",
                      background: unitType === type ? C.accentBg : C.bg,
                      border:`1px solid ${unitType === type ? C.accent : C.border}`,
                      borderRadius:"8px", cursor:"pointer", transition:"all 0.15s",
                    }}>
                    <div style={{ width:"16px", height:"16px", borderRadius:"50%", border:`2px solid ${unitType === type ? C.accent : C.border}`, background: unitType === type ? C.accent : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                      {unitType === type && <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#fff" }} />}
                    </div>
                    <span style={{ fontWeight:600, color: unitType === type ? C.accent : C.text, fontSize:"0.92rem" }}>Rumah {type}</span>
                  </div>
                  {unitType === type && (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"0.45rem" }}>
                      {levels.map(lvl => (
                        <div key={lvl.label} role="button" tabIndex={0}
                          onClick={() => setUnitLevel(lvl.label)}
                          onKeyDown={e => e.key === "Enter" && setUnitLevel(lvl.label)}
                          style={{
                            padding:"0.8rem 0.9rem", borderRadius:"7px", cursor:"pointer",
                            border:`1px solid ${unitLevel === lvl.label ? C.accent : C.border}`,
                            background: unitLevel === lvl.label ? C.accentBg : C.bg,
                            transition:"all 0.15s",
                          }}>
                          <div style={{ fontWeight:600, color: unitLevel === lvl.label ? C.accent : C.text, fontSize:"0.84rem" }}>{lvl.label}</div>
                          <div style={{ color: unitLevel === lvl.label ? C.accent : C.muted, fontSize:"0.78rem", marginTop:"0.15rem", fontWeight: unitLevel === lvl.label ? 700 : 400 }}>{lvl.price}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <StepHeader title="Butiran Pemohon" desc="Sila isikan maklumat peribadi pemohon utama." />
              <PersonFields prefix="pemohon" data={pemohon} onChange={up(setPemohon)} />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <StepHeader title="Butiran Pasangan" desc="Sila isikan maklumat peribadi pasangan (jika berkenaan)." />
              <PersonFields prefix="pasangan" data={pasangan} onChange={up(setPasangan)} />
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <StepHeader title="Butiran Tambahan" desc="Maklumat latar belakang dan status semasa pemohon." />
              <InputField label="Alamat Surat-Menyurat" value={tambahan.alamatSurat||""} onChange={e=>up(setTambahan)("alamatSurat",e.target.value)} placeholder="Alamat lengkap" />
              <TextareaField
                label="Senarai Tanggungan"
                hint="Format: Nama - No. KP - Hubungan. Contoh: 1. Ahmad Bin Ali - 150101XXXXXX - Anak"
                placeholder="Senaraikan tanggungan di sini..."
                value={tambahan.tanggungan||""}
                onChange={e=>up(setTambahan)("tanggungan",e.target.value)}
              />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0 2rem" }}>
                <RadioGroup label="Taraf Perkahwinan" name="tarafKahwin"
                  options={["Berkahwin","Duda / Janda / Balu Menanggung Anak","Tidak Berkahwin Tetapi Mempunyai Keluarga"]}
                  value={tambahan.tarafKahwin||""} onChange={v=>up(setTambahan)("tarafKahwin",v)} />
                <RadioGroup label="Tempat Tinggal Sekarang" name="tempatTinggal"
                  options={["Rumah Sewa","Rumah Keluarga","Rumah Majikan","Rumah Sendiri","Tumpang","Kuaters Kerajaan"]}
                  value={tambahan.tempatTinggal||""} onChange={v=>up(setTambahan)("tempatTinggal",v)} />
              </div>
              <InputField label="Lokasi Tempat Tinggal Sekarang" value={tambahan.lokasiTinggal||""} onChange={e=>up(setTambahan)("lokasiTinggal",e.target.value)} placeholder="Bandar / kawasan" />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0 2rem" }}>
                <RadioGroup label="Status OKU" name="statusOKU"
                  options={["Kecacatan Fizikal (Terlantar / Berkerusi Roda)","Kecacatan Lain (Boleh Berjalan)","Tidak berkenaan"]}
                  value={tambahan.statusOKU||""} onChange={v=>up(setTambahan)("statusOKU",v)} />
                <RadioGroup label="Pemilikan Rumah" name="pemilikanRumah"
                  options={["Telah memiliki rumah","Telah Memiliki Rumah Tetapi Dalam Proses Pembinaan","Belum Memiliki Rumah"]}
                  value={tambahan.pemilikanRumah||""} onChange={v=>up(setTambahan)("pemilikanRumah",v)} />
              </div>
              {(tambahan.pemilikanRumah==="Telah memiliki rumah"||tambahan.pemilikanRumah==="Telah Memiliki Rumah Tetapi Dalam Proses Pembinaan") && (
                <InputField label="Lokasi Rumah & Tarikh Jangkaan Siap" value={tambahan.lokasiRumahMilik||""} onChange={e=>up(setTambahan)("lokasiRumahMilik",e.target.value)} placeholder="Lokasi dan tarikh jangkaan siap" />
              )}
              <div style={{ background:C.warnBg, border:`1px solid ${C.warnBdr}`, borderRadius:"8px", padding:"1rem 1.1rem", marginTop:"1.5rem" }}>
                <p style={{ fontSize:"0.72rem", fontWeight:600, color:C.warnLabel, marginBottom:"0.45rem", letterSpacing:"0.05em", textTransform:"uppercase" }}>Akuan Pemohon</p>
                <p style={{ fontSize:"0.83rem", color:C.warnText, lineHeight:1.65, margin:0 }}>
                  Saya mengaku bahawa semua maklumat yang diberikan adalah benar. Saya bersetuju dan faham bahawa permohonan yang mengandungi maklumat palsu atau tidak lengkap berhak untuk tidak diluluskan atau tidak diproses.
                </p>
                <label style={{ display:"flex", alignItems:"flex-start", gap:"0.55rem", marginTop:"0.8rem", cursor:"pointer", fontSize:"0.84rem", color:C.warnText, fontWeight:600 }}>
                  <input type="checkbox" checked={tambahan.akuan||false} onChange={e=>up(setTambahan)("akuan",e.target.checked)}
                    style={{ width:"14px", height:"14px", marginTop:"2px", accentColor:C.accent, flexShrink:0 }} />
                  Ya, saya bersetuju dengan akuan di atas
                </label>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div>
              <StepHeader title="Muat Naik Dokumen" desc="Sila muat naik semua dokumen yang diperlukan untuk menyokong permohonan." />
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"0.9rem 1.1rem", marginBottom:"1.4rem" }}>
                <p style={{ fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.06em", color:C.muted, textTransform:"uppercase", marginBottom:"0.6rem" }}>Dokumen Wajib</p>
                {["Salinan Kad Pengenalan","Pengesahan Pekerjaan","Pengesahan Status Perkahwinan","Dokumen Tambahan"].map((d,i) => (
                  <div key={d} style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.84rem", color:C.sub, marginBottom:"0.3rem" }}>
                    <span style={{ width:"18px", height:"18px", borderRadius:"50%", background:C.accentBg, color:C.accent, fontSize:"0.63rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
                    {d}
                  </div>
                ))}
              </div>
              <Label required>Muat Naik Dokumen</Label>
              <div
                role="button" tabIndex={0}
                onClick={() => document.getElementById("fileInput").click()}
                onKeyDown={e => e.key === "Enter" && document.getElementById("fileInput").click()}
                style={{
                  border:`1.5px dashed ${dokumen ? C.accent : C.border}`,
                  borderRadius:"8px", padding: isMobile ? "2rem 1rem" : "2.2rem 2rem",
                  textAlign:"center", background: dokumen ? C.accentBg : C.bg,
                  cursor:"pointer", transition:"all 0.15s",
                }}>
                {dokumen ? (
                  <div>
                    <div style={{ fontSize:"1.4rem", marginBottom:"0.4rem", color:C.accent }}>✓</div>
                    <div style={{ fontWeight:600, color:C.accent, fontSize:"0.87rem", wordBreak:"break-word" }}>{dokumen.name}</div>
                    <div style={{ fontSize:"0.74rem", color:C.muted, marginTop:"0.25rem" }}>Klik untuk tukar fail</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize:"1.6rem", marginBottom:"0.4rem", opacity:0.3 }}>↑</div>
                    <div style={{ fontWeight:600, color:C.sub, fontSize:"0.87rem", marginBottom:"0.2rem" }}>Klik untuk pilih fail</div>
                    <div style={{ fontSize:"0.74rem", color:C.muted }}>PDF, dokumen, atau imej · Maks 100 MB</div>
                  </div>
                )}
                <input id="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display:"none" }} onChange={e => setDokumen(e.target.files[0]||null)} />
              </div>
            </div>
          )}

          {/* navigation */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"1.75rem", paddingTop:"1.25rem", borderTop:`1px solid ${C.border}`, gap:"0.75rem" }}>
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              style={{
                padding:"0.6rem 1.15rem", borderRadius:"6px",
                border:`1px solid ${C.border}`, background:C.white,
                color: step===1 ? C.muted : C.sub,
                cursor: step===1 ? "default" : "pointer",
                fontSize:"0.84rem", fontWeight:500, fontFamily:"'DM Sans',sans-serif",
                opacity: step===1 ? 0.4 : 1, transition:"opacity 0.15s",
              }}>
              ← Kembali
            </button>
            <span style={{ fontSize:"0.71rem", color:C.muted }}>{step} / {STEPS.length}</span>
            {step < STEPS.length ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                style={{
                  padding:"0.6rem 1.3rem", borderRadius:"6px", border:"none",
                  background: canNext() ? C.accent : C.bg,
                  color: canNext() ? "#fff" : C.muted,
                  cursor: canNext() ? "pointer" : "default",
                  fontSize:"0.84rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.15s",
                }}>
                Seterusnya →
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                style={{
                  padding:"0.6rem 1.5rem", borderRadius:"6px", border:"none",
                  background:C.accent, color:"#fff", cursor:"pointer",
                  fontSize:"0.84rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                }}>
                Hantar Permohonan
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}