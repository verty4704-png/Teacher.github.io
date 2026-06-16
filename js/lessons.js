const lessons = {
  grammar: {
    presentSimple: {
      title: 'Present Simple',
      exercises: [
        { type: 'choice', q: 'She ___ to school every day.', opts: ['go', 'goes', 'going'], correct: 1 },
        { type: 'input', q: 'They ___ (play) football.', correct: 'play' },
        { type: 'match', q: 'Соедините:', pairs: [['I', 'am'], ['You', 'are'], ['He', 'is']] },
        { type: 'translation', q: 'Я люблю кофе.', correct: 'I love coffee.' }
      ]
    },
    presentContinuous: {
      title: 'Present Continuous',
      exercises: [
        { type: 'choice', q: 'She ___ now.', opts: ['reads', 'is reading', 'read'], correct: 1 },
        { type: 'input', q: 'They ___ (play) now.', correct: 'are playing' },
        { type: 'match', q: 'Соедините:', pairs: [['I', 'am going'], ['She', 'is going'], ['We', 'are going']] },
        { type: 'translation', q: 'Мы идём в кино.', correct: 'We are going to the cinema.' }
      ]
    }
  },
  vocabulary: {
    family: {
      title: 'Семья',
      exercises: [
        { type: 'choice', q: 'Мама по-английски:', opts: ['father', 'mother', 'sister'], correct: 1 },
        { type: 'input', q: 'Брат: ___', correct: 'brother' },
        { type: 'match', q: 'Семья:', pairs: [['mother', 'мама'], ['father', 'папа'], ['sister', 'сестра']] }
      ]
    },
    food: {
      title: 'Еда',
      exercises: [
        { type: 'choice', q: 'Яблоко:', opts: ['apple', 'orange', 'banana'], correct: 0 },
        { type: 'input', q: 'Хлеб: ___', correct: 'bread' },
        { type: 'translation', q: 'Я хочу воды.', correct: 'I want water.' }
      ]
    }
  }
};
