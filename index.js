
class Game {
    constructor() {
        let d = document;
        this.eRecommendTitle = d.getElementsByClassName("recommendTitle")[0];
        this.eRecommendText = d.getElementsByClassName("recommendText")[0];
        this.eRecommendHand = d.getElementsByClassName("recommendHand")[0];
        this.eRateText = d.getElementsByClassName("rateText")[0];
        this.eRateText.innerHTML = "";
        this.eEnemyHandsTitle = d.getElementsByClassName("jrHandsTitle")[0];
        this.eEnemyHands = [
            d.getElementsByClassName("jrHand gu")[0],
            d.getElementsByClassName("jrHand choki")[0],
            d.getElementsByClassName("jrHand pa")[0],
        ];
        this.eSelectedEnemyHandIndex = null;
        for (let i = 0; i < this.eEnemyHands.length; i++) {
            let e = this.eEnemyHands[i];
            e.onclick = () => {
                this.eSelectedEnemyHandIndex = i;
                for (const e of this.eEnemyHands) {
                    e.classList.remove("selected");
                }
                e.classList.add("selected");
                this.eNextButton.disabled = false;
            }
        }
        this.eNextButton = d.getElementsByClassName("nextButton")[0];
        this.eNextButton.disabled = true;
        this.eNextButton.onclick = () => {
            this.eNextButton.disabled = true;

            const index = this.eSelectedEnemyHandIndex;
            this.enemyRemainingHands[index] -= 1;
            this.eEnemyHands[index].classList.remove("selected");
            if (this.enemyRemainingHands[index] === 0) {
                this.eEnemyHands[index].classList.add("disabled");
            }

            if (this.round >= 9) {
                window.location.reload();
                return;
            }
            this.round += 1;
            if (this.round === 9) {
                this.eEnemyHandsTitle.style.display = "none";
                for (const e of this.eEnemyHands) {
                    e.style.display = "none";
                }
                this.eNextButton.setAttribute("value", "もういっかい");
                this.eNextButton.disabled = false;
            }

            this.showRecommendHand();
        };

        this.round = 1;
        this.enemyRemainingHands = [3, 3, 3];
        this.showRecommendHand();
    }

    showRecommendHand() {
        this.eRecommendTitle.innerHTML = this.round + "回目のおすすめは…";
        let total = this.enemyRemainingHands.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        // probabilities
        let p = {
            gu: this.enemyRemainingHands[0] / total,
            choki: this.enemyRemainingHands[1] / total,
            pa: this.enemyRemainingHands[2] / total,
        };
        // evaluation
        let gu = p.gu * 0 + p.choki * 100 + p.pa * -100;
        let choki = p.gu * -100 + p.choki * 0 + p.pa * 100;
        let pa = p.gu * 100 + p.choki * -100 + p.pa * 0;
        let max = Math.max(gu, choki, pa);

        let classList = this.eRecommendHand.classList;
        classList.remove("gu", "choki", "pa");
        if (gu === max) {
            classList.add("gu");
            this.setRateText(p.choki, p.gu, p.pa);
        } else if (choki === max) {
            classList.add("choki");
            this.setRateText(p.pa, p.choki, p.gu);
        } else {
            classList.add("pa");
            this.setRateText(p.gu, p.pa, p.choki);
        }
        this.eRecommendHand.classList = classList;
        console.log(gu, choki, pa);
    }

    setRateText(win, draw, lose) {
        let winText = (Math.floor(win * 1000) / 10).toString();
        let drawText = (Math.floor(draw * 1000) / 10).toString();
        let loseText = (Math.floor(lose * 1000) / 10).toString();
        this.eRateText.innerHTML = "かち率:" + winText + "% " + "あいこ率:" + drawText + "% " + "まけ率:" + loseText + "%";
    }
}

window.onload = function () {
    window.game = new Game();
};
