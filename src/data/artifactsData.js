export const ARTIFACTS = [
  {
    id: 'ingenuity',
    name: 'Ingenuity Mars Helicopter',
    body: 'Mars',
    location: 'Neretva Vallis, Jezero Crater',
    coordinates: '18.444° N, 77.451° E',
    missionTime: '2021 – 2024 (1,004 Sols)',
    status: 'Grounded / Stationary Sensor',
    statusType: 'warning', // green, warning, offline
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Fallback or official local /models/ingenuity.glb
    officialNasaUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-helicopter/',
    audioSample: '/audio/mars_wind.mp3',
    audioTitle: 'Perseverance Audio Feed: Jezero Winds',
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
        desc: 'El aire en Marte es tan tenue como a 30 km de altitud en la Tierra. Para generar sustentación, dos juegos de aspas giran en sentidos opuestos 5 veces más rápido que un helicóptero terrestre comercial.',
      },
      {
        title: 'Navegación Óptica Autónoma',
        specs: 'Sensor Visual + IMU | 30 FPS',
        desc: 'Debido al retraso de la señal Tierra-Marte (hasta 20 minutos), el control manual era imposible. Ingenuity tomaba 30 fotos por segundo del terreno para calcular velocidad y posición en tiempo real.',
      },
      {
        title: 'Arquitectura Ultra-Ligera',
        specs: '1.8 kg masa total | Baterías Li-ion',
        desc: 'Equipado con un procesador Qualcomm Snapdragon 801 (similar a un teléfono), antenas de radio y aislamiento de aerogel para no congelarse en las noches marcianas de -90°C.',
      }
    ],
    theStory: 'Diseñado como una prueba tecnológica de solo 5 vuelos de 30 segundos, Ingenuity rompió todas las expectativas completando 72 vuelos y cubriendo 17 kilómetros a través de dunas y cañones marcianos.',
    legacy: 'Demostró que el vuelo aéreo propulsado es posible en otros mundos, sentando las bases para futuras flotas de drones exploradores en Marte y Titán.'
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
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', // Fallback or /models/opportunity.glb
    officialNasaUrl: 'https://science.nasa.gov/mission/mer-opportunity/',
    audioSample: '/audio/oppy_last_transmission.mp3',
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
        desc: 'Su misión estaba garantizada para 90 días, pero duró 14 años gracias a remolinos de viento marciano ("dust devils") que limpiaban la suciedad acumulada sobre los paneles en un fenómeno que los ingenieros llamaron "eventos de limpieza".',
      },
      {
        title: 'Sistema de Suspensión Rocker-Bogie',
        specs: '6 ruedas motrices | Articulación pasiva',
        desc: 'Permite superar obstáculos del doble del diámetro de sus ruedas sin volcarse, distribuyendo el peso uniformemente sobre rocas afiladas de regolito marciano.',
      },
      {
        title: 'Calentadores de Radioisótopos (RHU)',
        specs: 'Pastillas de Dióxido de Plutonio',
        desc: 'Generaban calor constante mediante decaimiento radiactivo para evitar que la electrónica interna se resquebrajara durante las gélidas noches de invierno marciano.',
      }
    ],
    theStory: 'En junio de 2018, una descomunal tormenta global de polvo cubrió todo el planeta rojo, bloqueando el 99% de la radiación solar. Oppy transmitió su último paquete de datos de bajo voltaje antes de entrar en un sueño eterno.',
    legacy: 'Descubrió los primeros hematitas en forma de "arándanos" (blueberries), la evidencia definitiva de que Marte albergó lagos de agua líquida neutra en su pasado geológico.'
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
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Fallback or /models/lem.glb
    officialNasaUrl: 'https://history.nasa.gov/alsj/a11/a11.html',
    audioSample: '/audio/eagle_landed.mp3',
    audioTitle: 'Armstrong: "Houston, Tranquility Base here."',
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
    theStory: 'Cuando Neil Armstrong y Buzz Aldrin despegaron de regreso a la Tierra, la mitad superior del módulo se impulsó usando la etapa de descenso como plataforma fija. La base quedó allí, junto con una placa que reza: "Vinimos en son de paz por toda la humanidad".',
    legacy: 'La primera instalación tecnológica de nuestra especie en otro cuerpo celeste y el inicio de la era de exploración interplanetaria.'
  },
  {
    id: 'lrv',
    name: 'Lunar Roving Vehicle (LRV - Moon Buggy)',
    body: 'Moon',
    location: 'Taurus-Littrow Valley (Apollo 17)',
    coordinates: '20.1908° N, 30.7717° E',
    missionTime: 'December 11 – 14, 1972',
    status: 'Parked in Vacuum',
    statusType: 'green',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', // Fallback or /models/lrv.glb
    officialNasaUrl: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html',
    audioSample: '/audio/cernan_lrv.mp3',
    audioTitle: 'Gene Cernan driving LRV on Apollo 17',
    diagnostics: {
      powerLevel: 'Silver-Zinc Batteries Depleted',
      temperature: 'Thermal cycles (-160°C to +110°C)',
      mileage: '35.74 km total recorridos',
      tiresCondition: 'Titanium-Chevron Mesh intact',
      vacuumPreservation: 'Zero Oxidation / No Rust',
    },
    engineeringBreakdown: [
      {
        title: 'Ruedas de Malla de Acero y Titanio',
        specs: 'Diámetro 81 cm | Sin cámara de aire',
        desc: 'Un neumático de caucho convencional se habría endurecido hasta quebrarse por el frío o explotado en el vacío. Se tejieron hilos de acero zincado con huellas de titanio en espiga para tracción en polvo ultra fino.',
      },
      {
        title: 'Tracción 4x4 Eléctrica Integrada',
        specs: '4 motores Delco de 0.25 HP (180 W)',
        desc: 'Cada rueda tenía su propio motor eléctrico sellado con reducción armónica de 80:1. Si uno fallaba, el vehículo podía continuar operando con las ruedas restantes.',
      },
      {
        title: 'Palanca de Control en T (Joystick)',
        specs: 'Control de aceleración, freno y giro en 1 mano',
        desc: 'Con trajes espaciales presurizados y guantes rígidos, girar un volante tradicional era casi imposible. Los astronautas conducían usando un joystick central manipulable por cualquiera de los dos tripulantes.',
      }
    ],
    theStory: 'Plegado ingeniosamente en un compartimiento exterior del tamaño de una maleta en el módulo lunar, el LRV se desplegaba con cuerdas y poleas en menos de 15 minutos una vez en la Luna.',
    legacy: 'Multiplicó por diez el alcance geológico de las misiones Apolo, permitiendo recolectar 110 kg de muestras que cambiaron la comprensión del origen del sistema Tierra-Luna.'
  }
];
