export const CATEGORIES = [
  { id: "tractors", name: "Tractors", icon: "tractor", count: 0 },
  { id: "combines", name: "Combines & Harvesters", icon: "combine", count: 0 },
  { id: "excavators", name: "Excavators", icon: "excavator", count: 0 },
  { id: "skid-steers", name: "Skid Steers", icon: "skid-steer", count: 0 },
  { id: "telehandlers", name: "Telehandlers", icon: "telehandler", count: 0 },
  { id: "trailers", name: "Trailers", icon: "trailer", count: 0 },
  { id: "hay-equipment", name: "Hay & Forage", icon: "hay", count: 0 },
  { id: "planting", name: "Planting & Seeding", icon: "planting", count: 0 },
  { id: "tillage", name: "Tillage", icon: "tillage", count: 0 },
  { id: "trucks", name: "Trucks", icon: "truck", count: 0 },
];

export const BRANDS = [
  { id: "john-deere", name: "John Deere" },
  { id: "case-ih", name: "Case IH" },
  { id: "caterpillar", name: "Caterpillar" },
  { id: "kubota", name: "Kubota" },
  { id: "new-holland", name: "New Holland" },
  { id: "komatsu", name: "Komatsu" },
  { id: "bobcat", name: "Bobcat" },
  { id: "agco", name: "AGCO" },
  { id: "massey-ferguson", name: "Massey Ferguson" },
  { id: "fendt", name: "Fendt" },
  { id: "claas", name: "CLAAS" },
  { id: "volvo", name: "Volvo" },
];

export const CONDITIONS = [
  "Field-Ready Premium",
  "Field-Ready",
  "Working Order",
  "Needs Service",
  "Parts Only",
];

export const CONDITION_CHECKLISTS: Record<string, any[]> = {
  tractors: [
    { key: "engine_smoke", label: "Engine smoke on startup", options: ["None", "Light blue", "Black", "White"] },
    { key: "hydraulic_leaks", label: "Hydraulic leaks", options: ["None", "Minor seep", "Active leak"] },
    { key: "transmission_shifts", label: "Transmission shifts smoothly", options: ["Yes", "Minor slippage", "Needs attention"] },
    { key: "front_axle", label: "Front axle condition", options: ["Tight", "Minor play", "Needs rebuild"] },
    { key: "rear_tire_pct", label: "Rear tire % remaining", options: ["80%+", "50-80%", "30-50%", "Below 30%"] },
    { key: "cab_ac", label: "Cab AC working", options: ["Yes", "Weak", "No", "N/A - Open station"] },
    { key: "electrical", label: "Electrical issues", options: ["None", "Minor (lights, gauges)", "Significant"] },
    { key: "pto_operation", label: "PTO operation", options: ["Normal", "Noisy", "Not engaging"] },
    { key: "three_point", label: "3-point hitch operation", options: ["Normal", "Slow to lift", "Not working"] },
    { key: "maintenance_records", label: "Maintenance records available", options: ["Complete records", "Partial records", "None available"] },
  ],
  combines: [
    { key: "engine_smoke", label: "Engine smoke on startup", options: ["None", "Light blue", "Black", "White"] },
    { key: "separator_hours", label: "Separator hours condition", options: ["Low (<60% of engine)", "Normal (60-80%)", "High (>80%)"] },
    { key: "feeder_house", label: "Feeder house chain condition", options: ["Good (>70%)", "Fair (40-70%)", "Needs replacement"] },
    { key: "rotor_cylinder", label: "Rotor/threshing cylinder", options: ["Good - no wear", "Minor wear", "Needs bars/rasp"] },
    { key: "cleaning_shoe", label: "Cleaning shoe/sieves", options: ["Good condition", "Minor damage", "Needs replacement"] },
    { key: "unload_auger", label: "Unload auger", options: ["Works properly", "Slow", "Issues"] },
    { key: "chopper", label: "Straw chopper/spreader", options: ["Good", "Knives need sharpening", "Needs rebuild"] },
    { key: "yield_monitor", label: "Yield monitor functional", options: ["Yes - calibrated", "Yes - needs calibration", "Not working"] },
    { key: "drive_tires", label: "Drive tire % remaining", options: ["80%+", "50-80%", "30-50%", "Below 30%"] },
    { key: "maintenance_records", label: "Maintenance records available", options: ["Complete records", "Partial records", "None available"] },
  ],
  excavators: [
    { key: "hydraulic_leaks", label: "Hydraulic cylinder leaks", options: ["None", "Minor seep", "Active leak"] },
    { key: "undercarriage", label: "Undercarriage condition", options: ["Good (>60%)", "Fair (30-60%)", "Needs replacement"] },
    { key: "boom_stick_play", label: "Boom/stick pin play", options: ["Tight", "Minor play", "Excessive - needs pins"] },
    { key: "bucket_teeth", label: "Bucket teeth condition", options: ["Good", "Worn - usable", "Needs replacement"] },
    { key: "swing_bearing", label: "Swing bearing", options: ["Smooth", "Minor noise", "Excessive play"] },
    { key: "tracks_pads", label: "Track pads", options: ["Good (>50%)", "Worn", "Needs replacement"] },
    { key: "cab_condition", label: "Cab HVAC", options: ["AC & Heat work", "Heat only", "Neither working"] },
    { key: "engine_condition", label: "Engine performance", options: ["Strong - full power", "Adequate", "Down on power"] },
    { key: "auxiliary_hydraulics", label: "Auxiliary hydraulics", options: ["Working", "Slow", "Not working", "N/A"] },
    { key: "maintenance_records", label: "Maintenance records available", options: ["Complete records", "Partial records", "None available"] },
  ],
  "skid-steers": [
    { key: "hydraulic_leaks", label: "Hydraulic leaks", options: ["None", "Minor seep", "Active leak"] },
    { key: "tires_tracks", label: "Tires/tracks condition", options: ["Good (>50%)", "Worn (20-50%)", "Needs replacement"] },
    { key: "drive_motors", label: "Drive motors", options: ["Both strong", "One weak", "Issues"] },
    { key: "cab_condition", label: "Cab/ROPS condition", options: ["Good - HVAC works", "Good - no HVAC", "Damage/issues"] },
    { key: "coupler", label: "Quick attach coupler", options: ["Works properly", "Stiff", "Not working"] },
    { key: "high_flow", label: "High-flow hydraulics", options: ["Working", "Not equipped", "Not working"] },
    { key: "joysticks", label: "Joystick controls", options: ["Smooth operation", "Sloppy/worn", "Issues"] },
    { key: "engine_condition", label: "Engine performance", options: ["Strong", "Adequate", "Down on power"] },
    { key: "maintenance_records", label: "Maintenance records available", options: ["Complete records", "Partial records", "None available"] },
  ],
};

export const PHOTO_GUIDES: Record<string, string[]> = {
  tractors: ["Front 3/4 view", "Rear 3/4 view", "Driver side profile", "Passenger side profile", "Grille close-up", "Engine compartment", "Hour meter", "Cab interior (wide)", "Cab interior (controls)", "Front axle", "Rear axle / duals", "3-point hitch", "PTO shaft", "Hydraulic rear outlets", "Any known damage", "Serial number plate"],
  combines: ["Full machine (header attached)", "Full machine (header off)", "Hour meter (engine + separator)", "Header front view", "Knife/cutterbar close-up", "Feeder house", "Grain tank (open)", "Cab interior", "Yield monitor screen", "Rotor/threshing area", "Cleaning shoe/sieves", "Straw chopper", "Unload auger", "Drive tires", "Steer tires/tracks", "Engine compartment", "Any damage", "Serial number plate"],
  excavators: ["Front 3/4 view", "Rear 3/4 view", "Side profile (boom extended)", "Side profile (boom tucked)", "Cab interior", "Hour meter", "Engine compartment", "Undercarriage (full)", "Track pads close-up", "Bucket/attachment", "Boom pin close-up", "Hydraulic lines", "Counterweight area", "Any known damage", "Serial number plate"],
  "skid-steers": ["Front 3/4 view", "Rear 3/4 view", "Side profiles", "Cab interior", "Hour meter", "Engine compartment", "Tires/tracks close-up", "Quick attach coupler", "Hydraulic connections", "Bucket/attachment", "Any known damage", "Serial number plate"],
};
