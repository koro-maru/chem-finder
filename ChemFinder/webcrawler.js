const Chemical = require('./models/Chemical')
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const Nightmare = require('nightmare')
const vo = require('vo')

const createChem = (name, price, link, picture, source) => {
    const chemical = new Chemical({
        name: name,
        price: price,
        link: link,
        picture: picture,
        source: source
    });


    //more efficient way of accomplishing this?
    Chemical.find({ name: name, price: price, link: link }, (err, res) => {
        if (err) {
            return {}
        }
        else if (res.length == 0) {
            //console.log(chemical)
            chemical.save((err) => {
                if (err) {
                    console.log("val err")
                }
            })
        }
        else {
            console.log("NOT 0, ", res)
        }
    })
    return chemical;
}


const labProIncScrape = () => {
    let page = 1;
    const links = [
        `https://labproinc.com/collections/acids`,
        `https://labproinc.com/collections/acs-grade-laboratory-chemicals`,
        `https://labproinc.com/collections/amino-acids`,
        `https://labproinc.com/collections/cleaning-chemicals`,
        `https://labproinc.com/collections/inorganic-chemicals`,
        `https://labproinc.com/collections/life-science-chemicals`,
        `https://labproinc.com/collections/chromatography`,
        `https://labproinc.com/collections/cosmetic-ingredients`,
        `https://labproinc.com/collections/oxidizers`,
        `https://labproinc.com/collections/solvents`,
        `https://labproinc.com/collections/reagents`,
        `https://labproinc.com/collections/standards`,
        `https://labproinc.com/collections/water`
    ]

    links.forEach(async (link) => {
        try {
            let response = await axios.get(link);
            if (await response.status === 200) {
                let body = response.data;
                let $ = cheerio.load(await body);
                const MAX_PAGE = $('.page-numbers > li:nth-last-child(2) > a:nth-child(1)').text();

                if (!MAX_PAGE) {
                    labProIncItemScrape($)
                }
                else {
                    while (page <= parseInt(MAX_PAGE)) {
                        labProIncItemScrape($);
                        page++;
                        let pageLink = link + `?page=${page}`
                        response = await axios.get(pageLink);
                        if (await response.status === 200) {
                            body = response.data;
                            $ = cheerio.load(body);
                        }
                    }
                }
            }
        }
        catch (err) {
            return err;
        }
        page = 1;
    })
}



function* homeScienceToolsScrape() {
    const link = `https://www.homesciencetools.com/chemistry/chemicals/`;
    console.log(link)
    const nightmare = Nightmare({ show: true });
    let nextPage = true;
    let page = 0;

    try {

        //first wait and click 4 modals, ignore if site changes in future
        yield nightmare.goto(link)
        yield nightmare.wait('img.needsclick.undefined.kl-private-reset-css-Xuajs1')
        yield nightmare.click('img.needsclick.undefined.kl-private-reset-css-Xuajs1');
        yield nightmare.wait('main#product-listing-container')

        nextPage = yield nightmare.visible('.ss-pagination-next > a');

        if (page === 0 && !nextPage) {
            console.log("here 3")
            yield nightmare.evaluate(() => document.querySelector('body').innerHTML)
                .then((res) => {
                    $ = cheerio.load(res);
                    homeScienceToolsItemScrape($);
                })
            yield nightmare.end();
        }
        else {
            while (nextPage) {
                nextPage = yield nightmare.visible('.ss-pagination-next > a');
                yield nightmare.evaluate(() => document.querySelector('body').innerHTML)
                    .then((res) => {
                        $ = cheerio.load(res);
                        homeScienceToolsItemScrape($);
                    })

                if (nextPage) {
                    yield nightmare
                        .click('.ss-pagination-next > a')
                        .wait('main#product-listing-container')
                        .wait(1000)
                }
                page++;
            }
            yield nightmare.end();
        }
    }
    catch (err) {
        console.trace(err)
    }
}


function qorpakScrape(searchTerm) {
    const link = `https://www.qorpak.com/search?filter=1&search=${searchTerm}&type=q&keywordoption=ALL&cid=0&fltrdesc=1`;
    const nightmare = Nightmare();

    return nightmare
        .goto(link)
        .wait('#productlistcontainer')
        .wait(1500)
        .exists('a#showAllLinkHeader')
        .then((result) => {
            if (result) {
                return nightmare.click('a#showAllLinkHeader').wait(1000)
            }
            else {
                return nightmare;
            }
        })
        .then(() => {
            return nightmare.
                evaluate(() => document.querySelector('#productlistcontainer').innerHTML)
                .then((res) => {
                    $ = cheerio.load(res);
                    qorpakItemScrape($);
                    return nightmare.end();
                })
        })
        .catch((err) => {
            console.trace(err)
            return [];
        })

}

function* carolinaScrape() {
    try {
        const links = [
            'https://www.carolina.com/chemistry/specialty-chemicals/ph-buffers/10172.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-a/10174.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-b-c/10175.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-d-l/10176.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-m-o/10177.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-p-r/10178.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-s/10179.ct?Nr=product.siteId%3A100001',
            'https://www.carolina.com/chemistry/specialty-chemicals/specialty-chemicals-t-z/10180.ct?Nr=product.siteId%3A100001'
        ]

        for (let i = 0; i < links.length; i++) {
            const nightmare = Nightmare();
            let link = links[i];
            let nextPage = true;
            let page = 0;

            yield nightmare.goto(link)
            yield nightmare.wait('body')

            nextPage = yield nightmare.visible('.paging-next > a')

            if (page === 0 && !nextPage) {
                yield nightmare
                    .evaluate(() => document.querySelector('body').innerHTML)
                    .then((res) => {
                        $ = cheerio.load(res);
                        carolinaItemScrape($);
                    })
                yield nightmare.end();
            }
            else {
                while (nextPage) {
                    nextPage = yield nightmare.visible('.paging-next > a');
                    yield nightmare
                        .evaluate(() => document.querySelector('body').innerHTML)
                        .then((res) => {
                            $ = cheerio.load(res);
                            carolinaItemScrape($);
                        });

                    if (nextPage) {
                        yield nightmare
                            .click('.paging-next > a')
                            .wait('body')
                            .wait(1000)
                    }
                    page++
                }

                yield nightmare.end()
            }
        }
    }

    catch (e) {
        console.trace(e)
    }

}



let labProIncItemScrape = ($) => {
    $('div.product-grid-item').each(function () {
        let productLink = 'https://labproinc.com' + $(this).find('.product-title > a').attr('href');
        let name = $(this).find('.product-title').text().trim();
        let picture = 'https:' + $(this).find('.attachment-shop_catalog').attr('src');
        let source = 'Lab Pro Inc';
        let price = parseFloat($(this).find('.money').text().replace(/(\r\n|\n|\r)/gm, "").trim().substring(1));
        createChem(name, parseFloat(price), productLink, picture, source);
    })
}

let homeScienceToolsItemScrape = ($) => {

    $('li.product.ng-scope').each(function () {
        let productLink = 'https://www.homesciencetools.com' + $(this).find('a.ng-binding').attr('href');
        let name = $(this).find('a.ng-binding').text().trim();
        let price = parseFloat($(this).find('span.price').text().replace(/([, ]+|\r\n|\n|\r)/gm, "").trim().substring(1));
        let picture = 'https:' + $(this).find('img.card-image').attr('src');
        let source = 'Home Science Tools';
        createChem(name, price, productLink, picture, source);
    })
}

let qorpakItemScrape = async ($) => {
    let qorpak = [];
    $('ul.productitem').each(function () {
        let name = $(this).find('.proddescription').text().trim();
        let prodlink = 'https://www.qorpak.com' + $(this).find('.prodlink').attr('href');
        let source = 'Qorpak';
        let picture = $(this).find('.prodlink > img').attr('src');
        let price = parseFloat($(this).find('span.price').text().replace(/([, ]+|\r\n|\n|\r)/gm, "").trim().substring(1));

        qorpak.push(createChem(name, price, prodlink, picture, source));
    })

    return qorpak;
}

let carolinaItemScrape = ($) => {
    $('.item-item').each(function () {
        let name = $(this).find('.item-title').text();
        let prodlink = 'https://www.carolina.com' + $(this).find('a').attr('href');
        const source = 'Carolina';
        let picture = 'https://www.carolina.com' + $(this).find('.item-thumb').attr('src');
        let price = parseFloat($(this).find('.item-price').text().replace(/([, ]+|\r\n|\n|\r)/gm, "").trim().substring(1));

        createChem(name, price, prodlink, picture, source);
    })
}


module.exports = {
    'labProIncScrape': labProIncScrape,
    'homeScienceToolsScrape': () => {
        return new Promise((resolve, reject) => {
            vo(homeScienceToolsScrape())(function (err, res) {
                if (err) console.log(err);
                resolve(res);
            })
        })
            .catch((err) => {
                console.log(err);
            })
    },
    'qorpakScrape': () => {
        return qorpakScrape();
    }
    ,
    'carolinaScrape': () => {
        return new Promise((resolve, reject) => {
            vo(carolinaScrape())(function (err, res) {
                if (err) console.log(err);
                resolve(res);
            })
        })
            .catch((err) => {
                console.log(err);
            })
    }
}

 //MUST ADD CHECKS FOR NO RESULTS FOUND