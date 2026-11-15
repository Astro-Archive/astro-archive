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
  }
};
