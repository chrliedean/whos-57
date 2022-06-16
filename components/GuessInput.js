export default function GuessInput() {

    const checkAge = async(event) => {
        event.preventDefault()
        console.log("Trying to submit...")
        const name = event.target.name.value
        let url = 'https://api.api-ninjas.com/v1/celebrity?name=' + name;
        let response = fetch(url, {
            headers: {
                'X-Api-Key': 'crWclNDAkqaITyk4flKARg==C6CR1MuQBEkP9d2p'
            }

            });
        console.log(response)
            

    }

    return (
        <>
        <div className="inputContainer">
            <form onSubmit={checkAge}>
                <input type="text" className="inputBox" id="name" name="name"></input> 
                <input type="submit" className="hidden"/>
            </form>
        </div> 
        </>
    )
}