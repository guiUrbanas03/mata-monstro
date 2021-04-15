new Vue({
    el: '#app',
    data: {
        playing: false,
        tutorial: false,
        specialTracker: 0,
        activeSpecial: false,
        activeHeal: false,
        win: false,
        draw: false,
        end: false,
        wins: 0,
        treasureOpened: false,
        getTreasure: false,
        logs: [],
        turn: {
            current: 0,
            logs: [],
        },
        player: {
            health: 100,
        },
        monster: {
            health: 100,
        },
    },

    mounted() {
        if (localStorage.wins) {
            this.wins = localStorage.wins;
        }
    },

    methods: {
        startGame() {
            this.playing = true;
        },

        quitGame() {
            this.playing = false;
            this.resetGame();
        },

        resetGame() {
            this.specialTracker = 0;
            this.player.health = 100;
            this.monster.health = 100;
            this.activeSpecial = false;
            this.activeHeal = false;
            this.win = false;
            this.end = false;
            this.draw = false;
            this.logs = [];
            this.turn = {
                current: 0,
                logs: [],
            };
        },

        attack() {
            const playerDamage = this.randomDamage(13, 1);
            const monsterDamage = this.randomDamage(15, 1);

            this.player.health - monsterDamage >= 0
                ? (this.player.health -= monsterDamage)
                : (this.player.health = 0);

            this.monster.health - playerDamage >= 0
                ? (this.monster.health -= playerDamage)
                : (this.monster.health = 0);

            this.registerLog(
                `Jogador atingiu monstro com ${playerDamage} de dano`,
                `Monstro atingiu jogador com ${monsterDamage} de dano`
            );
            this.specialTracker++;
            this.turn.current++;
        },

        heal() {
            const playerHeal = this.randomDamage(15, 1);
            const monsterDamage = this.randomDamage(15, 1);

            this.player.health - monsterDamage >= 0
                ? (this.player.health -= monsterDamage)
                : (this.player.health = 0);

            this.player.health + playerHeal < 100
                ? (this.player.health += playerHeal)
                : (this.player.health = 100);

            this.specialTracker++;
            this.turn.current++;

            this.registerLog(
                `Jogador se curou: +${playerHeal} de vida`,
                `Monstro atingiu jogador com ${monsterDamage} de dano`
            );
        },

        special() {
            this.activeSpecial = false;
            const playerDamage = this.randomDamage(18, 1);
            const monsterDamage = this.randomDamage(15, 1);

            this.player.health - monsterDamage >= 0
                ? (this.player.health -= monsterDamage)
                : (this.player.health = 0);

            this.monster.health - playerDamage >= 0
                ? (this.monster.health -= playerDamage)
                : (this.monster.health = 0);

            this.registerLog(
                `Jogador atingiu monstro com ataque especial: ${playerDamage} de dano`,
                `Monstro atingiu jogador com ${monsterDamage} dano`
            );

            this.turn.current++;
        },

        openTutorial() {
            this.tutorial = true;
        },

        closeTutorial() {
            this.tutorial = false;
        },

        openTreasure() {
            this.getTreasure = true;
        },

        closeTreasure() {
            this.getTreasure = false;
        },

        registerLog(playerLog, monsterLog) {
            this.logs.push({
                player: playerLog,
                monster: monsterLog,
            });
        },

        randomDamage(mult, add) {
            return Math.floor(Math.random() * mult) + add;
        },

        forceScroll() {
            const logContainer = this.$refs.logContainer;
            logContainer.scrollTop = logContainer.scrollHeight;
        },

        saveWins() {
            localStorage.wins = this.wins;
        },
    },

    computed: {
        healthBarProgress() {
            return {
                player: `${this.player.health}%`,
                monster: `${this.monster.health}%`,
            };
        },

        critical() {
            return {
                player: this.player.health < 50 ? true : false,
                monster: this.monster.health < 50 ? true : false,
            };
        },

        currentTurn() {
            return this.turn.current;
        },
    },

    watch: {
        specialTracker() {
            if (this.specialTracker % 3 === 0 && this.specialTracker !== 0) {
                this.activeSpecial = true;
            }
        },

        currentTurn() {
            if (this.player.health > 0 && this.monster.health === 0) {
                this.wins++;
                this.end = true;
                this.win = true;
            } else if (this.player.health === 0 && this.monster.health > 0) {
                this.end = true;
                this.win = false;
            } else if (this.player.health === 0 && this.monster.health === 0) {
                this.draw = true;
                this.end = true;
            }
            if (this.turn.current != 0) {
                this.turn.logs.push(this.currentTurn);
            }
            this.forceScroll();

            let random = Math.round(Math.random());
            this.activeHeal = Boolean(random);
        },

        wins() {
            if (this.wins >= 10) {
                this.treasureOpened = true;
            }

            this.saveWins();
        },
    },
});
