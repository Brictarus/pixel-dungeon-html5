define({
  version: "0.0",
  assetConfig: {
    spritesDir: 'assets/img/',
    soundsDir: 'assets/snd/',

    badges: {
      imgName: "badges",
      sw: 15,
      sh: 15,
      KILLED: {
        KILLED_10: {
          sx: 0, sy: 0, desc: "10 enemies slain"
        },
        KILLED_50: {
          sx: 16, sy: 0, desc: "50 enemies slain"
        }
      },
      GOLD: {
        GOLD_100: {
          sx: 64, sy: 0, desc: "100 gold collected"
        },
        GOLD_500: {
          sx: 80, sy: 0, desc: "500 gold collected"
        }
      },
      LEVEL: {
        LEVEL_6: {
          sx: 0, sy: 16, desc: "Level 6 reached"
        }, LEVEL_11: {
          sx: 16, sy: 16, desc: "Level 11 reached"
        }
      },
      BOSS: {
        BOSS_1: {
          sx: 64, sy: 16, desc: "1st boss slain"
        }, BOSS_2: {
          sx: 80, sy: 16, desc: "2nd boss slain"
        }
      }
    }
  }
});