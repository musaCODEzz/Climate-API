const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 8000;

const articles = [];
const newspapers = [
    {
        name: 'The Guardian',
        url: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
        
    },
    {
        name: 'The Washington Post',
        url: 'https://www.washingtonpost.com/climate-environment/',
        base: ''
        
    },
    {
        name: 'The Economist',
        url: 'https://www.economist.com/climate-change',
        base: 'https://www.economist.com'
    },
    {   
        name: 'The Independent',
        url: 'https://www.independent.co.uk/environment/climate-change/',
        base: 'https://www.independent.co.uk'
    },
    {
        name: 'The Telegraph',
        url: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'The Times',
        url: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
        
    },
    

];

newspapers.forEach((newspaper) => {
    axios.get(newspaper.url)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name

                });
            });
            console.log(articles);
        }, (error) => console.log(error));
});
        


app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/news', (req, res) => {
    res.json(articles);
});

app.get('/news/:newspaperId',(req, res) => {
    
    const newspaperId = req.params.newspaperId;
    const newspaperAddress = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].url;
    const newspaperBase = newspapers.filter((newspaper) => newspaper.name == newspaperId)[0].base;

    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            const specificArticles = [];

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                specificArticles.push({
                    title,
                    url : newspaperBase + url,
                    source: newspaperId
                });
            });
            console.log(specificArticles);
            res.json(specificArticles);
        }
        , (error) => console.log(error));


});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);

