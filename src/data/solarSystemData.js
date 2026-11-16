import { localize } from '../i18n/localize';

/**
 * Catálogo del sistema solar.
 *
 * Todo texto visible se guarda como `{ en, es }` y se resuelve con
 * `getSolarBodies(lang)` / `getSpecialProbes(lang)`. Los valores técnicos
 * (ids, radios, distancias, texturas, colores, flags) quedan planos.
 */
export const SOLAR_BODIES = [
  {
    id: 'sun',
    shortName: { en: 'Sun', es: 'Sol' },
    name: { en: 'The Sun', es: 'El Sol' },
    type: { en: 'Star (G2V Yellow Dwarf)', es: 'Estrella (Enana Amarilla G2V)' },
    radius: 14, // Scaled so Mercury at distance 40 is clearly visible outside
    orbitDistance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
    texture: '/textures/sun.jpg',
    color: '#ffb703',
    emissive: true,
    realDiameter: { en: '1,392,700 km (109x Earth)', es: '1,392,700 km (109x Tierra)' },
    surfaceTemp: { en: '5,500 °C (Core: 15,000,000 °C)', es: '5,500 °C (Núcleo: 15,000,000 °C)' },
    massPercent: {
      en: '99.86% of the entire mass of the Solar System',
      es: '99.86% de toda la masa del Sistema Solar'
    },
    funFacts: [
      {
        en: 'It converts 4 million tons of matter into pure energy every second through nuclear fusion (E=mc²).',
        es: 'Convierte 4 millones de toneladas de materia en energía pura cada segundo mediante fusión nuclear (E=mc²).'
      },
      {
        en: 'Its light takes 8 minutes and 20 seconds to travel 150 million kilometers and reach Earth.',
        es: 'Su luz tarda 8 minutos y 20 segundos en viajar 150 millones de kilómetros hasta llegar a la Tierra.'
      },
      {
        en: 'If the Sun were the size of a standard front door, Earth would be the size of a penny.',
        es: 'Si el Sol fuera del tamaño de una puerta de casa normal, la Tierra tendría el tamaño de una moneda de un centavo.'
      },
      {
        en: 'It generates the solar wind: a constant river of charged particles racing at 450 km/s across the entire planetary system.',
        es: 'Genera el viento solar: un río constante de partículas cargadas que viaja a 450 km/s por todo el sistema planetario.'
      }
    ]
  },
  {
    id: 'mercury',
    shortName: { en: 'Mercury', es: 'Mercurio' },
    name: { en: 'Mercury', es: 'Mercurio' },
    type: { en: 'Rocky Planet', es: 'Planeta Rocoso' },
    radius: 1.4,
    orbitDistance: 38,
    orbitSpeed: 0.035,
    rotationSpeed: 0.004,
    texture: '/textures/mercury.jpg',
    color: '#94a3b8',
    realDiameter: { en: '4,879 km', es: '4,879 km' },
    surfaceTemp: { en: '-180 °C to +430 °C', es: '-180 °C a +430 °C' },
    orbitalPeriod: { en: '88 Earth days', es: '88 días terrestres' },
    funFacts: [
      {
        en: 'With no atmosphere to regulate temperature, it swings from oven-like heat to glacial cold faster than any other planet.',
        es: 'Al no tener atmósfera para regular la temperatura, pasa del calor extremo de un horno al frío glacial más rápido que ningún otro planeta.'
      },
      {
        en: 'Despite being so close to the Sun, the deep craters at its poles sit in perpetual shadow and hold frozen water ice.',
        es: 'A pesar de estar tan cerca del Sol, los cráteres profundos de sus polos están en sombra perpetua y albergan hielo de agua congelada.'
      },
      {
        en: 'Its giant iron core makes up 85% of its radius. As it cooled, the planet shrank by more than 7 km, wrinkling its crust into colossal scarps.',
        es: 'Su gigantesco núcleo de hierro ocupa el 85% de su radio. Al enfriarse, el planeta se ha encogido más de 7 km, arrugando su corteza con colosales escarpes.'
      },
      {
        en: 'It has a faint tail of sodium atoms driven by the solar wind, stretching millions of kilometers like a comet.',
        es: 'Tiene una tenue cola de átomos de sodio impulsada por el viento solar, extendiéndose por millones de kilómetros como un cometa.'
      }
    ]
  },
  {
    id: 'venus',
    shortName: { en: 'Venus', es: 'Venus' },
    name: { en: 'Venus', es: 'Venus' },
    type: { en: 'Rocky Planet (Runaway Greenhouse)', es: 'Planeta Rocoso (Efecto Invernadero)' },
    radius: 2.5,
    orbitDistance: 58,
    orbitSpeed: 0.024,
    rotationSpeed: -0.002,
    texture: '/textures/venus.jpg',
    color: '#fde047',
    realDiameter: { en: '12,104 km (~95% of Earth)', es: '12,104 km (~95% de la Tierra)' },
    surfaceTemp: { en: '465 °C (Hot enough to melt lead)', es: '465 °C (Suficiente para derretir plomo)' },
    orbitalPeriod: { en: '225 days', es: '225 días' },
    funFacts: [
      {
        en: 'It is the hottest planet in the entire solar system because of a runaway greenhouse effect driven by an atmosphere that is 96% CO₂.',
        es: 'Es el planeta más caliente de todo el sistema solar debido a un efecto invernadero desbocado provocado por un 96% de CO₂ en su atmósfera.'
      },
      {
        en: 'Its surface pressure is 92 times that of Earth: the equivalent of diving 900 meters deep into the ocean.',
        es: 'Su presión en superficie es 92 veces superior a la de la Tierra: el equivalente a sumergirse a 900 metros de profundidad en el océano.'
      },
      {
        en: 'It spins in the opposite direction to almost every other planet (the Sun rises in the west and sets in the east).',
        es: 'Gira en sentido contrario a casi todos los planetas (el Sol sale por el oeste y se pone por el este).'
      },
      {
        en: 'A day on Venus lasts 243 Earth days: its day is longer than its own year!',
        es: 'Un día en Venus dura 243 días terrestres: ¡su día es más largo que su propio año!'
      }
    ]
  },
  {
    id: 'earth',
    shortName: { en: 'Earth', es: 'Tierra' },
    name: { en: 'Earth', es: 'La Tierra' },
    type: { en: 'Terrestrial Planet (Home)', es: 'Planeta Terrestre (Hogar)' },
    radius: 2.7,
    orbitDistance: 82,
    orbitSpeed: 0.018,
    rotationSpeed: 0.01,
    texture: '/textures/earth.jpg',
    color: '#38bdf8',
    realDiameter: { en: '12,742 km', es: '12,742 km' },
    surfaceTemp: { en: '-89 °C to +58 °C (Average: 15 °C)', es: '-89 °C a +58 °C (Media: 15 °C)' },
    orbitalPeriod: { en: '365.25 days', es: '365.25 días' },
    hasMoon: true,
    moonRadius: 0.75,
    moonDistance: 7.2,
    moonTexture: '/textures/moon.jpg',
    hasIss: true,
    funFacts: [
      {
        en: 'It is the only known world in the universe with stable liquid water on its surface and biological life.',
        es: 'Es el único mundo conocido en el universo con agua líquida estable en su superficie y vida biológica.'
      },
      {
        en: "Earth's magnetic field (the magnetosphere) acts as a cosmic force shield that protects us from deadly solar radiation.",
        es: 'El campo magnético terrestre (magnetosfera) actúa como un escudo de fuerza cósmico que nos protege de la radiación solar mortal.'
      },
      {
        en: 'It travels around the Sun at an impressive 107,000 km/h (30 km per second).',
        es: 'Viaja alrededor del Sol a una impresionante velocidad de 107,000 km/h (30 km por segundo).'
      },
      {
        en: 'Tectonic plates recycle carbon from the crust, regulating the climate and keeping us from turning into a hellscape like Venus.',
        es: 'Las placas tectónicas reciclan el carbono de la corteza, regulando el clima y evitando que nos convirtamos en un infierno como Venus.'
      }
    ]
  },
  {
    id: 'moon',
    shortName: { en: 'Moon', es: 'Luna' },
    name: { en: 'The Moon', es: 'La Luna' },
    type: { en: "Earth's Natural Satellite", es: 'Satélite Natural Terrestre' },
    radius: 0.75,
    orbitDistance: 7.2,
    orbitSpeed: 0.045,
    rotationSpeed: 0.005,
    texture: '/textures/moon.jpg',
    color: '#e2e8f0',
    realDiameter: { en: '3,474 km', es: '3,474 km' },
    surfaceTemp: { en: '-173 °C to +127 °C', es: '-173 °C a +127 °C' },
    orbitalPeriod: { en: '27.3 days', es: '27.3 días' },
    hasApollo: true,
    funFacts: [
      {
        en: 'It always shows the same face to Earth because of gravitational tidal locking.',
        es: 'Muestra siempre la misma cara a la Tierra debido al anclaje de marea gravitacional.'
      },
      {
        en: 'Lunar regolith (the dust that covers its surface) has particles as sharp as volcanic glass and, according to the Apollo astronauts, smells like spent gunpowder.',
        es: 'El regolito lunar (el polvo que cubre su superficie) tiene partículas afiladas como vidrio volcánico y, según los astronautas de Apolo, huele a pólvora quemada.'
      },
      {
        en: 'With no wind or liquid water, the Apollo astronauts\u2019 footprints will remain intact for millions of years.',
        es: 'Al no haber viento ni agua líquida, las huellas de los astronautas del Apolo permanecerán intactas durante millones de años.'
      },
      {
        en: 'It drifts away from Earth at a steady 3.8 cm per year because of the friction of the ocean tides.',
        es: 'Se aleja de la Tierra a una velocidad constante de 3.8 cm por año debido a la fricción de las mareas oceánicas.'
      }
    ]
  },
  {
    id: 'mars',
    shortName: { en: 'Mars', es: 'Marte' },
    name: { en: 'Mars', es: 'Marte' },
    type: { en: 'Red Desert Planet', es: 'Planeta Desértico Rojo' },
    radius: 1.8,
    orbitDistance: 116,
    orbitSpeed: 0.014,
    rotationSpeed: 0.009,
    texture: '/textures/mars.jpg',
    color: '#ef4444',
    realDiameter: { en: '6,779 km (~53% of Earth)', es: '6,779 km (~53% de la Tierra)' },
    surfaceTemp: { en: '-125 °C to +20 °C', es: '-125 °C a +20 °C' },
    orbitalPeriod: { en: '687 days', es: '687 días' },
    hasIngenuity: true,
    hasOpportunity: true,
    funFacts: [
      {
        en: 'Sunsets on Mars are blue because of the way fine magnetite dust scatters sunlight.',
        es: 'Las puestas de sol en Marte son de color azul debido a cómo el fino polvo de magnetita dispersa la luz solar.'
      },
      {
        en: 'It hosts Olympus Mons: the most colossal shield volcano in the solar system, 21.9 km tall (almost three times the Everest).',
        es: 'Alberga el Monte Olimpo: el volcán escudo más colosal del sistema solar, con 21.9 km de altura (casi tres veces el Everest).'
      },
      {
        en: 'Valles Marineris canyon is 4,000 km long and up to 7 km deep; it would stretch across the entire North American continent from coast to coast.',
        es: 'El cañón Valles Marineris tiene 4,000 km de longitud y hasta 7 km de profundidad; cruzaría todo el continente norteamericano de costa a costa.'
      },
      {
        en: 'It has two small potato-shaped moons captured from the asteroid belt: Phobos and Deimos.',
        es: 'Tiene dos pequeñas lunas con forma de patata capturadas del cinturón de asteroides: Fobos y Deimos.'
      }
    ]
  },
  {
    id: 'jupiter',
    shortName: { en: 'Jupiter', es: 'Júpiter' },
    name: { en: 'Jupiter', es: 'Júpiter' },
    type: { en: 'Gas Giant', es: 'Gigante Gaseoso' },
    radius: 7.2,
    orbitDistance: 175,
    orbitSpeed: 0.008,
    rotationSpeed: 0.02,
    texture: '/textures/jupiter.jpg',
    color: '#d97706',
    realDiameter: {
      en: '139,820 km (More than 1,300 Earths would fit inside)',
      es: '139,820 km (Caben más de 1,300 Tierras)'
    },
    surfaceTemp: { en: '-110 °C', es: '-110 °C' },
    orbitalPeriod: { en: '11.86 Earth years', es: '11.86 años terrestres' },
    funFacts: [
      {
        en: 'It spins about its axis so fast that a day lasts barely 9 hours and 56 minutes, visibly flattening its poles.',
        es: 'Gira tan rápido sobre sí mismo que su día dura apenas 9 horas y 56 minutos, lo que achata visiblemente sus polos.'
      },
      {
        en: 'Its Great Red Spot is a gigantic anticyclonic storm that has been roaring for at least 400 years, and the entire Earth would fit inside it.',
        es: 'Su Gran Mancha Roja es una gigantesca tormenta anticiclónica que lleva rugiendo al menos 400 años y en la que cabe la Tierra entera.'
      },
      {
        en: 'It acts as the solar system\u2019s gravitational vacuum cleaner, deflecting or swallowing hazardous comets and asteroids.',
        es: 'Funciona como el "aspirador gravitacional" del sistema solar, desviando o absorbiendo cometas y asteroides peligrosos.'
      },
      {
        en: 'It has more than 95 moons, including Europa, which hides a liquid-water ocean beneath its icy crust holding twice the water of all Earth\u2019s oceans combined.',
        es: 'Tiene más de 95 lunas; entre ellas Europa, que esconde un océano de agua líquida bajo su corteza de hielo con el doble de agua que todos los océanos de la Tierra juntos.'
      }
    ]
  },
  {
    id: 'saturn',
    shortName: { en: 'Saturn', es: 'Saturno' },
    name: { en: 'Saturn', es: 'Saturno' },
    type: { en: 'Ringed Gas Giant', es: 'Gigante Gaseoso Anillado' },
    radius: 6.0,
    orbitDistance: 235,
    orbitSpeed: 0.006,
    rotationSpeed: 0.018,
    texture: '/textures/saturn.jpg',
    ringTexture: '/textures/saturn_ring.png',
    hasRings: true,
    color: '#facc15',
    realDiameter: { en: '116,460 km', es: '116,460 km' },
    surfaceTemp: { en: '-140 °C', es: '-140 °C' },
    orbitalPeriod: { en: '29.45 years', es: '29.45 años' },
    funFacts: [
      {
        en: 'Its dazzling rings stretch out to 282,000 km, yet their average thickness is only 10 to 100 meters.',
        es: 'Sus deslumbrantes anillos se extienden hasta 282,000 km, pero su grosor medio es de apenas entre 10 y 100 metros.'
      },
      {
        en: 'It is the only planet in the solar system less dense than water: if there were a giant bathtub, Saturn would float!',
        es: 'Es el único planeta del sistema solar con una densidad menor que la del agua: ¡si hubiera una bañera gigantesca, Saturno flotaría!'
      },
      {
        en: 'A mysterious jet stream shaped like a perfect hexagon, 30,000 km wide, roars around its north pole.',
        es: 'En su polo norte ruge una misteriosa corriente en chorro con forma de hexágono perfecto de 30,000 km de ancho.'
      },
      {
        en: 'Its moon Enceladus fires colossal geysers of water vapor and organic salts into space, feeding one of its rings.',
        es: 'Su luna Encélado dispara colosales géiseres de vapor de agua y sales orgánicas hacia el espacio, alimentando uno de sus anillos.'
      }
    ]
  },
  {
    id: 'uranus',
    shortName: { en: 'Uranus', es: 'Urano' },
    name: { en: 'Uranus', es: 'Urano' },
    type: { en: 'Tilted Ice Giant', es: 'Gigante Helado Inclinado' },
    radius: 3.6,
    orbitDistance: 295,
    orbitSpeed: 0.004,
    rotationSpeed: 0.012,
    texture: '/textures/uranus.jpg',
    color: '#22d3ee',
    realDiameter: { en: '50,724 km', es: '50,724 km' },
    surfaceTemp: { en: '-224 °C (The coldest atmosphere)', es: '-224 °C (La atmósfera más gélida)' },
    orbitalPeriod: { en: '84 Earth years', es: '84 años terrestres' },
    funFacts: [
      {
        en: 'It is tilted 98 degrees, meaning it rolls on its side along its orbit like a ball, possibly after a giant protoplanet struck it.',
        es: 'Está inclinado a 98 grados, lo que significa que rueda de lado sobre su órbita como una pelota, posiblemente por el impacto de un protoplaneta gigante.'
      },
      {
        en: 'Its poles spend 42 Earth years in uninterrupted sunlight followed by 42 years of absolute darkness.',
        es: 'Sus polos pasan 42 años terrestres bajo luz solar ininterrumpida seguidos de 42 años de oscuridad absoluta.'
      },
      {
        en: 'Its atmosphere contains methane gas (which gives it its cyan color) and hydrogen sulfide, so it would literally smell of rotten eggs.',
        es: 'Su atmósfera contiene gas metano (que le da su color cian) y sulfuro de hidrógeno, por lo que literalmente olería a huevos podridos.'
      },
      {
        en: 'All 28 of its known moons are named after characters from the works of William Shakespeare and Alexander Pope.',
        es: 'Todas sus 28 lunas conocidas llevan nombres de personajes de las obras de William Shakespeare y Alexander Pope.'
      }
    ]
  },
  {
    id: 'neptune',
    shortName: { en: 'Neptune', es: 'Neptuno' },
    name: { en: 'Neptune', es: 'Neptuno' },
    type: { en: 'Azure Ice Giant', es: 'Gigante Helado Azur' },
    radius: 3.5,
    orbitDistance: 355,
    orbitSpeed: 0.003,
    rotationSpeed: 0.012,
    texture: '/textures/neptune.jpg',
    color: '#3b82f6',
    realDiameter: { en: '49,244 km', es: '49,244 km' },
    surfaceTemp: { en: '-218 °C', es: '-218 °C' },
    orbitalPeriod: { en: '164.8 years', es: '164.8 años' },
    funFacts: [
      {
        en: 'It unleashes the fiercest atmospheric winds in the entire solar system, exceeding 2,100 km/h (faster than the speed of sound on Earth).',
        es: 'Desata los vientos atmosféricos más feroces de todo el sistema solar, superando los 2,100 km/h (más rápidos que la velocidad del sonido en la Tierra).'
      },
      {
        en: 'It was the first planet discovered through mathematical prediction (calculated from perturbations in Uranus\u2019s orbit before being seen through a telescope in 1846).',
        es: 'Fue el primer planeta descubierto mediante predicciones matemáticas (calculado por perturbaciones en la órbita de Urano antes de verse por telescopio en 1846).'
      },
      {
        en: 'It takes so long to orbit the Sun that it barely completed its first full orbit since its discovery in 2011.',
        es: 'Tarda tanto en orbitar el Sol que apenas completó su primera órbita completa desde su descubrimiento en el año 2011.'
      },
      {
        en: 'Its largest moon, Triton, orbits in a retrograde direction and vents geysers of liquid nitrogen; astronomers believe it is an object captured from the Kuiper Belt.',
        es: 'Su luna más grande, Tritón, orbita en sentido retrógrado y arroja géiseres de nitrógeno líquido; los astrónomos creen que es un objeto capturado del Cinturón de Kuiper.'
      }
    ]
  },
  {
    id: 'pluto',
    shortName: { en: 'Pluto', es: 'Plutón' },
    name: { en: 'Pluto', es: 'Plutón' },
    type: { en: 'Dwarf Planet (Kuiper Belt)', es: 'Planeta Enano (Cinturón de Kuiper)' },
    radius: 0.9,
    orbitDistance: 415,
    orbitSpeed: 0.002,
    rotationSpeed: 0.003,
    texture: '/textures/pluto.jpg',
    color: '#d6d3d1',
    realDiameter: { en: '2,376 km (smaller than our Moon)', es: '2,376 km (más pequeño que nuestra Luna)' },
    surfaceTemp: { en: '-230 °C', es: '-230 °C' },
    orbitalPeriod: { en: '248 years', es: '248 años' },
    inclination: 17.1,
    funFacts: [
      {
        en: 'It has an immense frozen nitrogen glacier 1,000 km wide shaped like a heart, called Sputnik Planitia.',
        es: 'Posee un inmenso glaciar de nitrógeno congelado de 1,000 km de ancho con forma de corazón llamado Sputnik Planitia.'
      },
      {
        en: 'Its moon Charon is so massive compared to Pluto that both orbit a common center of gravity floating in the space between them.',
        es: 'Su luna Caronte es tan masiva comparada con Plutón que ambos orbitan un centro de gravedad común flotando en el espacio entre los dos.'
      },
      {
        en: 'It has a thin nitrogen and methane atmosphere that freezes and falls as cosmic snow when the planet moves away from the Sun.',
        es: 'Tiene una tenue atmósfera de nitrógeno y metano que se congela y cae en forma de nieve cósmica cuando el planeta se aleja del Sol.'
      },
      {
        en: 'From its discovery in 1930 until its reclassification as a dwarf planet in 2006, it did not even complete a third of its orbit around the Sun!',
        es: 'Desde que fue descubierto en 1930 hasta que fue reclasificado como planeta enano en 2006, ¡no alcanzó a completar ni un tercio de su órbita solar!'
      }
    ]
  }
];

export const SPECIAL_PROBES = [
  {
    id: 'voyager1',
    shortName: { en: 'Voyager 1', es: 'Voyager 1' },
    name: { en: 'Voyager 1 (Interstellar Space)', es: 'Voyager 1 (Espacio Interestelar)' },
    type: { en: 'Deep Space Interstellar Probe', es: 'Sonda Interestelar de Espacio Profundo' },
    launchYear: { en: 'September 5, 1977', es: '5 de Septiembre de 1977' },
    distanceAU: '163 AU (~24,400,000,000 km)',
    speedKmH: { en: '61,200 km/h (17 km/s)', es: '61,200 km/h (17 km/s)' },
    coordinates: { x: 340, y: 120, z: 200 },
    status: { en: 'Active in Interstellar Space', es: 'Activa en Espacio Interestelar' },
    modelPath: '/models/voyager.glb',
    funFacts: [
      {
        en: 'It is the most distant human-made object in history; it crossed the heliopause into interstellar space in August 2012.',
        es: 'Es el objeto fabricado por el ser humano más lejano de la historia; cruzó la heliopausa hacia el espacio interestelar en agosto de 2012.'
      },
      {
        en: 'It carries the famous Golden Record with 115 images, sounds of nature on Earth, music by Bach and greetings in 55 languages for extraterrestrial civilizations.',
        es: 'Lleva el famoso "Disco de Oro" (Golden Record) con 115 imágenes, sonidos de la naturaleza terrestre, música de Bach y saludos en 55 idiomas para civilizaciones extraterrestres.'
      },
      {
        en: 'Its radio signals travel at the speed of light and take more than 22 and a half hours to reach NASA\u2019s Deep Space Network antennas on Earth.',
        es: 'Sus señales de radio viajan a la velocidad de la luz y tardan más de 22 horas y media en llegar a las antenas de la Red de Espacio Profundo de la NASA en la Tierra.'
      },
      {
        en: 'It runs on three radioisotope thermoelectric generators (RTGs) powered by plutonium-238, which have kept its computers running for almost 50 continuous years.',
        es: 'Funciona con tres generadores termoeléctricos de radioisótopos (RTG) alimentados por plutonio-238, que han alimentado sus computadoras por casi 50 años continuos.'
      }
    ]
  },
  {
    id: 'voyager2',
    shortName: { en: 'Voyager 2', es: 'Voyager 2' },
    name: { en: 'Voyager 2 (The Grand Planetary Tour)', es: 'Voyager 2 (El Gran Tour Planetario)' },
    type: { en: 'Deep Space Interstellar Probe', es: 'Sonda Interestelar de Espacio Profundo' },
    launchYear: { en: 'August 20, 1977', es: '20 de Agosto de 1977' },
    distanceAU: '136 AU (~20,300,000,000 km)',
    speedKmH: { en: '55,300 km/h (15.4 km/s)', es: '55,300 km/h (15.4 km/s)' },
    coordinates: { x: 310, y: -140, z: 240 },
    status: { en: 'Active in Interstellar Space', es: 'Activa en Espacio Interestelar' },
    modelPath: '/models/voyager.glb',
    funFacts: [
      {
        en: 'It is the only spacecraft in history to have visited all four outer giants: Jupiter (1979), Saturn (1981), Uranus (1986) and Neptune (1989).',
        es: 'Es la única nave espacial en la historia que ha visitado los cuatro gigantes exteriores: Júpiter (1979), Saturno (1981), Urano (1986) y Neptuno (1989).'
      },
      {
        en: 'It discovered 16 new moons and the faint ring systems of Uranus and Neptune.',
        es: 'Descubrió 16 nuevas lunas y los sistemas de anillos tenues de Urano y Neptuno.'
      },
      {
        en: 'It took advantage of a geometric alignment of the four planets that happens only once every 175 years to hop from one to the next using gravity assists.',
        es: 'Aprovechó una alineación geométrica de los cuatro planetas que ocurre solo una vez cada 175 años para saltar de uno a otro mediante asistencia gravitatoria.'
      },
      {
        en: 'It is still transmitting data on the plasma density of interstellar space beyond the Sun\u2019s magnetic reach.',
        es: 'Sigue transmitiendo datos de la densidad de plasma del espacio interestelar más allá del alcance magnético del Sol.'
      }
    ]
  },
  {
    id: 'iss',
    shortName: { en: 'ISS', es: 'ISS' },
    name: { en: 'International Space Station (ISS)', es: 'Estación Espacial Internacional (ISS)' },
    type: { en: 'Crewed Orbital Laboratory', es: 'Laboratorio Orbital Tripulado' },
    launchYear: { en: 'November 1998 (Zarya module)', es: 'Noviembre de 1998 (Módulo Zarya)' },
    altitude: { en: '420 km (Low Earth Orbit - LEO)', es: '420 km (Órbita Terrestre Baja - LEO)' },
    speedKmH: { en: '28,000 km/h (7.66 km/s)', es: '28,000 km/h (7.66 km/s)' },
    status: { en: 'Continuously Crewed (Since 2000)', es: 'Continuamente Tripulada (Desde 2000)' },
    modelPath: '/models/iss.glb',
    funFacts: [
      {
        en: 'It completes one lap around Earth every 90 minutes: the astronauts on board see 16 sunrises and 16 sunsets every 24 hours.',
        es: 'Completa una vuelta a la Tierra cada 90 minutos: los astronautas a bordo ven 16 amaneceres y 16 atardeceres cada 24 horas.'
      },
      {
        en: 'It measures 109 meters from end to end, as long as a professional American football field.',
        es: 'Mide 109 metros de extremo a extremo, tan grande como un campo de fútbol americano profesional.'
      },
      {
        en: 'It has been continuously inhabited since November 2000 by astronauts from more than 20 countries.',
        es: 'Ha sido habitada ininterrumpidamente desde noviembre del año 2000 por astronautas de más de 20 países.'
      },
      {
        en: 'Its solar panels cover more than 2,400 square meters and generate 120 kilowatts of continuous electricity for scientific experiments.',
        es: 'Sus paneles solares cubren más de 2,400 metros cuadrados y generan 120 kilovatios de electricidad continua para los experimentos científicos.'
      }
    ]
  },
  {
    id: 'hubble',
    shortName: { en: 'Hubble (HST)', es: 'Hubble (HST)' },
    name: { en: 'Hubble Space Telescope (HST)', es: 'Telescopio Espacial Hubble (HST)' },
    type: { en: 'Great Orbital Observatory (LEO)', es: 'Gran Observatorio Orbital (LEO)' },
    launchYear: { en: 'April 24, 1990 (STS-31 Discovery)', es: '24 de Abril de 1990 (STS-31 Discovery)' },
    altitude: { en: '535 km (Low Earth Orbit)', es: '535 km (Órbita Terrestre Baja)' },
    speedKmH: { en: '27,300 km/h (7.59 km/s)', es: '27,300 km/h (7.59 km/s)' },
    status: { en: 'Active / In Scientific Operation', es: 'Activo / En Operación Científica' },
    modelPath: '/models/hubble.glb',
    funFacts: [
      {
        en: 'It was the first great optical observatory placed in orbit above the distorting effect of Earth\u2019s atmosphere.',
        es: 'Fue el primer gran observatorio óptico puesto en órbita fuera de la distorsión atmosférica de la Tierra.'
      },
      {
        en: 'It was repaired and upgraded by astronauts on 5 Space Shuttle servicing missions (1993 to 2009).',
        es: 'Fue reparado y actualizado por astronautas en 5 misiones de servicio del Transbordador Espacial (1993 a 2009).'
      },
      {
        en: 'It accurately measured the expansion rate of the universe, dating it at 13.8 billion years.',
        es: 'Calculó con exactitud la tasa de expansión del universo, determinando su edad en 13,800 millones de años.'
      },
      {
        en: 'Its Fine Guidance Sensors can lock onto a human hair from 1.6 kilometers away without losing focus.',
        es: 'Sus Sensores de Guía Fina pueden apuntar a un cabello humano a 1.6 kilómetros de distancia sin perder el enfoque.'
      }
    ]
  },
  {
    id: 'jwst',
    shortName: { en: 'James Webb (JWST)', es: 'James Webb (JWST)' },
    name: { en: 'James Webb Space Telescope (JWST)', es: 'Telescopio Espacial James Webb (JWST)' },
    type: { en: 'Great Infrared Observatory (L2 Point)', es: 'Gran Observatorio Infrarrojo (Punto L2)' },
    launchYear: { en: 'December 25, 2021 (Ariane 5)', es: '25 de Diciembre de 2021 (Ariane 5)' },
    altitude: {
      en: '1.5 million km from Earth (Lagrange Point L2)',
      es: '1.5 Millones de km de la Tierra (Punto Lagrange L2)'
    },
    speedKmH: { en: 'Halo orbit at L2', es: 'Órbita de Halo en L2' },
    status: { en: 'Active / In Scientific Operation', es: 'Activo / En Operación Científica' },
    isProceduralWebb: true,
    coordinates: { x: 150, y: 52, z: -120 },
    funFacts: [
      {
        en: 'Its 6.5-meter primary mirror is made of 18 hexagonal beryllium segments coated with a 100-nanometer layer of pure gold.',
        es: 'Su espejo primario de 6.5 metros está compuesto por 18 segmentos hexagonales de berilio recubiertos con una capa de oro puro de 100 nanómetros.'
      },
      {
        en: 'Its five-layer Kapton sunshield is the size of a tennis court and keeps the instruments at -233 °C on the cold side.',
        es: 'Su parasol de cinco capas de Kapton es del tamaño de una cancha de tenis y mantiene los instrumentos a -233 °C en el lado frío.'
      },
      {
        en: 'It orbits the second Lagrange point (L2), 1.5 million kilometers from Earth, where the gravity of Earth and the Sun balance out.',
        es: 'Orbita el segundo punto de Lagrange (L2) a 1.5 millones de kilómetros de la Tierra, donde las gravedades de la Tierra y el Sol se equilibran.'
      },
      {
        en: 'Its infrared cameras and instruments (NIRCam, NIRSpec, MIRI) can observe the first galaxies born after the Big Bang and analyze exoplanet atmospheres.',
        es: 'Sus cámaras e instrumentos infrarrojos (NIRCam, NIRSpec, MIRI) pueden observar las primeras galaxias nacidas tras el Big Bang y analizar atmósferas de exoplanetas.'
      }
    ]
  },
  {
    id: 'halley',
    shortName: { en: "Halley's Comet", es: 'Cometa Halley' },
    name: { en: 'Comet 1P/Halley', es: 'Cometa 1P/Halley' },
    type: { en: 'Retrograde Periodic Comet (Oort Cloud)', es: 'Cometa Periódico Retrógrado (Nube de Oort)' },
    launchYear: { en: 'Observed since 240 BC // Giotto probe (1986)', es: 'Observado desde 240 a.C. // Sonda Giotto (1986)' },
    altitude: {
      en: 'Eccentric Orbit (Perihelion: 87.8 Mkm - Aphelion: 5,280 Mkm)',
      es: 'Órbita Excéntrica (Perihelio: 87.8 Mkm - Afelio: 5,280 Mkm)'
    },
    speedKmH: {
      en: '70,560 km/h (Perihelion) - 3,280 km/h (Aphelion)',
      es: '70,560 km/h (Perihelio) - 3,280 km/h (Afelio)'
    },
    status: { en: 'Outbound to Aphelion (Next perihelion in July 2061)', es: 'Rumbo a Afelio (Próximo perihelio en julio de 2061)' },
    modelPath: '/models/halley-nucleus.glb',
    funFacts: [
      {
        en: 'In March 1986, ESA\u2019s Giotto probe came within just 596 km of the nucleus, capturing the first direct images of a comet\u2019s heart in history.',
        es: 'En marzo de 1986, la sonda Giotto de la ESA se acercó a solo 596 km del núcleo, capturando por primera vez en la historia imágenes directas del corazón de un cometa.'
      },
      {
        en: 'Its nucleus is peanut / elongated-potato shaped, 15 x 7.2 x 7.2 km, with a crust of dark organic matter that reflects only 4% of sunlight (blacker than charcoal).',
        es: 'Su núcleo tiene forma de cacahuate / patata alargada de 15 x 7.2 x 7.2 km, con una corteza de materia orgánica oscura que refleja solo el 4% de la luz solar (más negro que el carbón).'
      },
      {
        en: 'It has an orbital period of roughly 75 to 76 years; its last visit was in 1986 and it will return to perihelion in mid-2061.',
        es: 'Tiene un período orbital de aproximadamente 75 a 76 años; su última visita fue en 1986 y regresará al perihelio a mediados de 2061.'
      },
      {
        en: 'The jets of gas and dust that sublimate from its nucleus create two annual meteor showers on Earth: the Eta Aquariids (May) and the Orionids (October).',
        es: 'Los chorros de gas y polvo que subliman de su núcleo originan dos lluvias de meteoros anuales en la Tierra: las Eta Acuáridas (mayo) y las Oriónidas (octubre).'
      }
    ]
  }
];

export const getSolarBodies = (lang = 'en') => localize(SOLAR_BODIES, lang);
export const getSpecialProbes = (lang = 'en') => localize(SPECIAL_PROBES, lang);
