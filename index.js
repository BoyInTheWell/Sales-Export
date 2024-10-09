


const REDIRECT_URI = 'https://boyinthewell.github.io/Sales-Export/';
const CLIENT_ID = 'socLQDIifg0mqahAeMjDTcBo2xJITe3A';
const CLIENT_SECRET = 'pI0RJlEPPVIAgk1baPccSKCxEsUf1CcE';
const clientIDandSecret = window.btoa(CLIENT_ID + ':' + CLIENT_SECRET)
const STATE = '*Bpo2024*';
const SCOPE = 'sales';
const url = `https://api.contaazul.com/`
let ACESS_TOKEN = '';
let REFRESH_TOKEN = '';

async function create_Sales(endpoint, body, token) {
    let response = await fetch(url + endpoint,
        {
            method: "POST",
            body: body,
            headers: {
                Authorization: `Bearer ${token}`
            }
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
            
            
            
        }
        getToken(currentURLParams.get("code"))
        console.log(currentURLParams.get("code"));
    }
})

document.getElementById('send-table').addEventListener('click', (e) => {
    const textarea_element = document.getElementById('table_paste').value;
    const textarea_interpreted = interpret_table(textarea_element)


    console.log(textarea_interpreted);
    /* console.log(JSON.parse(textarea_interpreted[0]['Raw'])); */
    
    textarea_interpreted.forEach(e => {
        /* console.log(JSON.parse(e['Raw'])); */
        JSON.parse(e['Raw']).forEach(i => {
            const corpo_regio = {
                "name": i['Name'],
                "value": i['Unit_Value'],
                "cost": 0,
            }
            create_Sales('/v1/products', corpo_regio, ACESS_TOKEN)
            console.log(corpo_regio);
            
        });
        
    });

    

    
    document.getElementById('main-container').append(`
        Calm down folk
        `)
})