//body, startscherm en eindscherm
var body = document.querySelector('body')
var overlayStart = document.querySelector('.overlay2')
var overlayEind = document.querySelector('.overlay')

//health bijhouden en weergeven
var healthP1 = 200
var healthP2 = 200
var teller = 0
var exit = 0
var textHp1 = document.querySelector('.hptext p')
var textHp2 = document.querySelector('.hptext p:nth-of-type(2)')
var textLeft = document.querySelector('.hp h2')
var textRight = document.querySelector('.hp h2:nth-of-type(2)')
var eindstand = document.querySelector('.overlay p')

//events
var startButton = document.querySelector('.overlay2 button')
var restart = document.querySelector('.overlay button')
var buttonOne = document.querySelector('.buttonOne')
var buttonTwo = document.querySelector('.buttonTwo')
var buttonThree = document.querySelector('.buttonThree')
var heal1 = document.querySelector('.heal1')
var heal2 = document.querySelector('.heal2')
var heal3 = document.querySelector('.heal3')
//bron: https://genshin-impact.fandom.com/wiki/Potions

//audio
var audio1 = new Audio('./audio/traveler/prepare.mp4')
var audio2 = new Audio('./audio/traveler/windblade.mp4')
var audio3 = new Audio('./audio/traveler/begone.mp4')
var audio4 = new Audio('./audio/traveler/heavy.mp4')
//bron: https://genshin-impact.fandom.com/wiki/Traveler/Voicelines#Lumine
var audio5 = new Audio('./audio/healed.mp3')
audio5.volume = 0.5
//bron: https://www.epidemicsound.com/sound-effects/whoosh/?tags=shimmer&tags=ascend
var audioK1 = new Audio('./audio/kaeya/lookingforward.mp4')
var audioK2 = new Audio('./audio/kaeya/dodge.mp4')
var audioK3 = new Audio('./audio/kaeya/freeze.mp4')
var audioK4 = new Audio('./audio/kaeya/luck.mp4')
var audioK5 = new Audio('./audio/kaeya/sosorry.mp4')
var audioK6 = new Audio('./audio/kaeya/unexpected.mp4')
//bron: https://genshin-impact.fandom.com/wiki/Kaeya/Voicelines

function start() {
    audio5.play();
    overlayStart.classList.remove('overlay2') //het startscherm wordt verborgen
    overlayStart.classList.add('hidden')
    verwerkFormulier() //de gekozen moeilijkheid wordt toegepast
}

startButton.addEventListener('click', start) //dit is de button op het startscherm

function rematch() {
    location.reload(); //herlaad de pagina zodat er opnieuw gespeeld kan worden
}

function verwerkFormulier() { //de gekozen moeilijkheid wordt toegepast door HP te verlagen of verhogen
    var moeilijkheid = document.querySelector('input[name="moeilijkheid"]:checked').value
    if (moeilijkheid == 'makkelijk') {
        healthP1 = 250
    } else if (moeilijkheid == 'moeilijk') {
        healthP1 = 150
    } else {
        healthP1 = 200
    }
    textHp1.textContent = 'HP: ' + healthP1
}

//canvas
function tekenBar1() {
    var canvas1 = document.querySelector('.canvas1');
    canvas1.width = 200
    canvas1.height = 30
    var ctx = canvas1.getContext('2d');
    ctx.fillStyle = 'rgb(18, 232, 32)'; //groene vul kleur voor de health bar
    ctx.fillRect(0, 0, (healthP1 / 100) * 100, 30);
    //het huidige percentage health x de width van de balk = de nieuwe width van de balk

    if (healthP1 <= 100) {
        //als de health gehalveerd is wordt de levensbalk oranje getekent ipv groen
        var canvas1 = document.querySelector('.canvas1');
        canvas1.width = 200
        canvas1.height = 30
        var ctx = canvas1.getContext('2d');
        ctx.fillStyle = 'rgb(251, 163, 26)';
        ctx.fillRect(0, 0, (healthP1 / 100) * 100, 30);
    }
}

function tekenBar2() {
    var canvas2 = document.querySelector('.canvas2');
    canvas2.width = 600
    canvas2.height = 30
    var ctx2 = canvas2.getContext('2d');
    ctx2.fillStyle = 'rgb(18, 232, 32)';
    ctx2.fillRect(0, 0, (healthP2 / 100) * 100, 30);

    if (healthP2 <= 100) {
        var canvas2 = document.querySelector('.canvas2');
        canvas2.width = 600
        canvas2.height = 30
        var ctx2 = canvas2.getContext('2d');
        ctx2.fillStyle = 'rgb(251, 163, 26)';
        ctx2.fillRect(0, 0, (healthP2 / 100) * 100, 30);
    }
}

tekenBar1();
tekenBar2();

function check() {
    //checkt de health en voert op basis van de health acties uit

    if (healthP1 <= 100) {
        body.classList.add('damage1') //lichte rode gloed aan de rand van het scherm
    }

    if (healthP1 <= 20) {
        body.classList.add('damage2') //sterke rode gloed aan de rand van het scherm
    }

    if (healthP1 <= 0) {
        healthP1 = 0
        audioK5.play();
        exit = 1 //hierdoor wordt een return aangeroepen in de aanval functie
        overlayEind.classList.add('zichtbaar') //als de speler 0 health heeft wordt het eindscherm weergeven
        eindstand.textContent = 'Better luck next time...'
        restart.addEventListener('click', rematch) //rematch() herlaad de pagina zodat er opnieuw gespeeld kan worden
    }

    if (healthP2 <= 0) {
        healthP2 = 0
        audioK6.play();
        exit = 1
        overlayEind.classList.add('zichtbaar')
        eindstand.textContent = 'Victory!'
        restart.addEventListener('click', rematch)
    }
}

function tellen() {
    //player 1 is aan de beurt als de teller op 0 staat
    //deze functie wordt aangeroepen als player 1 een aanval doet
    //bij de teller wordt dan 1 opgeteld, zodat je de aanval niet 2x achter elkaar kan uitvoeren
    teller++
    buttonOne.classList.add('uit') //als je niet aan de beurt bent worden de buttons grijs
    buttonTwo.classList.add('uit')
    buttonThree.classList.add('uit')
}

//acties player 1
function actionOne() {
    if (teller == 0) { //functie wordt alleen uitgevoerd als player 1 aan de beurt is, dan is de teller == 0
        healthP2 -= 10
        textHp2.textContent = 'HP: ' + healthP2
        textLeft.textContent = 'Player 1 attacks!'
        textRight.textContent = '-10HP'
        audio2.play();
        tekenBar2() //de health bar wordt geupdate

        check() //checkt of health 0 is

        if (exit == 1) { //als health 0 is, is in check() de waarde 1 gegeven aan exit 
            return; //als health 0 is stopt het spel, met de return wordt voorkomen dat de beurt van player 2 begint
        } else { //anders begint na 1.5 sec de aanval van player 2
            tellen()
            setTimeout(function () {
                beurtP2();
            }, 1500);
        }
    }
}

function actionTwo() {
    if (teller == 0) {
        healthP2 -= 20
        textHp2.textContent = 'HP: ' + healthP2
        textLeft.textContent = 'Player 1 attacks!'
        textRight.textContent = '-20HP'
        audio3.play();
        tekenBar2()

        check()
        if (exit == 1) {
            return;
        } else {
            tellen()
            setTimeout(function () {
                beurtP2();
            }, 1500);
        }
    }
}

function actionThree() {
    if (teller == 0) {
        healthP2 -= 30
        textHp2.textContent = 'HP: ' + healthP2
        textLeft.textContent = 'Player 1 attacks!'
        textRight.textContent = '-30HP'
        audio4.play();
        tekenBar2()

        check()
        if (exit == 1) {
            return;
        } else {
            tellen()
            setTimeout(function () {
                beurtP2();
            }, 1500);
        }
    }
}

buttonOne.addEventListener("click", actionOne)
buttonTwo.addEventListener("click", actionTwo)
buttonThree.addEventListener("click", actionThree)

function heal(img) {
    if (img.getAttribute('src') === './images/healing.png') {
        //checkt eerst of de functie eerder gebruikt is, de afbeelding is dan al vervangen door './images/healing.png'
        healthP1 += 10
        tekenBar1()
        textHp1.textContent = 'HP: ' + healthP1
        textLeft.textContent = 'Player 1 heals!'
        textRight.textContent = ''
        audio5.play();
        img.src = './images/used.png' //de afbeelding wordt vervangen door './images/healing.png', afbeelding van een gebruikte item
    }
}

heal1.addEventListener("click", function () {
    heal(heal1)
})
heal2.addEventListener("click", function () {
    heal(heal2)
})
heal3.addEventListener("click", function () {
    heal(heal3)
})

//acties player 2
function reset() {
    //reset de teller zodat player 1 weer aan de beurt kan
    teller = 0
    buttonOne.classList.remove('uit') //de knoppen zijn hierdoor niet meer grijs
    buttonTwo.classList.remove('uit')
    buttonThree.classList.remove('uit')
}

function beurtP2() {
    var randomAttack = [attack1, attack2, attack3]
    var randomGetal = Math.random() * 3
    randomGetal = Math.floor(randomGetal)
    randomAttack[randomGetal]() //een functie wordt random gekozen uit de array en uitgevoerd

    function attack1() {
        healthP1 -= 10
        textHp1.textContent = 'HP: ' + healthP1
        textRight.textContent = 'Player 2 attacks!'
        textLeft.textContent = '-10HP'
        audioK2.play();
        tekenBar1() //de health bar wordt geupdate
        check() //er wordt gecheckt of health 0 is
        reset() //de teller wordt gereset
    }

    function attack2() {
        healthP1 -= 20
        textHp1.textContent = 'HP: ' + healthP1
        textRight.textContent = 'Player 2 attacks!'
        textLeft.textContent = '-20HP'
        audioK3.play();
        tekenBar1()
        check()
        reset()
    }

    function attack3() {
        healthP1 -= 30
        textHp1.textContent = 'HP: ' + healthP1
        textRight.textContent = 'Player 2 attacks!'
        textLeft.textContent = '-30HP'
        audioK4.play();
        tekenBar1()
        check()
        reset()
    }
}