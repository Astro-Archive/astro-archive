import { localize } from '../i18n/localize';

export const CURIOSITIES = {
  apollo11: {
    summary: {
      en: 'The Eagle lunar module was the spacecraft that carried Neil Armstrong and Buzz Aldrin to the lunar surface on 20 July 1969.',
      es: 'El módulo lunar Eagle fue la nave que llevó a Neil Armstrong y Buzz Aldrin a la superficie lunar el 20 de julio de 1969.'
    },
    facts: [
      {
        en: 'The descent stage stayed on the Moon as a historic site; the ascent stage returned to lunar orbit.',
        es: 'La etapa de descenso permaneció en la Luna como una estación histórica; la etapa de ascenso regresó a la órbita lunar.'
      },
      {
        en: 'Armstrong had to fly the lander manually in the final seconds to avoid a field full of boulders.',
        es: 'Armstrong tuvo que pilotar manualmente los últimos segundos para evitar una zona llena de rocas.'
      },
      {
        en: 'The guidance computer had less capacity than a modern phone, yet it ran critical software in real time.',
        es: 'El ordenador de guiado tenía menos capacidad que un teléfono actual, pero ejecutaba software crítico en tiempo real.'
      },
      {
        en: 'The module legs carried contact probes that warned when they touched the lunar regolith.',
        es: 'Las patas del módulo incluían sondas de contacto que avisaban cuando tocaban el regolito lunar.'
      }
    ],
    photos: [
      {
        src: 'https://images-assets.nasa.gov/image/as11-40-5868/as11-40-5868~large.jpg',
        caption: {
          en: 'The Eagle lunar module on the lunar surface',
          es: 'El módulo lunar Eagle sobre la superficie lunar'
        }
      },
      {
        src: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~large.jpg',
        caption: {
          en: 'Armstrong during the extravehicular activity',
          es: 'Armstrong durante la actividad extravehicular'
        }
      },
      {
        src: 'https://images-assets.nasa.gov/image/as11-40-5875/as11-40-5875~large.jpg',
        caption: {
          en: 'The Tranquility Base area',
          es: 'La zona de Tranquility Base'
        }
      }
    ]
  },
  ingenuity: {
    summary: {
      en: 'Ingenuity was the first vehicle to perform powered, controlled flights on another planet.',
      es: 'Ingenuity fue el primer vehículo que realizó vuelos propulsados y controlados en otro planeta.'
    },
    facts: [
      {
        en: 'It was designed as a five-flight demonstration and ended up completing 72 flights on Mars.',
        es: 'Fue diseñado como una demostración de cinco vuelos y terminó completando 72 vuelos en Marte.'
      },
      {
        en: 'Its rotors spun at about 2,400 revolutions per minute because the Martian atmosphere is extremely thin.',
        es: 'Sus rotores giraban a unas 2.400 revoluciones por minuto porque la atmósfera marciana es extremadamente tenue.'
      },
      {
        en: 'It flew autonomously: the distance between Mars and Earth rules out piloting it with a joystick in real time.',
        es: 'Volaba de forma autónoma: la distancia entre Marte y la Tierra impide pilotarlo con un joystick en tiempo real.'
      },
      {
        en: 'The helicopter stopped flying in January 2024 after damaging a blade during its final landing.',
        es: 'El helicóptero dejó de volar en enero de 2024 tras dañar una pala durante su último aterrizaje.'
      }
    ],
    photos: [
      {
        src: 'https://images-assets.nasa.gov/image/PIA24513/PIA24513~large.jpg',
        caption: {
          en: 'Ingenuity photographed by Perseverance',
          es: 'Ingenuity fotografiado por Perseverance'
        }
      },
      {
        src: 'https://images-assets.nasa.gov/image/PIA25356/PIA25356~large.jpg',
        caption: {
          en: "Ingenuity's shadow during a flight",
          es: 'La sombra de Ingenuity durante un vuelo'
        }
      },
      {
        src: 'https://images-assets.nasa.gov/image/PIA24647/PIA24647~large.jpg',
        caption: {
          en: 'Ingenuity on the Martian terrain',
          es: 'Ingenuity sobre el terreno marciano'
        }
      }
    ]
  },
  opportunity: {
    summary: {
      en: 'Opportunity explored Mars for almost fifteen years, far beyond its initial 90-day mission.',
      es: 'Opportunity exploró Marte durante casi quince años, mucho más allá de su misión inicial de 90 días.'
    },
    facts: [
      {
        en: 'It travelled more than 45 kilometres.',
        es: 'Recorrió más de 45 kilómetros.'
      },
      {
        en: 'It found evidence of ancient environments with liquid water.',
        es: 'Encontró evidencias de antiguos ambientes con agua líquida.'
      },
      {
        en: 'Its mission ended after a global dust storm in 2018.',
        es: 'Su misión terminó después de una tormenta de polvo global en 2018.'
      }
    ],
    photos: [
      {
        src: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~large.jpg',
        caption: {
          en: 'Opportunity on Mars',
          es: 'Opportunity en Marte'
        }
      }
    ]
  },
  viking: {
    summary: {
      en: 'Viking 1 was the first American lander to operate successfully on the surface of Mars.',
      es: 'Viking 1 fue el primer aterrizador estadounidense que operó con éxito en la superficie de Marte.'
    },
    facts: [
      {
        en: 'It landed in Chryse Planitia in 1976.',
        es: 'Aterrizó en Chryse Planitia en 1976.'
      },
      {
        en: 'It sent back the first photograph taken from the Martian surface.',
        es: 'Envió la primera fotografía tomada desde la superficie marciana.'
      },
      {
        en: 'It ran experiments to study the composition and possible biological activity of the soil.',
        es: 'Realizó experimentos para estudiar la composición y posible actividad biológica del suelo.'
      }
    ],
    photos: [
      {
        src: 'https://images-assets.nasa.gov/image/PIA00571/PIA00571~large.jpg',
        caption: {
          en: 'Viking 1 panorama',
          es: 'Panorama de Viking 1'
        }
      }
    ]
  },
  perseverance: {
    summary: {
      en: 'Perseverance is studying Jezero Crater and storing samples that could return to Earth in the future.',
      es: 'Perseverance estudia el cráter Jezero y almacena muestras que podrían regresar a la Tierra en el futuro.'
    },
    facts: [
      {
        en: 'It carried Ingenuity to Mars.',
        es: 'Transportó a Ingenuity hasta Marte.'
      },
      {
        en: 'It uses cameras, lasers and a drill to study rocks.',
        es: 'Utiliza cámaras, láseres y un taladro para estudiar rocas.'
      },
      {
        en: 'It looks for signs of environments that may have been habitable in the past.',
        es: 'Busca señales de ambientes que pudieron ser habitables en el pasado.'
      }
    ],
    photos: [
      {
        src: 'https://images-assets.nasa.gov/image/PIA26368/PIA26368~large.jpg',
        caption: {
          en: 'Perseverance in Jezero Crater',
          es: 'Perseverance en el cráter Jezero'
        }
      }
    ]
  },
  hubble: {
    summary: {
      en: 'The Hubble Space Telescope is the most influential orbital observatory in the history of astronomy. Launched in 1990 from the space shuttle Discovery (STS-31), it has operated for more than three decades from low Earth orbit.',
      es: 'El Telescopio Espacial Hubble es el observatorio orbital más influyente en la historia de la astronomía. Lanzado en 1990 desde el transbordador espacial Discovery (STS-31), ha operado por más de tres décadas desde la órbita terrestre baja.'
    },
    facts: [
      {
        en: 'It has made more than 1.6 million observations and its data have produced more than 20,000 peer-reviewed scientific papers.',
        es: 'Ha realizado más de 1.6 millones de observaciones y sus datos han generado más de 20,000 artículos científicos arbitrados.'
      },
      {
        en: 'It orbits Earth at 27,300 km/h: one full lap of the planet every 95 minutes at an altitude of 540 km.',
        es: 'Orbita la Tierra a 27,300 km/h: completa una vuelta completa al planeta cada 95 minutos a 540 km de altitud.'
      },
      {
        en: 'Its 2.4-metre primary mirror was corrected in 1993 by astronauts on the legendary STS-61 mission, which installed the COSTAR optical "glasses".',
        es: 'Su espejo primario de 2.4 metros fue corregido en 1993 por astronautas en la legendaria misión STS-61 instalando las "gafas" ópticas COSTAR.'
      },
      {
        en: 'Its Fine Guidance Sensors can lock onto a target with a precision of 7 milliarcseconds (equivalent to spotting a coin 320 km away).',
        es: 'Sus Sensores de Guía Fina pueden fijar un objetivo con una precisión de 7 milésimas de arco (equivalente a apuntar a una moneda a 320 km).'
      }
    ],
    photos: [
      {
        src: '/textures/hubble/pillars.jpg',
        caption: {
          en: 'Pillars of Creation (M16): Towers of hydrogen gas and cosmic dust where new stars are born.',
          es: 'Pilares de la Creación (M16): Torres de gas hidrógeno y polvo cósmico donde nacen nuevas estrellas.'
        }
      },
      {
        src: '/textures/hubble/deep_field.jpg',
        caption: {
          en: 'Hubble Ultra Deep Field: Almost 10,000 primordial galaxies captured in a tiny window of the sky.',
          es: 'Campo Ultra Profundo de Hubble: Casi 10,000 galaxias primitivas capturadas en una diminuta ventana del cielo.'
        }
      },
      {
        src: '/textures/hubble/catseye.jpg',
        caption: {
          en: "Cat's Eye Nebula (NGC 6543): Intricate layers of ionised gas expelled by a dying star.",
          es: 'Nebulosa del Ojo de Gato (NGC 6543): Intrincadas capas de gas ionizado expulsadas por una estrella moribunda.'
        }
      },
      {
        src: '/textures/hubble/sombrero.jpg',
        caption: {
          en: 'Sombrero Galaxy (M104): A bulging core and a massive band of interstellar dust 29 million light-years away.',
          es: 'Galaxia del Sombrero (M104): Núcleo bulboso y masiva banda de polvo interestelar a 29 millones de años luz.'
        }
      },
      {
        src: '/textures/hubble/orion.jpg',
        caption: {
          en: 'Orion Nebula (M42): A huge, active stellar nursery 1,344 light-years from Earth.',
          es: 'Nebulosa de Orión (M42): Gran guardería estelar activa a 1,344 años luz de la Tierra.'
        }
      },
      {
        src: '/textures/hubble/antennae.jpg',
        caption: {
          en: 'Antennae Galaxies: Two colliding galaxies setting off millions of new stars.',
          es: 'Galaxias de las Antenas: Dos galaxias colisionando y desencadenando millones de nuevas estrellas.'
        }
      }
    ]
  },
  jwst: {
    summary: {
      en: 'The James Webb Space Telescope (JWST) is the most powerful and complex space science observatory ever built. Operating at the L2 Lagrange point, 1.5 million kilometres from Earth, it observes in infrared wavelengths to study the first galaxies in the universe and the atmospheres of distant worlds.',
      es: 'El Telescopio Espacial James Webb (JWST) es el observatorio de ciencia espacial más potente y complejo jamás construido. Operando en el punto de Lagrange L2 a 1.5 millones de kilómetros de la Tierra, observa en longitudes de onda infrarrojas para estudiar las primeras galaxias del universo y las atmósferas de mundos lejanos.'
    },
    facts: [
      {
        en: 'Its primary mirror is made of 18 gold-coated beryllium hexagonal segments that unfolded and aligned with nanometre precision.',
        es: 'Su espejo primario está formado por 18 segmentos hexagonales de berilio bañados en oro que se desplegaron y alinearon con precisión nanométrica.'
      },
      {
        en: 'The sunshield is roughly the size of a tennis court (21 × 14 m) and blocks radiation from the Sun, Earth and Moon, cooling the science side to -233 °C.',
        es: 'El parasol tiene el tamaño aproximado de una cancha de tenis (21 × 14 m) y bloquea la radiación del Sol, la Tierra y la Luna, enfriando el lado científico a -233 °C.'
      },
      {
        en: 'It can analyse the chemical composition of exoplanet atmospheres through transmission spectroscopy, looking for water vapour, CO₂ and methane.',
        es: 'Puede analizar la composición química de atmósferas exoplanetarias mediante espectroscopia de transmisión buscando vapor de agua, CO₂ y metano.'
      },
      {
        en: 'It does not orbit Earth: it keeps a stable halo orbit around the second Lagrange point (L2) of the Sun-Earth system.',
        es: 'No orbita la Tierra: mantiene una órbita de halo estable alrededor del segundo punto de Lagrange (L2) del sistema Sol-Tierra.'
      }
    ],
    photos: [
      {
        src: 'https://assets.science.nasa.gov/content/dam/science/missions/webb/science/2022/07/STScI-01GA6KKWG229B16K4Q38CH3BXS.png/jcr%3Acontent/renditions/cq5dam.web.1280.1280.png',
        caption: {
          en: 'Cosmic Cliffs in the Carina Nebula, captured by Webb\'s NIRCam',
          es: 'Acantilados Cósmicos en la Nebulosa de Carina, captados por la NIRCam de Webb'
        }
      },
      {
        src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2022/07/STScI-01G8H19MA6SV3PC914WR1MGGH5.png?fit=clip&h=2000&w=1473',
        caption: {
          en: 'Webb\'s First Deep Field: galaxy cluster SMACS 0723 observed in infrared',
          es: 'Primer Campo Profundo de Webb: cúmulo de galaxias SMACS 0723 observado en infrarrojo'
        }
      },
      {
        src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2022/07/STScI-01G8GZQ3ZFJRD8YF8YZWMAXCE3.png?fit=clip&h=1863&w=2000',
        caption: {
          en: 'Southern Ring Nebula captured by Webb\'s NIRCam',
          es: 'Nebulosa del Anillo del Sur captada por la NIRCam de Webb'
        }
      }
    ]
  },
  halley: {
    summary: {
      en: "Comet 1P/Halley is the most famous periodic comet in human history. In March 1986, ESA's Giotto mission carried out humanity's first close encounter with a comet nucleus, capturing direct images of its solid, active heart.",
      es: 'El Cometa 1P/Halley es el cometa periódico más célebre de la historia humana. En marzo de 1986, la misión Giotto de la ESA protagonizó el primer encuentro cercano de la humanidad con el núcleo de un cometa, capturando imágenes directas de su corazón sólido y activo.'
    },
    facts: [
      {
        en: "ESA's Giotto probe came within just 596 km of the nucleus on 14 March 1986 at a speed of 68 km/s.",
        es: 'La sonda Giotto de la ESA se aproximó a solo 596 km del núcleo el 14 de marzo de 1986 a una velocidad de 68 km/s.'
      },
      {
        en: 'The nucleus has an asymmetric bilobed, peanut- or potato-like shape of 15 × 7.2 × 7.2 km, with two lobes joined by a narrow waist.',
        es: 'El núcleo tiene una forma asimétrica bilobulada de cacahuate o patata de 15 × 7.2 × 7.2 km con dos lóbulos unidos por una cintura estrecha.'
      },
      {
        en: 'Its crust is a mixture of volatile ices and dark organic tars that reflect only 4% of sunlight (albedo 0.04).',
        es: 'Su corteza está compuesta de una mezcla de hielos volátiles y alquitranes orgánicos oscuros que reflejan solo el 4% de la luz solar (albedo 0.04).'
      },
      {
        en: 'It produces two annual meteor showers on Earth as we cross its orbit: the Eta Aquariids (May) and the Orionids (October).',
        es: 'Origina dos lluvias anuales de meteoros en la Tierra cuando cruzamos su órbita: las Eta Acuáridas (mayo) y las Oriónidas (octubre).'
      }
    ],
    photos: [
      {
        src: 'https://images-assets.nasa.gov/image/PIA01487/PIA01487~orig.jpg',
        caption: {
          en: 'Comet Halley captured during its 1986 approach, with its bright coma and ion and dust tails',
          es: 'Cometa Halley capturado en su aproximación de 1986 con su brillante coma y colas de iones y polvo'
        }
      },
      {
        src: 'https://images-assets.nasa.gov/image/PIA14444/PIA14444~orig.jpg',
        caption: {
          en: "Historic Giotto probe image showing Halley's dark nucleus and active sublimation jets",
          es: 'Imagen histórica de la sonda Giotto mostrando el núcleo oscuro y los chorros activos de sublimación de Halley'
        }
      }
    ]
  }
};

export const getCuriosities = (lang = 'en') => localize(CURIOSITIES, lang);
