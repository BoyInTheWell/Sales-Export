import secrets from "./secrets.json" with {type: "json"}; 


const REDIRECT_URI = 'https://boyinthewell.github.io/Sales-Export/';
const CLIENT_ID = secrets.CLIENT_ID;
const CLIENT_SECRET = secrets.CLIENT_SECRET;
const clientIDandSecret = window.btoa(CLIENT_ID + ':' + CLIENT_SECRET)
const STATE = '*Bpo2024*';
const SCOPE = 'sales';
const url = `https://api.contaazul.com/`
let ACESS_TOKEN = '';
let REFRESH_TOKEN = '';

let MASTER_PRODUCTS = [];

function get_allRaws(raws) {
    const data = [];
    raws.forEach(e => {
        JSON.parse(e['Raw']).forEach(q => {
            data.push(q)
        })

    });
    return [...new Map(data.map(item => [item['Name'], item])).values()];
}

async function search_and_launch(data, token){

    const promise = new Promise((resolve, reject) => {
                const customer = fetch(url + 'v1/products?name=' + data['Name'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    }
                }).then((res) => res.json())
                    .then((dat) => {
                        
                        if (dat.length == 0) {
                            const body = {
                                "name": data['Name'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
                                "value": data['Unit_Value'],
                                "cost": 0,
                                "code": data['Item_Code']
                            }
                            fetch(url + 'v1/products', {
                                method: 'POST',
                                body: JSON.stringify(body),
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
            
                                }
                            }).then((result) => {
                                resolve(result.json())
                            })
                            
                        } else {
                            console.log("This item: " + data['Name'] + ' is already on CA');
                            resolve(dat[0])
                        }
                    })
            })

    
    return await promise
}

async function get_or_post_customers(data, token) {

    const get_customers = new Promise((resolve, reject) => {
        let customer_body = {
            "name": data['Cliente'],
            "person_type": 'NATURAL',
            "document": data['Documento']
        }

        const customer = fetch(url + 'v1/customers', {
            method: "POST",
            body: JSON.stringify(customer_body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'

            }
        }).then((res) => {
            if (res.status == 201) {

                resolve(res.json())
            } else {
                fetch(url + 'v1/customers?document=' + customer_body['document'], {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    }
                }).then((res) => res.json())
                .then((dat) => {
                    resolve(dat[0])
                })
            }
        })
    })

    return get_customers
}

async function launch_sales(data, token) {
    let MASTER_CONSUMERS = [];

    const get_customers = new Promise((resolve, reject) => {
        let customer_body = {
            "name": data['Cliente'],
            "person_type": 'NATURAL',
            "document": data['Documento']
        }

        const customer = fetch(url + 'v1/customers', {
            method: "POST",
            body: JSON.stringify(customer_body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'

            }
        }).then((res) => {
            if (res.status == 201) {

                resolve(res.json())
            } else {
                fetch(url + 'v1/customers?document=' + customer_body['document'], {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    }
                }).then((res) => res.json())
                .then((dat) => {
                    resolve(dat[0])
                })
            }
        })
    })

    await get_customers
    .then((values) => {
        values = JSON.stringify(values);
        values = JSON.parse(values)
        MASTER_CONSUMERS = values;
        
    })

    

    const body_products = [];
    const raw_products = JSON.parse(data['Raw'])
    const product_promisses = [];

    
    JSON.parse(data['Raw']).forEach((e) => {

        product_promisses.push(new Promise((resolve, reject) => {
            
            
            fetch(url + 'v1/products?name=' + e['Name'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json())
            .then((d) => {resolve(d[0])
            })

        })
    )   
    })

    await Promise.all(product_promisses)
    .then((values) => {
        values = JSON.stringify(values);
        values = JSON.parse(values)
        MASTER_PRODUCTS = values
    })
    
    /* 
    console.log(MASTER_CONSUMERS);
    console.log("----------------------");
    */
    console.log(MASTER_PRODUCTS);
     
    
    raw_products.forEach((e, i) => {
        try {
            e.id = MASTER_PRODUCTS[i]['id']
        } catch (error) {
            console.error("Failed to include item " + e['Name'] + " in the array \n Current batch of products is " + MASTER_PRODUCTS);
            
        }
        
    })

    raw_products.forEach((e) => {
        body_products.push({
            "desciption" : e['Name'],
            "quantity": e['Quantity'],
            "product_id": e['id'],
            "value": e['Unit_Value']
        })
    } )
    
    const bank_response = await fetch(url + 'v1/sales/banks?search=' + data['Payment_Bank'], {
        method:"GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    let bank_info = await bank_response.json()
    bank_info = JSON.stringify(bank_info)
    bank_info = JSON.parse(bank_info)

    
    let pay_method =''

    switch (data['Payment_Way']) {
        case "Cartao de Debito":
            method = "DEBIT_CARD"
            break;
        case "Cartao de Credito":
            method = "CREDIT_CARD"
            break;
        case "Dinheiro": 
            method = "CASH"
            break;
        case "Pix":
            method = "INSTANT_PAYMENT"
            break;
        case "Credito da Loja":
            method = "STORE_CREDIT"
            break;
        default:
            method = "OTHER"
            break;
    }

    const sale_value = (Number(data['Valor Total'].replace(',', '.')) + Number(data['Actual_Tax'])) - Number(data['Actual_Discount'])
    

    const sales_body = {

        "emission": data['Data'],
        "status": "COMMITTED",
        "customer_id": MASTER_CONSUMERS['id'],
        "products": body_products,
        "discount": {
            "measure_unit": "VALUE",
            "rate": data['Actual_Discount']
        },
        "payment": {
            "type": "CASH",
            "method": method,
            "installments": [
                {
                    "number": 1,
                    "value": sale_value,
                    "due_date": data['Data'],
                    "status": "PENDING"
                }
            ],
            "financial_account_id": bank_info[0]['uuid']

        },
        "notes": data['Observação'],
        "shipping_cost": data['Actual_Tax']
    }

    await fetch(url + 'v1/sales', {
        "method": "POST",
        "body": JSON.stringify(sales_body),
        "headers": {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }

    })
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

async function unique_sales(url, data, token) {
    let customer = {}
    let product = []

    const customer_promise = get_or_post_customers(data[0], token)
    await customer_promise
    .then((response) => {
        console.log("Finished getting or posting the customer");
        console.log(response);
        customer = response
    })

    const product_promise = search_and_launch(data[0]['Raw'][0], token)
    await product_promise
    .then((response) => {
        console.log("Finished getting or posting the product"); 
        console.log(response);
        const formated_response = {
            "description" : response['Name'],
            "product_id" : response['id'],
            "quantity": '',
            "value" : data[0]['Raw'][0]['Unit_Value'],
        }
        product.push(formated_response)
    })

    const bank_response = await fetch(url + 'v1/sales/banks?search=' + data[0]['Payment_Bank'], {
        method:"GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    let bank_info = await bank_response.json()
    bank_info = JSON.stringify(bank_info)
    bank_info = JSON.parse(bank_info)

    data.forEach((e) => {
        switch (e['Payment_Way']) {
            case "Cartao de Debito":
                method = "DEBIT_CARD"
                break;
            case "Cartao de Credito":
                method = "CREDIT_CARD"
                break;
            case "Dinheiro": 
                method = "CASH"
                break;
            case "Pix":
                method = "INSTANT_PAYMENT"
                break;
            case "Credito da Loja":
                method = "STORE_CREDIT"
                break;
            default:
                method = "OTHER"
                break;
        }

        const sale_value = (Number(e['Valor Total'].replace(',', '.')) + Number(e['Actual_Tax'])) - Number(e['Actual_Discount'])

        product[0]['quantity'] = e['Raw'][0]['Quantity']

        const sales_body = {

        "emission": e['Data'],
        "status": "COMMITTED",
        "customer_id": customer['id'],
        "products": product,
        "discount": {
            "measure_unit": "VALUE",
            "rate": e['Actual_Discount']
        },
        "payment": {
            "type": "CASH",
            "method": method,
            "installments": [
                {
                    "number": 1,
                    "value": sale_value,
                    "due_date": e['Data'],
                    "status": "PENDING"
                }
            ],
            "financial_account_id": bank_info[0]['uuid']
        },
        "notes": e['Observação'],
        "shipping_cost": e['Actual_Tax']
    }

    fetch(url + 'v1/sales', {
        "method": "POST",
        "body": JSON.stringify(sales_body),
        "headers": {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }

    })
    })

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

document.getElementById('send-table').addEventListener('click', (e) => {
    const textarea_element = document.getElementById('table_paste').value;
    const textarea_interpreted = interpret_table(textarea_element)

    console.log("This is text area interpreted");

    console.log(textarea_interpreted);
    /* console.log(JSON.parse(textarea_interpreted[0]['Raw'])); */

    const allRaws = []

    textarea_interpreted.forEach(e => {
        JSON.parse(e['Raw']).forEach(q => {
            allRaws.push(q)
        }) 
        
    })
    
    const arrUniqRaws = [...new Map(allRaws.map(v => [v.Name, v])).values()]
    const promises = []

    arrUniqRaws.forEach(e => {
        promises.push(search_and_launch(e, ACESS_TOKEN))
    })
        
    Promise.all(promises)
    .then((res) => {
        console.log("All promises have finished");
        console.log(res);
        
        /* 
        const newRaw = []
        console.log(typeof res); */
        
      /*   textarea_interpreted.forEach((e) => {
            JSON.parse(e['Raw']).forEach(y => {
                const compareY = y['Name'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
                const compareX = res.filter((x) => x['name'] == y['Name'])[0]['name'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
                
                console.log(compareX);
                console.log(compareY);
                
                console.log(res.filter(() => compareX == compareY));
                
                
                const rawItem = {
                    "name" : y['Name'],
                    "id" : y['id'] = res.filter((x) => x['name'] == y['Name'])['id'],
                    "value" : y['Unit_Value'],
                    "quantity" : y['Quantity']
                }
                newRaw.push(rawItem)
                               
            })

            console.log(newRaw);
            
        })

        console.log(textarea_interpreted); */

    })

    textarea_interpreted.forEach((e) => {
        launch_sales(e, ACESS_TOKEN)
    })

    


})

document.getElementById('send-alphaville').addEventListener('click', () => {
    const textarea_element = document.getElementById('table_paste').value;
    const table_itens = interpret_table(textarea_element)

    table_itens.forEach(e => {
        e['Raw'] = JSON.parse(e['Raw']);
    })
    console.log(table_itens);
    
    unique_sales(url, table_itens, ACESS_TOKEN )

    
})