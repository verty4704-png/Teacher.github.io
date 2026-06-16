class Player {
  constructor() {
    this.xp = 0;
    this.level = 1;
    this.hearts = 5;
    this.maxHearts = 5;
    this.lastHeartRefill = Date.now();
    this.avatar = '😀';
    this.frame = '';
    this.inventory = ['😀'];
  }

  addXP(amount) {
    this.xp += amount;
    this.checkLevelUp();
  }

  checkLevelUp() {
    const needed = this.level * 100;
    if (this.xp >= needed) {
      this.xp -= needed;
      this.level++;
      alert(`🎉 Поздравляем! Вы достигли уровня ${this.level}!`);
      return true;
    }
    return false;
  }

  loseHeart() {
    if (this.hearts > 0) {
      this.hearts--;
      return true;
    }
    return false;
  }

  refillHearts() {
    const now = Date.now();
    const diff = now - this.lastHeartRefill;
    const heartsToAdd = Math.floor(diff / (30 * 60 * 1000)); // каждые 30 минут
    if (heartsToAdd > 0 && this.hearts < this.maxHearts) {
      this.hearts = Math.min(this.maxHearts, this.hearts + heartsToAdd);
      this.lastHeartRefill = now - (diff % (30 * 60 * 1000));
    }
  }

  getXPForNextLevel() {
    return this.level * 100;
  }
}
