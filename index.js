const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

function shippingRatesJson() {
    return {
        status: 'calculated',
        rate: {
            serviceName: 'Canada Post',
            serviceCode: 'SNC9600',
            shipmentCost: 11.99,
            otherCost: 5.99
        }
    };
}

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/calculate-shipping-rates', (req, res) => res.json(shippingRatesJson()))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
