import puppeteer from 'puppeteer';
import { json2csv, csv2json } from 'json-2-csv';
import { writeCSV, readCSV } from './fileHandler.js';

export const soft_scrape = async () => {
    var oldDataCSV;

    try{
        oldDataCSV = await readCSV();
    }
    catch(error){
        console.log(`❌ ERROR in reading old data.\n📜 Performing Hard Scrape instead.`);
        hard_scrape();
        return;
    }

    const oldData = csv2json(oldDataCSV);

    var nextButton = {};
    var terminate = false;
    var pageNumber = 1;
    var newData = [];

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    while(nextButton && !terminate){
        console.log(`⏱️  Parsing page ${pageNumber} ...`);

        await page.goto(`https://rategain.com/blog/page/${pageNumber}`);

        var scrapedData = await page.evaluate(() => 
            Array.from(document.querySelectorAll('.blog-item'), (e) => {
                const content = e.children[0].children.length > 1 ? e.children[0].children[1] : e.children[0].children[0];
                const image = e.children[0].children.length > 1 ? e.children[0].children[0] : null;
                
                return (
                {
                    title: content.children[0].innerText,
                    date: content.children[1].children[0].innerText,
                    likes: content.children[4].innerText.trim(),
                    image: (image) ? image.children[0].dataset.bg : 'NA'
                })
            })
        );

        var indexToTerminate = 0;
            
        terminate = scrapedData.some((element, index) => {
            if(element.title == oldData[0].title){
                indexToTerminate = index;
                return true;
            }    
        });

        if(terminate){
            scrapedData = scrapedData.slice(0, indexToTerminate);
            console.log(`🛑 Terminating scraper at page ${pageNumber}.`)
        }

        newData.push(...scrapedData);

        nextButton = await page.evaluate(() => 
            document.querySelector('.next')
        )

        ++pageNumber;
    }

    try{
        const newDataCount = newData.length;
        newData.push(...oldData);
        const newDataCSV = json2csv(newData);
        await writeCSV(newDataCSV);

        console.log(`✅ Parsing completed!\n🎉 Added ${newDataCount} new records to dataset.`)
    }
    catch(error){
        console.log(`❌ ERROR in parsing and saving data.\nERROR Message : ${error}`);
    }

    await browser.close();
}

export const hard_scrape = async () => {
    var nextButton = {};
    var pageNumber = 1;
    var newData = [];

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    while(nextButton){
        console.log(`⏱️  Parsing page ${pageNumber} ...`);

        await page.goto(`https://rategain.com/blog/page/${pageNumber}`);

        var scrapedData = await page.evaluate(() => 
            Array.from(document.querySelectorAll('.blog-item'), (e) => {
                const content = e.children[0].children.length > 1 ? e.children[0].children[1] : e.children[0].children[0];
                const image = e.children[0].children.length > 1 ? e.children[0].children[0] : null;
                
                return (
                {
                    title: content.children[0].innerText,
                    date: content.children[1].children[0].innerText,
                    likes: content.children[4].innerText.trim(),
                    image: (image) ? image.children[0].dataset.bg : 'NA'
                })
            })
        );

        newData.push(...scrapedData);

        nextButton = await page.evaluate(() => 
            document.querySelector('.next')
        )

        ++pageNumber;
    }

    try{
        const newDataCount = newData.length;
        const newDataCSV = json2csv(newData);
        await writeCSV(newDataCSV);

        console.log(`✅ Parsing completed!\n🎉 Added ${newDataCount} new records to dataset.`)
    }
    catch(error){
        console.log(`❌ ERROR in parsing and saving data.\nERROR Message : ${error}`);
    }

    await browser.close();   
}