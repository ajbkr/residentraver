/* global ig, LevelDorm1 */
ig.module(
  'game.main'
).requires(
  'impact.game',
  'game.levels.dorm1'
).defines(function () {
  const MyGame = ig.Game.extend({
    gravity: 300,

    init: function () {
      // Initialize your game here; bind keys etc.

      // Bind keys
      ig.input.bind(ig.KEY.LEFT_ARROW, 'left')
      ig.input.bind(ig.KEY.RIGHT_ARROW, 'right')
      ig.input.bind(ig.KEY.X, 'jump')
      ig.input.bind(ig.KEY.C, 'shoot')

      this.loadLevel(LevelDorm1)
    },

    update: function () {
      // Update all entities and backgroundMaps
      this.parent()

      // Add your own, additional update code here
    },

    draw: function () {
      // Draw all entities and backgroundMaps
      this.parent()

      // Add your own drawing code here
    }
  })

  // Start the Game with 60fps, a resolution of 320x240, scaled
  // up by a factor of 2
  ig.main('#canvas', MyGame, 60, 320, 240, 2)
})
