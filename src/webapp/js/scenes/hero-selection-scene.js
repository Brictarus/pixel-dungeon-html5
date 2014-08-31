define(['scenes/base-scene', 'asset-loader', 'gui/button', 'gui/radio-button', 'gui/simple-button', 'gui/panel',
    'scenes/arcs', 'models/warrior', 'models/mage', 'models/rogue', 'models/huntress'],
  function (BaseScene, AssetLoader, Button, RadioButton, SimpleButton, Panel, Arcs,
    Warrior, Mage, Rogue, Huntress) {
    var HeroSelectionScene = BaseScene.extend({
      init: function (options) {
        this.game = options.game;
        this.zoom = options.zoom;
        this.height = options.height;
        this.width = options.width;
        this.context = options.context;
        this.showHeroDescription = false;

        if (options.arcsData) {
          this.arcs1VertOffset = options.arcsData.arcs1VertOffset;
          this.arcs2VertOffset = options.arcsData.arcs2VertOffset;
        } else {
          this.arcs1VertOffset = 0;
          this.arcs2VertOffset = 0;
        }
        this.started = false;

        this.aLoader = new AssetLoader(this.game.config.assetConfig);
        this.aLoader.addSprite("avatars", "png");
        this.aLoader.addSprite("arcs1", "png");
        this.aLoader.addSprite("arcs2", "png");
        this.aLoader.addSprite("icons", "png");
        this.aLoader.addSprite("chrome", "png");
        this.aLoader.load(this.onResourcesLoaded.bind(this));

        this.children = [];
      },

      initScene: function () {
        var canvasH = this.height;
        var canvasW = this.width;

        // boutons
        var xOffset = ((canvasW / 2) - 24) / 2;
        var avatarsImg = this.aLoader.spriteData('avatars').image;
        this.warriorButton = new RadioButton({
          scene: this,
          text: "WARRIOR",
          img: {
            data: avatarsImg,
            sx: 0, sy: 0, w: 24, h: 32
          },
          position: {
            x: xOffset,
            y: (canvasH / 3) + (avatarsImg.height / 2) - 50
          },
          size: {
            w: 24 * this.zoom,
            h: 32 * this.zoom
          },
          alpha: 0.2,
          pressedCallback: function () {
            this.scene.selectHero(this);
          }
        });

        this.mageButton = new RadioButton({
          scene: this,
          text: "MAGE",
          img: {
            data: avatarsImg,
            sx: 24, sy: 0, w: 24, h: 32
          },
          position: {
            x: xOffset + (canvasW / 2),
            y: (canvasH / 3) + (avatarsImg.height / 2) - 50
          },
          size: {
            w: 24 * this.zoom,
            h: 32 * this.zoom
          },
          alpha: 0.2,
          pressedCallback: function () {
            this.scene.selectHero(this)
          }
        });

        this.rogueButton = new RadioButton({
          scene: this,
          text: "ROGUE",
          img: {
            data: avatarsImg,
            sx: 48, sy: 0, w: 24, h: 32
          },
          position: {
            x: xOffset,
            y: (canvasH / 3) + (avatarsImg.height / 2) + 70
          },
          size: {
            w: 24 * this.zoom,
            h: 32 * this.zoom
          },
          alpha: 0.2,
          pressedCallback: function () {
            this.scene.selectHero(this)
          }
        });

        this.huntressButton = new RadioButton({
          scene: this,
          text: "HUNTRESS",
          img: {
            data: avatarsImg,
            sx: 72, sy: 0, w: 24, h: 32
          },
          position: {
            x: xOffset + (canvasW / 2),
            y: (canvasH / 3) + (avatarsImg.height / 2) + 70
          },
          size: {
            w: 24 * this.zoom,
            h: 32 * this.zoom
          },
          alpha: 0.2,
          pressedCallback: function () {
            this.scene.selectHero(this)
          }
        });

        var iconsImg = this.aLoader.spriteData('icons').image;
        this.backButton = new Button({
          text: "Retour",
          hideText: true,
          img: {
            data: iconsImg,
            sx: 98, sy: 0, w: 16, h: 14
          },
          position: {
            x: canvasW - (10 * this.zoom) - 10,
            y: 10
          },
          size: {
            w: (10 * this.zoom),
            h: (10 * this.zoom)
          },
          pressedCallback: (function () {
            if(this.showHeroDescription){
              this.showHeroDescription = false;
              return;
            }
            this.game.changeScene({
              sceneName: "TITLE",
              arcsData: {
                arcs1VertOffset: this.arcs.arcs1VertOffset,
                arcs2VertOffset: this.arcs.arcs2VertOffset
              }
            });
          }).bind(this)
        });
        this.challengeButton = new Button({
          alpha: 0.2,
          hideText: true,
          img: {
            data: iconsImg,
            sx: 79, sy: 15, w: 22, h: 24
          },
          position: {
            x: canvasW / 2 - 12,
            y: (canvasH / 3) + (avatarsImg.height / 2) + 70 - 24
          },
          size: {
            w: (18 * this.zoom),
            h: (18 * this.zoom)
          },
          pressedCallback: (function () {
            console.info('Challenges not implemented yet');
          }).bind(this)
        });

        this.herosToButtons = {
          WARRIOR: this.warriorButton,
          MAGE: this.mageButton,
          ROGUE: this.rogueButton,
          HUNTRESS: this.huntressButton
        }

        this.children.push(this.warriorButton);
        this.children.push(this.mageButton);
        this.children.push(this.rogueButton);
        this.children.push(this.huntressButton);

        this.children.push(this.challengeButton);

        this.children.push(this.backButton);

        this.newGameButton = new SimpleButton({
          alpha: 0.2,
          hideText: false,
          text: 'New game',
          position: {
            x: 50,
            y: (2 * canvasH / 3) + 100
          },
          size: {
            w: canvasW - 100,
            h: 24
          },
          pressedCallback: (function () {
            console.info('New game not implemented yet');
          }).bind(this)
        });

        this.heroDescriptionPanel = new Panel({
          pos: { x: 20, y: 50 }, size: { w: this.width - 20 * 2, h: this.height - 50 - 15 },
          zoom: this.zoom,
          padding: 6,
          images: {
            spriteImg: this.aLoader.spriteData('chrome').image,
            cornerTopLeft: {
              sx: 0, sy: 0, sw: 11, sh: 11
            }, cornerTopRight: {
              sx: 11, sy: 0, sw: 11, sh: 11
            }, cornerBottomRight: {
              sx: 11, sy: 11, sw: 11, sh: 11
            }, cornerBottomLeft: {
              sx: 0, sy: 11, sw: 11, sh: 11
            }, left: {
              sx: 0, sy: 11, sw: 11, sh: 1
            }, top: {
              sx: 11, sy: 0, sw: 1, sh: 11
            }, right: {
              sx: 11, sy: 11, sw: 11, sh: 1
            }, bottom: {
              sx: 11, sy: 11, sw: 1, sh: 11
            },
            center: {
              sx: 10, sy: 10, sw: 1, sh: 1
            }
          }
        });

        // défilement du background (arcs1 et arcs2)
        this.arcs = new Arcs({
          arcs1Asset: this.aLoader.spriteData('arcs1'),
          arcs2Asset: this.aLoader.spriteData('arcs2'),
          arcs1VertOffset: this.arcs1VertOffset,
          arcs2VertOffset: this.arcs2VertOffset,
          size: {
            w: this.width,
            h: this.height
          },
          zoom: this.zoom
        });

        this.selectDefaultHero();
      },

      onResourcesLoaded: function () {
        this.initScene();
            this.ready = true;
      },

      selectHero: function (heroButton) {

        if (this.selectedHero) {
          if (this.selectedHero == heroButton) {
            this.showHeroDescription = true;
            this.heroDescriptionPanel.setText(this.getHeroDescription(heroButton.text));
            return;
          }
          this.showHeroDescription = false;
          this.selectedHero.unselect();
        }
        heroButton.select();
        this.selectedHero = heroButton;
      },

      getHeroDescription: function(type){
        switch(type){
          case 'WARRIOR':
            return Warrior.description;
          case 'MAGE':
            return Mage.description;
          case 'ROGUE':
            return Rogue.description;
          case 'HUNTRESS':
            return Huntress.description;
          default: return '';
        }
      },

      update: function () {
        // background scrolling
        this.arcs.update();
      },

      selectDefaultHero: function () {
        var className = localStorage.getItem('LAST_CLASS') || "WARRIOR";
        var button = this.herosToButtons[className];
        this.selectHero(button);
      },


      hitTest: function (x, y) {
        for (var i = this.children.length - 1; i >= 0; i--) {
          if (this.children[i].hitTest) {
            var res = this.children[i].hitTest(x, y);
            if (res === true) return this.children[i];
          }
        }
        if (this.newGameButton.hitTest(x, y) === true) {
          return this.newGameButton;
        }
        return null;
      },

      draw: function () {
        var canvasW = this.width,
          canvasH = this.height,
          zoom = this.zoom;

        this.arcs.draw(this.context);

        // draw title
        var titleImg = this.aLoader.spriteData('banners').image;
        this.context.drawImage(titleImg, 0, 136, titleImg.width, 28,
            (canvasW / 2) - (titleImg.width / 2 * zoom), (canvasH / 3) - (titleImg.height / 2), titleImg.width * 2, 28 * zoom);

        // draw buttons
        this.children.forEach((function (element) {
          element.draw(this.context);
        }).bind(this));

        if (this.selectedHero) {
          this.newGameButton.draw(this.context);
        }

        if(this.showHeroDescription){
          this.heroDescriptionPanel.draw(this.context);
        }
      }

    });

    return HeroSelectionScene;
  })