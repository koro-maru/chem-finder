var express = require('express');
var router = express.Router();
const scraper = require('../webcrawler');
const Chemical = require('../models/Chemical');
const scheduler = require('node-schedule');

router.get('/chemicals', function (req, res) {
    const searchTerm = req.query.search;
    let re = new RegExp(`\\b${searchTerm}\\b`, 'gi');

    Chemical.find({ name: re }, (err, result) => {
        if (err || !searchTerm) {
            res.send([])
        }
        else {
            res.send(result);
        }
    })
});


//Alter lab pro inc to not scrape query but chemical pages.
const scrape = () => {
    scraper.labProIncScrape()
    scraper.homeScienceToolsScrape()
    scraper.carolinaScrape()
    scraper.qorpakScrape()
}

const job = scheduler.scheduleJob('0 0 * * *', scrape)

module.exports = router;
