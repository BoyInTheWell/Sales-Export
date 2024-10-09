


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

            ACESS_TOKEN = JSON.parse()['acess_token'];
            console.log(ACESS_TOKEN);

            alert("A sale is about to be created!");
            let corpo_regio = {
                "number": 12,
                "emission": "2024-10-09T19:46:10.096Z",
                "status": "COMMITTED",
                "customer_id": "62d05442-5e02-4fb3-978b-da7e58e1f770",
                "seller_id": "62d05442-5e02-4fb3-978b-da7e58e1f771",
                "products": [
                  {
                    "description": "Game Atari ET",
                    "quantity": 2,
                    "product_id": "f8ffb77a-3d52-42d7-9bec-ea38c0ef043d",
                    "value": 50
                  }
                ],
                "services": [
                  {
                    "description": "Fix car engine",
                    "quantity": 1,
                    "service_id": "e78c6d82-501a-4045-90c4-ae5b520f58dc",
                    "value": 200
                  }
                ],
                "discount": {
                  "measure_unit": "VALUE",
                  "rate": 5
                },
                "payment": {
                  "type": "CASH",
                  "method": "BANKING_BILLET",
                  "installments": [
                    {
                      "number": 1,
                      "value": 305,
                      "due_date": "2024-10-09T19:46:10.096Z",
                      "status": "PENDING",
                      "note": "NOTE",
                      "hasBillet": true
                    }
                  ],
                  "financial_account_id": "string"
                },
                "notes": "Sale made by noon",
                "shipping_cost": 10
              }
            create_Sales('/v1/sales', corpo_regio);
            
        }
        getToken(currentURLParams.get("code"))
        console.log(currentURLParams.get("code"));
    }
})