function createCertificateHTML(userName, level, score, avatar) {
  return `
    <div class="certificate-box" id="certificate">
      <h2>📜 Сертификат</h2>
      <p>Настоящим подтверждается, что</p>
      <h3>${userName || 'Ученик'}</h3>
      <p>успешно сдал экзамен по английскому языку</p>
      <p>Уровень: ${level} | Результат: ${score}%</p>
      <p>Аватар: ${avatar}</p>
      <button class="btn" onclick="window.print()">🖨️ Распечатать</button>
    </div>
  `;
}
