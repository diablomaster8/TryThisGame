/**
 * R0739 (KIDS-71): the Learning Grove's child-facing chrome in Spanish, the same keys as the
 * Hebrew slice (the picker, the round buttons, the results and the break screen). Neutral
 * Latin American Spanish, warm and short, speaking to one child ("tú"). Round prompts, the
 * grown-up area and the story stay English for now (see PROGRESS). Needs a native speaker's
 * read before it ships to children.
 */
export const EDU_TEXT_ES = {
  play: 'Jugar y aprender',
  playHelp: 'Elige un juego. Tres intentos y luego vemos la respuesta juntos. Sin reloj.',
  gameNames: {
    colours: 'Colores',
    letters: 'Letras',
    counting: 'Contar',
    shapes: 'Formas',
    sounds: 'Sonidos y rimas',
    animals: 'Animales',
    tracing: 'Trazar',
    times: 'Tablas de multiplicar',
    timeMoney: 'Reloj y conchas',
    numbers: 'Los números',
    reading: 'Leer y responder',
    science: 'Clasificar la naturaleza',
  },
  gameBlurbs: {
    colours: 'Encuentra el color y ordena por colores.',
    letters: 'Nombres de letras, primeras letras, mayúsculas y minúsculas.',
    counting: 'Contar, más o menos, sumas pequeñas.',
    shapes: 'Círculo, cuadrado, triángulo y sus amigos.',
    sounds: 'Sonidos de animales, primeros sonidos, rimas y palmadas.',
    animals: 'Nombres, sonidos, casas y crías.',
    tracing: 'Traza letras, números y tu nombre.',
    times: 'Las tablas de multiplicar del 2 al 12.',
    timeMoney: 'Lee la hora en un reloj y arma precios con conchas.',
    numbers: 'Valor de posición, mitades, cuartos y tercios.',
    reading: 'Lee un texto corto y responde quién, qué y por qué.',
    science: 'Clasifica seres vivos, cosas que flotan, agua y casas de animales.',
  },
  readerGameNames: {
    counting: 'Sumas',
    letters: 'Ortografía',
    sounds: 'Rimas y ritmos',
  },
  readerGameBlurbs: {
    counting: 'Suma y resta, hasta sumas de dos cifras.',
    letters: 'Elige la ortografía correcta de una palabra con dibujo.',
    sounds: 'Lee palabras que riman y cuenta los golpes del ritmo.',
  },
  tryAgain: '¡Otra vez!',
  almost: 'Casi. Mira otra vez.',
  showAnswer: 'Aquí está:',
  wellDone: ['¡Muy bien!', '¡Sí!', '¡Lo encontraste!', '¡Qué buena vista!', '¡Eso es!'],
  nextRound: 'Siguiente',
  leave: 'Salir',
  roundOf: (n: number, total: number) => `${n} de ${total}`,
  finished: (stars: number, max: number) => `¡${stars} de ${max} estrellas!`,
  sticker: '¡Una calcomanía nueva para tu álbum!',
  stickers: (n: number) => `Calcomanías: ${n}`,
  backToGrove: 'Volver a la Arboleda',
  playAgain: 'Jugar otra vez',
  breakTitle: 'Hora de descansar',
  breakBody: 'Estírate, toma un poco de agua, mira por la ventana. La Arboleda esperará.',
  breakSay: 'Hora de descansar. Vamos a dormir un ratito y jugamos otra vez pronto.',
  noGames: 'Todos los juegos están apagados. Pide a un adulto que encienda algunos.',
};
