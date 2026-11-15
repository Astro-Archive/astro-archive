export const CURIOSITIES = {
  apollo11: {
    summary: 'El módulo lunar Eagle fue la nave que llevó a Neil Armstrong y Buzz Aldrin a la superficie lunar el 20 de julio de 1969.',
    facts: [
      'La etapa de descenso permaneció en la Luna como una estación histórica; la etapa de ascenso regresó a la órbita lunar.',
      'Armstrong tuvo que pilotar manualmente los últimos segundos para evitar una zona llena de rocas.',
      'El ordenador de guiado tenía menos capacidad que un teléfono actual, pero ejecutaba software crítico en tiempo real.',
      'Las patas del módulo incluían sondas de contacto que avisaban cuando tocaban el regolito lunar.'
    ],
    photos: [
      { src: 'https://images-assets.nasa.gov/image/as11-40-5868/as11-40-5868~large.jpg', caption: 'El módulo lunar Eagle sobre la superficie lunar' },
      { src: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~large.jpg', caption: 'Armstrong durante la actividad extravehicular' },
      { src: 'https://images-assets.nasa.gov/image/as11-40-5875/as11-40-5875~large.jpg', caption: 'La zona de Tranquility Base' }
    ]
  },
  ingenuity: {
    summary: 'Ingenuity fue el primer vehículo que realizó vuelos propulsados y controlados en otro planeta.',
    facts: [
      'Fue diseñado como una demostración de cinco vuelos y terminó completando 72 vuelos en Marte.',
      'Sus rotores giraban a unas 2.400 revoluciones por minuto porque la atmósfera marciana es extremadamente tenue.',
      'Volaba de forma autónoma: la distancia entre Marte y la Tierra impide pilotarlo con un joystick en tiempo real.',
      'El helicóptero dejó de volar en enero de 2024 tras dañar una pala durante su último aterrizaje.'
    ],
    photos: [
      { src: 'https://images-assets.nasa.gov/image/PIA24513/PIA24513~large.jpg', caption: 'Ingenuity fotografiado por Perseverance' },
      { src: 'https://images-assets.nasa.gov/image/PIA25356/PIA25356~large.jpg', caption: 'La sombra de Ingenuity durante un vuelo' },
      { src: 'https://images-assets.nasa.gov/image/PIA24647/PIA24647~large.jpg', caption: 'Ingenuity sobre el terreno marciano' }
    ]
  },
  opportunity: {
    summary: 'Opportunity exploró Marte durante casi quince años, mucho más allá de su misión inicial de 90 días.',
    facts: ['Recorrió más de 45 kilómetros.', 'Encontró evidencias de antiguos ambientes con agua líquida.', 'Su misión terminó después de una tormenta de polvo global en 2018.'],
    photos: [{ src: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~large.jpg', caption: 'Opportunity en Marte' }]
  },
  viking: {
    summary: 'Viking 1 fue el primer aterrizador estadounidense que operó con éxito en la superficie de Marte.',
    facts: ['Aterrizó en Chryse Planitia en 1976.', 'Envió la primera fotografía tomada desde la superficie marciana.', 'Realizó experimentos para estudiar la composición y posible actividad biológica del suelo.'],
    photos: [{ src: 'https://images-assets.nasa.gov/image/PIA00571/PIA00571~large.jpg', caption: 'Panorama de Viking 1' }]
  },
  perseverance: {
    summary: 'Perseverance estudia el cráter Jezero y almacena muestras que podrían regresar a la Tierra en el futuro.',
    facts: ['Transportó a Ingenuity hasta Marte.', 'Utiliza cámaras, láseres y un taladro para estudiar rocas.', 'Busca señales de ambientes que pudieron ser habitables en el pasado.'],
    photos: [{ src: 'https://images-assets.nasa.gov/image/PIA26368/PIA26368~large.jpg', caption: 'Perseverance en el cráter Jezero' }]
  },
  hubble: {
    summary: 'El Telescopio Espacial Hubble es el observatorio orbital más influyente en la historia de la astronomía. Lanzado en 1990 desde el transbordador espacial Discovery (STS-31), ha operado por más de tres décadas desde la órbita terrestre baja.',
    facts: [
      'Ha realizado más de 1.6 millones de observaciones y sus datos han generado más de 20,000 artículos científicos arbitrados.',
      'Orbita la Tierra a 27,300 km/h: completa una vuelta completa al planeta cada 95 minutos a 540 km de altitud.',
      'Su espejo primario de 2.4 metros fue corregido en 1993 por astronautas en la legendaria misión STS-61 instalando las "gafas" ópticas COSTAR.',
      'Sus Sensores de Guía Fina pueden fijar un objetivo con precisión de 7 milésimas de segundo de arco (apuntar a una moneda a 320 km).'
    ],
    photos: [
      { src: '/textures/hubble/pillars.jpg', caption: 'Pilares de la Creación (M16): Torres de gas hidrógeno y polvo cósmico donde nacen nuevas estrellas.' },
      { src: '/textures/hubble/deep_field.jpg', caption: 'Campo Ultra Profundo de Hubble: Casi 10,000 galaxias primitivas capturadas en una diminuta ventana del cielo.' },
      { src: '/textures/hubble/catseye.jpg', caption: 'Nebulosa del Ojo de Gato (NGC 6543): Intrincadas capas de gas ionizado expulsadas por una estrella moribunda.' },
      { src: '/textures/hubble/sombrero.jpg', caption: 'Galaxia del Sombrero (M104): Núcleo bulboso y masiva banda de polvo interestelar a 29 millones de años luz.' },
      { src: '/textures/hubble/orion.jpg', caption: 'Nebulosa de Orión (M42): Gran guardería estelar activa a 1,344 años luz de la Tierra.' },
      { src: '/textures/hubble/antennae.jpg', caption: 'Galaxias de las Antenas: Dos galaxias colisionando y desencadenando millones de nuevas estrellas.' }
    ]
  },
  jwst: {
    summary: 'El Telescopio Espacial James Webb (JWST) es el observatorio de ciencia espacial más potente y complejo jamás construido. Operando en el punto de Lagrange L2 a 1.5 millones de kilómetros de la Tierra, observa en longitudes de onda infrarrojas para estudiar las primeras galaxias del universo y las atmósferas de mundos lejanos.',
    facts: [
      'Su espejo primario está formado por 18 segmentos hexagonales de berilio bañados en oro que se desplegaron y alinearon con precisión nanométrica.',
      'El parasol tiene el tamaño aproximado de una cancha de tenis (21 × 14 m) y bloquea la radiación del Sol, la Tierra y la Luna, enfriando el lado científico a -233 °C.',
      'Puede analizar la composición química de atmósferas exoplanetarias mediante espectroscopia de transmisión buscando vapor de agua, CO₂ y metano.',
      'No orbita la Tierra: mantiene una órbita de halo estable alrededor del segundo punto de Lagrange (L2) del sistema Sol-Tierra.'
    ],
    photos: [
      { src: 'https://images-assets.nasa.gov/image/webb-telescope-deployment/webb-telescope-deployment~large.jpg', caption: 'El telescopio James Webb durante su despliegue y alineación óptica en el espacio' },
      { src: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001738/GSFC_20171208_Archive_e001738~large.jpg', caption: 'El icónico espejo primario dorado de 18 segmentos de berilio' },
      { src: 'https://images-assets.nasa.gov/image/PIA23763/PIA23763~large.jpg', caption: 'El escudo solar térmico de cinco capas de Kapton' }
    ]
  },
  halley: {
    summary: 'El Cometa 1P/Halley es el cometa periódico más célebre de la historia humana. En marzo de 1986, la misión Giotto de la ESA protagonizó el primer encuentro cercano de la humanidad con el núcleo de un cometa, capturando imágenes directas de su corazón sólido y activo.',
    facts: [
      'La sonda Giotto de la ESA se aproximó a solo 596 km del núcleo el 14 de marzo de 1986 a una velocidad de 68 km/s.',
      'El núcleo tiene una forma asimétrica bi-lobulada de cacahuate o patata de 15 × 7.2 × 7.2 km con dos lóbulos unidos por una cintura estrecha.',
      'Su corteza está compuesta de una mezcla de hielos volátiles y alquitranes orgánicos oscuros que reflejan solo el 4% de la luz solar (albedo 0.04).',
      'Origina dos lluvias anuales de meteoros en la Tierra cuando cruzamos su órbita: las Eta Acuáridas (mayo) y las Oriónidas (octubre).'
    ],
    photos: [
      { src: 'https://images-assets.nasa.gov/image/PIA01487/PIA01487~orig.jpg', caption: 'Cometa Halley capturado en su aproximación de 1986 con su brillante coma y colas de iones y polvo' },
      { src: 'https://images-assets.nasa.gov/image/PIA14444/PIA14444~orig.jpg', caption: 'Imagen histórica de la sonda Giotto mostrando el núcleo oscuro y los chorros activos de sublimación de Halley' }
    ]
  }
};
