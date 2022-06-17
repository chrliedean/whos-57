export default function GuessInput() {

    var targetAge = 57

    const getAge = async(event) => {
        event.preventDefault();
        //Get User Input
        const name = event.target.name.value

        //Fetch Celebrity data from API
        let url = 'https://api.api-ninjas.com/v1/celebrity?name=' + name;
        let response = await fetch(url, {
            headers: {
                'X-Api-Key': 'crWclNDAkqaITyk4flKARg==C6CR1MuQBEkP9d2p'
            }

        });

        
        if (response.ok) { //If the request went through
            let json = await response.json()

            if (Object.keys(json).length === 0) { //if the celebrity is not found here
                console.log("no celebrity found.")
                noCelebrityFound(name)
            } else { //prints the age
                let age = json[0].age
                let name = json[0].name
                if (age != undefined) { // if the celebrity's age is listed
                    console.log(age)
                    submitGuess(age, name)
                } else {
                    noAgeFound(name)
                }
                

            }
           
        //If the request didn't go through
        } else {
            alert("There's been an error. Are you connected to the network?")
        }

    }

    function submitGuess(age, name) {

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

    function noCelebrityFound(input) {

        document.getElementById("validGuess").style.display = "none"
        document.getElementById("errorGuess").style.display = "block"
        document.getElementById("guessErrorText").innerHTML = "We couldn't find anyone by the name of " + input + "."

    }

    function noAgeFound(input) {

        document.getElementById("validGuess").style.display = "none"
        document.getElementById("errorGuess").style.display = "block"
        document.getElementById("guessErrorText").innerHTML = "Damn! Doesn't look like we have data on how old " + input + " is."

    }

    return (
        <>
        <div className="inputContainer">
            <form onSubmit={getAge}>
                <input type="text" className="inputBox" id="name" name="name"></input> 
                <input type="submit" className="hidden"/>
            </form>

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
        </div> 
        </>
    )
}