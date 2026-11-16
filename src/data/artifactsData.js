import { localize } from '../i18n/localize';

export const ARTIFACTS = [
  {
    id: 'ingenuity',
    name: {
      en: 'Ingenuity Mars Helicopter',
      es: 'Helicóptero Marciano Ingenuity',
    },
    body: 'Mars',
    bodyLabel: {
      en: 'Mars',
      es: 'Marte',
    },
    location: {
      en: 'Neretva Vallis, Jezero Crater',
      es: 'Neretva Vallis, cráter Jezero',
    },
    coordinates: '18.444° N, 77.451° E',
    missionTime: {
      en: '2021 – 2024 (1,004 Sols)',
      es: '2021 – 2024 (1.004 soles)',
    },
    status: {
      en: 'Grounded / Stationary Sensor',
      es: 'En tierra / Sensor estacionario',
    },
    statusType: 'warning',
    modelUrl: '/models/ingenuity-mars-helicopter.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-helicopter/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: {
      en: 'Telemetry Carrier & Atmospheric Drone Feed',
      es: 'Portadora de telemetría y señal del dron atmosférico',
    },
    diagnostics: {
      powerLevel: {
        en: '28% (Solar Trickle Charge)',
        es: '28% (carga solar de mantenimiento)',
      },
      temperature: '-84°C',
      rotorCondition: {
        en: 'Rotor Tip Damaged (Flight 72)',
        es: 'Punta del rotor dañada (vuelo 72)',
      },
      signalDelay: '14m 22s',
      atmosphereDensity: {
        en: '0.020 kg/m³ (~1% of Earth)',
        es: '0.020 kg/m³ (~1 % de la Tierra)',
      },
    },
    engineeringBreakdown: [
      {
        title: {
          en: 'Coaxial Carbon-Fiber Rotors',
          es: 'Rotores Coaxiales de Fibra de Carbono',
        },
        specs: {
          en: '2,400 RPM | 1.2 m diameter',
          es: '2.400 RPM | Diámetro 1,2 m',
        },
        desc: {
          en: 'The air on Mars is less than 1% as dense as Earth\'s. To generate lift, two sets of blades spin in opposite directions five times faster than a commercial terrestrial helicopter.',
          es: 'El aire en Marte tiene menos del 1% de la densidad terrestre. Para generar sustentación, dos juegos de aspas giran en sentidos opuestos 5 veces más rápido que un helicóptero terrestre comercial.',
        },
      },
      {
        title: {
          en: 'Autonomous Optical Navigation',
          es: 'Navegación Óptica Autónoma',
        },
        specs: {
          en: 'Visual Sensor + IMU | 30 FPS',
          es: 'Sensor visual + IMU | 30 FPS',
        },
        desc: {
          en: 'Because of the Earth–Mars signal delay (up to 20 minutes), manual control was impossible. Ingenuity took 30 photos per second of the terrain to compute velocity and position in real time.',
          es: 'Debido al retraso de la señal Tierra-Marte (hasta 20 minutos), el control manual era imposible. Ingenuity tomaba 30 fotos por segundo del terreno para calcular velocidad y posición en tiempo real.',
        },
      },
      {
        title: {
          en: 'Ultra-Light Architecture',
          es: 'Arquitectura Ultra-Ligera',
        },
        specs: {
          en: '1.8 kg total mass | Li-ion batteries',
          es: '1,8 kg de masa total | Baterías de Li-ion',
        },
        desc: {
          en: 'Equipped with a Snapdragon 801 processor, radio antennas and aerogel insulation to keep it from freezing on −90°C Martian nights.',
          es: 'Equipado con un procesador Snapdragon 801, antenas de radio y aislamiento de aerogel para no congelarse en las noches marcianas de -90°C.',
        },
      }
    ],
    theStory: {
      en: 'Designed as a technology demonstration of just five 30-second flights, Ingenuity broke every expectation by completing 72 flights and covering 17 kilometres across Martian dunes and canyons.',
      es: 'Diseñado como una prueba tecnológica de solo 5 vuelos de 30 segundos, Ingenuity rompió todas las expectativas completando 72 vuelos y cubriendo 17 kilómetros a través de dunas y cañones marcianos.',
    },
    legacy: {
      en: 'It proved that powered aerodynamic flight is possible on other worlds, laying the groundwork for future fleets of exploring drones on Mars and Titan.',
      es: 'Demostró que el vuelo aéreo propulsado es posible en otros mundos, sentando las bases para futuras flotas de drones exploradores en Marte y Titán.',
    }
  },
  {
    id: 'apollo11',
    name: {
      en: 'Apollo 11 LEM Eagle (Descent Stage)',
      es: 'Módulo Lunar Eagle del Apollo 11 (etapa de descenso)',
    },
    body: 'Moon',
    bodyLabel: {
      en: 'Moon',
      es: 'Luna',
    },
    location: {
      en: 'Tranquility Base (Mare Tranquillitatis)',
      es: 'Base Tranquilidad (Mare Tranquillitatis)',
    },
    coordinates: '0.67408° N, 23.47297° E',
    missionTime: {
      en: 'July 20, 1969 – Present',
      es: '20 de julio de 1969 – presente',
    },
    status: {
      en: 'Permanent Monument',
      es: 'Monumento permanente',
    },
    statusType: 'green',
    modelUrl: '/models/apollo-lunar-module.glb',
    officialNasaUrl: 'https://history.nasa.gov/alsj/a11/a11.html',
    audioSample: '/audio/eagle_landed.mp3',
    audioTitle: {
      en: 'Armstrong: "Houston, Tranquility Base here. The Eagle has landed."',
      es: 'Armstrong: «Houston, aquí Base Tranquilidad. El Eagle ha aterrizado».',
    },
    diagnostics: {
      powerLevel: {
        en: 'N/A (Descent Batteries Expended)',
        es: 'N/D (baterías de descenso agotadas)',
      },
      temperature: {
        en: '-170°C to +120°C (Day/Night)',
        es: '-170°C a +120°C (día/noche)',
      },
      structuralIntegrity: {
        en: 'Preserved in Lunar Vacuum',
        es: 'Conservada en vacío lunar',
      },
      atmosphereDensity: {
        en: 'Vacuum (~10⁻¹² torr)',
        es: 'Vacío (~10⁻¹² torr)',
      },
      micrometeoriteExposure: {
        en: '57+ Years',
        es: '57+ años',
      },
    },
    engineeringBreakdown: [
      {
        title: {
          en: 'DPS Engine (Descent Propulsion System)',
          es: 'Motor DPS (Descent Propulsion System)',
        },
        specs: {
          en: 'Throttle range 4,500 – 43,900 N',
          es: 'Empuje variable 4.500 – 43.900 N',
        },
        desc: {
          en: 'The first rocket engine with an in-flight throttle. Neil Armstrong was able to fly manually over a rock-strewn crater and set the module down on level ground with only 25 seconds of fuel remaining.',
          es: 'El primer cohete con acelerador graduable en vuelo. Neil Armstrong pudo maniobrar manualmente sobre un cráter lleno de rocas para posar el módulo en un terreno plano con solo 25 segundos de combustible restante.',
        },
      },
      {
        title: {
          en: 'Mylar & Kapton Thermal Insulation',
          es: 'Aislamiento Térmico Mylar & Kapton',
        },
        specs: {
          en: '25 reflective aluminium/gold layers',
          es: '25 capas reflectivas de aluminio/oro',
        },
        desc: {
          en: 'With no atmosphere to moderate heat, the lunar surface swings from freezing to boiling. The gold foils reflected solar radiation and kept the cabin at a habitable temperature.',
          es: 'Al no haber atmósfera que regule el calor, la superficie lunar pasa de congelarse a hervir. Las láminas doradas reflejaban la radiación solar manteniendo la cabina a temperatura habitable.',
        },
      },
      {
        title: {
          en: 'Landing Probes and Footpads',
          es: 'Sensores de Alunizaje y Plataforma',
        },
        specs: {
          en: '1.7 m probes beneath the pads',
          es: 'Varillas de 1,7 m bajo las almohadillas',
        },
        desc: {
          en: 'On contact with the ground the probes lit the blue "Lunar Contact" light on the control panel so the astronauts could shut down the engine before impact and avoid overpressure in the nozzle.',
          es: 'Al tocar el suelo, las varillas encendían la luz azul "Lunar Contact" en el panel de control para que los astronautas apagaran el motor antes de impactar y evitar sobrepresión en la tobera.',
        },
      }
    ],
    theStory: {
      en: 'When Neil Armstrong and Buzz Aldrin lifted off for home, the upper half of the module launched using the descent stage as a fixed platform. The golden base stayed there for ever.',
      es: 'Cuando Neil Armstrong y Buzz Aldrin despegaron de regreso a la Tierra, la mitad superior del módulo se impulsó usando la etapa de descenso como plataforma fija. La base dorada quedó allí para siempre.',
    },
    legacy: {
      en: 'The first technological installation our species left on another celestial body, and the beginning of the era of interplanetary exploration.',
      es: 'La primera instalación tecnológica de nuestra especie en otro cuerpo celeste y el inicio de la era de exploración interplanetaria.',
    }
  },
  {
    id: 'opportunity',
    name: {
      en: 'Opportunity Rover (MER-B)',
      es: 'Rover Opportunity (MER-B)',
    },
    body: 'Mars',
    bodyLabel: {
      en: 'Mars',
      es: 'Marte',
    },
    location: {
      en: 'Perseverance Valley, Endeavour Crater',
      es: 'Valle Perseverance, cráter Endeavour',
    },
    coordinates: '2.28° S, 354.76° E',
    missionTime: {
      en: '2004 – 2018 (5,111 Sols)',
      es: '2004 – 2018 (5.111 soles)',
    },
    status: {
      en: 'Terminated / Power Depleted',
      es: 'Finalizada / energía agotada',
    },
    statusType: 'offline',
    modelUrl: '/models/opportunity-rover.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/mer-opportunity/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: {
      en: 'Simulated Last Telemetry Frame (Sol 5111)',
      es: 'Última trama de telemetría simulada (sol 5111)',
    },
    diagnostics: {
      powerLevel: {
        en: '0 Wh (Total Solar Blackout)',
        es: '0 Wh (apagón solar total)',
      },
      temperature: '-102°C',
      odometer: {
        en: '45.16 km (Record on another world)',
        es: '45,16 km (récord en otro mundo)',
      },
      signalDelay: {
        en: 'Offline (Last ping June 10, 2018)',
        es: 'Sin conexión (último ping el 10 de junio de 2018)',
      },
      atmosphereDensity: {
        en: 'Tau Factor > 10.8 (Extreme Dust)',
        es: 'Factor tau > 10,8 (polvo extremo)',
      },
    },
    engineeringBreakdown: [
      {
        title: {
          en: 'Photovoltaic Array & Dust Devils',
          es: 'Arreglo Fotovoltaico & Dust Devils',
        },
        specs: {
          en: '140 W peak | Triple-junction cells',
          es: '140 W pico | Células de triple unión',
        },
        desc: {
          en: 'The mission was warranted for 90 days but lasted 14 years thanks to Martian whirlwinds ("dust devils") that blew the accumulated dust off the panels.',
          es: 'Su misión estaba garantizada para 90 días, pero duró 14 años gracias a remolinos de viento marciano ("dust devils") que limpiaban la suciedad acumulada sobre los paneles.',
        },
      },
      {
        title: {
          en: 'Rocker-Bogie Suspension System',
          es: 'Sistema de Suspensión Rocker-Bogie',
        },
        specs: {
          en: '6 driven wheels | Passive articulation',
          es: '6 ruedas motrices | Articulación pasiva',
        },
        desc: {
          en: 'It can climb obstacles twice the diameter of its wheels without tipping, spreading the load evenly over the sharp edges of Martian regolith.',
          es: 'Permite superar obstáculos del doble del diámetro de sus ruedas sin volcarse, distribuyendo el peso uniformemente sobre rocas afiladas de regolito marciano.',
        },
      },
      {
        title: {
          en: 'Radioisotope Heater Units (RHU)',
          es: 'Calentadores de Radioisótopos (RHU)',
        },
        specs: {
          en: 'Plutonium dioxide pellets',
          es: 'Pastillas de dióxido de plutonio',
        },
        desc: {
          en: 'They produced steady heat through radioactive decay to keep the internal electronics from freezing on Martian winter nights.',
          es: 'Generaban calor constante mediante decaimiento radiactivo para evitar que la electrónica interna se congelara durante las noches de invierno marciano.',
        },
      }
    ],
    theStory: {
      en: 'In June 2018 a colossal planet-wide dust storm shrouded the entire red planet, blocking 99% of the solar radiation. Oppy sent its last data packet before falling into an eternal sleep.',
      es: 'En junio de 2018, una descomunal tormenta global de polvo cubrió todo el planeta rojo, bloqueando el 99% de la radiación solar. Oppy transmitió su último paquete de datos antes de entrar en un sueño eterno.',
    },
    legacy: {
      en: 'It found the first "blueberry" haematite concretions, the definitive evidence that Mars once held lakes of liquid water in its geological past.',
      es: 'Descubrió las primeras hematitas en forma de "arándanos" (blueberries), la evidencia definitiva de que Marte albergó lagos de agua líquida en su pasado geológico.',
    }
  },
  {
    id: 'viking',
    name: {
      en: 'Viking 1 Lander',
      es: 'Módulo de Aterrizaje Viking 1',
    },
    body: 'Mars',
    bodyLabel: {
      en: 'Mars',
      es: 'Marte',
    },
    location: {
      en: 'Chryse Planitia',
      es: 'Chryse Planitia',
    },
    coordinates: '22.697° N, 312.05° E',
    missionTime: {
      en: '1976 – 1982 (2,245 Sols)',
      es: '1976 – 1982 (2.245 soles)',
    },
    status: {
      en: 'Historic Monument / Silent',
      es: 'Monumento histórico / en silencio',
    },
    statusType: 'offline',
    modelUrl: '/models/viking-lander.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/viking-1/',
    audioSample: '/audio/we_came_in_peace.mp3',
    audioTitle: {
      en: 'Historical Mission Commemorative Transmission',
      es: 'Transmisión conmemorativa de la misión histórica',
    },
    diagnostics: {
      powerLevel: {
        en: 'RTG Nuclear Fuel Expended',
        es: 'Combustible nuclear del RTG agotado',
      },
      temperature: '-90°C',
      soilSamplesAnalyzed: {
        en: 'Biology Experiment Complete',
        es: 'Experimento de biología completado',
      },
      firstPhotoDate: {
        en: 'July 20, 1976',
        es: '20 de julio de 1976',
      },
      preservation: {
        en: 'Preserved in Dry Martian Plains',
        es: 'Conservado en las llanuras secas marcianas',
      },
    },
    engineeringBreakdown: [
      {
        title: {
          en: 'Radioisotope Thermoelectric Generators (RTG)',
          es: 'Generadores Termoeléctricos de Radioisótopos (RTG)',
        },
        specs: {
          en: '2 × SNAP-19 RTG (plutonium-238)',
          es: '2 × SNAP-19 RTG (plutonio-238)',
        },
        desc: {
          en: 'Unlike solar panels that get coated in dust, Viking used nuclear power to run its computers and instruments for more than six years.',
          es: 'A diferencia de los paneles solares que se cubren de polvo, Viking utilizó energía nuclear para alimentar sus computadoras e instrumentos durante más de 6 años.',
        },
      },
      {
        title: {
          en: 'Sample Collector Arm and GCMS Oven',
          es: 'Brazo Colector de Muestras y Horno GCMS',
        },
        specs: {
          en: '3-metre extendable boom',
          es: 'Brazo extensible de 3 metros',
        },
        desc: {
          en: 'It dug the first trenches in Martian soil to deliver regolith to a mass spectrometer and search for organic compounds.',
          es: 'Excavó las primeras zanjas en el suelo marciano para depositar regolito en un espectrómetro de masas y buscar compuestos orgánicos.',
        },
      },
      {
        title: {
          en: 'Facsimile Scanning Cameras',
          es: 'Cámaras de Escaneo Facsímil',
        },
        specs: {
          en: 'Mechanical photodiode sensors',
          es: 'Sensores fotodiodo mecánicos',
        },
        desc: {
          en: 'They transmitted the first sharp colour photograph taken from the surface of another planet, revealing for the first time the reddish landscape and pink sky of Mars.',
          es: 'Transmitieron la primera fotografía nítida en color tomada desde la superficie de otro planeta, revelando por primera vez el paisaje rojizo y el cielo rosado de Marte.',
        },
      }
    ],
    theStory: {
      en: 'It was the first American spacecraft to land successfully on Mars and complete its mission. It kept transmitting Martian weather daily until a faulty software command cut the link in 1982.',
      es: 'Fue la primera nave espacial estadounidense en aterrizar con éxito en Marte y completar su misión. Permaneció transmitiendo el clima marciano diariamente hasta que un comando de software defectuoso cortó el enlace en 1982.',
    },
    legacy: {
      en: 'It marked the start of biological and geological exploration of the Martian surface, providing the first long-term weather record from another world.',
      es: 'Marcó el inicio de la exploración biológica y geológica de la superficie de Marte, proporcionando el primer registro meteorológico a largo plazo de otro mundo.',
    }
  },
  {
    id: 'perseverance',
    name: {
      en: 'Perseverance Rover (Mars 2020)',
      es: 'Rover Perseverance (Marte 2020)',
    },
    body: 'Mars',
    bodyLabel: {
      en: 'Mars',
      es: 'Marte',
    },
    location: {
      en: 'Jezero Crater Delta',
      es: 'Delta del cráter Jezero',
    },
    coordinates: '18.38° N, 77.58° E',
    missionTime: {
      en: '2021 – Present (Active Pioneer)',
      es: '2021 – presente (pionero activo)',
    },
    status: {
      en: 'Active / Sample Caching',
      es: 'Activo / almacenando muestras',
    },
    statusType: 'green',
    modelUrl: '/models/perseverance-rover.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
    audioSample: '/audio/one_small_step.mp3',
    audioTitle: {
      en: 'EDL Acoustic System Recording: Jezero',
      es: 'Grabación del sistema acústico de EDL: Jezero',
    },
    diagnostics: {
      powerLevel: {
        en: 'MMRTG 110W (Continuous Nuclear)',
        es: 'MMRTG 110 W (nuclear continuo)',
      },
      temperature: '-62°C',
      samplesCached: {
        en: '24 Sealed Titanium Tubes',
        es: '24 tubos de titanio sellados',
      },
      superCamLasers: {
        en: 'Operational',
        es: 'Operativo',
      },
      subsurfaceRadar: {
        en: 'RIMFAX Active',
        es: 'RIMFAX activo',
      },
    },
    engineeringBreakdown: [
      {
        title: {
          en: 'MMRTG Nuclear Generator',
          es: 'Generador Nuclear MMRTG',
        },
        specs: {
          en: '4.8 kg plutonium dioxide',
          es: '4,8 kg de dióxido de plutonio',
        },
        desc: {
          en: 'It converts the natural heat of radioactive decay into steady electricity, letting the rover operate without interruption even through fierce dust storms.',
          es: 'Convierte el calor natural del decaimiento radiactivo en electricidad constante, permitiéndole operar sin interrupción incluso durante feroces tormentas de arena.',
        },
      },
      {
        title: {
          en: 'Rock Core Sampling System',
          es: 'Sistema de Extracción de Testigos de Roca',
        },
        specs: {
          en: 'Rotary-percussive drill + carousel',
          es: 'Taladro rotativo-percutor + carrusel',
        },
        desc: {
          en: 'It drills into rocks of the ancient Jezero delta and seals them hermetically in ultra-clean titanium tubes so a future mission can bring them back to Earth.',
          es: 'Perfora rocas del antiguo delta de Jezero y las sella herméticamente en tubos de titanio ultra limpios para que una futura misión las traiga de regreso a la Tierra.',
        },
      },
      {
        title: {
          en: 'MOXIE Instrument (Oxygen Factory)',
          es: 'Instrumento MOXIE (Fábrica de Oxígeno)',
        },
        specs: {
          en: 'CO₂ electrolysis at 800°C',
          es: 'Electrólisis de CO₂ a 800°C',
        },
        desc: {
          en: 'It successfully demonstrated that breathable oxygen and rocket propellant can be manufactured directly from the Martian carbon-dioxide atmosphere.',
          es: 'Demostró con éxito que se puede fabricar oxígeno respirable y propulsor de cohetes directamente a partir de la atmósfera de dióxido de carbono marciana.',
        },
      }
    ],
    theStory: {
      en: 'It reached Mars with the most precise SkyCrane manoeuvre in history. It travelled accompanied by the Ingenuity helicopter and is currently collecting the most promising samples in history in the search for past biosignatures.',
      es: 'Llegó a Marte con la maniobra SkyCrane más precisa de la historia. Viajó acompañado por el helicóptero Ingenuity y actualmente recolecta las muestras más prometedoras de la historia para buscar biofirmas pasadas.',
    },
    legacy: {
      en: 'The direct precursor of future human missions to Mars, proving oxygen generation and gathering the geological treasure for Mars Sample Return.',
      es: 'El precursor directo de las futuras misiones humanas a Marte, probando generación de oxígeno y recolectando el tesoro geológico para Mars Sample Return.',
    }
  },
  {
    id: 'hubble',
    name: {
      en: 'Hubble Space Telescope (HST)',
      es: 'Telescopio Espacial Hubble (HST)',
    },
    body: 'Earth Orbit (LEO)',
    bodyLabel: {
      en: 'Low Earth orbit (LEO)',
      es: 'Órbita terrestre baja (LEO)',
    },
    location: {
      en: 'Low Earth Orbit (540 km)',
      es: 'Órbita Terrestre Baja (540 km)',
    },
    coordinates: {
      en: 'Inclination 28.5°, Altitude 535 km',
      es: 'Inclinación 28,5°, altitud 535 km',
    },
    missionTime: {
      en: '1990 – Present (36+ Years Active)',
      es: '1990 – presente (36+ años activo)',
    },
    status: {
      en: 'Operational / Great Observatory',
      es: 'Operativo / Gran Observatorio',
    },
    statusType: 'green',
    modelUrl: '/models/hubble.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/hubble/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: {
      en: 'Telemetry Carrier & Orbital Radio Frequency',
      es: 'Portadora de telemetría y frecuencia de radio orbital',
    },
    diagnostics: {
      altitude: {
        en: '535 km (Low Earth Orbit)',
        es: '535 km (órbita terrestre baja)',
      },
      orbitalSpeed: '27,300 km/h (7.59 km/s)',
      pointingAccuracy: {
        en: '0.007 arcseconds (FGS Lock)',
        es: '0,007 arcosegundos (bloqueo FGS)',
      },
      primaryMirrorDiameter: {
        en: '2.4 metres (Ritchey-Chrétien)',
        es: '2,4 metros (Ritchey-Chrétien)',
      },
      observationsCount: {
        en: '1.6M+ exposures',
        es: '1,6+ millones de exposiciones',
      },
      spectralCoverage: {
        en: 'Ultraviolet, Visible, Near-Infrared',
        es: 'Ultravioleta, visible, infrarrojo cercano',
      }
    },
    engineeringBreakdown: [
      {
        title: {
          en: '2.4 m Primary Mirror and COSTAR Optics',
          es: 'Espejo Primario de 2,4 m y Óptica COSTAR',
        },
        specs: {
          en: 'Corning ULE glass + aluminium/MgF₂ coating',
          es: 'Vidrio ULE de Corning + recubrimiento de aluminio/MgF₂',
        },
        desc: {
          en: 'After launch in 1990 with a 2-micrometre spherical aberration at the mirror\'s edge, the STS-61 mission in 1993 installed the COSTAR corrective module, giving Hubble the sharpest view of the cosmos ever achieved.',
          es: 'Tras el lanzamiento en 1990 con una aberración esférica de 2 micrómetros en el borde del espejo, la misión STS-61 en 1993 instaló el módulo correctivo COSTAR, otorgándole la visión más nítida del cosmos jamás lograda.',
        },
      },
      {
        title: {
          en: 'Fine Guidance Sensors (FGS) and Gyroscopes',
          es: 'Sensores de Guía Fina (FGS) y Giroscopios',
        },
        specs: {
          en: '3 interferometric FGS + 6 gyroscopes',
          es: '3 FGS interferométricos + 6 giroscopios',
        },
        desc: {
          en: 'They lock onto an astronomical target with a precision of seven thousandths of an arcsecond: the equivalent of holding a laser pointer on a dime 320 kilometres away.',
          es: 'Permiten fijar un objetivo astronómico con una precisión de 7 milésimas de segundo de arco: el equivalente a mantener un puntero láser sobre una moneda de 10 centavos a 320 kilómetros de distancia.',
        },
      },
      {
        title: {
          en: 'Wide Field Camera 3 (WFC3)',
          es: 'Cámara de Gran Campo 3 (WFC3)',
        },
        specs: {
          en: 'UVIS and near-infrared detectors',
          es: 'Detectores UVIS y de infrarrojo cercano',
        },
        desc: {
          en: 'Installed by astronauts on the STS-125 mission (2009). It captures multispectral images that reveal galaxies more than 13 billion light-years away.',
          es: 'Instalada por astronautas en la misión STS-125 (2009). Captura imágenes multiespectrales que revelan galaxias a más de 13.000 millones de años luz de distancia.',
        },
      }
    ],
    theStory: {
      en: 'Launched on 24 April 1990 aboard the space shuttle Discovery (STS-31), the Hubble Space Telescope transformed astronomy. It rose above the distorting turbulence of Earth\'s atmosphere and was designed to be repaired and upgraded in orbit by astronauts across five epic shuttle servicing missions.',
      es: 'Lanzado el 24 de abril de 1990 a bordo del transbordador espacial Discovery (STS-31), el Telescopio Espacial Hubble transformó la astronomía. Superó la turbulencia distorsionadora de la atmósfera terrestre y fue diseñado para ser reparado y mejorado en órbita por astronautas durante 5 épicas misiones de servicio del Transbordador.',
    },
    legacy: {
      en: 'It determined the accelerated expansion rate of the universe and its age (13.8 billion years), discovered that nearly every galaxy hosts a supermassive black hole at its centre, and captured the first atmospheric data from distant exoplanets.',
      es: 'Determinó la tasa de expansión acelerada del universo y su edad (13.800 millones de años), descubrió que casi toda galaxia alberga un agujero negro supermasivo en su centro, y capturó los primeros datos atmosféricos de exoplanetas lejanos.',
    }
  },
  {
    id: 'jwst',
    name: {
      en: 'James Webb Space Telescope (JWST)',
      es: 'Telescopio Espacial James Webb (JWST)',
    },
    body: 'Lagrange Point L2',
    bodyLabel: {
      en: 'Lagrange point L2',
      es: 'Punto de Lagrange L2',
    },
    location: {
      en: 'Sun–Earth L2 Halo Orbit (1.5M km)',
      es: 'Órbita de Halo L2 Sol-Tierra (1,5 M km)',
    },
    coordinates: {
      en: 'L2 point, 1,500,000 km anti-sunward',
      es: 'Punto L2, 1.500.000 km antisolar',
    },
    missionTime: {
      en: '2021 – Present (Operational)',
      es: '2021 – presente (en operación)',
    },
    status: {
      en: 'Operational / Flagship Observatory',
      es: 'Operativo / Observatorio insignia',
    },
    statusType: 'green',
    isProceduralWebb: true,
    modelUrl: '/models/jwst.glb',
    officialNasaUrl: 'https://science.nasa.gov/mission/webb/',
    audioSample: '/audio/space_ambient.mp3',
    audioTitle: {
      en: 'Deep Space Infrared Telemetry Carrier',
      es: 'Portadora de telemetría infrarroja de espacio profundo',
    },
    diagnostics: {
      altitude: {
        en: '1,500,000 km (L2 Lagrange Point)',
        es: '1.500.000 km (punto de Lagrange L2)',
      },
      operatingTemp: {
        en: '-233 °C (Cold Instruments) / +85 °C (Sun-facing Side)',
        es: '-233 °C (instrumentos fríos) / +85 °C (lado solar)',
      },
      pointingAccuracy: {
        en: '0.001 arcseconds (FGS Sub-pixel Lock)',
        es: '0,001 arcosegundos (bloqueo subpíxel FGS)',
      },
      primaryMirrorDiameter: {
        en: '6.5 metres (18 hexagonal beryllium-gold segments)',
        es: '6,5 metros (18 segmentos hexagonales de berilio bañado en oro)',
      },
      sunshieldDimensions: {
        en: '21.2 m × 14.2 m (5 Kapton layers)',
        es: '21,2 m × 14,2 m (5 capas de Kapton)',
      },
      spectralCoverage: {
        en: '0.6 to 28 micrometres (Near- and Mid-Infrared)',
        es: '0,6 a 28 micrómetros (infrarrojo cercano y medio)',
      }
    },
    engineeringBreakdown: [
      {
        title: {
          en: '6.5 m Gold-Coated Primary Mirror',
          es: 'Espejo Primario Dorado de 6,5 m',
        },
        specs: {
          en: '18 hexagonal beryllium segments plated in gold',
          es: '18 segmentos hexagonales de berilio bañados en oro',
        },
        desc: {
          en: 'The 18 segments deploy and align using 132 electromechanical micro-actuators with nanometre precision to form a perfect optical collecting surface.',
          es: 'Los 18 segmentos se despliegan y alinean mediante 132 microactuadores electromecánicos de precisión nanométrica para formar una superficie colectora óptica perfecta.',
        },
      },
      {
        title: {
          en: 'Five-Layer Thermal Sunshield (Kapton)',
          es: 'Parasol Térmico de 5 Capas (Kapton)',
        },
        specs: {
          en: '21 m × 14 m with aluminium and doped-silicon coatings',
          es: '21 m × 14 m con recubrimientos de aluminio y silicio dopado',
        },
        desc: {
          en: 'It attenuates more than a millionfold the heat and light coming from the Sun, Earth and Moon, making it possible to detect the faint infrared radiation of primordial galaxies.',
          es: 'Atenúa más de 1 millón de veces el calor y la luz provenientes del Sol, la Tierra y la Luna, permitiendo detectar la tenue radiación infrarroja de galaxias primitivas.',
        },
      },
      {
        title: {
          en: 'NIRCam, NIRSpec and MIRI Instruments',
          es: 'Instrumentos NIRCam, NIRSpec y MIRI',
        },
        specs: {
          en: 'Cryogenically cooled infrared detectors',
          es: 'Detectores infrarrojos refrigerados criogénicamente',
        },
        desc: {
          en: 'They can pierce dense clouds of interstellar dust to observe stars being born and break down the chemical fingerprints of exoplanet atmospheres.',
          es: 'Permiten atravesar las densas nubes de polvo interestelar para observar el nacimiento de estrellas y desglosar la huella química de atmósferas de exoplanetas.',
        },
      }
    ],
    theStory: {
      en: 'Launched on 25 December 2021 from Kourou on an Ariane 5 rocket, the James Webb telescope executed the most complex and risky autonomous deployment sequence in spaceflight history, with more than 300 single points of failure. It now operates 1.5 million km from Earth at the L2 point, revealing the deepest corners of the cosmos.',
      es: 'Lanzado el 25 de diciembre de 2021 desde Kourou en un cohete Ariane 5, el telescopio James Webb ejecutó la secuencia de despliegue autónomo más compleja y arriesgada de la historia espacial, con más de 300 puntos de falla única. Hoy opera a 1,5 millones de km de la Tierra en el punto L2 revelando los rincones más profundos del cosmos.',
    },
    legacy: {
      en: 'It discovered bright galaxies just 300 million years after the Big Bang, challenging earlier cosmological models, detected water vapour and carbon dioxide in exoplanets, and photographed stellar nurseries with unprecedented infrared sharpness.',
      es: 'Descubrió galaxias brillantes a solo 300 millones de años del Big Bang desafiando modelos cosmológicos previos, detectó vapor de agua y dióxido de carbono en exoplanetas, y fotografió guarderías estelares con una nitidez infrarroja sin precedentes.',
    }
  }
];

export const getArtifacts = (lang = 'en') => localize(ARTIFACTS, lang);
