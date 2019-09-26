/* global ig */
ig.module(
  'game.entities.zombie'
).requires(
  'impact.entity'
).defines(function () {
  // eslint-disable-next-line no-undef
  EntityZombie = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/zombie.png', 16, 16),

    size: { x: 8, y: 14 },
    offset: { x: 4, y: 2 },
    flip: false,

    maxVel: { x: 100, y: 100 },
    friction: { x: 150, y: 0 },
    speed: 14,

    init: function (x, y, settings) {
      this.parent(x, y, settings)
      this.addAnim('walk', 0.07, [0, 1, 2, 3, 4, 5])
    },

    update: function () {
      // near an edge? return!
      if (!ig.game.collisionMap.getTile(
        this.pos.x + (this.flip ? 4 : this.size.x - 4),
        this.pos.y + this.size.y + 1
      )) {
        this.flip = !this.flip
      }

      var xdir = this.flip ? -1 : 1
      this.vel.x = this.speed * xdir
      this.currentAnim.flip.x = this.flip

      this.parent()
    },

    handleMovementTrace: function (res) {
      this.parent(res)

      // collision with a wall? return!
      if (res.collision.x) {
        this.flip = !this.flip
      }
    }
  })
})
