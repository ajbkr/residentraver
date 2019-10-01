/* global ig */
ig.module(
  'game.entities.player'
).requires(
  'impact.entity'
).defines(function () {
  // eslint-disable-next-line no-undef
  EntityPlayer = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/player.png', 16, 16),

    size: { x: 8, y: 14 },
    offset: { x: 4, y: 2 },
    flip: false,

    maxVel: { x: 100, y: 150 },
    friction: { x: 600, y: 0 },
    accelGround: 400,
    accelAir: 200,
    jump: 200,

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,

    weapon: 0,
    totalWeapons: 2,
    activeWeapon: 'EntityBullet',

    startPosition: null,

    invincible: true,
    invincibleDelay: 2,
    invincibleTimer: null,

    draw: function () {
      if (this.invincible) {
        this.currentAnim.alpha = this.invincibleTimer.delta() / this.invincibleDelay * 1
      }
      this.parent()
    },

    init: function (x, y, settings) {
      this.startPosition = { x: x, y: y }

      this.invincibleTimer = new ig.Timer()
      this.makeInvincible()

      this.parent(x, y, settings)

      // Add the animations
      this.setupAnimation(this.weapon)
    },

    kill: function () {
      this.parent()
      // eslint-disable-next-line no-undef
      ig.game.spawnEntity(EntityPlayer, this.startPosition.x,
        this.startPosition.y)
    },

    makeInvincible: function () {
      this.invincible = true
      this.invincibleTimer.reset()
    },

    receiveDamage: function (amount, from) {
      if (this.invincible) {
        return
      }
      this.parent(amount, from)
    },

    setupAnimation: function (offset) {
      offset *= 10
      this.addAnim('idle', 1, [0 + offset])
      this.addAnim('run', 0.07, [0, 1, 2, 3, 4, 5].map(val => val + offset))
      this.addAnim('jump', 1, [9 + offset])
      this.addAnim('fall', 0.4, [6, 7].map(val => val + offset))
    },

    update: function () {
      // Move left or right
      const accel = this.standing ? this.accelGround : this.accelAir

      if (ig.input.state('left')) {
        this.accel.x = -accel
        this.flip = true
      } else if (ig.input.state('right')) {
        this.accel.x = accel
        this.flip = false
      } else {
        this.accel.x = 0
      }

      // Jump
      if (this.standing && ig.input.pressed('jump')) {
        this.vel.y = -this.jump
      }

      // Shoot
      if (ig.input.pressed('shoot')) {
        // eslint-disable-next-line no-undef
        ig.game.spawnEntity(this.activeWeapon, this.pos.x, this.pos.y, { flip: this.flip })
      }

      // Switch [weapon]
      if (ig.input.pressed('switch')) {
        ++this.weapon
        if (this.weapon >= this.totalWeapons) {
          this.weapon = 0
        }
        switch (this.weapon) {
          case 0:
            this.activeWeapon = 'EntityBullet'
            break
          case 1:
            this.activeWeapon = 'EntityGrenade'
        }
        this.setupAnimation(this.weapon)
      }

      // Set the current animation, based on the player's speed
      if (this.vel.y < 0) {
        this.currentAnim = this.anims.jump
      } else if (this.vel.y > 0) {
        this.currentAnim = this.anims.fall
      } else if (this.vel.x !== 0) {
        this.currentAnim = this.anims.run
      } else {
        this.currentAnim = this.anims.idle
      }
      this.currentAnim.flip.x = this.flip

      if (this.invincibleTimer.delta() > this.invincibleDelay) {
        this.invincible = false
        this.currentAnim.alpha = 1
      }

      // Move!
      this.parent()
    }
  })

  // eslint-disable-next-line no-undef
  EntityBullet = ig.Entity.extend({
    size: { x: 5, y: 3 },
    animSheet: new ig.AnimationSheet('media/bullet.png', 5, 3),
    maxVel: { x: 200, y: 0 },

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function (x, y, settings) {
      this.parent(x + (settings.flip ? -4 : 8), y + 8, settings)
      this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x)
      this.addAnim('idle', 0.2, [0])
    },

    handleMovementTrace: function (res) {
      this.parent(res)
      if (res.collision.x || res.collision.y) {
        this.kill()
      }
    },

    check: function (other) {
      other.receiveDamage(3, this)
      this.kill()
    }
  })

  // eslint-disable-next-line no-undef
  EntityGrenade = ig.Entity.extend({
    size: { x: 4, y: 4 },
    offset: { x: 2, y: 2 },
    animSheet: new ig.AnimationSheet('media/grenade.png', 8, 8),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 200, y: 200 },
    bounciness: 0.6,
    bounceCounter: 0,

    init: function (x, y, settings) {
      this.parent(x + (settings.flip ? -4 : 7), y, settings)
      this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x)
      this.vel.y = -(50 + (Math.random() * 100))
      this.addAnim('idle', 0.2, [0, 1])
    },

    handleMovementTrace: function (res) {
      this.parent(res)
      if (res.collision.x || res.collision.y) {
        // Only bounce 3 times
        ++this.bounceCounter
        if (this.bounceCounter > 3) {
          this.kill()
        }
      }
    },

    check: function (other) {
      other.receiveDamage(10, this)
      this.kill()
    }
  })
})
