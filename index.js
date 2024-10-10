


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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'

            }
        }
    )
    console.log(response.json());

    return await response.json()
}

function interpret_table(data) {

    var table = data.split("\n");

    for (i in table) {
        table[i] = table[i].split("\t");
    }

    var keys = table.shift();
    var objects = table.map(function (values) {
        return keys.reduce(function (o, k, i) {
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
    else {
        async function getToken(code) {

            let response = await fetch(`https://api.contaazul.com/oauth2/token?grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=${code}`,
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Basic ${clientIDandSecret}`,
                    },
                }
            );

            json_response = await response.json()
            console.log(json_response);
            ACESS_TOKEN = json_response['access_token'];
            REFRESH_TOKEN = json_response['refresh_token'];

            console.log(ACESS_TOKEN);

        }
        getToken(currentURLParams.get("code"))
        console.log(currentURLParams.get("code"));
    }
})

document.getElementById('send-token').addEventListener('click', (e) => {
    ACESS_TOKEN = document.getElementById('token_paste').value;
    console.log(ACESS_TOKEN);

})

document.getElementById('send-table').addEventListener('click', (e) => {
    const textarea_element = document.getElementById('table_paste').value;
    const textarea_interpreted = interpret_table(textarea_element)


    console.log(textarea_interpreted);
    /* console.log(JSON.parse(textarea_interpreted[0]['Raw'])); */

    textarea_interpreted.forEach((e, i) => {
        /* console.log(JSON.parse(e['Raw'])); */

        const corpo_sanum = {
            "name": e['Cliente'],
            "person_type": 'NATURAL',
            "document": e['Documento']
        }

        create_Sales('v1/customers', JSON.stringify(corpo_sanum), ACESS_TOKEN).then(r => {

            JSON.parse(i['Raw']).forEach(x => {
                const corpo_regio = {
                    "name": x['Name'],
                    "value": x['Unit_Value'],
                    "cost": 0,
                }
                create_Sales('v1/products', JSON.stringify(corpo_regio), ACESS_TOKEN).then(response => { console.log(response.json()) });

            })

            console.log(corpo_regio);

        });

    })

});


