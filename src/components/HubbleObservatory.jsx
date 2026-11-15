import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Crosshair, Camera, Compass, Award, X, Sparkles, CheckCircle2, 
  ChevronRight, RotateCcw, Eye, Info, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Layers,
  ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { getAssetPath } from '../utils/assets';
import SciFiButton from './ui/SciFiButton';
import SciFiLoader from './ui/SciFiLoader';

const OBSERVATION_TARGETS = [
  {
    id: 'pillars',
    name: 'Pilares de la Creación (M16)',
    objectType: 'Nebulosa de Emisión / Guardería Estelar',
    constellation: 'Serpens (Serpiente)',
    distance: '6,500 años luz',
    coordinates: { ra: '18h 18m 48s', dec: '-13° 49′ 00″' },
    targetOffset: { x: -35, y: -25 }, // Relative positioning in telescope arc
    image: '/textures/hubble/pillars.jpg',
    filter: 'F656N (H-Alpha) + F502N ([O III])',
    summary: 'Colosales chimeneas de gas hidrógeno molecular y polvo cósmico esculpidas por la intensa radiación ultravioleta de estrellas masivas recién nacidas.',
    discoveryText: 'Hubble demostró que dentro de estos densos "glóbulos gaseosos en evaporación" (EGGs) están naciendo sistemas estelares enteros con planetas embrionarios.',
    year: '1995 & 2014'
  },
  {
    id: 'deep_field',
    name: 'Campo Ultra Profundo (HUDF)',
    objectType: 'Cosmología Profunda / Galaxias Primitivas',
    constellation: 'Fornax (El Horno)',
    distance: 'Hasta 13,000 millones de años luz',
    coordinates: { ra: '03h 32m 39s', dec: '-27° 47′ 29″' },
    targetOffset: { x: 42, y: 32 },
    image: '/textures/hubble/deep_field.jpg',
    filter: 'ACS/WFC + WFC3/IR (Multi-banda)',
    summary: 'Mirando hacia un diminuto parche del cielo que parecía completamente negro y desierto, Hubble acumuló fotones durante 11 días seguidos.',
    discoveryText: 'Reveló casi 10,000 galaxias en todas las etapas de evolución, muchas de ellas existiendo cuando el universo tenía apenas unos cientos de millones de años.',
    year: '2004 – 2014'
  },
  {
    id: 'catseye',
    name: 'Nebulosa del Ojo de Gato (NGC 6543)',
    objectType: 'Nebulosa Planetaria Compleja',
    constellation: 'Draco (El Dragón)',
    distance: '3,300 años luz',
    coordinates: { ra: '17h 58m 33s', dec: '+66° 37′ 59″' },
    targetOffset: { x: -48, y: 35 },
    image: '/textures/hubble/catseye.jpg',
    filter: 'WFC3 UVIS Narrowband',
    summary: 'El sudario brillante y concéntrico expulsado por una estrella agonizante similar a nuestro Sol en sus etapas finales de vida.',
    discoveryText: 'Mostró una intrincada serie de burbujas, chorros y anillos concéntricos expulsados cada 1,500 años, revelando por primera vez la muerte caótica de estrellas solares.',
    year: '1994 – 2004'
  },
  {
    id: 'sombrero',
    name: 'Galaxia del Sombrero (M104)',
    objectType: 'Galaxia Espiral No Barrada',
    constellation: 'Virgo (La Virgen)',
    distance: '29.3 millones de años luz',
    coordinates: { ra: '12h 39m 59s', dec: '-11° 37′ 23″' },
    targetOffset: { x: 50, y: -30 },
    image: '/textures/hubble/sombrero.jpg',
    filter: 'ACS/WFC Visible Spectrum',
    summary: 'Famosa por su brillante bulbo central blanco y una densa y simétrica banda de polvo interestelar que la hace parecer un sombrero mexicano.',
    discoveryText: 'La espectroscopía de alta resolución del Hubble demostró que en su corazón reside un monstruoso agujero negro supermasivo de 1,000 millones de masas solares.',
    year: '2003'
  },
  {
    id: 'orion',
    name: 'Gran Nebulosa de Orión (M42)',
    objectType: 'Región H II / Guardería Protoplanetaria',
    constellation: 'Orión (El Cazador)',
    distance: '1,344 años luz',
    coordinates: { ra: '05h 35m 17s', dec: '-05° 23′ 28″' },
    targetOffset: { x: -20, y: 45 },
    image: '/textures/hubble/orion.jpg',
    filter: 'ACS + WFPC2 Mosaico 18,000 px',
    summary: 'La fábrica de estrellas masivas más cercana a la Tierra, visible incluso a simple vista en la espada de Orión.',
    discoveryText: 'Hubble fotografió por primera vez discos protoplanetarios ("proplyds"): discos de polvo y gas girando alrededor de estrellas recién nacidas donde nacen nuevos planetas.',
    year: '2006'
  },
  {
    id: 'antennae',
    name: 'Galaxias de las Antenas (NGC 4038/4039)',
    objectType: 'Colisión Galáctica en Curso',
    constellation: 'Corvus (El Cuervo)',
    distance: '62 millones de años luz',
    coordinates: { ra: '12h 01m 53s', dec: '-18° 52′ 10″' },
    targetOffset: { x: 30, y: -45 },
    image: '/textures/hubble/antennae.jpg',
    filter: 'WFC3 Multi-wavelength',
    summary: 'Dos majestuosas galaxias espirales chocando de frente, arrancándose gigantescas colas de estrellas y gas por atracción gravitacional.',
    discoveryText: 'Hubble descubrió miles de supercúmulos estelares jóvenes naciendo en las zonas de compresión de gas, un presagio de la futura colisión entre la Vía Láctea y Andrómeda.',
    year: '1997 & 2010'
  },
  {
    id: 'andromeda',
    name: 'Galaxia de Andrómeda (M31)',
    objectType: 'Galaxia Espiral Gigante',
    constellation: 'Andrómeda',
    distance: '2.537 millones de años luz',
    coordinates: { ra: '00h 42m 44s', dec: '+41° 16′ 09″' },
    targetOffset: { x: -28, y: -48 },
    image: '/textures/hubble/andromeda.jpg',
    filter: 'ACS + WFC3 Mosaico PHAT (100M estrellas)',
    summary: 'La galaxia espiral más grande de nuestro Grupo Local. Contiene aproximadamente un billón de estrellas y se acerca a la Vía Láctea a 110 km/s.',
    discoveryText: 'El censo estelar de Hubble resolvió más de 100 millones de estrellas individuales en su disco, revelando la historia de fusiones galácticas en el universo local.',
    year: '2015'
  },
  {
    id: 'crab',
    name: 'Nebulosa del Cangrejo (M1)',
    objectType: 'Remanente de Supernova con Púlsar',
    constellation: 'Taurus (Tauro)',
    distance: '6,500 años luz',
    coordinates: { ra: '05h 34m 31s', dec: '+22° 00′ 52″' },
    targetOffset: { x: 45, y: -15 },
    image: '/textures/hubble/crab.jpg',
    filter: 'WFPC2 F658N [N II] + F673N [S II]',
    summary: 'El remanente expansivo de una supernova registrada por astrónomos chinos y árabes en el año 1054 d.C.',
    discoveryText: 'Hubble captó las ondas de choque relativistas y filamentos magnéticos emanando del púlsar central que gira a 30 revoluciones por segundo.',
    year: '1996 & 2005'
  },
  {
    id: 'horsehead',
    name: 'Nebulosa Cabeza de Caballo (Barnard 33)',
    objectType: 'Nebulosa Oscura de Absorción',
    constellation: 'Orión (El Cazador)',
    distance: '1,375 años luz',
    coordinates: { ra: '05h 40m 59s', dec: '-02° 27′ 30″' },
    targetOffset: { x: -55, y: -10 },
    image: '/textures/hubble/horsehead.jpg',
    filter: 'WFC3 Infrarrojo Cercano (F110W / F160W)',
    summary: 'Una densa columna de polvo interestelar oscuro con forma de equino emergiendo contra una cortina resplandeciente de gas hidrógeno.',
    discoveryText: 'La visión infrarroja de Hubble penetró el polvo opaco revelando estructuras etéreas y estrellas embrionarias naciendo en su interior.',
    year: '2013'
  },
  {
    id: 'whirlpool',
    name: 'Galaxia del Remolino (M51)',
    objectType: 'Galaxia Espiral Gran Diseño con Compañera',
    constellation: 'Canes Venatici (Perros de Caza)',
    distance: '23 millones de años luz',
    coordinates: { ra: '13h 29m 52s', dec: '+47° 11′ 43″' },
    targetOffset: { x: 22, y: 52 },
    image: '/textures/hubble/whirlpool.jpg',
    filter: 'ACS/WFC Banda Ancha Multicolor',
    summary: 'El arquetipo de galaxia espiral con brazos majestuosos cargados de cúmulos estelares azules y nebulosas de emisión rosadas.',
    discoveryText: 'Demostró cómo la interacción de marea con su galaxia enana compañera (NGC 5195) comprime el gas y dispara una ola masiva de nacimiento de estrellas.',
    year: '2005'
  },
  {
    id: 'ring',
    name: 'Nebulosa del Anillo (M57)',
    objectType: 'Nebulosa Planetaria Bipolar',
    constellation: 'Lyra (La Lira)',
    distance: '2,570 años luz',
    coordinates: { ra: '18h 53m 35s', dec: '+33° 01′ 45″' },
    targetOffset: { x: -15, y: -55 },
    image: '/textures/hubble/ring_nebula.jpg',
    filter: 'WFC3/UVIS F502N + F658N',
    summary: 'Un cilindro elíptico de gas ionizado visto casi a lo largo de su eje, asemejando una rosquilla brillante flotando en el espacio.',
    discoveryText: 'La resolución angular del Hubble cartografió la enana blanca central ultracaliente (120,000 K) y miles de nódulos gaseosos densos que desafían la evaporación estelar.',
    year: '2013'
  },
  {
    id: 'jupiter',
    name: 'Júpiter y la Gran Mancha Roja',
    objectType: 'Dinámica Atmosférica Planetaria',
    constellation: 'Sistema Solar Exterior',
    distance: '628 millones de km (4.2 AU)',
    coordinates: { ra: 'Coordenadas Heliocéntricas', dec: 'Eclíptica' },
    targetOffset: { x: 55, y: 15 },
    image: '/textures/hubble/jupiter_hst.jpg',
    filter: 'WFC3/UVIS Programa OPAL (400-900 nm)',
    summary: 'El vórtice anticiclónico más colosal del sistema solar: una tormenta de más de 16,000 km de ancho donde cabría el planeta Tierra entero.',
    discoveryText: 'Las observaciones anuales continuas de Hubble descubrieron que la Gran Mancha Roja se está contrayendo y volviéndose más circular, mientras sus vientos internos se aceleran.',
    year: '2019 – 2024'
  }
];

export const WEBB_OBSERVATION_TARGETS = [
  {
    id: 'webb_carina',
    name: 'Nebulosa de Carina (Acantilados Cósmicos)',
    objectType: 'Guardería Estelar / Región H II',
    constellation: 'Carina (La Quilla)',
    distance: '7,600 años luz',
    coordinates: { ra: '10h 45m 08s', dec: '-59° 52′ 04″' },
    targetOffset: { x: -38, y: -28 },
    image: 'https://images-assets.nasa.gov/image/PIA23768/PIA23768~large.jpg',
    filter: 'NIRCam F090W / F187N / F200W',
    summary: 'Los colosales "Acantilados Cósmicos": un paisaje tridimensional de gas brillante y polvo interestelar esculpido por la feroz radiación ultravioleta de estrellas jóvenes en formación.',
    discoveryText: 'La penetrante visión infrarroja de Webb reveló por primera vez cientos de protoestrellas completamente ocultas detrás del denso polvo que el Hubble no podía ver.',
    importance: 'Permite estudiar cómo la radiación de estrellas masivas transforma una nube molecular en embriones planetarios.',
    year: '2022'
  },
  {
    id: 'webb_deep_field',
    name: 'Primer Campo Profundo (SMACS 0723)',
    objectType: 'Lente Gravitacional / Galaxias Primitivas',
    constellation: 'Volans (El Pez Volador)',
    distance: 'Más de 13,000 millones de años luz',
    coordinates: { ra: '07h 23m 19s', dec: '-73° 27′ 15″' },
    targetOffset: { x: 42, y: 35 },
    image: 'https://images-assets.nasa.gov/image/PIA24921/PIA24921~large.jpg',
    filter: 'NIRCam Mosaico 12.5 Horas (0.9 – 4.4 µm)',
    summary: 'La imagen infrarroja más profunda y nítida jamás tomada del universo distante, cubriendo una porción de cielo equivalente a sostener un grano de arena con el brazo extendido.',
    discoveryText: 'La masa colosal del cúmulo SMACS 0723 actuó como una lupa cósmica, magnificando y curvando la luz de galaxias que existían cuando el universo tenía menos de mil millones de años.',
    importance: 'Muestra galaxias muy jóvenes y primitivas, cercanas al mismísimo comienzo de la historia del universo.',
    year: '2022'
  },
  {
    id: 'webb_exoplanet',
    name: 'Atmósfera de WASP-96b (Espectroscopia)',
    objectType: 'Exoplaneta Gigante Gaseoso Caliente',
    constellation: 'Phoenix (El Fénix)',
    distance: '1,150 años luz',
    coordinates: { ra: '00h 04m 11s', dec: '-47° 21′ 38″' },
    targetOffset: { x: 30, y: -45 },
    image: 'https://images-assets.nasa.gov/image/PIA23405/PIA23405~large.jpg',
    filter: 'NIRISS Espectroscopia de Tránsito (0.6 – 2.8 µm)',
    summary: 'Un gigante de gas caliente que orbita muy cerca de su estrella anfitriona cada 3.4 días terrestres.',
    discoveryText: 'Webb detectó la huella química inequívoca de moléculas de vapor de agua, neblinas y nubes en su atmósfera, marcando un hito en la caracterización de mundos alienígenas.',
    importance: 'La espectroscopia de transmisión infrarroja demuestra que podemos analizar agua, metano y biofirmas en otros mundos.',
    year: '2022'
  },
  {
    id: 'webb_pillars',
    name: 'Pilares de la Creación (Infrarrojo NIRCam)',
    objectType: 'Guardería Estelar en Nebulosa del Águila',
    constellation: 'Serpens (Serpiente)',
    distance: '6,500 años luz',
    coordinates: { ra: '18h 18m 48s', dec: '-13° 49′ 00″' },
    targetOffset: { x: -25, y: 40 },
    image: 'https://images-assets.nasa.gov/image/PIA21454/PIA21454~large.jpg',
    filter: 'NIRCam F187N + F200W + F444W',
    summary: 'Las legendarias columnas de gas y polvo vistas en longitudes de onda infrarrojas, donde el polvo se vuelve semitransparente.',
    discoveryText: 'Destacó esferas de color rojo intenso que corresponden a glóbulos de gas colapsando por gravedad donde están naciendo estrellas con apenas unos cientos de miles de años.',
    importance: 'Son laboratorios cósmicos naturales para observar el nacimiento de nuevas estrellas sin la opacidad del polvo.',
    year: '2022'
  },
  {
    id: 'webb_southern_ring',
    name: 'Nebulosa del Anillo del Sur (NGC 3132)',
    objectType: 'Nebulosa Planetaria Doble Estrella',
    constellation: 'Vela (Las Velas)',
    distance: '2,500 años luz',
    coordinates: { ra: '10h 07m 01s', dec: '-40° 26′ 11″' },
    targetOffset: { x: 15, y: -55 },
    image: 'https://images-assets.nasa.gov/image/PIA24568/PIA24568~large.jpg',
    filter: 'NIRCam + MIRI Infrarrojo Medio',
    summary: 'Capas concéntricas de gas y polvo expulsadas por una estrella moribunda a lo largo de miles de años.',
    discoveryText: 'El instrumento MIRI de Webb reveló por primera vez que la estrella central causante de la nebulosa está envuelta en polvo y tiene una compañera estelar cercana en una danza orbital caótica.',
    importance: 'Revela cómo evolucionan y mueren las estrellas similares al Sol al final de sus ciclos vitales.',
    year: '2022'
  },
  {
    id: 'webb_cartwheel',
    name: 'Galaxia Cartwheel (Rueda de Carro)',
    objectType: 'Galaxia de Anillo por Colisión',
    constellation: 'Sculptor (El Escultor)',
    distance: '500 millones de años luz',
    coordinates: { ra: '00h 37m 41s', dec: '-33° 42′ 58″' },
    targetOffset: { x: 50, y: -20 },
    image: 'https://images-assets.nasa.gov/image/PIA24917/PIA24917~large.jpg',
    filter: 'NIRCam / MIRI Compuesto Infrarrojo',
    summary: 'El resultado violento de una colisión frontal a alta velocidad entre una galaxia espiral gigante y otra menor, semejante a arrojar una piedra a un estanque.',
    discoveryText: 'Webb desveló rayos individuales dentro del anillo de formación estelar activa y demostró que la galaxia se encuentra en una fase altamente transitoria de reorganización.',
    importance: 'Su anillo en expansión permite estudiar cómo las ondas de choque activan olas gigantescas de formación estelar.',
    year: '2022'
  },
  {
    id: 'webb_stephans_quintet',
    name: 'Quinteto de Stephan (Grupo Compacto HCG 92)',
    objectType: 'Grupo Galáctico en Interacción Gravitacional',
    constellation: 'Pegasus (Pegaso)',
    distance: '290 millones de años luz',
    coordinates: { ra: '22h 35m 57s', dec: '+33° 57′ 36″' },
    targetOffset: { x: -48, y: 18 },
    image: 'https://images-assets.nasa.gov/image/PIA24914/PIA24914~large.jpg',
    filter: 'Mosaico NIRCam de 150 Millones de Píxeles',
    summary: 'Cinco galaxias agrupadas cercanamente, cuatro de las cuales están atrapadas en una dramática danza de choques gravitacionales.',
    discoveryText: 'Capturó gigantescas ondas de choque de gas provocadas por una galaxia penetrando el grupo a más de 800 km/s y observó la alimentación de un agujero negro supermasivo central.',
    importance: 'Muestra en tiempo real cómo la gravedad desgarra y reorganiza el gas y las estrellas durante las fusiones galácticas.',
    year: '2022'
  },
  {
    id: 'webb_tarantula',
    name: 'Nebulosa de la Tarántula (30 Doradus)',
    objectType: 'Superguardería Estelar Extragaláctica',
    constellation: 'Gran Nube de Magallanes',
    distance: '161,000 años luz',
    coordinates: { ra: '05h 38m 38s', dec: '-69° 05′ 38″' },
    targetOffset: { x: -20, y: -40 },
    image: 'https://images-assets.nasa.gov/image/PIA25110/PIA25110~large.jpg',
    filter: 'NIRCam Mosaico de Alta Resolución',
    summary: 'La región de formación estelar más grande y brillante de todo el Grupo Local de galaxias.',
    discoveryText: 'Desveló decenas de miles de estrellas jóvenes nunca antes vistas y miles de millones de años luz de galaxias distantes de fondo brillando a través del polvo.',
    importance: 'Contiene estrellas con composiciones químicas similares a las del cosmos temprano durante el "Mediodía Cósmico".',
    year: '2022'
  },
  {
    id: 'webb_phantom',
    name: 'Galaxia Fantasma (M74)',
    objectType: 'Espiral de Gran Diseño Infrarroja',
    constellation: 'Pisces (Piscis)',
    distance: '32 millones de años luz',
    coordinates: { ra: '01h 36m 41s', dec: '+15° 47′ 01″' },
    targetOffset: { x: 38, y: 45 },
    image: 'https://images-assets.nasa.gov/image/PIA24920/PIA24920~large.jpg',
    filter: 'MIRI Infrarrojo Medio (Polvo Cálido)',
    summary: 'Una galaxia espiral con brazos simétricos y majestuosos vistos de frente desde la Tierra.',
    discoveryText: 'MIRI cartografió filamentos delicados de polvo y gas que recorren los brazos espirales, emanando desde un núcleo estelar despejado.',
    importance: 'Permite comparar la estructura y distribución de gas de galaxias espirales frente a nuestra Vía Láctea.',
    year: '2022'
  },
  {
    id: 'webb_uranus',
    name: 'Urano y Sistema de Anillos Infrarrojo',
    objectType: 'Gigante Helado con Anillos Tenues',
    constellation: 'Sistema Solar Exterior',
    distance: '2,900 millones de km (19.2 AU)',
    coordinates: { ra: 'Coordenadas Heliocéntricas', dec: 'Eclíptica' },
    targetOffset: { x: -45, y: -18 },
    image: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~large.jpg',
    filter: 'NIRCam F140M / F300M (Infrarrojo)',
    summary: 'El enigmático planeta ladeado observado con una sensibilidad sin precedentes para anillos tenues.',
    discoveryText: 'Webb captó 11 de los 13 anillos del planeta, incluidos anillos de polvo extremadamente débiles que solo habían sido vistos por la nave Voyager 2 y el Observatorio Keck.',
    importance: 'El infrarrojo permite estudiar su atmósfera de metano profundo, tormentas estacionales y meteorología helada.',
    year: '2023'
  },
  {
    id: 'webb_neptune',
    name: 'Neptuno y sus Lunas en Infrarrojo',
    objectType: 'Gigante Helado y Anillos Brillantes',
    constellation: 'Sistema Solar Exterior',
    distance: '4,500 millones de km (30.1 AU)',
    coordinates: { ra: 'Coordenadas Heliocéntricas', dec: 'Eclíptica' },
    targetOffset: { x: 52, y: 12 },
    image: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~large.jpg',
    filter: 'NIRCam (0.6 – 5.0 µm)',
    summary: 'La primera mirada clara a los anillos de Neptuno en más de tres décadas desde el sobrevuelo de la Voyager 2.',
    discoveryText: 'Debido a que el gas metano absorbe con fuerza la luz roja e infrarroja, el planeta aparece brillante solo donde hay nubes altas de hielo de metano, revelando anillos espectaculares.',
    importance: 'Sus vórtices y vientos de 2,100 km/h ayudan a modelar la dinámica de atmósferas gigantescas en exoplanetas helados.',
    year: '2022'
  },
  {
    id: 'webb_jupiter',
    name: 'Júpiter Profundo y Auroras Infrarrojas',
    objectType: 'Planeta Gigante con Auroras Bipolares',
    constellation: 'Sistema Solar Exterior',
    distance: '640 millones de km (4.3 AU)',
    coordinates: { ra: 'Coordenadas Heliocéntricas', dec: 'Eclíptica' },
    targetOffset: { x: 18, y: 50 },
    image: 'https://images-assets.nasa.gov/image/PIA22946/PIA22946~large.jpg',
    filter: 'NIRCam Filtro Compuesto F360M / F212N',
    summary: 'Júpiter observado en infrarrojo mostrando gigantescas auroras luminosas en sus polos norte y sur.',
    discoveryText: 'Webb reveló tormentas gigantes, neblinas a gran altitud, los tenues anillos jovianos y dos pequeñas lunas (Amaltea y Adrastea) orbitando junto a los anillos.',
    importance: 'Sus tormentas masivas son el laboratorio clave para comprender cómo el calor interno interactúa con la alta atmósfera.',
    year: '2022'
  }
];

export default function HubbleObservatory({ initialTelescope = 'hubble', onClose, onUnlockDiscovery }) {
  const [activeTelescope, setActiveTelescope] = useState(initialTelescope);
  const [zoom, setZoom] = useState(1);
  const targetsList = useMemo(() => activeTelescope === 'jwst' ? WEBB_OBSERVATION_TARGETS : OBSERVATION_TARGETS, [activeTelescope]);
  const [selectedTargetId, setSelectedTargetId] = useState(initialTelescope === 'jwst' ? 'webb_carina' : 'pillars');
  const [discoveredIds, setDiscoveredIds] = useState(['pillars', 'webb_carina']);
  const [telescopePos, setTelescopePos] = useState({ x: 0, y: 0 });
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [revealedTarget, setRevealedTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('viewport'); // 'viewport' | 'targets'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync default target & zoom when switching telescopes
  useEffect(() => {
    setSelectedTargetId(activeTelescope === 'jwst' ? 'webb_carina' : 'pillars');
    setTelescopePos({ x: 0, y: 0 });
    setZoom(1);
  }, [activeTelescope]);

  // Audio Context ref for synthesized SFX (servos, lock ping, camera shutter)
  const audioCtxRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const activeTarget = useMemo(
    () => targetsList.find(t => t.id === selectedTargetId) || targetsList[0],
    [targetsList, selectedTargetId]
  );

  // Calculate distance between telescope reticle and target coordinates
  const distanceToTarget = useMemo(() => {
    const dx = telescopePos.x - activeTarget.targetOffset.x;
    const dy = telescopePos.y - activeTarget.targetOffset.y;
    return Math.hypot(dx, dy);
  }, [telescopePos, activeTarget]);

  // Alignment percentage: 100% when right on target, 0% when far
  const alignmentPercent = useMemo(() => {
    const maxDist = 75;
    const score = Math.max(0, Math.min(100, Math.round(100 - (distanceToTarget / maxDist) * 100)));
    return score;
  }, [distanceToTarget]);

  const isLockAcquired = alignmentPercent >= 93;

  // Web Audio Synth for authentic Space Telescope telemetry sounds
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'gyro') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 20, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'lock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'shutter') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Audio autoplay gracefully handled
    }
  };

  // Sound cue on lock acquisition
  const wasLockedRef = useRef(false);
  useEffect(() => {
    if (isLockAcquired && !wasLockedRef.current) {
      playSound('lock');
    }
    wasLockedRef.current = isLockAcquired;
  }, [isLockAcquired]);

  // Keyboard navigation for telescope pointing (W/A/S/D or Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (revealedTarget || isCapturing) return;
      const step = e.shiftKey ? 4 : 1.5;
      let moved = false;

      setTelescopePos(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          newY = Math.max(-65, prev.y - step);
          moved = true;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          newY = Math.min(65, prev.y + step);
          moved = true;
        }
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          newX = Math.max(-65, prev.x - step);
          moved = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          newX = Math.min(65, prev.x + step);
          moved = true;
        }

        return { x: newX, y: newY };
      });

      if (moved) playSound('gyro');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealedTarget, isCapturing]);

  // Touch and Mouse Drag to Pan Telescope Reticle
  const handlePointerDown = (e) => {
    if (revealedTarget || isCapturing) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: telescopePos.x,
      initialY: telescopePos.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || revealedTarget || isCapturing) return;
    const dx = (e.clientX - dragStartRef.current.x) * 0.18;
    const dy = (e.clientY - dragStartRef.current.y) * 0.18;

    const newX = Math.max(-65, Math.min(65, dragStartRef.current.initialX - dx));
    const newY = Math.max(-65, Math.min(65, dragStartRef.current.initialY - dy));

    setTelescopePos({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Direct Slew with D-Pad
  const slewTelescope = (dx, dy) => {
    playSound('gyro');
    setTelescopePos(prev => ({
      x: Math.max(-65, Math.min(65, prev.x + dx)),
      y: Math.max(-65, Math.min(65, prev.y + dy))
    }));
  };

  // Auto-calibrar / Slew to current target
  const handleAutoAlign = () => {
    playSound('gyro');
    setTelescopePos({
      x: activeTarget.targetOffset.x,
      y: activeTarget.targetOffset.y
    });
  };

  // Trigger scientific exposure
  const handleCaptureExposure = () => {
    if (!isLockAcquired || isCapturing) return;
    setIsCapturing(true);
    setCaptureProgress(0);
    playSound('shutter');

    let current = 0;
    const interval = setInterval(() => {
      current += 8;
      setCaptureProgress(Math.min(100, current));

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsCapturing(false);
          setRevealedTarget(activeTarget);
          if (!discoveredIds.includes(activeTarget.id)) {
            const next = [...discoveredIds, activeTarget.id];
            setDiscoveredIds(next);
            if (onUnlockDiscovery) onUnlockDiscovery(activeTarget.id);
          }
        }, 350);
      }
    }, 90);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 font-mono text-cyan-300 select-none overflow-hidden">
      
      {/* 1. TOP SCIENTIFIC HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/40 bg-black/90 px-3 py-2 sm:px-6 backdrop-blur-md">
        
        {/* Observatory Title & Active Telescope */}
        <div className="flex items-center space-x-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-none border shadow-md ${
            activeTelescope === 'jwst'
              ? 'border-amber-400 bg-amber-950/80 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
              : 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
          }`}>
            <Crosshair className={`h-4 w-4 animate-spin-slow ${activeTelescope === 'jwst' ? 'text-amber-300' : 'text-cyan-300'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-white">
                {activeTelescope === 'jwst' ? 'JAMES WEBB SPACE TELESCOPE' : 'HUBBLE SPACE TELESCOPE'}
              </span>
              <span className={`hidden sm:inline-block border px-1.5 py-0.5 text-[9px] font-bold ${
                activeTelescope === 'jwst'
                  ? 'border-amber-500/60 bg-amber-950/80 text-amber-300'
                  : 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300'
              }`}>
                {activeTelescope === 'jwst' ? 'L2 HALO LOCK: NOMINAL' : 'FGS LOCK: NOMINAL'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {activeTelescope === 'jwst'
                ? 'STScI MOC // PUNTO LAGRANGE L2 (1.5M KM) // SENSORES NIRCAM / MIRI'
                : 'STScI SOC // ÓRBITA LEO (535 KM) // SENSOR WFC3/ACS'}
            </div>
          </div>
        </div>

        {/* Telescope Switcher: HST vs JWST */}
        <div className="flex items-center space-x-1 border border-slate-700 bg-black/80 p-0.5">
          <button
            onClick={() => { setActiveTelescope('hubble'); setSelectedTargetId('pillars'); setZoom(1); }}
            className={`px-2 sm:px-3 py-1 text-[11px] font-bold transition-all flex items-center space-x-1 ${
              activeTelescope === 'hubble'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <span>🔭</span>
            <span className="hidden sm:inline">HUBBLE (HST)</span>
            <span className="sm:hidden">HST</span>
          </button>
          <button
            onClick={() => { setActiveTelescope('jwst'); setSelectedTargetId('webb_carina'); setZoom(1); }}
            className={`px-2 sm:px-3 py-1 text-[11px] font-bold transition-all flex items-center space-x-1 ${
              activeTelescope === 'jwst'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <span>🛰️</span>
            <span className="hidden sm:inline">JAMES WEBB (JWST)</span>
            <span className="sm:hidden">JWST</span>
          </button>
        </div>

        {/* Discovery Counter & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Badge discovery tally */}
          <div className="flex items-center space-x-1.5 border border-amber-500/50 bg-amber-950/30 px-2.5 py-1 text-xs">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-300 hidden sm:inline">Descubrimientos:</span>
            <span className="font-bold text-amber-300">
              {discoveredIds.filter(id => targetsList.some(t => t.id === id)).length}/{targetsList.length}
            </span>
          </div>

          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="border border-slate-700 bg-black/60 p-1.5 hover:border-cyan-400 text-slate-300 hover:text-white"
            title="Activar / Desactivar Sonido"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Close Observatory */}
          <button
            onClick={onClose}
            className="flex items-center space-x-1 border border-rose-500/60 bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-300 transition-all hover:bg-rose-900/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar Visor</span>
          </button>

        </div>

      </header>

      {/* 2. MOBILE TAB SELECTOR (Telescope Viewport vs Target Catalog) */}
      <div className="flex md:hidden border-b border-cyan-500/30 bg-black/70 text-xs">
        <button
          onClick={() => setActiveTab('viewport')}
          className={`flex-1 py-2 font-bold text-center border-b-2 transition-all ${
            activeTab === 'viewport' 
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40' 
              : 'border-transparent text-slate-400'
          }`}
        >
          🔭 Visor del Telescopio
        </button>
        <button
          onClick={() => setActiveTab('targets')}
          className={`flex-1 py-2 font-bold text-center border-b-2 transition-all ${
            activeTab === 'targets' 
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40' 
              : 'border-transparent text-slate-400'
          }`}
        >
          🎯 Catálogo de Misión ({discoveredIds.filter(id => targetsList.some(t => t.id === id)).length}/{targetsList.length})
        </button>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="relative flex flex-1 flex-col md:flex-row overflow-hidden">
        
        {/* LEFT / MAIN: TELESCOPE RETICLE & SKY VIEWPORT */}
        <div 
          className={`relative flex-1 flex flex-col items-center justify-center bg-black overflow-hidden select-none cursor-crosshair ${
            activeTab === 'targets' ? 'hidden md:flex' : 'flex'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={(e) => {
            e.preventDefault();
            setZoom(z => Math.max(1, Math.min(10, +(z - Math.sign(e.deltaY) * 0.5).toFixed(1))));
          }}
        >
          {/* Cosmic Starfield Background with Twinkle */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none">
            {/* Twinkling star field */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fde047_1.5px,transparent_1.5px)] [background-size:64px_64px]"></div>
          </div>

          {/* Faint Target Silhouette in Space (Relative to telescope offset + Zoom scale) */}
          <div 
            className="absolute pointer-events-none transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${(activeTarget.targetOffset.x - telescopePos.x) * 6}px, ${(activeTarget.targetOffset.y - telescopePos.y) * 6}px) scale(${1 + (zoom - 1) * 0.22})`
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer detection pulse */}
              <div className={`w-36 h-36 rounded-full border border-dashed transition-all duration-300 ${
                isLockAcquired 
                  ? (activeTelescope === 'jwst' ? 'border-amber-400 scale-105 animate-pulse' : 'border-cyan-400 scale-105 animate-pulse') 
                  : 'border-cyan-500/30'
              }`}></div>
              
              {/* Target Image Preview Silhouette with Dynamic Zoom Scale, Sharpness & Detail */}
              <div 
                className={`absolute rounded-full overflow-hidden border shadow-2xl transition-all duration-300 ease-out ${
                  activeTelescope === 'jwst' 
                    ? 'border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.4)]' 
                    : 'border-cyan-400/60 shadow-[0_0_25px_rgba(0,240,255,0.4)]'
                }`}
                style={{
                  width: `${96 + (zoom - 1) * 14}px`,
                  height: `${96 + (zoom - 1) * 14}px`,
                  opacity: Math.min(1, 0.45 + (zoom / 16)),
                  filter: isLockAcquired 
                    ? 'contrast(1.25) saturate(1.25)' 
                    : `blur(${Math.max(0, 2.5 - zoom * 0.35)}px) saturate(${0.75 + zoom * 0.05})`
                }}
              >
                <img 
                  src={activeTarget.image.startsWith('http') ? activeTarget.image : getAssetPath(activeTarget.image)} 
                  alt={activeTarget.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: `scale(${1 + (zoom - 1) * 0.06})` }}
                  onError={(e) => { e.currentTarget.src = getAssetPath('/textures/stars.jpg'); }}
                />
              </div>

              {/* Target Tag */}
              <div className="absolute -bottom-10 whitespace-nowrap bg-black/85 border border-cyan-500/50 px-2.5 py-0.5 text-[10px] text-cyan-300 shadow-md">
                [{activeTelescope === 'jwst' ? 'SEÑAL NIR' : 'SEÑAL FGS'}]: {activeTarget.name.toUpperCase()}
              </div>
            </div>
          </div>

          {/* TELESCOPE RETICLE OVERLAY (HUD Optical Targeting Glass) */}
          <div className="relative w-[min(380px,85vw)] h-[min(380px,85vw)] rounded-full border-2 border-cyan-500/40 pointer-events-none flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
            
            {/* Concentric Measurement Circles */}
            <div className="absolute inset-4 rounded-full border border-cyan-500/20 border-dashed"></div>
            <div className="absolute inset-16 rounded-full border border-cyan-500/30"></div>
            <div className="absolute inset-28 rounded-full border border-cyan-500/20"></div>

            {/* Crosshair Lines */}
            <div className="absolute w-full h-[1px] bg-cyan-500/40"></div>
            <div className="absolute h-full w-[1px] bg-cyan-500/40"></div>

            {/* Tick marks on axes */}
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] text-cyan-500/70 font-mono">
              <span>-60′</span>
              <span>-30′</span>
              <span>+30′</span>
              <span>+60′</span>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-2 text-[9px] text-cyan-500/70 font-mono">
              <span>+60″</span>
              <span>+30″</span>
              <span>-30″</span>
              <span>-60″</span>
            </div>

            {/* Central Precision Guidance Box */}
            <div className={`w-14 h-14 border transition-all duration-200 flex items-center justify-center ${
              isLockAcquired 
                ? (activeTelescope === 'jwst'
                    ? 'border-2 border-amber-400 bg-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-110'
                    : 'border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.8)] scale-110')
                : 'border-cyan-400/60 bg-cyan-950/20'
            }`}>
              <div className={`w-2 h-2 ${isLockAcquired ? (activeTelescope === 'jwst' ? 'bg-amber-300' : 'bg-emerald-300') : 'bg-cyan-400'} rounded-none`}></div>
            </div>

            {/* Live Reticle Status Readout */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-500/40 px-3 py-0.5 text-[10px] tracking-widest font-bold">
              {isLockAcquired ? (
                <span className={`${activeTelescope === 'jwst' ? 'text-amber-300' : 'text-emerald-400'} animate-pulse font-black`}>
                  ● GUIDANCE LOCK CONFIRMADO
                </span>
              ) : (
                <span className="text-slate-400">BUSCANDO SEÑAL ESTELAR...</span>
              )}
            </div>

          </div>

          {/* TELEMETRY READOUTS (Floating HUD corners) */}
          <div className="absolute top-3 left-3 bg-black/80 border border-slate-700 p-2 text-[10px] text-slate-300 pointer-events-none space-y-1">
            <div className="text-cyan-400 font-bold border-b border-slate-800 pb-0.5">TELEMETRÍA DE APUNTADO</div>
            <div>RA: <span className="text-white font-mono">{activeTarget.coordinates.ra}</span></div>
            <div>DEC: <span className="text-white font-mono">{activeTarget.coordinates.dec}</span></div>
            <div>CAMPO / ZOOM: <span className="text-emerald-400 font-mono">{zoom.toFixed(1)}x (FOV: {(2.4 / zoom).toFixed(2)}′)</span></div>
            <div>FILTRO ACTIVO: <span className="text-amber-300">{activeTarget.filter.split(' ')[0]}</span></div>
          </div>

          {/* ALIGNMENT METER (Top Right) */}
          <div className="absolute top-3 right-3 bg-black/85 border border-cyan-500/40 p-2.5 text-xs pointer-events-none w-44">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">ALINEACIÓN FGS:</span>
              <span className={`font-bold ${isLockAcquired ? (activeTelescope === 'jwst' ? 'text-amber-300' : 'text-emerald-400') : 'text-cyan-300'}`}>
                {alignmentPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-900 border border-slate-700 h-2.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-150 ${
                  isLockAcquired 
                    ? (activeTelescope === 'jwst' ? 'bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]')
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${alignmentPercent}%` }}
              ></div>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
              <span>Tolerancia: &lt;3%</span>
              <span className={isLockAcquired ? (activeTelescope === 'jwst' ? 'text-amber-300 font-bold' : 'text-emerald-400 font-bold') : 'text-slate-500'}>
                {isLockAcquired ? 'OBJETIVO EN MIRA' : 'FUERA DE EJE'}
              </span>
            </div>
          </div>

          {/* BOTTOM FLOATING CONTROLS: D-PAD, ZOOM SLIDER & CAPTURE BUTTON */}
          <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-end justify-between gap-2 pointer-events-auto">
            
            {/* 1. On-screen touch D-Pad for steering */}
            <div className="bg-black/90 border border-cyan-500/40 p-2 shadow-2xl backdrop-blur-md flex flex-col items-center">
              <div className="text-[9px] text-slate-400 mb-1 font-bold">GIROSCOPIOS RCS</div>
              <div className="grid grid-cols-3 gap-1 w-28">
                <div></div>
                <button 
                  onClick={() => slewTelescope(0, -6)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Arriba"
                >
                  <ArrowUp className="h-4 w-4 text-cyan-300" />
                </button>
                <div></div>
                <button 
                  onClick={() => slewTelescope(-6, 0)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Izquierda"
                >
                  <ArrowLeft className="h-4 w-4 text-cyan-300" />
                </button>
                <button 
                  onClick={handleAutoAlign}
                  className="h-8 bg-cyan-950/80 hover:bg-cyan-800 border border-cyan-400 flex items-center justify-center font-bold text-[9px] text-cyan-200"
                  title="Auto-Centrar Señal"
                >
                  AUTO
                </button>
                <button 
                  onClick={() => slewTelescope(6, 0)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Derecha"
                >
                  <ArrowRight className="h-4 w-4 text-cyan-300" />
                </button>
                <div></div>
                <button 
                  onClick={() => slewTelescope(0, 6)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Abajo"
                >
                  <ArrowDown className="h-4 w-4 text-cyan-300" />
                </button>
                <div></div>
              </div>
            </div>

            {/* 2. ZOOM OPTICAL & DIGITAL SLIDER CONTROLLER */}
            <div className="bg-black/90 border border-cyan-500/40 p-2 shadow-2xl backdrop-blur-md flex flex-col items-center">
              <div className="flex items-center justify-between w-full text-[9px] text-slate-400 mb-1 font-bold space-x-3">
                <span className="flex items-center space-x-1">
                  <Maximize2 className="w-3 h-3 text-cyan-400" />
                  <span>AUMENTO ÓPTICO</span>
                </span>
                <span className="text-cyan-300 font-mono font-bold">{zoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setZoom(z => Math.max(1, +(z - 0.5).toFixed(1)))}
                  className="h-8 w-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 active:bg-cyan-600"
                  title="Reducir Zoom (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <input 
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24 sm:w-36 accent-cyan-400 cursor-pointer h-2 bg-slate-800"
                  title="Deslizar o usar rueda del ratón para ampliar campo"
                />
                <button
                  onClick={() => setZoom(z => Math.min(10, +(z + 0.5).toFixed(1)))}
                  className="h-8 w-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 active:bg-cyan-600"
                  title="Aumentar Zoom (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 3. INSTRUCTION TIP */}
            <div className="hidden xl:block bg-black/80 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-300 max-w-xs">
              💡 <span className="font-bold text-cyan-300">Consejo:</span> Usa <kbd className="border border-slate-600 px-1 bg-slate-800">W/A/S/D</kbd> o ratón para alinear, y la <span className="text-cyan-300 font-bold">rueda</span> para zoom.
            </div>

            {/* 4. PRIMARY ACTION: CAPTURE EXPOSURE */}
            <SciFiButton
              size="lg"
              onClick={handleCaptureExposure}
              disabled={!isLockAcquired || isCapturing}
              icon={isCapturing ? <SciFiLoader size="sm" /> : <Camera className="h-4 w-4" />}
            >
              {isCapturing
                ? `Exposición ${captureProgress}%`
                : isLockAcquired
                ? (activeTelescope === 'jwst' ? 'Tomar fotografía (NIRCam / MIRI)' : 'Tomar fotografía (WFC3 / ACS)')
                : 'Alinea el telescopio'}
            </SciFiButton>

          </div>

          {/* EXPOSURE IN-PROGRESS MODAL OVERLAY */}
          {isCapturing && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-40">
              <div className="w-80 max-w-full bg-slate-950 border border-cyan-400 p-6 text-center space-y-4 shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                <div className="flex justify-center text-cyan-300"><SciFiLoader size="xl" /></div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white">RECOLECTANDO FOTONES DE ESPACIO PROFUNDO</h3>
                  <p className="text-[11px] text-slate-400">
                    {activeTelescope === 'jwst' ? 'Detectores criogénicos a -233°C // NIRCam/MIRI' : 'Sensor CCD refrigerado a -81°C // WFC3/ACS'}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-900 border border-slate-700 h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-100"
                    style={{ width: `${captureProgress}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-cyan-300 font-mono">
                  PROCESANDO MATRIZ ESPECTRAL // {captureProgress}% COMPLETADO
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: TARGETS CATALOG & MISSION DOSSIER */}
        <div 
          className={`w-full md:w-96 md:border-l border-cyan-500/40 bg-black/95 flex flex-col justify-between overflow-y-auto ${
            activeTab === 'viewport' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Target Selection Header */}
          <div className="p-3 sm:p-4 border-b border-cyan-500/30">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">PLAN DE OBSERVACIÓN</span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {activeTelescope === 'jwst' ? 'OBJETIVOS CIENTÍFICOS DE WEBB (INFRARROJO)' : 'OBJETIVOS CIENTÍFICOS DE HUBBLE'}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Selecciona un astro para calibrar las coordenadas y apuntar el observatorio:
            </p>
          </div>

          {/* Targets List */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {targetsList.map((target) => {
              const isSelected = selectedTargetId === target.id;
              const isDiscovered = discoveredIds.includes(target.id);

              return (
                <button
                  key={target.id}
                  onClick={() => {
                    setSelectedTargetId(target.id);
                    setActiveTab('viewport');
                  }}
                  className={`w-full text-left p-2.5 border transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Thumbnail / Status */}
                  <div className="relative w-12 h-12 flex-shrink-0 border border-slate-700 overflow-hidden bg-black">
                    <img 
                      src={target.image.startsWith('http') ? target.image : getAssetPath(target.image)} 
                      alt={target.name}
                      className={`w-full h-full object-cover ${isDiscovered ? '' : 'filter grayscale blur-[1px]'}`}
                      onError={(e) => { e.currentTarget.src = getAssetPath('/textures/stars.jpg'); }}
                    />
                    {isDiscovered && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-black p-0.5" title="Registrado en Bitácora">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate">{target.name}</span>
                      <span className="text-[10px] text-amber-300 font-mono">{target.year}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{target.objectType}</p>
                    <div className="flex items-center space-x-2 text-[9px] text-cyan-400 mt-1">
                      <span>{target.distance}</span>
                      <span>•</span>
                      <span>{target.constellation}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Info Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Espejo Primario:</span>
              <span className="text-white font-bold">
                {activeTelescope === 'jwst' ? '6.5 m (18 hexágonos berilio/oro)' : '2.4 m Ritchey-Chrétien'}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sensibilidad:</span>
              <span className="text-white font-bold">
                {activeTelescope === 'jwst' ? '0.6 a 28 micrómetros (Infrarrojo)' : '115 a 2,500 nanómetros'}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Resolución angular:</span>
              <span className="text-emerald-400 font-bold">
                {activeTelescope === 'jwst' ? '0.01 arcosegundos (Sub-pixel L2)' : '0.05 arcosegundos'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. DISCOVERY REVEAL MODAL (When an image is successfully captured) */}
      {revealedTarget && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl border border-cyan-400 bg-slate-950 p-4 sm:p-6 space-y-4 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative">
            
            {/* Close Button */}
            <button
              onClick={() => setRevealedTarget(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 border border-slate-700 hover:border-cyan-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>¡NUEVO DESCUBRIMIENTO REGISTRADO EN LA BITÁCORA!</span>
            </div>

            {/* Full-res NASA Photograph */}
            <div className="border border-cyan-500/40 overflow-hidden bg-black relative group">
              <img 
                src={revealedTarget.image.startsWith('http') ? revealedTarget.image : getAssetPath(revealedTarget.image)} 
                alt={revealedTarget.name}
                className="w-full h-64 sm:h-80 object-cover"
                onError={(e) => { e.currentTarget.src = getAssetPath('/textures/stars.jpg'); }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 text-xs">
                <span className="text-[10px] text-amber-400 font-bold block">
                  FOTOGRAFÍA OFICIAL DE LA NASA / ESA // {activeTelescope === 'jwst' ? 'JWST (INFRARROJO)' : 'HST (ÓPTICO)'}
                </span>
                <span className="text-white font-bold text-sm sm:text-base">{revealedTarget.name}</span>
              </div>
            </div>

            {/* Scientific Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-slate-200 leading-relaxed font-sans">{revealedTarget.summary}</p>
              <div className="border-l-2 border-cyan-400 pl-3 py-1 bg-cyan-950/20 text-slate-300 font-sans text-xs leading-relaxed">
                <span className="font-bold text-cyan-300">Hallazgo clave:</span> {revealedTarget.discoveryText}
              </div>
              {revealedTarget.importance && (
                <div className="border-l-2 border-amber-400 pl-3 py-1 bg-amber-950/20 text-slate-300 font-sans text-xs leading-relaxed">
                  <span className="font-bold text-amber-300">Importancia científica:</span> {revealedTarget.importance}
                </div>
              )}
            </div>

            {/* Technical Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] sm:text-xs">
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Distancia:</span>
                <span className="text-white font-bold">{revealedTarget.distance}</span>
              </div>
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Constelación:</span>
                <span className="text-white font-bold">{revealedTarget.constellation}</span>
              </div>
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Filtros Ópticos:</span>
                <span className="text-cyan-300 font-bold truncate block">{revealedTarget.filter}</span>
              </div>
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Año de Toma:</span>
                <span className="text-amber-400 font-bold">{revealedTarget.year}</span>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2 flex justify-end space-x-3">
              <SciFiButton onClick={() => setRevealedTarget(null)} className="w-full sm:w-auto">
                Continuar observaciones
              </SciFiButton>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
