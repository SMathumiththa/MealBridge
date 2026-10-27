import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const SRI_LANKA_LOCATIONS = {
  "COLOMBO": [
    "Avissawella", "Bambalapitiya", "Battaramulla", "Borella", "Cinnamon Gardens",
    "Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5", "Colombo 6", "Colombo 7",
    "Dehiwala", "Fort", "Homagama", "Kollupitiya", "Koswatta", "Kottawa", "Kotte", "Maharagama",
    "Malabe", "Moratuwa", "Mount Lavinia", "Nawala", "Nugegoda", "Padukka", "Pelawatte", "Pettah",
    "Rajagiriya", "Ratmalana", "Thalawathugoda", "Wellawatte"
  ],
  "GAMPAHA": ["Biyagama", "Delgoda", "Divulapitiya", "Dompe", "Gampaha", "Ja-Ela", "Kadawatha", "Kandana", "Katunayake", "Kelaniya", "Kiribathgoda", "Minuwangoda", "Mirigama", "Negombo", "Nittambuwa", "Peliyagoda", "Ragama", "Veyangoda", "Wattala"],
  "KALUTARA": ["Agalawatta", "Aluthgama", "Baduraliya", "Bandaragama", "Beruwala", "Bulathsinhala", "Dodangoda", "Horana", "Ingiriya", "Kalutara", "Matugama", "Panadura", "Wadduwa"],
  "KANDY": ["Akurana", "Gampola", "Gelioya", "Galaha", "Kadugannawa", "Kandy", "Katugastota", "Kundasale", "Madawala", "Nawalapitiya", "Peradeniya", "Pilimathalawa", "Wattegama"],
  "MATALE": ["Dambulla", "Galewela", "Matale", "Naula", "Palapathwela", "Rattota", "Sigiriya", "Ukuwela", "Yatawatta"],
  "NUWARA ELIYA": ["Agarapathana", "Bogawantalawa", "Dayagama", "Dickoya", "Ginigathena", "Hatton", "Kotagala", "Maskeliya", "Nanu Oya", "Nuwara Eliya", "Pundaluoya", "Talawakele"],
  "GALLE": ["Ahangama", "Ambalangoda", "Baddegama", "Batapola", "Bentota", "Boossa", "Elpitiya", "Galle", "Habaraduwa", "Hikkaduwa", "Karapitiya", "Karandeniya", "Koggala", "Unawatuna"],
  "MATARA": ["Akuressa", "Deniyaya", "Dickwella", "Hakmana", "Kamburupitiya", "Matara", "Morawaka", "Weligama"],
  "HAMBANTOTA": ["Ambalantota", "Beliatta", "Hambantota", "Middaramulla", "Tangalle", "Tissamaharama", "Walasmulla", "Weeraketiya"],
  "JAFFNA": ["Chavakachcheri", "Chunnakam", "Jaffna", "Kankesanthurai", "Karainagar", "Kopay", "Nallur", "Point Pedro", "Tellippalai", "Velanai"],
  "KILINOCHCHI": ["Kilinochchi", "Pallai", "Paranthan", "Pooneryn"],
  "MANNAR": ["Adampan", "Mannar", "Murunkan", "Nanaddan", "Pesalai", "Thalaimannar"],
  "VAVUNIYA": ["Cheddikulam", "Nedunkeni", "Omanthai", "Vavuniya"],
  "MULLAITIVU": ["Mallavi", "Mankulam", "Mullaitivu", "Oddusuddan", "Puthukkudiyiruppu", "Welioya"],
  "BATTICALOA": ["Araiyampathy", "Batticaloa", "Chenkalady", "Eravur", "Kalkudah", "Kaluwanchikudy", "Kattankudy", "Vakarai", "Valaichchenai"],
  "AMPARA": ["Akkaraipattu", "Ampara", "Dehiattakandiya", "Kalmunai", "Maha Oya", "Nintavur", "Padiyathalawa", "Pottuvil", "Samanthurai", "Uhana"],
  "TRINCOMALEE": ["Gomarankadawala", "Kantale", "Kinniya", "Kuchchaveli", "Mutur", "Nilaveli", "Thampalakamam", "Trincomalee"],
  "KURUNEGALA": ["Alawwa", "Bingiriya", "Galgamuwa", "Giriulla", "Hettipola", "Kuliyapitiya", "Kurunegala", "Mawathagama", "Narammala", "Nikaweratiya", "Pannala", "Polgahawela", "Wariyapola"],
  "PUTTALAM": ["Anamaduwa", "Chilaw", "Dankotuwa", "Kalpitiya", "Madampe", "Mahawewa", "Marawila", "Mundel", "Nattandiya", "Puttalam", "Wennappuwa"],
  "ANURADHAPURA": ["Anuradhapura", "Eppawala", "Galenbindunuwewa", "Galnewa", "Habarana", "Kekirawa", "Medawachchiya", "Mihintale", "Nochchiyagama", "Padaviya", "Tambuttegama"],
  "POLONNARUWA": ["Dimbulagala", "Hingurakgoda", "Kaduruwela", "Medirigiriya", "Polonnaruwa", "Welikanda"],
  "BADULLA": ["Badulla", "Bandarawela", "Diyatalawa", "Ella", "Haldummulla", "Hali-ela", "Haputale", "Mahiyanganaya", "Meegahakiula", "Passara", "Welimada"],
  "MONARAGALA": ["Badalkumbura", "Bibile", "Buttala", "Kataragama", "Medagama", "Monaragala", "Siyambalanduwa", "Wellawaya"],
  "RATNAPURA": ["Ayagama", "Balangoda", "Eheliyagoda", "Elapatha", "Embilipitiya", "Godakawela", "Kahangama", "Kuruwita", "Nivitigala", "Opanayaka", "Pelmadulla", "Rakwana", "Ratnapura"],
  "KEGALLE": ["Aranayaka", "Bulathkohupitiya", "Dehiowita", "Deraniyagala", "Galigamuwa", "Kegalle", "Kitulgala", "Mawanella", "Ruwanwella", "Warakapola", "Yatiyantota"]
};

const DISTRICT_ALIASES = {
  "cmb": "COLOMBO",
  "kdy": "KANDY",
  "gle": "GALLE",
  "mta": "MATARA",
  "hbt": "HAMBANTOTA",
  "jfn": "JAFFNA",
  "tco": "TRINCOMALEE",
  "bad": "BADULLA",
  "kln": "KILINOCHCHI",
  "kga": "KEGALLE"
};

export default function LocationSelector({ 
  district, 
  setDistrict, 
  place, 
  setPlace, 
  districtError, 
  placeError, 
  label = "Pickup Location",
  theme
}) {
  const { t } = useTranslation();
  const [districtSearch, setDistrictSearch] = useState("");
  const [showDistricts, setShowDistricts] = useState(false);
  
  const [placeSearch, setPlaceSearch] = useState("");
  const [showPlaces, setShowPlaces] = useState(false);

  const [detecting, setDetecting] = useState(false);

  // Auto-detect theme from prop or document body
  const isLight = theme === "light" || (typeof document !== "undefined" && document.body.classList.contains("light-theme"));

  const districts = Object.keys(SRI_LANKA_LOCATIONS).sort((a, b) => a.localeCompare(b));
  const filteredDistricts = districts.filter(d => {
    const q = districtSearch.toLowerCase();
    if (d.toLowerCase().includes(q)) return true;
    for (const [alias, realName] of Object.entries(DISTRICT_ALIASES)) {
      if (alias.includes(q) && realName === d) return true;
    }
    return false;
  });

  const places = useMemo(() => {
    if (!district) return [];
    const rawPlaces = SRI_LANKA_LOCATIONS[district] || [];
    const uniquePlaces = [];
    const lowerCaseSet = new Set();
    
    rawPlaces.forEach(p => {
      if (!lowerCaseSet.has(p.toLowerCase())) {
        lowerCaseSet.add(p.toLowerCase());
        uniquePlaces.push(p);
      }
    });
    
    return uniquePlaces.sort((a, b) => a.localeCompare(b));
  }, [district]);

  const filteredPlaces = places.filter(p => p.toLowerCase().includes(placeSearch.toLowerCase()));

  const dropdownRef = useRef(null);
  const placeRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDistricts(false);
      }
      if (placeRef.current && !placeRef.current.contains(event.target)) {
        setShowPlaces(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        if (data && data.address) {
          const detectedString = [data.address.state_district, data.address.county, data.address.city, data.address.state].join(" ").toUpperCase();
          const match = Object.keys(SRI_LANKA_LOCATIONS).find(d => detectedString.includes(d));
          if (match) {
            setDistrict(match);
            setPlace("");
          } else {
            alert("Could not map your location to a Sri Lankan district.");
          }
        }
      } catch (err) {
        console.error("GPS detect error:", err);
      } finally {
        setDetecting(false);
      }
    }, () => {
      setDetecting(false);
      alert("Location permission denied.");
    });
  };

  // Color variables for theme-aware rendering
  const labelColor = isLight ? "rgba(15,23,42,0.68)" : "rgba(255,255,255,0.6)";
  const triggerBg = isLight ? "#ffffff" : "rgba(255,255,255,0.06)";
  const triggerBorder = isLight ? "1px solid rgba(15,23,42,0.16)" : "1px solid rgba(255,255,255,0.15)";
  const triggerBorderActive = isLight ? "1px solid #19a85a" : "1px solid rgba(25,168,90,0.7)";
  const textColor = isLight ? "#0f172a" : "#ffffff";
  const placeholderColor = isLight ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.45)";
  
  const menuBg = isLight ? "#ffffff" : "#0f2231";
  const menuBorder = isLight ? "1px solid rgba(15,23,42,0.12)" : "1px solid rgba(255,255,255,0.15)";
  const menuShadow = isLight ? "0 14px 40px rgba(15,23,42,0.14)" : "0 18px 48px rgba(0,0,0,0.65)";
  
  const searchInputBg = isLight ? "#f8fafc" : "rgba(255,255,255,0.06)";
  const searchInputBorder = isLight ? "1px solid rgba(15,23,42,0.14)" : "1px solid rgba(255,255,255,0.15)";
  const searchBorderBottom = isLight ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(255,255,255,0.1)";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: labelColor, letterSpacing: "1.2px", textTransform: "uppercase" }}>
          {label}
        </label>
        <button 
          onClick={handleGPSDetect} 
          disabled={detecting}
          style={{
            background: "transparent",
            border: "none",
            color: isLight ? "#19a85a" : "#79cf8a",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {detecting ? `📍 ${t("common.detecting", { defaultValue: "Detecting..." })}` : `📍 ${t("common.autoDetect", { defaultValue: "Auto Detect" })}`}
        </button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        
        {/* District Selector */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div 
            onClick={() => setShowDistricts(!showDistricts)}
            style={{
              width: "100%",
              padding: "13px 16px",
              background: triggerBg,
              border: districtError ? "1px solid #e74c3c" : (showDistricts ? triggerBorderActive : triggerBorder),
              borderRadius: 12,
              color: district ? textColor : placeholderColor,
              fontSize: 14,
              fontWeight: district ? 600 : 400,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.2s ease",
              boxShadow: isLight ? "0 2px 8px rgba(15,23,42,0.03)" : "none"
            }}
          >
            <span style={{ color: district ? textColor : placeholderColor }}>
              {district || t("donor.selectDistrict", { defaultValue: "Select District..." })}
            </span>
            <span style={{ 
              fontSize: "11px", 
              color: isLight ? "#19a85a" : "#79cf8a", 
              transform: showDistricts ? "rotate(180deg)" : "none", 
              transition: "transform 0.2s ease" 
            }}>
              ▼
            </span>
          </div>
          {districtError && <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>{districtError}</div>}

          {showDistricts && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: menuBg,
              border: menuBorder,
              borderRadius: 14,
              zIndex: 9999,
              maxHeight: "320px",
              overflowY: "auto",
              boxShadow: menuShadow,
              boxSizing: "border-box"
            }}>
              <div style={{ padding: "10px 12px", borderBottom: searchBorderBottom, position: "sticky", top: 0, background: menuBg, zIndex: 10000 }}>
                <input 
                  type="text" 
                  placeholder={t("donor.searchDistrict", { defaultValue: "Search district..." })} 
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: searchInputBorder,
                    background: searchInputBg,
                    color: textColor,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  autoFocus
                />
              </div>
              <div style={{ padding: "6px" }}>
                {filteredDistricts.length === 0 ? (
                  <div style={{ 
                    padding: "16px 12px", 
                    color: placeholderColor, 
                    fontSize: "14px",
                    textAlign: "center"
                  }}>
                    {t("donor.noDistrictsFound", { defaultValue: "No districts found" })}
                  </div>
                ) : (
                  filteredDistricts.map(d => {
                    const isSelected = district === d;
                    return (
                      <div 
                        key={d}
                        onClick={() => {
                          setDistrict(d);
                          setPlace(""); 
                          setShowDistricts(false);
                          setDistrictSearch("");
                        }}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          color: isSelected 
                            ? (isLight ? "#19a85a" : "#ffffff") 
                            : textColor,
                          background: isSelected 
                            ? (isLight ? "rgba(25,168,90,0.12)" : "linear-gradient(135deg, #124b55, #19a85a)") 
                            : "transparent",
                          fontWeight: isSelected ? 700 : 500,
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.15s ease",
                          marginBottom: 2
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = isLight ? "rgba(25,168,90,0.08)" : "rgba(255,255,255,0.08)";
                            e.currentTarget.style.color = isLight ? "#124b55" : "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = textColor;
                          }
                        }}
                      >
                        <span>{d}</span>
                        {isSelected && <span style={{ color: isLight ? "#19a85a" : "#ffffff", fontWeight: 800 }}>✓</span>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Place / Area Selector */}
        <div ref={placeRef} style={{ position: "relative" }}>
          <div 
            onClick={() => {
              if (district) setShowPlaces(!showPlaces);
            }}
            style={{
              width: "100%",
              padding: "13px 16px",
              background: triggerBg,
              border: placeError ? "1px solid #e74c3c" : (showPlaces ? triggerBorderActive : triggerBorder),
              borderRadius: 12,
              color: place ? textColor : placeholderColor,
              fontSize: 14,
              fontWeight: place ? 600 : 400,
              cursor: district ? "pointer" : "not-allowed",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.2s ease",
              opacity: district ? 1 : 0.6,
              boxShadow: isLight ? "0 2px 8px rgba(15,23,42,0.03)" : "none"
            }}
          >
            <span style={{ color: place ? textColor : placeholderColor }}>
              {place || t("donor.selectArea", { defaultValue: "Select area..." })}
            </span>
            <span style={{ 
              fontSize: "11px", 
              color: isLight ? "#19a85a" : "#79cf8a", 
              transform: showPlaces ? "rotate(180deg)" : "none", 
              transition: "transform 0.2s ease" 
            }}>
              ▼
            </span>
          </div>
          {placeError && <div style={{ color: "#e74c3c", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>{placeError}</div>}

          {showPlaces && district && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: menuBg,
              border: menuBorder,
              borderRadius: 14,
              zIndex: 9999,
              maxHeight: "320px",
              overflowY: "auto",
              boxShadow: menuShadow,
              boxSizing: "border-box"
            }}>
              <div style={{ padding: "10px 12px", borderBottom: searchBorderBottom, position: "sticky", top: 0, background: menuBg, zIndex: 10000 }}>
                <input 
                  type="text" 
                  placeholder={t("donor.searchArea", { defaultValue: "Search area..." })} 
                  value={placeSearch}
                  onChange={(e) => setPlaceSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: searchInputBorder,
                    background: searchInputBg,
                    color: textColor,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  autoFocus
                />
              </div>
              <div style={{ padding: "6px" }}>
                {filteredPlaces.length === 0 ? (
                  <div style={{ 
                    padding: "16px 12px", 
                    color: placeholderColor, 
                    fontSize: "14px",
                    textAlign: "center"
                  }}>
                    {t("donor.noAreasFound", { defaultValue: "No areas found" })}
                  </div>
                ) : (
                  filteredPlaces.map(p => {
                    const isSelected = place === p;
                    return (
                      <div 
                        key={p}
                        onClick={() => {
                          setPlace(p); 
                          setShowPlaces(false);
                          setPlaceSearch("");
                        }}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          color: isSelected 
                            ? (isLight ? "#19a85a" : "#ffffff") 
                            : textColor,
                          background: isSelected 
                            ? (isLight ? "rgba(25,168,90,0.12)" : "linear-gradient(135deg, #124b55, #19a85a)") 
                            : "transparent",
                          fontWeight: isSelected ? 700 : 500,
                          cursor: "pointer",
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.15s ease",
                          marginBottom: 2
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = isLight ? "rgba(25,168,90,0.08)" : "rgba(255,255,255,0.08)";
                            e.currentTarget.style.color = isLight ? "#124b55" : "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = textColor;
                          }
                        }}
                      >
                        <span>{p}</span>
                        {isSelected && <span style={{ color: isLight ? "#19a85a" : "#ffffff", fontWeight: 800 }}>✓</span>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
