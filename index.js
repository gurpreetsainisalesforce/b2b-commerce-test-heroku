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

// Return the same list of SKUs with a quantity of 9999 for each SKU
function getInventory(skus) {
    let inventoryJson = {};
    const skusArray = skus.slice(1, -1).split(',');
    for (const sku of skusArray) {
        inventoryJson[sku.slice(1, -1)] = 9999.00;
    }
    return inventoryJson;
}

// Return the same list of SKUs with the same sale price (0.00) for each SKU
function getSalesPrices(skus) {
    let json = {};
    const skusArray = skus.slice(1, -1).split(',');
    for (const sku of skusArray) {
        const simpleSku = sku.slice(1, -1);
        if (simpleSku == 'SKU_FOR_TEST') {
            json[simpleSku] = 100.00;
        } else {
            json[simpleSku] = 0.00;
        }
    }
    return json;
}

// Return the same list of SKUs with the calculated tax amount and the tax rate 0.08 for each SKU
function getTaxRates(amountsBySKU) {
    let json = {};
    const skusArray = amountsBySKU.slice(1, -1).split(',');
    for (const skuAndAmount of skusArray) {
        const sku = skuAndAmount.split(':')[0];
        const amount = skuAndAmount.split(':')[1];
        const taxRate = 0.08;
        const taxAmount = amount * taxRate;
        json[sku.slice(1, -1)] = {
            taxAmount: taxAmount,
            taxRate: taxRate,
            taxName: 'GST'
        };
    }
    return json;
}

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/calculate-shipping-rates', (req, res) => res.json(shippingRatesJson()))
    .get('/get-inventory', (req, res) => res.json(getInventory(req.query.skus)))
    .get('/get-sales-prices', (req, res) => res.json(getSalesPrices(req.query.skus)))
    .get('/get-tax-rates', (req, res) => res.json(getTaxRates(req.query.amountsBySKU)))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
