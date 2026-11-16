/** Explorador de superficie (rovers, dron, mapa 3D). */
export default {
  en: {
    // Header
    'surface.header.mars': '🪐 Martian Surface // Jezero Crater',
    'surface.header.moon': '🌕 Lunar Surface // Sea of Tranquility (Tranquility Base)',
    'surface.title.astronaut': 'Neil Armstrong (Apollo 11 EVA)',
    'surface.title.lem': 'LEM Eagle Lunar Module (Apollo 11)',
    'surface.badge.astronaut': '👨‍🚀 NEIL ARMSTRONG (1/6 g LUNAR WALK)',
    'surface.badge.landing': '🚀 MANUAL DPS DESCENT PHASE',
    'surface.badge.flight': '🚁 360° ATMOSPHERIC FLIGHT MODE',
    'surface.badge.rover': '🚜 360° GROUND ROVER',
    'surface.audio.mars.title': 'Ambient Martian wind audio from Perseverance',
    'surface.audio.moon.title': 'Apollo 11 Capcom radio ambient audio',
    'surface.audio.mars.label': 'Mars Wind',
    'surface.audio.moon.label': 'Houston Capcom Radio',
    'surface.close': 'Close surface simulation',

    // Telemetry HUD
    'surface.telemetry.astronaut': '👨‍🚀 Astronaut Telemetry',
    'surface.telemetry.lem': '🚀 LEM Descent Telemetry',
    'surface.telemetry.flight': '🚁 Flight Telemetry',
    'surface.telemetry.surface': '📡 Surface Telemetry',
    'surface.telemetry.dpsActive': 'DPS ENGINE: ACTIVE',
    'surface.telemetry.radarActive': 'RADAR: ACTIVE',
    'surface.telemetry.stepSpeed': 'Step Speed:',
    'surface.telemetry.speed': 'Speed:',
    'surface.telemetry.flightSpeed': 'Flight Speed:',
    'surface.telemetry.altitude': 'Radar Altitude:',
    'surface.telemetry.overRegolith': '(above regolith)',
    'surface.telemetry.overDunes': '(above dunes)',
    'surface.telemetry.heading': 'Heading (Yaw):',
    'surface.telemetry.terrain': 'Terrain Elevation:',
    'surface.telemetry.coords': 'Coordinates:',
    'surface.telemetry.descendHint': '▼ DESCEND BELOW 0.2 m TO TOUCH DOWN',

    // Mission tracker
    'surface.mission.moon': 'MISSION: TRANQUILITY BASE',
    'surface.mission.mars': 'MISSION: JEZERO WITNESSES',
    'surface.mission.objectives': '{collected} / {total} OBJECTIVES',
    'surface.target.completed': 'COMPLETE',
    'surface.target.radar': 'Radar',

    // Historical banners
    'surface.landing.kicker': '🎙️ HISTORIC TRANSMISSION FROM THE SEA OF TRANQUILITY',
    'surface.landing.quote': '"Houston, Tranquility Base here. The Eagle has landed."',
    'surface.landing.author': '— Neil Armstrong (July 20, 1969)',
    'surface.landing.body':
      'Touchdown successful. The Eagle module now rests stationary. Control transferred to Neil Armstrong for the EVA lunar walk.',
    'surface.firstStep.kicker': "🎙️ HUMANITY'S FIRST STEP ON ANOTHER WORLD",
    'surface.firstStep.quote': '"That\'s one small step for [a] man, one giant leap for mankind."',
    'surface.firstStep.author': '— Neil Armstrong as he stepped onto the lunar regolith',

    // Interaction prompt
    'surface.prompt.kicker': 'SCIENTIFIC TARGET IN RANGE',
    'surface.prompt.astronautAction': 'Complete lunar objective',
    'surface.prompt.drillAction': 'Drill and sample',

    // Active operation dialog
    'surface.sampling.eva': 'EXTRAVEHICULAR OPERATION EVA',
    'surface.sampling.science': 'SCIENTIFIC OPERATION IN PROGRESS',
    'surface.sampling.eva.step1': 'Step 1/3: Deploying instruments on the lunar regolith...',
    'surface.sampling.eva.step2': 'Step 2/3: Adjusting mounts and Earth alignment...',
    'surface.sampling.eva.step3': 'Step 3/3: Verifying telemetry with Capcom Houston...',
    'surface.sampling.mars.step1': 'Phase 1/3: SuperCam — Laser vaporization and spectral analysis...',
    'surface.sampling.mars.step2': 'Phase 2/3: Percussive drill — Extracting core at 5.8 cm...',
    'surface.sampling.mars.step3': 'Phase 3/3: Robotic arm — Hermetic sealing in titanium tube...',
    'surface.sampling.tool': 'Tool:',

    // Scientific dossier
    'surface.dossier.historicTitle': 'HISTORIC OBJECTIVE COMPLETE',
    'surface.dossier.sampleTitle': 'SEALED ROCK CORE',
    'surface.dossier.finding': 'Historic Finding:',
    'surface.dossier.engineering': 'Engineering / Material Data:',
    'surface.dossier.mineralogy': 'Detected Mineralogy:',
    'surface.dossier.science': 'NASA Scientific Relevance:',
    'surface.dossier.completed': 'Completed:',
    'surface.dossier.continue': 'Continue exploration',

    // Campaign complete banner
    'surface.complete.moon.title': 'APOLLO 11 MISSION AT THE SEA OF TRANQUILITY ACCOMPLISHED!',
    'surface.complete.mars.title': 'JEZERO SAMPLING CAMPAIGN COMPLETE!',
    'surface.complete.moon.body':
      'All experiments have been deployed and the lunar samples are secured for their return to Earth aboard the Columbia module.',
    'surface.complete.mars.body':
      "All 3 key Martian rock cores have been secured in Perseverance's carousel for the Mars Sample Return mission.",

    // On-screen controls
    'surface.controls.dpsThrust': 'DPS THRUST',
    'surface.controls.altitude': 'ALTITUDE',
    'surface.controls.ascendAria': 'Increase altitude or slow descent',
    'surface.controls.brake': '▲ BRAKE',
    'surface.controls.climb': '▲ UP',
    'surface.controls.descend': '▼ DOWN',
    'surface.controls.descendAria': 'Descend',
    'surface.controls.forwardAria': 'Move forward',
    'surface.controls.leftAria': 'Turn left',
    'surface.controls.backAria': 'Move backward',
    'surface.controls.rightAria': 'Turn right',

    // Footer
    'surface.footer.controls': 'CONTROLS:',
    'surface.footer.lem.pre': 'Maneuver with',
    'surface.footer.lem.afterSpeed': '. Descend with',
    'surface.footer.lem.afterDescent': ' and fire DPS thrust with',
    'surface.footer.lem.tail': '. Touch down below 0.2 m.',
    'surface.footer.eva.pre': 'Walk as Neil Armstrong using',
    'surface.footer.eva.afterSpeed': ' (1/6 g lunar gravity). Press',
    'surface.footer.eva.tail': ' to interact with the experiments.',
    'surface.footer.rover.pre': 'Drive with',
    'surface.footer.rover.afterSpeed': '. Press',
    'surface.footer.rover.tail': ' to drill rocks in range.',
    'surface.footer.location.moon': 'Sea of Tranquility // Earth visible in the lunar sky',
    'surface.footer.location.mars': 'Jezero Crater // Martian Dunes',
  },
  es: {
    // Encabezado
    'surface.header.mars': '🪐 Superficie Marciana // Cráter Jezero',
    'surface.header.moon': '🌕 Superficie Lunar // Mar de la Tranquilidad (Base Tranquilidad)',
    'surface.title.astronaut': 'Neil Armstrong (EVA Apolo 11)',
    'surface.title.lem': 'Módulo Lunar LEM Eagle (Apolo 11)',
    'surface.badge.astronaut': '👨‍🚀 NEIL ARMSTRONG (CAMINATA LUNAR 1/6 g)',
    'surface.badge.landing': '🚀 FASE DE ALUNIZAJE MANUAL DPS',
    'surface.badge.flight': '🚁 MODO VUELO ATMOSFÉRICO 360°',
    'surface.badge.rover': '🚜 ROVER TERRESTRE 360°',
    'surface.audio.mars.title': 'Audio ambiental de viento marciano de Perseverance',
    'surface.audio.moon.title': 'Audio ambiental radio Capcom de la misión Apolo 11',
    'surface.audio.mars.label': 'Viento de Marte',
    'surface.audio.moon.label': 'Radio Capcom Houston',
    'surface.close': 'Cerrar simulación de superficie',

    // HUD de telemetría
    'surface.telemetry.astronaut': '👨‍🚀 Telemetría de Astronauta',
    'surface.telemetry.lem': '🚀 Telemetría Alunizaje LEM',
    'surface.telemetry.flight': '🚁 Telemetría de Vuelo',
    'surface.telemetry.surface': '📡 Telemetría de Superficie',
    'surface.telemetry.dpsActive': 'MOTOR DPS: ACTIVO',
    'surface.telemetry.radarActive': 'RADAR: ACTIVO',
    'surface.telemetry.stepSpeed': 'Vel. de Pasos:',
    'surface.telemetry.speed': 'Velocidad:',
    'surface.telemetry.flightSpeed': 'Vel. de Vuelo:',
    'surface.telemetry.altitude': 'Altitud Radar:',
    'surface.telemetry.overRegolith': '(sobre regolito)',
    'surface.telemetry.overDunes': '(sobre dunas)',
    'surface.telemetry.heading': 'Rumbo (Yaw):',
    'surface.telemetry.terrain': 'Cota Terreno:',
    'surface.telemetry.coords': 'Coordenadas:',
    'surface.telemetry.descendHint': '▼ DESCENDER A MENOS DE 0.2 m PARA ALUNIZAR',

    // Rastreador de misión
    'surface.mission.moon': 'MISIÓN: BASE TRANQUILIDAD',
    'surface.mission.mars': 'MISIÓN: TESTIGOS DE JEZERO',
    'surface.mission.objectives': '{collected} / {total} OBJETIVOS',
    'surface.target.completed': 'COMPLETADO',
    'surface.target.radar': 'Radar',

    // Banners históricos
    'surface.landing.kicker': '🎙️ TRANSMISIÓN HISTÓRICA DESDE EL MAR DE LA TRANQUILIDAD',
    'surface.landing.quote': '"Houston, Tranquility Base here. The Eagle has landed."',
    'surface.landing.author': '— Neil Armstrong (20 de julio de 1969)',
    'surface.landing.body':
      'Alunizaje exitoso. El módulo Eagle queda posado fijo. Control transferido a Neil Armstrong para la caminata lunar EVA.',
    'surface.firstStep.kicker': '🎙️ PRIMER PASO DE LA HUMANIDAD EN OTRO MUNDO',
    'surface.firstStep.quote': '"That\'s one small step for [a] man, one giant leap for mankind."',
    'surface.firstStep.author': '— Neil Armstrong al pisar el regolito lunar',

    // Aviso de interacción
    'surface.prompt.kicker': 'OBJETIVO CIENTÍFICO EN RANGO',
    'surface.prompt.astronautAction': 'Completar objetivo lunar',
    'surface.prompt.drillAction': 'Perforar y recolectar',

    // Diálogo de operación activa
    'surface.sampling.eva': 'OPERACIÓN EXTRAVEHICULAR EVA',
    'surface.sampling.science': 'OPERACIÓN CIENTÍFICA EN CURSO',
    'surface.sampling.eva.step1': 'Paso 1/3: Desplegando instrumental en el regolito lunar...',
    'surface.sampling.eva.step2': 'Paso 2/3: Ajustando fijaciones y alineación con la Tierra...',
    'surface.sampling.eva.step3': 'Paso 3/3: Verificación de telemetría con Capcom Houston...',
    'surface.sampling.mars.step1': 'Fase 1/3: SuperCam — Vaporización láser y análisis espectral...',
    'surface.sampling.mars.step2': 'Fase 2/3: Taladro percutor — Extrayendo testigo a 5.8 cm...',
    'surface.sampling.mars.step3': 'Fase 3/3: Brazo robótico — Sellado hermético en tubo de titanio...',
    'surface.sampling.tool': 'Herramienta:',

    // Dosier científico
    'surface.dossier.historicTitle': 'OBJETIVO HISTÓRICO COMPLETADO',
    'surface.dossier.sampleTitle': 'TESTIGO DE ROCA SELLADO',
    'surface.dossier.finding': 'Hallazgo Histórico:',
    'surface.dossier.engineering': 'Datos de Ingeniería / Materiales:',
    'surface.dossier.mineralogy': 'Mineralogía Detectada:',
    'surface.dossier.science': 'Relevancia Científica NASA:',
    'surface.dossier.completed': 'Completados:',
    'surface.dossier.continue': 'Continuar exploración',

    // Banner de campaña completada
    'surface.complete.moon.title': '¡MISIÓN APOLO 11 EN EL MAR DE LA TRANQUILIDAD CUMPLIDA!',
    'surface.complete.mars.title': '¡CAMPAÑA DE MUESTREO DE JEZERO COMPLETADA!',
    'surface.complete.moon.body':
      'Todos los experimentos han sido desplegados y las muestras lunares quedan aseguradas para su retorno a la Tierra en el módulo Columbia.',
    'surface.complete.mars.body':
      'Los 3 testigos clave de roca marciana han sido asegurados en el carrusel de Perseverance para la misión Mars Sample Return.',

    // Controles en pantalla
    'surface.controls.dpsThrust': 'EMPUJE DPS',
    'surface.controls.altitude': 'ALTITUD',
    'surface.controls.ascendAria': 'Subir altitud o frenar descenso',
    'surface.controls.brake': '▲ FRENAR',
    'surface.controls.climb': '▲ SUBIR',
    'surface.controls.descend': '▼ BAJAR',
    'surface.controls.descendAria': 'Descender',
    'surface.controls.forwardAria': 'Avanzar',
    'surface.controls.leftAria': 'Girar izquierda',
    'surface.controls.backAria': 'Retroceder',
    'surface.controls.rightAria': 'Girar derecha',

    // Pie de página
    'surface.footer.controls': 'CONTROLES:',
    'surface.footer.lem.pre': 'Maniobra con',
    'surface.footer.lem.afterSpeed': '. Desciende con',
    'surface.footer.lem.afterDescent': ' y activa empuje DPS con',
    'surface.footer.lem.tail': '. Aluniza a menos de 0.2 m.',
    'surface.footer.eva.pre': 'Camina con Neil Armstrong usando',
    'surface.footer.eva.afterSpeed': ' (gravedad lunar 1/6 g). Presiona',
    'surface.footer.eva.tail': ' para interactuar con los experimentos.',
    'surface.footer.rover.pre': 'Conduce con',
    'surface.footer.rover.afterSpeed': '. Presiona',
    'surface.footer.rover.tail': ' para perforar rocas en rango.',
    'surface.footer.location.moon': 'Mar de la Tranquilidad // La Tierra visible en el cielo lunar',
    'surface.footer.location.mars': 'Cráter Jezero // Dunas Marcianas',
  },
};
