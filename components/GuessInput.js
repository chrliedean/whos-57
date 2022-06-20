import WBK from 'wikibase-sdk'

export default function GuessInput() {

    // maybe this will be user-changable later
    var targetAge = 57
    var inputname = ""
    var currentImg = ""

    //INITIALIZES WIKIBASE SDK
    const wdk = WBK({
        instance: 'https://www.wikidata.org/',
        sparqlEndpoint: 'https://query.wikidata.org/sparql'
    })


    // GETS USER INPUT AND FINDS WIKIDATA ID
    const getEntity = async(event) => {
        event.preventDefault();
        inputname = event.target.name.value // gets input text from field
        event.target.name.value = ""

        //Defines Wikidata search
        const wdurl = wdk.cirrusSearchPages({ 
            search: inputname , 
            haswbstatement: ['P31=Q5','-P570=*'], 
            language: 'en',
            profile: 'wikibase_prefix_boost',
            prop: 'snippet'
        })

        // Fetches search results
        let wdresponse = await fetch(wdurl, {
            method: 'GET',
            headers: new Headers( {
                'Api-User-Agent': 'Whos-57/1.0/charlie@charliedean.com'
            })
            }
            )
            .then(res => res.json())
            .then(wdk.parse.wb.pagesTitles)
            .then(titles => {
                if (titles != undefined)
                {
                    const targetId = titles[0]
                    if (targetId != undefined) {
                        console.log(targetId)
                        const url = wdk.getEntities({
                            ids: targetId,
                            languages: 'en',
                            props: ['claims', 'labels']
                        })
                        getData(url, targetId)
                        
                    } else {
                        noCelebrityFound(inputname)
                    }

                } else {
                    noCelebrityFound(inputname)
                }

              })

    }

    // FETCHES DATA FROM WIKIDATA ID
    async function getData(url, targetId) {
        let response = await fetch(url)
        if (response.ok) {
            let json = await response.json()
            const entity = json.entities[targetId]
            console.log(entity)

            //get birthday and deathday
            const birthdayClaim = wdk.simplify.propertyClaims(entity.claims.P569) 
            const deathdayClaim = wdk.simplify.propertyClaims(entity.claims.P570)

            //tries to find image
            const image = wdk.simplify.propertyClaims(entity.claims.P18)
            let imagekey = Object.values(image)[0]
            console.log(image)
            const imageURL = wdk.getImageUrl(imagekey, 400)
            currentImg = imageURL

            //gets name as listed on wikidata
            let namekey = wdk.simplify.labels(entity.labels)
            var name = Object.values(namekey)[0]

            //checks if birthday is available and submits guess if so
            if (birthdayClaim.length !== 0) {
                if (deathdayClaim.length === 0) {
                    let age = getAge(birthdayClaim[0])
                    submitGuess(age, name)         
                } else {
                    console.log("he dead")
                    guessDead(birthdayClaim, deathdayClaim, name)
                }
            } else {
                console.log("no birthdat fonnd.")
                displayError("We couldn't find the age of anyone named " + inputname + ".")
            }

        } else {
            alert("not netwrok")
        }
    }

    // PARSES BIRTHDATE
    function getAge(birthday) {

        console.log(birthday)
        let today = new Date();
        let birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age--;
        }
        return age;
    }

    function guessDead(birthday, deathday, name) {

        let age = getAge(birthday)
        let sincedeath = getAge(deathday)
        console.log("sincedeath:" + sincedeath)
        let deathage = age - sincedeath
        let deathyear = new Date(deathday).getFullYear()

        displayError("Sorry, " + name + " died at age " + deathage + " in " + deathyear +  ".")
        displayImage(currentImg, name, "DEAD")
    }

    // CHECKS IF THE AGE IS 57
    function submitGuess(age, name) {
        displayImage(currentImg, name, age)

        document.getElementById("validGuess").style.display = "block"
        document.getElementById("errorGuess").style.display = "none"

        document.getElementById("guessName").innerHTML = name
        document.getElementById("guessAge").innerHTML =  age

        if (age != targetAge) { // incorrect guess
            document.getElementById("exclamation").innerHTML = "Sorry, "
            document.getElementById("punctuation").innerHTML = "."

        } else { // correct guess!
            document.getElementById("exclamation").innerHTML = "Congrats! "
            document.getElementById("punctuation").innerHTML = "!"
        }
    }

    // displays image
    let imgCardIndex = 0
    function displayImage(url, name, age) {

        let imgCard = document.getElementById('imgCard' + imgCardIndex)
        let cardCopy = imgCard.cloneNode(true)
        if (imgCardIndex < 5) {
            imgCardIndex++
        } else {
            imgCardIndex = 0
        }
        cardCopy.id = 'imgCard' + imgCardIndex
        imgCard.after(cardCopy)

        let image = document.getElementById("guessImage")
        let agetext = document.getElementById("ageCircleText")
        let nametext = document.getElementById('nameCircleText')
        
        console.log("Trying to display image...")
        if (url.includes("undefined")) {
            image.style.backgroundImage = "url(\'placeholder-profile.svg\')"
        } else {
            image.style.backgroundImage = "url(\'" + url + "\')"
        }

        if (age != "DEAD") {
            agetext.innerHTML = "AGE " + age
        } else {
            agetext.innerHTML = "DECEASED"
        }
        nametext.innerHTML = name
    }

    
    // NAME NOT FOUND
    function noCelebrityFound(input) {

        document.getElementById("validGuess").style.display = "none"
        document.getElementById("errorGuess").style.display = "block"
        document.getElementById("guessErrorText").innerHTML = "We couldn't find anyone by the name of " + input + "."

    }

    function displayError(string) {
        document.getElementById("validGuess").style.display = "none"
        document.getElementById("errorGuess").style.display = "block"
        document.getElementById("guessErrorText").innerHTML = string
    }

    // NAME FOUND, AGE UNKNOWN
    function noAgeFound(input) {

        document.getElementById("validGuess").style.display = "none"
        document.getElementById("errorGuess").style.display = "block"
        document.getElementById("guessErrorText").innerHTML = "Damn! Doesn't look like we have data on how old " + input + " is."

    }

    return (
        <>
        <div className="inputContainer">
        
        <div className="guessResultDisplay" id="guessResultDisplay">
                <p id="validGuess">
                    <span id="exclamation"></span> 
                    <span id="guessName"></span>
                    <span id="is"> is </span>
                    <span id="guessAge"></span>
                    <span id="punctuation"></span>
                </p>
                <p id="errorGuess">
                    <span id="guessErrorText"></span>
                </p>
            </div>

            <div className='imgCardContainer'>

                <div className="guessImageWrapper" id="imgCard0">

                    <svg width="250" height="125" className='topArc'>
                        <path id='topArc' d="m 17.5 125 a 1 1 0 0 1 215 0" fill="transparent" />
                        <text textAnchor='middle'>
                            <textPath startOffset='50%' href='#topArc' className='guessImageText' id="nameCircleText">
                                WHO IS
                            </textPath>
                        </text>
                    </svg>

                    <div className="guessImage" id="guessImage"></div>

                    <svg width="250" height="125" className='bottomArc'>
                        <path d="m7,0 a1,1 0 0,0 236,0" fill="transparent" id='bottomArc'/>
                        <text textAnchor="middle">
                            <textPath startOffset="50%" side="right" href="#bottomArc" className='guessImageText' id='ageCircleText'>
                            57?
                            </textPath>
                        </text>                
                    </svg>

                </div>
            </div>

            

            <form onSubmit={getEntity}>
                <input type="text" className="inputBox" id="name" name="name"></input> 
                <input type="submit" className="hidden"/>
            </form>

        </div> 
        </>
    )
}