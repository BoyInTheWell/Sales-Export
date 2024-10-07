


const REDIRECT_URI = 'https://boyinthewell.github.io/Sales-Export/';
const CLIENT_ID = 'socLQDIifg0mqahAeMjDTcBo2xJITe3A';
const STATE = '*Bpo2024*';
const SCOPE = 'sales';
const url = `https://api.contaazul.com/auth/authorize`

window.addEventListener('load', (e) => {
    const currentURLParams = new URL(window.location.href).searchParams
    if (currentURLParams.get("code") === null) {
        document.getElementById('send-call').addEventListener('click', () => {
            window.location.href = url + `?redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}&state=${STATE}`;
        });
    }
    else{   
        async function getToken(code) {

            const data = new URLSearchParams();
            data.append('grant_type', 'authorization_code');
            data.append('redirect_uri', REDIRECT_URI);
            data.append('code', code)

            let clientIDandSecret = window.btoa(CLIENT_ID + ':' + 'pI0RJlEPPVIAgk1baPccSKCxEsUf1CcE')
            console.log(clientIDandSecret);
            
            let response = await fetch(`https://api.contaazul.com/oauth2/token?grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=${code}`, 
            {
                method : "POST",
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Authorization': `Basic ${clientIDandSecret}`,
                },
               /*  body: data, */
            }
        );
            console.log(response);
            
        }
        getToken(currentURLParams.get("code"))
        console.log(currentURLParams.get("code"));
    }
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