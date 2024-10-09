const input = document.getElementById("search__bar");
const apiUrl = "https://corsproxy.io/?" + "https://api.2b2t.vc/stats/player?playerName="
var inputVal;

const searchPage = document.getElementById("search");
const footer = document.getElementById("misc");
const aboutPage = document.getElementById("about");
const resultsPage = document.getElementById("results");

let icon = document.getElementById("pp");
let playerName = document.getElementById("name");
let kills = document.getElementById("kills");
let deaths = document.getElementById("deaths");
let kdr = document.getElementById("kdr");
let joins = document.getElementById("joins");
let leaves = document.getElementById("leaves");
let chats = document.getElementById("chats");
let time = document.getElementById("time");
let monthly = document.getElementById("monthly");
let prio = document.getElementById("prio");
let errorState = false;

let first = document.getElementById("first-seen");
let last = document.getElementById("last-seen");
let backBtn = document.getElementById("back");

let vips = ["wbba", "raaanch"]

// listen for inputs on the search bar
input.addEventListener("keydown", function(event) {

    // if currently showing error, get rid of error after
    // user begins typing again
    if(errorState = true) {
        input.placeholder="Username"
        input.classList.remove("error");
        errorState = false;
    }
    
    // if no characters were typed in the input, show error
    if (event.key === "Enter" && !input.value) {
        input.placeholder="Cannot be empty"
        input.classList.add("error");
        errorState = true;

    } else if(event.key === "Enter") {
        // input recieved, now call apis with it and
        // hide & show relevant content
        inputVal = input.value;
        fetchData(inputVal);

        // delete what the user typed so it is empty
        // if they go back to the search page
        input.value = "";

    }
})



async function fetchData(value) {
    try {
        const response = await fetch(apiUrl+value)
        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        
        // if there is no data for this person, show error
        if (!data.firstSeen) {
            input.placeholder="There is no data for this player"
            input.classList.add("error");
            errorState = true;
        } 

        // if there is data, fetch player icon 
        // and show results
        else {
            icon.src = `https://mineskin.eu/bust/${value}/100.png`
            fillResults(data, value);
            showResults(); 
        }
        

    } catch (error) {
        console.error(error);
    }
}

function fillResults(api, playername){
    
    lowercaseName = playername.toLowerCase()
    playerName.innerText = lowercaseName;

    if (vips.includes(lowercaseName)) {
        applyVipColors(lowercaseName);
    }

    kills.innerText = api.killCount;
    deaths.innerText = api.deathCount;
    
    if (api.deathCount > 0) {
        rawkdr = api.killCount / api.deathCount;
        kdr.innerText = rawkdr.toFixed(2);
    } else if (api.deathCount === 0) {
        kdr.innerText = api.killCount;
    }
    
    
    joins.innerText = api.joinCount;
    leaves.innerText = api.leaveCount;
    chats.innerText = api.chatsCount;
    
    let timeInHours = api.playtimeSeconds / 3600;
    time.innerText = timeInHours.toFixed(1) + "h"

    let monthlyInHours = api.playtimeSecondsMonth / 3600;
    monthly.innerText = monthlyInHours.toFixed(1) + "h"

    prio.innerText = api.prio;

    first.innerText = formatDate(api.firstSeen);
    last.innerText = formatDate(api.lastSeen);
}

function showResults(){
    resultsPage.classList.remove("hidden");
    backBtn.classList.remove("hidden");
    searchPage.classList.add("hidden");
    footer.classList.add("hidden");
    aboutPage.classList.add("hidden");
    
}

function goBack(){
    resultsPage.classList.add("hidden");
    backBtn.classList.add("hidden");
    searchPage.classList.remove("hidden");
    footer.classList.remove("hidden");
    aboutPage.classList.remove("hidden");

    // removes VIP styling for next search
    removeVipColors();

    // resets pp back to placeholder
    icon.src="https://mineskin.eu/bust/a/100.png";
}

function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getUTCFullYear();

  const suffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${suffix(day)} of ${month} ${year}`;
}

function applyVipColors(playername) {
    playerName.classList.add(playername);
    kills.previousElementSibling.classList.add(playername);
    deaths.previousElementSibling.classList.add(playername);
    kdr.previousElementSibling.classList.add(playername);
    joins.previousElementSibling.classList.add(playername);
    leaves.previousElementSibling.classList.add(playername);
    chats.previousElementSibling.classList.add(playername);
    time.previousElementSibling.classList.add(playername);
    monthly.previousElementSibling.classList.add(playername);
    prio.previousElementSibling.classList.add(playername);
    first.previousElementSibling.classList.add(playername);
    last.previousElementSibling.classList.add(playername);
    icon.classList.add(playername + "pp");
}

function removeVipColors(){
    playerName.className=`search__name`
    kills.previousElementSibling.className="stats__title"
    deaths.previousElementSibling.className="stats__title"
    kdr.previousElementSibling.className="stats__title"
    joins.previousElementSibling.className="stats__title"
    leaves.previousElementSibling.className="stats__title"
    chats.previousElementSibling.className="stats__title"
    time.previousElementSibling.className="stats__title"
    monthly.previousElementSibling.className="stats__title"
    prio.previousElementSibling.className="stats__title"
    first.previousElementSibling.className="seen__title"
    last.previousElementSibling.className="seen__title"
    icon.className="search__pp";
}

function toAbout(){
    aboutPage.scrollIntoView({
        behavior: "smooth",
        block: "start",
    }
);
}