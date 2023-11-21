import { soft_scrape, hard_scrape } from './utils/scraper.js';
import readline from 'readline';

const run = async () => {
    console.log('Welcome to RateGain Web Scraper!');

    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    reader.question(`Choose one of the following options :\n1. Soft Scrape ( Tries to scrape only new data )\n2. Hard Scrape ( Tries to scrape the whole website )\n`, async (option) => {
        reader.close();

        if(option == 1){
            console.log('🏎️  Loading Soft scraper ...');
            soft_scrape();
            
        }
        else if(option == 2){
            console.log('🏎️  Loading Hard scraper ...');
            hard_scrape();
        }
        else{
            console.log('❌ Invalid option!\n🚨 Restarting ...');
            run();
        }
    });
};

run();
