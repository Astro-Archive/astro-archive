export const ARTIFACTS = [
  {
    id: 'ingenuity',
    name: 'Ingenuity Mars Helicopter',
    body: 'Mars',
    location: 'Neretva Vallis, Jezero Crater',
    coordinates: '18.444° N, 77.451° E',
    missionTime: '2021 – 2024 (1,004 Sols)',
    status: 'Grounded / Stationary Sensor',
    statusType: 'warning',
    modelUrl: '/models/ingenuity-mars-helicopter.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-helicopter/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: 'Telemetry Carrier & Atmospheric Drone Feed',
    diagnostics: {
      powerLevel: '28% (Solar Trickle Charge)',
      temperature: '-84°C',
      rotorCondition: 'Rotor Tip Damaged (Flight 72)',
      signalDelay: '14m 22s',
      atmosphereDensity: '0.020 kg/m³ (~1% of Earth)',
    },
    engineeringBreakdown: [
      {
        title: 'Rotores Coaxiales de Fibra de Carbono',
        specs: '2,400 RPM | Diámetro 1.2 m',
        desc: 'El aire en Marte tiene menos del 1% de la densidad terrestre. Para generar sustentación, dos juegos de aspas giran en sentidos opuestos 5 veces más rápido que un helicóptero terrestre comercial.',
      },
      {
        title: 'Navegación Óptica Autónoma',
        specs: 'Sensor Visual + IMU | 30 FPS',
        desc: 'Debido al retraso de la señal Tierra-Marte (hasta 20 minutos), el control manual era imposible. Ingenuity tomaba 30 fotos por segundo del terreno para calcular velocidad y posición en tiempo real.',
      },
      {
        title: 'Arquitectura Ultra-Ligera',
        specs: '1.8 kg masa total | Baterías Li-ion',
        desc: 'Equipado con un procesador Snapdragon 801, antenas de radio y aislamiento de aerogel para no congelarse en las noches marcianas de -90°C.',
      }
    ],
    theStory: 'Diseñado como una prueba tecnológica de solo 5 vuelos de 30 segundos, Ingenuity rompió todas las expectativas completando 72 vuelos y cubriendo 17 kilómetros a través de dunas y cañones marcianos.',
    legacy: 'Demostró que el vuelo aéreo propulsado es posible en otros mundos, sentando las bases para futuras flotas de drones exploradores en Marte y Titán.'
  },
  {
    id: 'apollo11',
    name: 'Apollo 11 LEM Eagle (Descent Stage)',
    body: 'Moon',
    location: 'Tranquility Base (Mare Tranquillitatis)',
    coordinates: '0.67408° N, 23.47297° E',
    missionTime: 'July 20, 1969 – Present',
    status: 'Permanent Monument',
    statusType: 'green',
    modelUrl: '/models/apollo-lunar-module.glb',
    officialNasaUrl: 'https://history.nasa.gov/alsj/a11/a11.html',
    audioSample: '/audio/eagle_landed.mp3',
    audioTitle: 'Armstrong: "Houston, Tranquility Base here. The Eagle has landed."',
    diagnostics: {
      powerLevel: 'N/A (Descent Batteries Expended)',
      temperature: '-170°C to +120°C (Day/Night)',
      structuralIntegrity: 'Preserved in Lunar Vacuum',
      atmosphereDensity: 'Vacuum (~10⁻¹² torr)',
      micrometeoriteExposure: '57+ Years',
    },
    engineeringBreakdown: [
      {
        title: 'Motor DPS (Descent Propulsion System)',
        specs: 'Empuje variable 4,500 – 43,900 N',
        desc: 'El primer cohete con acelerador graduable en vuelo. Neil Armstrong pudo maniobrar manualmente sobre un cráter lleno de rocas para posar el módulo en un terreno plano con solo 25 segundos de combustible restante.',
      },
      {
        title: 'Aislamiento Térmico Mylar & Kapton',
        specs: '25 capas reflectivas de aluminio/oro',
        desc: 'Al no haber atmósfera que regule el calor, la superficie lunar pasa de congelarse a hervir. Las láminas doradas reflejaban la radiación solar manteniendo la cabina a temperatura habitable.',
      },
      {
        title: 'Sensores de Alunizaje y Plataforma',
        specs: 'Varillas de 1.7 m bajo las almohadillas',
        desc: 'Al tocar el suelo, las varillas encendían la luz azul "Lunar Contact" en el panel de control para que los astronautas apagaran el motor antes de impactar y evitar sobrepresión en la tobera.',
      }
    ],
    theStory: 'Cuando Neil Armstrong y Buzz Aldrin despegaron de regreso a la Tierra, la mitad superior del módulo se impulsó usando la etapa de descenso como plataforma fija. La base dorada quedó allí para siempre.',
    legacy: 'La primera instalación tecnológica de nuestra especie en otro cuerpo celeste y el inicio de la era de exploración interplanetaria.'
  },
  {
    id: 'opportunity',
    name: 'Opportunity Rover (MER-B)',
    body: 'Mars',
    location: 'Perseverance Valley, Endeavour Crater',
    coordinates: '2.28° S, 354.76° E',
    missionTime: '2004 – 2018 (5,111 Sols)',
    status: 'Terminated / Power Depleted',
    statusType: 'offline',
    modelUrl: '/models/opportunity-rover.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/mer-opportunity/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: 'Simulated Last Telemetry Frame (Sol 5111)',
    diagnostics: {
      powerLevel: '0 Wh (Total Solar Blackout)',
      temperature: '-102°C',
      odometer: '45.16 km (Record en otro mundo)',
      signalDelay: 'Offline (Last ping June 10, 2018)',
      atmosphereDensity: 'Tau Factor > 10.8 (Extreme Dust)',
    },
    engineeringBreakdown: [
      {
        title: 'Arreglo Fotovoltaico & Dust Devils',
        specs: '140 W pico | Células Triple Unión',
        desc: 'Su misión estaba garantizada para 90 días, pero duró 14 años gracias a remolinos de viento marciano ("dust devils") que limpiaban la suciedad acumulada sobre los paneles.',
      },
      {
        title: 'Sistema de Suspensión Rocker-Bogie',
        specs: '6 ruedas motrices | Articulación pasiva',
        desc: 'Permite superar obstáculos del doble del diámetro de sus ruedas sin volcarse, distribuyendo el peso uniformemente sobre rocas afiladas de regolito marciano.',
      },
      {
        title: 'Calentadores de Radioisótopos (RHU)',
        specs: 'Pastillas de Dióxido de Plutonio',
        desc: 'Generaban calor constante mediante decaimiento radiactivo para evitar que la electrónica interna se congelara durante las noches de invierno marciano.',
      }
    ],
    theStory: 'En junio de 2018, una descomunal tormenta global de polvo cubrió todo el planeta rojo, bloqueando el 99% de la radiación solar. Oppy transmitió su último paquete de datos antes de entrar en un sueño eterno.',
    legacy: 'Descubrió los primeros hematitas en forma de "arándanos" (blueberries), la evidencia definitiva de que Marte albergó lagos de agua líquida en su pasado geológico.'
  },
  {
    id: 'viking',
    name: 'Viking 1 Lander',
    body: 'Mars',
    location: 'Chryse Planitia',
    coordinates: '22.697° N, 312.05° E',
    missionTime: '1976 – 1982 (2,245 Sols)',
    status: 'Historic Monument / Silent',
    statusType: 'offline',
    modelUrl: '/models/viking-lander.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/viking-1/',
    audioSample: '/audio/we_came_in_peace.mp3',
    audioTitle: 'Historical Mission Commemorative Transmission',
    diagnostics: {
      powerLevel: 'RTG Nuclear Fuel Expended',
      temperature: '-90°C',
      soilSamplesAnalyzed: 'Biology Experiment Complete',
      firstPhotoDate: 'July 20, 1976',
      preservation: 'Preserved in Dry Martian Plains',
    },
    engineeringBreakdown: [
      {
        title: 'Generadores Termoeléctricos (RTG)',
        specs: '2 x SNAP-19 RTG (Plutonio-238)',
        desc: 'A diferencia de los paneles solares que se cubren de polvo, Viking utilizó energía nuclear para alimentar sus computadoras e instrumentos durante más de 6 años.',
      },
      {
        title: 'Brazo Colector de Muestras y Horno GCMS',
        specs: 'Brazo extensible de 3 metros',
        desc: 'Excavó las primeras zanjas en el suelo marciano para depositar regolito en un espectrómetro de masas y buscar compuestos orgánicos.',
      },
      {
        title: 'Cámaras de Escaneo Facsímil',
        specs: 'Sensores fotodiodo mecánicos',
        desc: 'Transmitieron la primera fotografía nítida en color tomada desde la superficie de otro planeta, revelando por primera vez el paisaje rojizo y el cielo rosado de Marte.',
      }
    ],
    theStory: 'Fue la primera nave espacial estadounidense en aterrizar con éxito en Marte y completar su misión. Permaneció transmitiendo el clima marciano diariamente hasta que un comando de software defectuoso cortó el enlace en 1982.',
    legacy: 'Marcó el inicio de la exploración biológica y geológica de la superficie de Marte, proporcionando el primer registro meteorológico a largo plazo de otro mundo.'
  },
  {
    id: 'perseverance',
    name: 'Perseverance Rover (Mars 2020)',
    body: 'Mars',
    location: 'Jezero Crater Delta',
    coordinates: '18.38° N, 77.58° E',
    missionTime: '2021 – Present (Active Pioneer)',
    status: 'Active / Sample Caching',
    statusType: 'green',
    modelUrl: '/models/perseverance-rover.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
    audioSample: '/audio/one_small_step.mp3',
    audioTitle: 'EDL Acoustic System Recording: Jezero',
    diagnostics: {
      powerLevel: 'MMRTG 110W (Continuous Nuclear)',
      temperature: '-62°C',
      samplesCached: '24 Sealed Titanium Tubes',
      superCamLasers: 'Operational',
      subsurfaceRadar: 'RIMFAX Active',
    },
    engineeringBreakdown: [
      {
        title: 'Generador Nuclear MMRTG',
        specs: '4.8 kg Dióxido de Plutonio',
        desc: 'Convierte el calor natural del decaimiento radiactivo en electricidad constante, permitiéndole operar sin interrupción incluso durante feroces tormentas de arena.',
      },
      {
        title: 'Sistema de Extracción de Testigos de Roca',
        specs: 'Taladro rotativo-percutor + Carrusel',
        desc: 'Perfora rocas del antiguo delta de Jezero y las sella herméticamente en tubos de titanio ultra limpios para que una futura misión las traiga de regreso a la Tierra.',
      },
      {
        title: 'Instrumento MOXIE (Fábrica de Oxígeno)',
        specs: 'Electrólisis de CO₂ a 800°C',
        desc: 'Demostró con éxito que se puede fabricar oxígeno respirable y propulsor de cohetes directamente a partir de la atmósfera de dióxido de carbono marciana.',
      }
    ],
    theStory: 'Llegó a Marte con la maniobra SkyCrane más precisa de la historia. Viajó acompañado por el helicóptero Ingenuity y actualmente recolecta las muestras más prometedoras de la historia para buscar biofirmas pasadas.',
    legacy: 'El precursor directo de las futuras misiones humanas a Marte, probando generación de oxígeno y recolectando el tesoro geológico para Mars Sample Return.'
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope (HST)',
    body: 'Earth Orbit (LEO)',
    location: 'Órbita Terrestre Baja (540 km)',
    coordinates: 'Inclinación 28.5°, Altitud 535 km',
    missionTime: '1990 – Presente (36+ Años Activo)',
    status: 'Operational / Great Observatory',
    statusType: 'green',
    modelUrl: '/models/hubble.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/hubble/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: 'Telemetry Carrier & Orbital Radio Frequency',
    diagnostics: {
      altitude: '535 km (Órbita Terrestre Baja)',
      orbitalSpeed: '27,300 km/h (7.59 km/s)',
      pointingAccuracy: '0.007 arcosegundos (FGS Lock)',
      primaryMirrorDiameter: '2.4 metros (Ritchey-Chrétien)',
      observationsCount: '1.6+ Millones de exposiciones',
      spectralCoverage: 'Ultravioleta, Visible, Infrarrojo Cercano'
    },
    engineeringBreakdown: [
      {
        title: 'Espejo Primario de 2.4 m y Óptica COSTAR',
        specs: 'Vidrio ULE Corning + Recubrimiento Aluminio/MgF₂',
        desc: 'Tras el lanzamiento en 1990 con una aberración esférica de 2 micrómetros en el borde del espejo, la misión STS-61 en 1993 instaló el módulo correctivo COSTAR, otorgándole la visión más nítida del cosmos jamás lograda.'
      },
      {
        title: 'Sensores de Guía Fina (FGS) y Giroscopios',
        specs: '3 FGS interferométricos + 6 giroscopios',
        desc: 'Permiten fijar un objetivo astronómico con una precisión de 7 milésimas de segundo de arco: el equivalente a mantener un puntero láser sobre una moneda de 10 centavos a 320 kilómetros de distancia.'
      },
      {
        title: 'Cámara de Gran Campo 3 (WFC3)',
        specs: 'Detectores UVIS y de Infrarrojo Cercano',
        desc: 'Instalada por astronautas en la misión STS-125 (2009). Captura imágenes multiespectrales que revelan galaxias a más de 13,000 millones de años luz de distancia.'
      }
    ],
    theStory: 'Lanzado el 24 de abril de 1990 a bordo del transbordador espacial Discovery (STS-31), el Telescopio Espacial Hubble transformó la astronomía. Superó la turbulencia distorsionadora de la atmósfera terrestre y fue diseñado para ser reparado y mejorado en órbita por astronautas durante 5 épicas misiones de servicio del Transbordador.',
    legacy: 'Determinó la tasa de expansión acelerada del universo y su edad (13,800 millones de años), descubrió que casi toda galaxia alberga un agujero negro supermasivo en su centro, y capturó los primeros datos atmosféricos de exoplanetas lejanos.'
  }
];
