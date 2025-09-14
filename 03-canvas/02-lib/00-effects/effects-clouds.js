/* effects-clouds.js
   Minimal cloud effects and particleFog using the ParticleEmitter API.
   This file is a safe, self-contained implementation intended to restore
   a syntactically-correct baseline and migrate particleFog to the
   centralized particle system.
*/

(function () {
    'use strict';

    const Effects = Weather.Renderer.Effects;
    const ParticleEmitter = Weather.Renderer.ParticleEmitter;

    // Simple, decorative cloud overlay effect (non-particle)
    Effects.add('clouds', {
        defaultParameters: {
            opacity: 0.5,
            color: '#ffffff'
        },
        init() {},
        draw(ctx) {
            const w = this.layer.width;
            const h = this.layer.height;
            ctx.save();
            ctx.globalAlpha = this.opacity || 0.5;
            ctx.fillStyle = this.color || '#ffffff';
            // Simple stripe of clouds across the top
            const y = h * 0.15;
            ctx.beginPath();
            ctx.ellipse(w * 0.5, y, w * 0.6, h * 0.12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    // Thin cirrus band
    Effects.add('cirrus', {
        defaultParameters: {
            opacity: 0.25,
            color: '#f8f8ff'
        },
        init() {},
        draw(ctx) {
            const w = this.layer.width;
            const h = this.layer.height;
            ctx.save();
            ctx.globalAlpha = this.opacity || 0.25;
            ctx.fillStyle = this.color || '#f8f8ff';
            const y = h * 0.25;
            ctx.beginPath();
            ctx.ellipse(w * 0.35, y, w * 0.4, h * 0.06, -0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    // Overcast: a full-sheet soft overlay
    Effects.add('overcast', {
        defaultParameters: {
            opacity: 0.45,
            color: '#dddddd'
        },
        init() {},
        draw(ctx) {
            const w = this.layer.width;
            const h = this.layer.height;
            ctx.save();
            ctx.globalAlpha = this.opacity || 0.45;
            ctx.fillStyle = this.color || '#dddddd';
            ctx.fillRect(0, 0, w, h * 0.5);
            ctx.restore();
        }
    });

    // particleFog: migrate to ParticleEmitter
    Effects.add('particleFog', {
        defaultParameters: {
            particleCount: 60,
            color: 'rgba(240,240,245,0.6)',
            windSpeed: 0.2,
            spread: 0.6
        },

        init() {
            // Ensure we have an animation heartbeat if the layer doesn't provide one
            if (!this.animation) this.animation = {};
            if (!this.animation.updateRate) this.animation.updateRate = 80;

            const layer = this.layer;
            const params = this;

            // Create the emitter that uses the shared Particle system
            this._emitter = new ParticleEmitter({
                particleCount: Number(params.particleCount) || 60,
                initialSettings: {
                    life: 6000,
                    size: 30
                },
                generator: function () {
                    // random position across the whole layer, with vertical bias
                    const x = Math.random() * layer.width;
                    const y = Math.random() * layer.height;
                    const angle = Math.random() * Math.PI * 2;
                    const speed = (Math.random() - 0.5) * params.windSpeed;
                    const size = 20 + Math.random() * 40 * (params.spread || 0.6);
                    return {
                        position: { x: x, y: y },
                        velocity: { x: speed, y: (Math.random() - 0.5) * 0.05 },
                        life: 4000 + Math.random() * 4000,
                        size: size,
                        rotation: angle,
                        color: params.color
                    };
                },
                // onUpdate receives (particle, dt)
                onUpdate: function (p, dt) {
                    // simple advection + slight wandering
                    if (!p.velocity) p.velocity = { x: 0, y: 0 };
                    p.position.x += p.velocity.x * dt;
                    p.position.y += p.velocity.y * dt;

                    // wrap around horizontally for steady fog
                    if (p.position.x < -50) p.position.x = layer.width + 50;
                    if (p.position.x > layer.width + 50) p.position.x = -50;
                    // slowly change velocity for natural motion
                    p.velocity.x += (Math.random() - 0.5) * 0.0005 * dt;
                    p.velocity.y += (Math.random() - 0.5) * 0.0002 * dt;
                }
            });

            // start the emitter if it has lifecycle controls
            if (typeof this._emitter.start === 'function') this._emitter.start();
        },

        draw(ctx) {
            if (!this._emitter) return;

            // Use the emitter's draw helper if present, otherwise iterate particles
            if (typeof this._emitter.draw === 'function') {
                this._emitter.draw(ctx, (p) => {
                    ctx.save();
                    // particle color may be a string (rgba) or existing color property
                    ctx.globalAlpha = Math.max(0, Math.min(1, (p.life || 1000) / 4000)) * 0.8;
                    ctx.fillStyle = p.color || this.color || 'rgba(240,240,245,0.6)';
                    const sx = p.position.x;
                    const sy = p.position.y;
                    const rx = (p.size || 30) * 1.1;
                    const ry = (p.size || 30) * 0.55;
                    ctx.beginPath();
                    ctx.ellipse(sx, sy, rx, ry, p.rotation || 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
                return;
            }

            // Fallback: if emitter exposes particles array, draw them
            if (Array.isArray(this._emitter.particles)) {
                for (let i = 0; i < this._emitter.particles.length; i++) {
                    const p = this._emitter.particles[i];
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, Math.min(1, (p.life || 1000) / 4000)) * 0.8;
                    ctx.fillStyle = p.color || this.color || 'rgba(240,240,245,0.6)';
                    const sx = p.position.x;
                    const sy = p.position.y;
                    const rx = (p.size || 30) * 1.1;
                    const ry = (p.size || 30) * 0.55;
                    ctx.beginPath();
                    ctx.ellipse(sx, sy, rx, ry, p.rotation || 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        },

        onDisable() {
            if (this._emitter && typeof this._emitter.stop === 'function') this._emitter.stop();
            this._emitter = null;
        }
    });
})();
