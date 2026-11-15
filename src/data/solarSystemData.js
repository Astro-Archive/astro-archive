export const SOLAR_BODIES = [
  {
    id: 'sun',
    shortName: 'Sol',
    name: 'El Sol',
    type: 'Estrella (Enana Amarilla G2V)',
    radius: 14, // Scaled so Mercury at distance 40 is clearly visible outside
    orbitDistance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
    texture: '/textures/sun.jpg',
    color: '#ffb703',
    emissive: true,
    realDiameter: '1,392,700 km (109x Tierra)',
    surfaceTemp: '5,500 °C (Núcleo: 15,000,000 °C)',
    massPercent: '99.86% de toda la masa del Sistema Solar',
    funFacts: [
      'Convierte 4 millones de toneladas de materia en energía pura cada segundo mediante fusión nuclear (E=mc²).',
      'Su luz tarda 8 minutos y 20 segundos en viajar 150 millones de kilómetros hasta llegar a la Tierra.',
      'Si el Sol fuera del tamaño de una puerta de casa normal, la Tierra tendría el tamaño de una moneda de un centavo.',
      'Genera el viento solar: un río constante de partículas cargadas que viaja a 450 km/s por todo el sistema planetario.'
    ]
  },
  {
    id: 'mercury',
    shortName: 'Mercurio',
    name: 'Mercurio',
    type: 'Planeta Rocoso',
    radius: 1.4,
    orbitDistance: 38,
    orbitSpeed: 0.035,
    rotationSpeed: 0.004,
    texture: '/textures/mercury.jpg',
    color: '#94a3b8',
    realDiameter: '4,879 km',
    surfaceTemp: '-180 °C a +430 °C',
    orbitalPeriod: '88 días terrestres',
    funFacts: [
      'Al no tener atmósfera para regular la temperatura, pasa del calor extremo de un horno al frío glacial más rápido que ningún otro planeta.',
      'A pesar de estar tan cerca del Sol, los cráteres profundos de sus polos están en sombra perpetua y albergan hielo de agua congelada.',
      'Su gigantesco núcleo de hierro ocupa el 85% de su radio. Al enfriarse, el planeta se ha encogido más de 7 km, arrugando su corteza con colosales escarpes.',
      'Tiene una tenue cola de átomos de sodio impulsada por el viento solar, extendiéndose por millones de kilómetros como un cometa.'
    ]
  },
  {
    id: 'venus',
    shortName: 'Venus',
    name: 'Venus',
    type: 'Planeta Rocoso (Efecto Invernadero)',
    radius: 2.5,
    orbitDistance: 58,
    orbitSpeed: 0.024,
    rotationSpeed: -0.002,
    texture: '/textures/venus.jpg',
    color: '#fde047',
    realDiameter: '12,104 km (~95% de la Tierra)',
    surfaceTemp: '465 °C (Suficiente para derretir plomo)',
    orbitalPeriod: '225 días',
    funFacts: [
      'Es el planeta más caliente de todo el sistema solar debido a un efecto invernadero desbocado provocado por un 96% de CO₂ en su atmósfera.',
      'Su presión en superficie es 92 veces superior a la de la Tierra: el equivalente a sumergirse a 900 metros de profundidad en el océano.',
      'Gira en sentido contrario a casi todos los planetas (el Sol sale por el oeste y se pone por el este).',
      'Un día en Venus dura 243 días terrestres: ¡su día es más largo que su propio año!'
    ]
  },
  {
    id: 'earth',
    shortName: 'Tierra',
    name: 'La Tierra',
    type: 'Planeta Terrestre (Hogar)',
    radius: 2.7,
    orbitDistance: 82,
    orbitSpeed: 0.018,
    rotationSpeed: 0.01,
    texture: '/textures/earth.jpg',
    color: '#38bdf8',
    realDiameter: '12,742 km',
    surfaceTemp: '-89 °C a +58 °C (Media: 15 °C)',
    orbitalPeriod: '365.25 días',
    hasMoon: true,
    moonRadius: 0.75,
    moonDistance: 7.2,
    moonTexture: '/textures/moon.jpg',
    hasIss: true,
    funFacts: [
      'Es el único mundo conocido en el universo con agua líquida estable en su superficie y vida biológica.',
      'El campo magnético terrestre (magnetosfera) actúa como un escudo de fuerza cósmico que nos protege de la radiación solar mortal.',
      'Viaja alrededor del Sol a una impresionante velocidad de 107,000 km/h (30 km por segundo).',
      'Las placas tectónicas reciclan el carbono de la corteza, regulando el clima y evitando que nos convirtamos en un infierno como Venus.'
    ]
  },
  {
    id: 'moon',
    shortName: 'Luna',
    name: 'La Luna',
    type: 'Satélite Natural Terrestre',
    radius: 0.75,
    orbitDistance: 7.2,
    orbitSpeed: 0.045,
    rotationSpeed: 0.005,
    texture: '/textures/moon.jpg',
    color: '#e2e8f0',
    realDiameter: '3,474 km',
    surfaceTemp: '-173 °C a +127 °C',
    orbitalPeriod: '27.3 días',
    hasApollo: true,
    funFacts: [
      'Muestra siempre la misma cara a la Tierra debido al anclaje de marea gravitacional.',
      'El regolito lunar (el polvo que cubre su superficie) tiene partículas afiladas como vidrio volcánico y, según los astronautas de Apolo, huele a pólvora quemada.',
      'Al no haber viento ni agua líquida, las huellas de los astronautas del Apolo permanecerán intactas durante millones de años.',
      'Se aleja de la Tierra a una velocidad constante de 3.8 cm por año debido a la fricción de las mareas oceánicas.'
    ]
  },
  {
    id: 'mars',
    shortName: 'Marte',
    name: 'Marte',
    type: 'Planeta Desértico Rojo',
    radius: 1.8,
    orbitDistance: 116,
    orbitSpeed: 0.014,
    rotationSpeed: 0.009,
    texture: '/textures/mars.jpg',
    color: '#ef4444',
    realDiameter: '6,779 km (~53% de la Tierra)',
    surfaceTemp: '-125 °C a +20 °C',
    orbitalPeriod: '687 días',
    hasIngenuity: true,
    hasOpportunity: true,
    funFacts: [
      'Las puestas de sol en Marte son de color azul debido a cómo el fino polvo de magnetita dispersa la luz solar.',
      'Alberga el Monte Olimpo: el volcán escudo más colosal del sistema solar, con 21.9 km de altura (casi tres veces el Everest).',
      'El cañón Valles Marineris tiene 4,000 km de longitud y hasta 7 km de profundidad; cruzaría todo el continente norteamericano de costa a costa.',
      'Tiene dos pequeñas lunas con forma de patata capturadas del cinturón de asteroides: Fobos y Deimos.'
    ]
  },
  {
    id: 'jupiter',
    shortName: 'Júpiter',
    name: 'Júpiter',
    type: 'Gigante Gaseoso',
    radius: 7.2,
    orbitDistance: 175,
    orbitSpeed: 0.008,
    rotationSpeed: 0.02,
    texture: '/textures/jupiter.jpg',
    color: '#d97706',
    realDiameter: '139,820 km (Caben más de 1,300 Tierras)',
    surfaceTemp: '-110 °C',
    orbitalPeriod: '11.86 años terrestres',
    funFacts: [
      'Gira tan rápido sobre sí mismo que su día dura apenas 9 horas y 56 minutos, lo que achata visiblemente sus polos.',
      'Su Gran Mancha Roja es una gigantesca tormenta anticiclónica que lleva rugiendo al menos 400 años y en la que cabe la Tierra entera.',
      'Funciona como el "aspirador gravitacional" del sistema solar, desviando o absorbiendo cometas y asteroides peligrosos.',
      'Tiene más de 95 lunas; entre ellas Europa, que esconde un océano de agua líquida bajo su corteza de hielo con el doble de agua que todos los océanos de la Tierra juntos.'
    ]
  },
  {
    id: 'saturn',
    shortName: 'Saturno',
    name: 'Saturno',
    type: 'Gigante Gaseoso Anillado',
    radius: 6.0,
    orbitDistance: 235,
    orbitSpeed: 0.006,
    rotationSpeed: 0.018,
    texture: '/textures/saturn.jpg',
    ringTexture: '/textures/saturn_ring.png',
    hasRings: true,
    color: '#facc15',
    realDiameter: '116,460 km',
    surfaceTemp: '-140 °C',
    orbitalPeriod: '29.45 años',
    funFacts: [
      'Sus deslumbrantes anillos se extienden hasta 282,000 km, pero su grosor medio es de apenas entre 10 y 100 metros.',
      'Es el único planeta del sistema solar con una densidad menor que la del agua: ¡si hubiera una bañera gigantesca, Saturno flotaría!',
      'En su polo norte ruge una misteriosa corriente en chorro con forma de hexágono perfecto de 30,000 km de ancho.',
      'Su luna Encélado dispara colosales géiseres de vapor de agua y sales orgánicas hacia el espacio, alimentando uno de sus anillos.'
    ]
  },
  {
    id: 'uranus',
    shortName: 'Urano',
    name: 'Urano',
    type: 'Gigante Helado Inclinado',
    radius: 3.6,
    orbitDistance: 295,
    orbitSpeed: 0.004,
    rotationSpeed: 0.012,
    texture: '/textures/uranus.jpg',
    color: '#22d3ee',
    realDiameter: '50,724 km',
    surfaceTemp: '-224 °C (La atmósfera más gélida)',
    orbitalPeriod: '84 años terrestres',
    funFacts: [
      'Está inclinado a 98 grados, lo que significa que rueda de lado sobre su órbita como una pelota, posiblemente por el impacto de un protoplaneta gigante.',
      'Sus polos pasan 42 años terrestres bajo luz solar ininterrumpida seguidos de 42 años de oscuridad absoluta.',
      'Su atmósfera contiene gas metano (que le da su color cian) y sulfuro de hidrógeno, por lo que literalmente olería a huevos podridos.',
      'Todas sus 28 lunas conocidas llevan nombres de personajes de las obras de William Shakespeare y Alexander Pope.'
    ]
  },
  {
    id: 'neptune',
    shortName: 'Neptuno',
    name: 'Neptuno',
    type: 'Gigante Helado Azur',
    radius: 3.5,
    orbitDistance: 355,
    orbitSpeed: 0.003,
    rotationSpeed: 0.012,
    texture: '/textures/neptune.jpg',
    color: '#3b82f6',
    realDiameter: '49,244 km',
    surfaceTemp: '-218 °C',
    orbitalPeriod: '164.8 años',
    funFacts: [
      'Desata los vientos atmosféricos más feroces de todo el sistema solar, superando los 2,100 km/h (más rápidos que la velocidad del sonido en la Tierra).',
      'Fue el primer planeta descubierto mediante predicciones matemáticas (calculado por perturbaciones en la órbita de Urano antes de verse por telescopio en 1846).',
      'Tarda tanto en orbitar el Sol que apenas completó su primera órbita completa desde su descubrimiento en el año 2011.',
      'Su luna más grande, Tritón, orbita en sentido retrógrado y arroja géiseres de nitrógeno líquido; los astrónomos creen que es un objeto capturado del Cinturón de Kuiper.'
    ]
  },
  {
    id: 'pluto',
    shortName: 'Plutón',
    name: 'Plutón',
    type: 'Planeta Enano (Cinturón de Kuiper)',
    radius: 0.9,
    orbitDistance: 415,
    orbitSpeed: 0.002,
    rotationSpeed: 0.003,
    texture: '/textures/pluto.jpg',
    color: '#d6d3d1',
    realDiameter: '2,376 km (más pequeño que nuestra Luna)',
    surfaceTemp: '-230 °C',
    orbitalPeriod: '248 años',
    inclination: 17.1,
    funFacts: [
      'Posee un inmenso glaciar de nitrógeno congelado de 1,000 km de ancho con forma de corazón llamado Sputnik Planitia.',
      'Su luna Caronte es tan masiva comparada con Plutón que ambos orbitan un centro de gravedad común flotando en el espacio entre los dos.',
      'Tiene una tenue atmósfera de nitrógeno y metano que se congela y cae en forma de nieve cósmica cuando el planeta se aleja del Sol.',
      'Desde que fue descubierto en 1930 hasta que fue reclasificado como planeta enano en 2006, ¡no alcanzó a completar ni un tercio de su órbita solar!'
    ]
  }
];

export const SPECIAL_PROBES = [
  {
    id: 'voyager1',
    shortName: 'Voyager 1',
    name: 'Voyager 1 (Espacio Interestelar)',
    type: 'Sonda Interestelar de Espacio Profundo',
    launchYear: '5 de Septiembre de 1977',
    distanceAU: '163 AU (~24,400,000,000 km)',
    speedKmH: '61,200 km/h (17 km/s)',
    coordinates: { x: 340, y: 120, z: 200 },
    status: 'Activa en Espacio Interestelar',
    modelPath: '/models/voyager.glb',
    funFacts: [
      'Es el objeto fabricado por el ser humano más lejano de la historia; cruzó la heliopausa hacia el espacio interestelar en agosto de 2012.',
      'Lleva el famoso "Disco de Oro" (Golden Record) con 115 imágenes, sonidos de la naturaleza terrestre, música de Bach y saludos en 55 idiomas para civilizaciones extraterrestres.',
      'Sus señales de radio viajan a la velocidad de la luz y tardan más de 22 horas y media en llegar a las antenas de la Red de Espacio Profundo de la NASA en la Tierra.',
      'Funciona con tres generadores termoeléctricos de radioisótopos (RTG) alimentados por plutonio-238, que han alimentado sus computadoras por casi 50 años continuos.'
    ]
  },
  {
    id: 'voyager2',
    shortName: 'Voyager 2',
    name: 'Voyager 2 (El Gran Tour Planetario)',
    type: 'Sonda Interestelar de Espacio Profundo',
    launchYear: '20 de Agosto de 1977',
    distanceAU: '136 AU (~20,300,000,000 km)',
    speedKmH: '55,300 km/h (15.4 km/s)',
    coordinates: { x: 310, y: -140, z: 240 },
    status: 'Activa en Espacio Interestelar',
    modelPath: '/models/voyager.glb',
    funFacts: [
      'Es la única nave espacial en la historia que ha visitado los cuatro gigantes exteriores: Júpiter (1979), Saturno (1981), Urano (1986) y Neptuno (1989).',
      'Descubrió 16 nuevas lunas y los sistemas de anillos tenues de Urano y Neptuno.',
      'Aprovechó una alineación geométrica de los cuatro planetas que ocurre solo una vez cada 175 años para saltar de uno a otro mediante asistencia gravitatoria.',
      'Sigue transmitiendo datos de la densidad de plasma del espacio interestelar más allá del alcance magnético del Sol.'
    ]
  },
  {
    id: 'iss',
    shortName: 'ISS',
    name: 'Estación Espacial Internacional (ISS)',
    type: 'Laboratorio Orbital Tripulado',
    launchYear: 'Noviembre de 1998 (Módulo Zarya)',
    altitude: '420 km (Órbita Terrestre Baja - LEO)',
    speedKmH: '28,000 km/h (7.66 km/s)',
    status: 'Continuamente Tripulada (Desde 2000)',
    modelPath: '/models/iss.glb',
    funFacts: [
      'Completa una vuelta a la Tierra cada 90 minutos: los astronautas a bordo ven 16 amaneceres y 16 atardeceres cada 24 horas.',
      'Mide 109 metros de extremo a extremo, tan grande como un campo de fútbol americano profesional.',
      'Ha sido habitada ininterrumpidamente desde noviembre del año 2000 por astronautas de más de 20 países.',
      'Sus paneles solares cubren más de 2,400 metros cuadrados y generan 120 kilovatios de electricidad continua para los experimentos científicos.'
    ]
  }
];
