


const REDIRECT_URI = 'https://boyinthewell.github.io/Sales-Export/';
const CLIENT_ID = 'socLQDIifg0mqahAeMjDTcBo2xJITe3A';
const STATE = '*Bpo2024*';
const SCOPE = 'sales';
const url = `https://api.contaazul.com/auth/authorize`

window.addEventListener('load', (e) => {
    document.getElementById('send-call').addEventListener('click', () => {
        window.location.href = url + `?redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}&state=${STATE}`;
    });
    const currentURL = new URL(window.location.href)
    console.log(currentURL.search);
    
})


/* async function fetchAsync (url) {
    console.log("Starting up!");
    
    let response = await fetch(url + `?redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}&state=${STATE}`,
       {
            method: "GET",
            mode: "no-cors"
       }   
    );
    let data = response.json;
    console.log(data);
    
    return data;
  }

fetchAsync (url) */

/* async function fetchAsync(url) {
    console.log("Clicando");
    
    let response = await fetch(url + `?redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}&state=${STATE}`, 
        {
            method : "GET",
            mode: 'no-cors'
        }
    );
    let data = response;
    console.log(data);
};
 
document.getElementById('send-call').addEventListener('click', fetchAsync(url));
*/