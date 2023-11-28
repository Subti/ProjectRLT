import Phaser from "phaser";

// Set game scene then put into PhaserGame component
class GameScene extends Phaser.Scene {
  constructor(gameWidth, gameHeight, gameGravity) {
    super("scene-game");
    this.player;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameGravity = gameGravity;
  }

  preload() {
    this.load.image("bg", "/assets/bg.jpg");
    this.load.spritesheet("player", "/assets/player.png", {
      frameWidth: 62,
      frameHeight: 64,
      startFrame: 5,
    });
    this.load.spritesheet("invisibleSprite", "/assets/invisibleSprite.png", {
      frameWidth: 62,
      frameHeight: 64,
      startFrame: 5,
    });
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.currentWord = "";
    this.words = this.physics.add.group();
    fetch("https://random-word-api.vercel.app/api?words=10")
      .then((response) => response.json())
      .then((data) => {
        this.wordsData = data; // all words returned are stored in this.wordsData
        this.addNewWord(); // calling addNewWord func
      });
    // func definition for add new words
    this.addNewWord = () => {
      // if wordsData successfully retrieved words and it's stored in 'this.wordsData'
      if (this.wordsData.length > 0) {
        const word = this.wordsData.shift(); // grab then delete the first word
        this.targetWord = word; // updates targetWord with new word
        // random x position of the word between 0 and gameWidth minus 2% of itself
        const randomX = Phaser.Math.Between(0, (this.gameWidth - (this.gameWidth * 0.02)));
        this.targetWordSprite = this.words
          .create(randomX, 10, "invisibleSprite")
          .setScale(0.5);
        this.targetWordSprite.body.setAllowGravity(false);
        this.targetWordSprite.setVelocityY(this.gameGravity - 90);
        this.targetWordText = this.add.text(10, 10, this.targetWord, {
          fontSize: "32px",
          fill: "#fff",
        });
      }
    }
    this.currentWordText = this.add.text(
      this.gameWidth / 2 - 100,
      this.gameHeight - 150,
      this.currentWord,
      {
        fontSize: "32px",
        fill: "#fff",
      }
    );
    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "Backspace") {
        this.currentWord = this.currentWord.slice(0, -1);
        this.currentWordText.setText(this.currentWord);
        return;
      }
      this.currentWord += event.key;
      this.currentWordText.setText(this.currentWord);
      if (this.currentWord === this.targetWord) {
        this.currentWord = "";
        this.currentWordText.setText(this.currentWord);
        this.targetWordText.destroy();
        this.targetWordSprite.destroy();
        // adds new word until there are none left from wordsData
        this.addNewWord();
      }
    });
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player = this.add
      .sprite(this.gameWidth / 2, this.gameHeight - 100, "player")
      .setOrigin(0, 0);
    // physics sprite added for debugging, visually see where the physics of the player is
    this.physics.add.sprite(this.gameWidth / 2, this.gameHeight - 100)
      .setOrigin(0, 0);
    this.player.body.setSize(this.gameWidth, this.player.height, true);
    // physics collision detection, will destroy the word if collides with player then render new word
    this.physics.add.collider(this.words, this.player, (wordSprite, playerSprite) => {
      // also could add a check if player health is > 0 before rendering new word
      wordSprite.destroy();
      this.addNewWord();
    });
  }
  update() {
    if (this.targetWordSprite && this.targetWordText) {
      this.targetWordText.x = this.targetWordSprite.x;
      this.targetWordText.y = this.targetWordSprite.y;
    }
    if (this.targetWordSprite && this.targetWordSprite.y > this.gameHeight) {
      this.targetWordSprite.setY(0);
      this.targetWordText.setY(0);
    }
  }
}

export default GameScene;