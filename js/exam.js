function generateExamQuestions(allLessons, count = 20) {
  const allExercises = [];
  for (let cat in allLessons) {
    for (let key in allLessons[cat]) {
      allExercises.push(...allLessons[cat][key].exercises);
    }
  }
  const shuffled = allExercises.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
