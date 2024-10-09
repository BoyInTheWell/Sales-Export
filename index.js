


const REDIRECT_URI = 'https://boyinthewell.github.io/Sales-Export/';
const CLIENT_ID = 'socLQDIifg0mqahAeMjDTcBo2xJITe3A';
const CLIENT_SECRET = 'pI0RJlEPPVIAgk1baPccSKCxEsUf1CcE';
const clientIDandSecret = window.btoa(CLIENT_ID + ':' + CLIENT_SECRET)
const STATE = '*Bpo2024*';
const SCOPE = 'sales';
const url = `https://api.contaazul.com/`
let ACESS_TOKEN = '';
let REFRESH_TOKEN = '';

async function create_Sales(endpoint, body) {
    let response = await fetch(url + endpoint,
        {
            method: "POST",
            body: body
        }
    )
    console.log(response.json());
    alert("A sale was just created!")
}

function interpret_table( data ) {
  
    var table = data.split("\n");
    
    for (i in table) {
        table[i] = table[i].split("\t");
    }
    
    var keys = table.shift();
    var objects = table.map(function(values) {
    return keys.reduce(function(o, k, i) {
        o[k] = values[i];
        return o;
    }, {});
    });

    return objects;
}

window.addEventListener('load', (e) => {
    const currentURLParams = new URL(window.location.href).searchParams
    if (currentURLParams.get("code") === null) {
        document.getElementById('send-call').addEventListener('click', () => {
            window.location.href = url + `auth/authorize?redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}&state=${STATE}`;
        });
    }
    else{   
        async function getToken(code) {
        
            let response = await fetch(`https://api.contaazul.com/oauth2/token?grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=${code}`, 
            {
                method : "POST",
                headers: {
                    'Authorization': `Basic ${clientIDandSecret}`,
                },
            }
        );
            console.log(response.json());
            ACESS_TOKEN = response['acess_token'];
            REFRESH_TOKEN = response['refresh_token'];
            console.log(ACESS_TOKEN);

            alert("A sale is about to be created!");
            let corpo_regio = {
                
                    "emission": "2024-10-09T10:10:10.52Z",
                    "status": "PENDING",
                    "products":[
                    {
                    "description": "Atari Game Boy (Ultimate Deluxe Edition)",
                    "quantity": 2,
                    "value": 350,
                    "id": '3c32506d-46ab-450b-8250-d02b37d96b50'
                    }
                    ],
                    "payment": {
                    "type": "CASH",
                    "method": "CASH",
                    "installments": [
                    {
                    "number": 1,
                    "value": 700,
                    "due_date": "2024-10-11T10:10:12.12Z",
                    "status": "PENDING"
                    }
                    ]
                    
                    }
                    
              }
            create_Sales('/v1/sales', corpo_regio)
            
        }
        getToken(currentURLParams.get("code"))
        console.log(currentURLParams.get("code"));
    }
})

document.getElementById('send-table').addEventListener('click', (e) => {
    const textarea_element = document.getElementById('table_paste').value;
    const textarea_interpreted = interpret_table(textarea_element)


    console.log(textarea_interpreted);
    console.log(JSON.parse(textarea_interpreted[0]['Raw']));
    
    document.getElementById('main-container').append(`
        Calm down folk
        `)
})