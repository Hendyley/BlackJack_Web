
const playerEL = document.getElementById("player-el")
const messageEL = document.getElementById("message-el")
const sumEL = document.querySelector("#sum-el")
const cardsEL = document.getElementById("cards-el")
const dealercardsEL = document.getElementById("dealercards-el")
const recordContainer = document.getElementById("gamerecord-el")
const inputEL = document.getElementById("input-el")

const startBtn = document.getElementById("start-btn")
const newcardBtn = document.getElementById("newcard-btn")
const stayBtn = document.getElementById("stay-btn")
const saveBtn = document.getElementById("save-btn")

let cardsdrawn = []
let GameRecords = []
let sum = 0
let hasBlackJack = false
let isAlive = true
let message = ""

let deck = ['A', 2,3,4,5,6,7,8,9,10, 'J','Q','K']
let cardAppearance = Array(14).fill(0)
let handCount = 0


let dealerHand = []
let dealerSum = 0
let dealerHandcount = 0

let nameinfo = localStorage.getItem("BlackJack_PlayerName")
let chipinfo = localStorage.getItem("BlackJack_PlayerChip")

// console.log(`${nameinfo} ${chipinfo}`)

if(!nameinfo)
{
    localStorage.setItem( "BlackJack_PlayerName" , "Player" )
    nameinfo = "Player"
}
if(!chipinfo)
{
    localStorage.setItem( "BlackJack_PlayerChip" , "100" )
    chipinfo = 100
}
    
console.log(`${nameinfo} ${chipinfo}`)

let player = {
    name: nameinfo,
    chips: Number(chipinfo)
}

playerEL.textContent = player.name+": $"+ player.chips 


startBtn.addEventListener("click", function() {
    startGame()
})
function startGame()
{
    if (player.chips > 0 )
    {
        isAlive = true
        hasBlackJack = false
        
        deck = ['A', 2,3,4,5,6,7,8,9,10, 'J','Q','K']
        cardAppearance = Array(14).fill(0)
        player.chips -= 10
        playerEL.textContent = player.name+": $"+ player.chips 
        
        cardsdrawn = []
        sum = 0
        sum = getRandomCard(cardsdrawn,sum) + getRandomCard(cardsdrawn,sum)
        handCount = 2
        
        dealerHand = []
        dealerSum = 0
        dealerSum = getRandomCard(dealerHand,dealerSum) + getRandomCard(dealerHand,dealerSum)
        dealerHandcount = 2
        dealercardsEL.textContent = ""

        renderGame()
    }
    else
    {
        message="You have no more chip to play!"
        messageEL.textContent = message
    }
    
}

function renderGame() 
{
    
    let cardtext = "Cards: " + cardsdrawn[0]
    for(let i=1; i<cardsdrawn.length; i++)
    {
        cardtext += " - " + cardsdrawn[i]
    }
    cardsEL.textContent = cardtext

    sumEL.textContent = "Sum: " + sum
    if(sum < 21)
    {
        message = "Do you want to draw a new card?"
    }
    else if (sum === 21)
    {
        message = "You got a Black Jack!"
        hasBlackJack = true
        player.chips += 50
        GameRecords.push("WIN!   +50 ")
        KeepRecord()
    }
    else
    {

        for(let i=0; i<cardsdrawn.length; i++)
        {
            if(cardsdrawn[i]==='A')
            {
                cardsdrawn[i] = 1
                sum -= 10
                if(sum < 21)
                    renderGame()
                
            }
        }

        if(sum > 21)
        {
            message = "You are out of the game!"
            isAlive = false
            GameRecords.push("Lose!  -10 ")
            KeepRecord()
        }
        
    }

    
    messageEL.textContent = message
    playerEL.textContent = player.name+": $"+ player.chips 
}


newcardBtn.addEventListener("click", function() {
    newCard()
})
function newCard()
{
    if(!isAlive || hasBlackJack)
    {
        message="You cannot draw anymore card! Start new game!"
        messageEL.textContent = message
        
    }
    else
    {
        let nextCard = getRandomCard(cardsdrawn, sum)
        sum += nextCard
        renderGame()
        handCount++
    }

    if (handCount === 5)
    {
        stayPoint()
    }

    playerEL.textContent = player.name+": $"+ player.chips 
    
}

function getRandomCard(drawn, sum)
{
    let pick = Math.floor(Math.random()*12)
    let cardvalue = deck[pick]
    // console.log("Random Card: "+cardvalue+" from "+ pick+ " appear: "+cardAppearance[pick]+" times")
    if (cardAppearance[pick] > 4)
    {
        cardvalue = getRandomCard(drawn, sum)
    }
    else
    {
        cardAppearance[pick]++
    }
    
    drawn.push(cardvalue)
    if(cardvalue === 'J' || cardvalue === 'Q' || cardvalue === 'K')
    {
        return 10
    }    
    else if (cardvalue === 'A')
    {
        if(sum + 11 > 21)
            return 1
        else
            return 11
    }
    else
    {
        return cardvalue
    }

}

stayBtn.addEventListener("click", function() {
    stayPoint()
})
function stayPoint()
{
    if(sum<15 || !isAlive || hasBlackJack)
    {
        message = "You cannot stay with 15 points or below"
    } 
    else
    {
        // let dealerSum = Math.floor(Math.random()*7)+15
        while(dealerSum < 17 && dealerHandcount < 5)
        {
            dealerSum += getRandomCard(dealerHand, dealerSum)
            dealerHandcount++
            console.log(`Dealer: ${dealerSum}`)
            if(dealerSum > 21)
            {
                for(let i=0; i<dealerHand.length; i++)
                {
                    if(dealerHand[i]==='A')
                    {
                        dealerHand[i] = 1
                        dealerSum -= 10
                        break
                    }

                }
            }
        }

        if (dealerSum > 21)
        {
            message = "Dealer Burst with "+dealerSum+". You Win !!"
            player.chips += 30
            GameRecords.push("WIN!   +30 ")
        }
        else if (dealerSum === 21)
        {
            message = "Dealer Got BlackJack. You Lose !!"
            GameRecords.push("Lose!  -10 ")
        }
        else if (dealerSum < sum)
        {
            message = "Dealer Got "+dealerSum+". You Win !!"
            player.chips += 30
            GameRecords.push("WIN!   +30 ")
        }
        else if (dealerSum === sum)
        {
            message = "Dealer Got "+dealerSum+". Draw !!" 
            GameRecords.push("Draw!  -10 ")
        }
        else
        {
            message = "Dealer Got "+dealerSum+". You Lose !!"
            GameRecords.push("Lose!  -10 ")
        }
        KeepRecord()
        isAlive = false

        let dcardtext = "Dealer Cards: " + dealerHand[0]
        for(let i=1; i<dealerHand.length; i++)
        {
            dcardtext += " - " + dealerHand[i]
        }
        dealercardsEL.textContent = dcardtext
    }

    messageEL.textContent = message
    playerEL.textContent = player.name+": $"+ player.chips 
}

function KeepRecord()
{
    const li = document.createElement("li");
    li.textContent = GameRecords[GameRecords.length-1];
    recordContainer.appendChild(li);
}

saveBtn.addEventListener("click", function() {
    saveInfo()
})
function saveInfo()
{
    if(inputEL.value !== "")
    {
        nameinfo = inputEL.value
        localStorage.setItem( "BlackJack_PlayerName" , nameinfo )
        player.name = nameinfo
    }
        
    localStorage.setItem( "BlackJack_PlayerChip" , player.chips )

    playerEL.textContent = player.name+": $"+ player.chips 
}