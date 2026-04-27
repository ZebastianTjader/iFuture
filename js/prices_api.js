/* ============================================================
   prices_api.js
   Webbutveckling 1 | Vecka 17: fetch() och JSON

   Hanterar PricesAPI-integrationen på sidan "Jämföra priser".

   FLÖDE:
   1. Användaren skriver in ett produktnamn i sökfältet.
   2. Autocomplete-dropdown visas med matchande produkter.
   3. Användaren väljer en produkt eller trycker på Sök.
   4. fetch() anropar PricesAPI (simulerat med lokal JSON-data).
   5. Svaret parsas och de 5 billigaste butikerna visas i en tabell,
      sorterade från billigast till dyrast.
   ============================================================ */


/* ------------------------------------------------------------
   1. PRODUKTDATABAS (SIMULERAD PricesAPI-DATA)
      I ett riktigt projekt ersätts detta block med ett
      fetch()-anrop mot den riktiga API-endpointen, t.ex.:
        fetch(`https://api.pricesapi.com/v1/search?q=${produktnamn}&apikey=DIN_NYCKEL`)
      Gratisnivån ger ~1 000 anrop/månad.
   ------------------------------------------------------------ */

/**
 * Simulerad produktdatabas med prisuppgifter per butik.
 * Varje produkt har ett id, ett namn och en lista med butiksuppgifter.
 * @type {Array<Object>}
 */
/* ============================================================
   1. FULLSTÄNDIG PRODUKTDATABAS (PRICES_DB)
   Varje produkt har nu 5 butiker i Sverige med priser och länkar.
   ============================================================ */

const PRICES_DB = [
    {
        id: "iphone-17-pro-max",
        name: "iPhone 17 Pro Max",
        stores: [
            { name: "NetOnNet", price: 16981, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/mobiltelefoner/iphone/apple-iphone-17-pro-max-256gb-cosmic-orange/1059117.9044/" },
            { name: "Elgiganten", price: 16990, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/mobiltelefon/iphone-17-pro-max-5g-smartphone-256gb-cosmic-orange/982716?qid=f3cf1415d694c002cdac095f2643e2b0" },
            { name: "Power", price: 16980, inStock: true, url: "https://www.power.se/mobil-och-foto/mobiltelefoner/apple-iphone-17-pro-max-256-gb-kosmiskt-orange/p-4157306/?q=iphone%2017%20pro%20max" },
            { name: "Webhallen", price: 16981, inStock: true, url: "https://www.webhallen.com/se/product/389338-Apple-iPhone-17-Pro-Max-256GB-Cosmic-Orange" },
            { name: "Apple Store", price: 16995, inStock: true, url: "https://www.apple.com/se/shop/buy-iphone/iphone-17-pro" }
        ]
    },
    {
        id: "iphone-17-pro",
        name: "iPhone 17 Pro",
        stores: [
            { name: "NetOnNet", price: 14982, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/mobiltelefoner/iphone/apple-iphone-17-pro-256gb-cosmic-orange/1059115.9044/" },
            { name: "Elgiganten", price: 14990, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/mobiltelefon/iphone-17-pro-5g-smartphone-256gb-cosmic-orange/982706?q=iPhone+17+Pro+5G+smartphone+256GB+Cosmic+Orange&queryType=productName&qid=1873bf7ce7e07ea59dc1909af4dda447" },
            { name: "Power", price: 14981, inStock: true, url: "https://www.power.se/mobil-och-foto/mobiltelefoner/apple-iphone-17-pro-256-gb-kosmiskt-orange/p-4157296/?q=iphone%2017%20pro" },
            { name: "Webhallen", price: 14982, inStock: true, url: "https://www.webhallen.com/se/product/389335-Apple-iPhone-17-Pro-256GB-Cosmic-Orange" },
            { name: "Apple Store", price: 14995, inStock: true, url: "https://www.apple.com/se/shop/buy-iphone/iphone-17-pro" }
        ]
    },
    {
        id: "iphone-air",
        name: "iPhone Air",
        stores: [
            { name: "NetOnNet", price: 10990, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/mobiltelefoner/iphone/apple-iphone-air-256gb-space-black/1059104.9044/?utm_source=google&utm_medium=cpc&utm_campaign=p-se-search-brand-broad%2Fdsa&gad_source=1&gad_campaignid=22398497715&gbraid=0AAAAAD-k_JaGzrAcXKH_6_2nHpr7oUvee&gclid=EAIaIQobChMIn_K1m6r8kwMVR2CRBR20HjKFEAAYASAAEgKbsPD_BwE" },
            { name: "Elgiganten", price: 8990, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/mobiltelefon/iphone-air-5g-smartphone-256gb-space-black/982741" },
            { name: "Power", price: 8989, inStock: true, url: "https://www.power.se/mobil-och-foto/mobiltelefoner/apple-iphone-air-256-gb-rymdsvart/p-4157317/store/7101/?gclsrc=aw.ds&gad_source=1&gad_campaignid=23092580110&gbraid=0AAAAACqjObt9Z-epDnQyzVaewTEqzA8if&gclid=EAIaIQobChMIt6ayxKr8kwMVKCmiAx0nvTNgEAQYASABEgINlvD_BwE" },
            { name: "Komplett", price: 12195, inStock: true, url: "https://www.komplett.se/product/1328667/mobil-tablets-klockor/mobiltelefoner/iphone-air-256gb-rymdsvart" },
            { name: "Apple Store", price: 13995, inStock: true, url: "https://www.apple.com/se/shop/buy-iphone/iphone-air/6,5-tumssk%C3%A4rm-256gb-rymdsvart" }
        ]
    },
    {
        id: "iphone-17",
        name: "iPhone 17",
        stores: [
            { name: "NetOnNet", price: 9990, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/mobiltelefoner/iphone/apple-/1059112.9044/?utm_source=google&utm_medium=cpc&utm_campaign=p-se-shopping-brand&gad_source=1&gad_campaignid=20929376298&gbraid=0AAAAAD-k_JYeScT2v6GqLmrk6cmoOw_n_&gclid=EAIaIQobChMI3eabnav8kwMV5QWiAx2AgjDPEAQYASABEgLRdvD_BwE" },
            { name: "Elgiganten", price: 10960, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/mobiltelefon/iphone-17-5g-smartphone-256gb-svart/982749?utm_source=google&utm_medium=cpc&utm_campaign=SE%20-%20LIA%20-%20AO%20-%20TELE%20-%20Branded&utm_id=23200858275&gad_source=1&gad_campaignid=23200858275&gbraid=0AAAAAD7WKV8spo6KIA7waVWK8KwW1B9PZ&gclid=EAIaIQobChMI98qCqKv8kwMVh2eRBR1HfB-8EAQYASABEgIAwPD_BwE" },
            { name: "Power", price: 10958, inStock: true, url: "https://www.power.se/mobil-och-foto/mobiltelefoner/apple-iphone-17-256-gb-svart/p-4157177/?q=iphone%2017" },
            { name: "Webhallen", price: 10959, inStock: true, url: "https://www.webhallen.com/se/product/389360-Apple-iPhone-17-256GB-Black?utm_source=google&utm_medium=cpc&gad_source=1&gad_campaignid=23558120567&gbraid=0AAAAAD0gAa3DSHZBb99hqw8MA_Z_IGIaN&gclid=EAIaIQobChMIzcuMyav8kwMVdWeRBR2eyztVEAQYASABEgLFfPD_BwE" },
            { name: "Apple Store", price: 10995, inStock: true, url: "https://www.apple.com/se/shop/buy-iphone/iphone-17/6,3-tumssk%C3%A4rm-256gb-svart?afid=p240%7Cgo~cmp-20155483898~adg-189146319830~ad-773619241424_pla-2440946347659~dev-c~ext-~prd-MG6J4QN%2FA-SE~mca-5055540~nt-search&cid=aos-se-kwgo-lia-iphone-iphone--product-MG6J4QN%2FA-SE" }
        ]
    },
    {
        id: "iphone-17e",
        name: "iPhone 17e",
        stores: [
            { name: "NetOnNet", price: 8490, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/mobiltelefoner/iphone/apple-iphone-17e-256gb-black/1064438.9044/" },
            { name: "Power", price: 8488, inStock: true, url: "https://www.power.se/apple-iphone-17e-256-gb-svart/p-4252867/?q=iphone%2017e" },
            { name: "Elgiganten", price: 8490, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/mobiltelefon/iphone-17e-smarttelefon-256gb-black/1054966" },
            { name: "Webbhallen", price: 8489, inStock: true, url: "https://www.webhallen.com/se/product/396383-Apple-iPhone-17e-256GB-Black" },
            { name: "Apple Store", price: 8495, inStock: true, url: "https://www.apple.com/se/shop/buy-iphone/iphone-17e/6,1-tumssk%C3%A4rm-256gb-svart" }
        ]
    },
    {
        id: "macbook-pro-m5-max",
        name: "MacBook Pro M5 Max (14\")",
        stores: [
            { name: "Komplett", price: 49990, inStock: true, url: "https://www.komplett.se/product/1337264/dator-tillbehor/datorer-barbara-laptop/macbook-pro-16-m5-max-2026-2tb-silver?queryid=79abeb92e7a4bce8428f652a87b05e12&sort=None" },
            { name: "Power", price: 47990, inStock: true, url: "https://www.power.se/datorer-och-surfplattor/datorer/barbar-dator/apple-macbook-pro-16-2026-m5-max-362-tb-rymdsvart/p-4253556/?q=macbook%20pro%20m5%20max" },
            { name: "Webhallen", price: 53990, inStock: true, url: "https://www.webhallen.com/se/product/396570-Apple-MacBook-Pro-16-M5-Max-chip-18-core-CPU-40-core-GPU-48GB-2TB-SSD-Space-Black" },
            { name: "Elgiganten", price: 49995, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/datorer/laptop/macbook-pro-16-m5-max-362tb-space-black/1056036?qid=2786a9b2a9e9ab53b3c5c550198b941f" },
            { name: "Apple Store", price: 45495, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/macbook-pro" }
        ]
    },
    {
        id: "macbook-pro-m5-pro",
        name: "MacBook Pro M5 Pro (14\")",
        stores: [
            { name: "Komplett", price: 27990, inStock: true, url: "https://www.komplett.se/product/1337212/dator-tillbehor/datorer-barbara-laptop/macbook-pro-14-m5-pro-2026-1tb-rymdsvart?queryid=53da8b9b015b0402cba54a98e754811f&sort=None" },
            { name: "Webhallen", price: 26990, inStock: true, url: "https://www.webhallen.com/se/product/396566-Apple-MacBook-Pro-14-M5-Pro-chip-15-core-CPU-16-core-GPU-24GB-1TB-SSD-Space-Black" },
            { name: "Power", price: 26590, inStock: true, url: "https://www.power.se/datorer-och-surfplattor/datorer/barbar-dator/apple-macbook-pro-14-2026-m5-pro-241-tb-silver/p-4253543/?q=macbook%20pro%20m5%20pro" },
            { name: "Elgiganten", price: 26995, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/datorer/laptop/macbook-pro-14-m5-321tb-space-black/1056071?qid=79f122030701f99d780c1acf5e048e25" },
            { name: "Apple Store", price: 27995, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/macbook-pro" }
        ]
    },
    {
        id: "macbook-pro-m5",
        name: "MacBook Pro M5 (14\")",
        stores: [
            { name: "Inet", price: 28990, inStock: true, url: "https://www.inet.se/produkt/1979004/apple-macbook-pro-14-2-m5-32gb-1tb-rymdsvart-nanotextur" },
            { name: "Webhallen", price: 26490, inStock: true, url: "https://www.webhallen.com/se/product/396561-Apple-MacBook-Pro-14-M5-chip-10-core-CPU-10-core-GPU-32GB-1TB-SSD-Space-Black" },
            { name: "Power", price: 23990, inStock: true, url: "https://www.power.se/datorer-och-surfplattor/datorer/barbar-dator/apple-macbook-pro-14-2025-m5-241-tb-rymdsvart/p-4197000/?utm_source=prisjakt&utm_medium=cpc" },
            { name: "Elgiganten", price: 26995, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/datorer/laptop/macbook-pro-14-m5-321tb-space-black/1056071?qid=53b956e0b32787ac080521f54f2f752c" },
            { name: "Apple Store", price: 26995, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/macbook-pro" }
        ]
    },
    {
        id: "macbook-air-m5",
        name: "MacBook Air M5 (13\")",
        stores: [
            { name: "NetOnNet", price: 13990, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/laptop/laptop-12-14-tum/apple-13-inch-macbook-air-m5-chip-10core-cpu-8core-gpu-16gb-ram-512gb-ssd-midnight/1064530.8906/" },
            { name: "Power", price: 13989, inStock: true, url: "https://www.power.se/datorer-och-surfplattor/datorer/barbar-dator/apple-macbook-air-13-2026-m5-16512-gb-midnatt/p-4253519/store/7103/?gclsrc=aw.ds&gad_source=1&gad_campaignid=23092580110&gbraid=0AAAAACqjObu-SZ8-vPYW-d3yhlmG-75Lh&gclid=EAIaIQobChMI6uPDx7GGlAMVKGqRBR3KrQKdEAYYASABEgIaAfD_BwE" },
            { name: "Webhallen", price: 13990, inStock: true, url: "https://www.webhallen.com/se/product/396548-Apple-MacBook-Air-13-M5-chip-10-core-CPU-8-core-GPU-16GB-512GB-SSD-Midnight" },
            { name: "Elgiganten", price: 16999, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/datorer/laptop/macbook-air-15-m5-16512gb-silver/1056121?qid=d5c2c9ced21360d519dc3dad067ffa8f" },
            { name: "Apple Store", price: 13995, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/macbook-air/13-tum-midnatt-m5-chip-10-k%C3%A4rnig-processor-8-k%C3%A4rnig-grafik-16-gb-minne-512gb-lagring?afid=p240%7Cgo~cmp-9503448959~adg-98193255999~ad-424840966983_pla-2535669719197~dev-c~ext-~prd-MDHE4KS%2FA-SE~mca-5055540~nt-search&cid=aos-se-kwgo-pla-mac-mac--product-MDHE4KS%2FA-SE" }
        ]
    },
    {
        id: "macbook-air-m4",
        name: "MacBook Air M4 (13\")",
        stores: [
            { name: "Webhallen", price: 9990, inStock: true, url: "https://www.webhallen.com/se/product/383140-Apple-MacBook-Air-13-M4-chip-10-core-CPU-8-core-GPU-16GB-256GB-SSD-Midnight" },
            { name: "NetOnNet", price: 9990, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/laptop/laptop-12-14-tum/apple-13-inch-macbook-air-m4-chip-10-core-cpu-8-core-gpu-16gb-ram-256gb-ssd-silver/1054176.8906/" },
            { name: "Power", price: 9989, inStock: true, url: "https://www.power.se/apple-macbook-air-13-2025-m4-16256-gb-midnatt/p-4042908/?q=macbook-air-m4" },
            { name: "Elgiganten", price: 10990, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/datorer/laptop/macbook-air-13-m4-16256gb-sky-blue/905804?q=MacBook+Air+13+M4+16%2F256GB+%28Sky+Blue%29&queryType=productName&qid=384c3d911294907d2ec23cad13fe5b93" },
            { name: "Apple Store", price: 13995, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/macbook-air?afid=p240%7Cgo~cmp-9503448959~adg-98193255999~ad-424840966983_pla-2535669719197~dev-c~ext-~prd-MDHE4KS/A-SE~mca-5055540~nt-search&cid=aos-se-kwgo-pla-mac-mac--product-MDHE4KS/A-SE" }
        ]
    },
    {
        id: "macbook-neo",
        name: "MacBook Neo",
        stores: [
            { name: "NetOnNet", price: 7990, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/laptop/laptop-12-14-tum/apple-13-inch-macbook-neo-a18-pro-chip-6core-cpu-5core-gpu-8gb-ram-256gb-ssd-indigo/1064606.8906/" },
            { name: "Power", price: 7990, inStock: true, url: "https://www.power.se/apple-macbook-neo-13-a18-pro-8256-gb-indigo/p-4254019/?q=macbook-neo" },
            { name: "Webhallen", price: 7990, inStock: true, url: "https://www.webhallen.com/se/product/396598-Apple-MacBook-Neo-13-A18-Pro-chip-6-core-CPU-5-core-GPU-8GB-256GB-SSD-Indigo" },
            { name: "Elgiganten", price: 7990, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/datorer/laptop/macbook-neo-13-a18-pro-8256gb-indigo/1056904?q=MacBook+Neo+13+A18+Pro+8%2F256GB+%28Indigo%29&queryType=productName&qid=a0b857e648a93acbea6058248a610724" },
            { name: "Apple Store", price: 7990, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/macbook-neo" }
        ]
    },
    {
        id: "ipad-pro-m5",
        name: "iPad Pro M5 (11\")",
        stores: [
            { name: "NetOnNet", price: 12299, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/surfplattor/ipad/apple-11-inch-ipad-pro-m5-chip-wifi-256gb-standard-glass-space-black/1060398.21491/" },
            { name: "Power", price: 12299, inStock: true, url: "https://www.power.se/apple-ipad-pro-11-2025-wi-fi-256-gb-rymdsvart/p-4196934/?q=ipad-pro-m5" },
            { name: "Webhallen", price: 12290, inStock: true, url: "https://www.webhallen.com/se/product/391047-Apple-iPad-Pro-M5-11-WiFi-256GB-Standard-Glass-Space-Black" },
            { name: "Elgiganten", price: 16990, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/surfplatta/ipad-pro-13-m5-256gb-wifi-silver/998780?q=iPad+Pro+13%22+%28M5%29+256GB+WiFi+%28Silver%29&queryType=productName&qid=3cc8f27c981c0eaf62652be680c6621a" },
            { name: "Apple Store", price: 12995, inStock: true, url: "https://www.apple.com/se/shop/buy-ipad/ipad-pro" }
        ]
    },
    {
        id: "ipad-air-m4",
        name: "iPad Air M4 (11\")",
        stores: [
            { name: "NetOnNet", price: 7790, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/surfplattor/ipad/apple-11-inch-ipad-air-m4-chip-wi-fi-128gb-space-grey/1064407.21491/" },
            { name: "Power", price: 7390, inStock: true, url: "https://www.power.se/apple-ipad-air-11-2026-wi-fi-128-gb-rymdgraa/p-4252900/?q=ipad-air-m4" },
            { name: "Webhallen", price: 8690, inStock: true, url: "https://www.webhallen.com/se/product/396401-Apple-iPad-Air-M4-11-Wi-Fi-256GB-Space-Grey" },
            { name: "Elgiganten", price: 12589, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/surfplatta/ipad-air-13-m4-128gb-wifi-5g-space-grey/1054969" },
            { name: "Apple Store", price: 7795, inStock: true, url: "https://www.apple.com/se/shop/buy-ipad/ipad-air" }
        ]
    },
    {
        id: "ipad-air-m3",
        name: "iPad Air M3 (11\")",
        stores: [
            { name: "NetOnNet", price: 7990, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/surfplattor/ipad/apple-11-inch-ipad-air-wi-fi-cellular-128gb-space-grey/1054132.21491/" },
            { name: "Power", price: 6290, inStock: true, url: "https://www.power.se/apple-ipad-air-11-m3-wi-fi-128-gb-rymdgraa/p-4040378/?q=ipad-air-m3" },
            { name: "Webhallen", price: 6290, inStock: true, url: "https://www.webhallen.com/se/product/383093-Apple-iPad-Air-11-Wi-Fi-128GB-Space-Grey" },
            { name: "Elgiganten", price: 6290, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/surfplatta/ipad-air-11-m3-128gb-wifi-space-gray/905372?q=iPad+Air+11+M3+128GB+WiFi+%28Space+Gray%29&queryType=productName&qid=17037c2fad2c0921f54a7bd92f772c9c" },
            { name: "Apple Store", price: 7795, inStock: true, url: "https://www.apple.com/se/shop/buy-ipad/ipad-air/11-tum-sk%C3%A4rm-128gb-rymdgr%C3%A5-wifi" }
        ]
    },
    {
        id: "ipad-11",
        name: "iPad (11th gen)",
        stores: [
            { name: "NetOnNet", price: 4490, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/surfplattor/ipad/apple-11-inch-ipad-wi-fi-128gb-silver/1054053.21491/" },
            { name: "Power", price: 4489, inStock: true, url: "https://www.power.se/apple-ipad-11-a16-wi-fi-128-gb-silver/p-4040611/?q=ipad-11" },
            { name: "Webhallen", price: 4490, inStock: true, url: "https://www.webhallen.com/se/product/383013-Apple-iPad-11-Wi-Fi-128GB-Silver" },
            { name: "Elgiganten", price: 4490, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/surfplatta/ipad-11-11th-gen-128gb-wifi-silver/905379?q=iPad+11%22+%2811th+gen%29+128GB+WiFi+%28silver%29&queryType=productName&qid=1bf5931b006e6a6a43ffaa4a3c915554" },
            { name: "Apple Store", price: 4495, inStock: true, url: "https://www.apple.com/se/shop/buy-ipad/ipad" }
        ]
    },
    {
        id: "studio-display-xdr",
        name: "Studio Display XDR",
        stores: [
            { name: "Dustin", price: 40999, inStock: true, url: "https://www.dustin.se/product/5020085648/studio-display-xdr---standard-glass---tilt--and-height-adjustable-stand" },
            { name: "Power", price: 39990, inStock: true, url: "https://www.power.se/apple-studio-display-xdr-27-lutning-och-hojd-justerbar-stativ/p-4253834/?q=studio-display-xdr" },
            { name: "Webhallen", price: 39990, inStock: true, url: "https://www.webhallen.com/se/product/396522-Apple-Studio-Display-XDR-Standard-glass-Tilt-and-height-adjustable-stand" },
            { name: "Elgiganten", price: 34995, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/skarmar-tillbehor/datorskarm/studio-display-xdr-med-standardglasvesa-adapterutan-stativ/1056145?q=Studio+Display+XDR+med+standardglas%2FVESA-adapter%2FUtan+stativ&queryType=productName&qid=23804766a2b47008cad161cfeae01bdf" },
            { name: "Apple Store", price: 39995, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/studio-display-xdr" }
        ]
    },
    {
        id: "studio-display",
        name: "Studio Display",
        stores: [
            { name: "NetOnNet", price: 18990, inStock: true, url: "https://www.netonnet.se/art/dator-surfplatta/datorskarmar/datorskarmar-27-30-tum/apple-studio-display-standard-glass-tilt-adjustable-stand/1064532.8903/" },
            { name: "Power", price: 18990, inStock: true, url: "https://www.power.se/apple-studio-display-27-lutning-justerbar-stativ/p-4253838/?q=studio-display" },
            { name: "Webhallen", price: 18990, inStock: true, url: "https://www.webhallen.com/se/product/396549-Apple-Studio-Display-Standard-glass-Tilt-adjustable-stand" },
            { name: "Elgiganten", price: 23990, inStock: true, url: "https://www.elgiganten.se/product/datorer-kontor/skarmar-tillbehor/datorskarm/studio-display-med-standardglaslutnings-och-hojdjusterbart-stativ/1056150?q=Studio+Display+med+Standardglas%2FLutnings-+och+h%C3%B6jdjusterbart+stativ&queryType=productName&qid=1735e2722e5ceb9294da922bd302c499" },
            { name: "Apple Store", price: 18995, inStock: true, url: "https://www.apple.com/se/shop/buy-mac/studio-display" }
        ]
    },
    {
        id: "watch-ultra-3",
        name: "Apple Watch Ultra 3",
        stores: [
            { name: "NetOnNet", price: 9589, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/smartwatch/apple-watch/apple-watch-ultra-3gps-cellular49mmblack-titanium-case-with-black-ocean-band/1059206.13980/" },
            { name: "Power", price: 9989, inStock: true, url: "https://www.power.se/mobil-och-foto/smartwatch-och-wearables/smartwatch/apple-watch-ultra-3-gps-cell-49-mm-svart-titan-svart-havsband/p-4157276/?q=watch-ultra-3" },
            { name: "Webhallen", price: 9589, inStock: true, url: "https://www.webhallen.com/se/product/389455-Apple-Watch-Ultra-3GPS-Cellular49mmBlack-Titanium-Case-med-Black-Ocean-Band" },
            { name: "Elgiganten", price: 11190, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/smartwatch/apple-watch-ultra-3-49mm-black-titaniumblack-titanium-milanese-loop-s/982704?q=Apple+Watch+Ultra+3+49mm+%28Black+Titanium%2FBlack+Titanium+Milanese+Loop%29+S&queryType=productName&qid=d6cd390955bf630e5335df7b6d082e6d" },
            { name: "Apple Store", price: 9995, inStock: true, url: "https://www.apple.com/se/shop/buy-watch/apple-watch-ultra" }
        ]
    },
    {
        id: "watch-s11",
        name: "Apple Watch S11",
        stores: [
            { name: "NetOnNet", price: 4985, inStock: true, url: "https://www.netonnet.se/art/mobil-smartwatch/smartwatch/apple-watch/apple-watch-series-11-gps-42mm-jet-black-aluminium-case-with-black-sport-band-sm/1059160.13980/" },
            { name: "Power", price: 4984, inStock: true, url: "https://www.power.se/apple-watch-series-11-gps-42-mm-gagatsvart-aluminum-svart-sportband-sm/p-4157194/?q=Watch%20Series%2011%20GPS" },
            { name: "Webhallen", price: 4984, inStock: true, url: "https://www.webhallen.com/se/product/389377-Apple-Watch-Series-11GPS42mmJet-Black-Aluminium-Case-med-Black-Sport-Band-SM" },
            { name: "Elgiganten", price: 4990, inStock: true, url: "https://www.elgiganten.se/product/mobiler-tablets-smartklockor/smartwatch/apple-watch-s11-42mm-gps-space-gray-aluminium-black-sport-band-sm/982681?q=Apple+Watch+S11+42mm+GPS+%28Space+Gray+Aluminium%2F+Black+Sport+Band%29+S%2FM&queryType=productName&qid=2c493bc675aed54a7b5ecdddc157ce38" },
            { name: "Apple Store", price: 4995, inStock: true, url: "https://www.apple.com/se/shop/buy-watch/apple-watch" }
        ]
    },
    {
        id: "airpods-pro-3",
        name: "AirPods Pro 3",
        stores: [
            { name: "NetOnNet", price: 2590, inStock: true, url: "https://www.netonnet.se/art/ljud/horlurar/in-ear/apple-airpods-pro-3/1059118.9292/" },
            { name: "Power", price: 2890, inStock: true, url: "https://www.power.se/apple-airpods-pro-3/p-4157161/?q=AirPods%20Pro%203" },
            { name: "Webhallen", price: 2590, inStock: true, url: "https://www.webhallen.com/se/product/389327-Apple-AirPodsPro3" },
            { name: "Elgiganten", price: 2590, inStock: true, url: "https://www.elgiganten.se/product/tv-ljud-smart-hem/horlurar-tillbehor/horlurar/apple-airpods-pro-gen-3-2025-true-wireless-horlurar/982641?q=Apple+AirPods+Pro+Gen+3+%282025%29++True+Wireless+h%C3%B6rlurar&queryType=productName&qid=709ae52b4ed7ba7fe86f9bc31407cd57" },
            { name: "Apple Store", price: 2995, inStock: true, url: "https://www.apple.com/se/shop/buy-airpods/airpods-pro-3?fnode=df3edc644ba0eaba47b7085e4b5a8ec300574ed55935f1ae78881cbe6be637642f5a2f270da7a85dfffb12fc0dd80f299984e74de38a2d20e87ad39b5b0ffd6c6896c32cc51b06de783a970caea5b2ac5ddee41566f20046320696f37d688fb0" }
        ]
    }
];

/* ------------------------------------------------------------
   2. SIMULERAD fetch() MOT PricesAPI
      fetchPrices() efterliknar ett riktigt API-anrop med fetch().
      Data returneras som ett Promise med ett JSON-liknande objekt,
      precis som PricesAPI skulle svara.
   ------------------------------------------------------------ */

/**
 * Simulerar ett fetch()-anrop mot PricesAPI.
 * Returnerar ett Promise med JSON-data för den sökta produkten.
 *
 * I ett riktigt projekt används istället:
 *   fetch(`https://api.pricesapi.com/v1/search?q=${encodeURIComponent(query)}&apikey=DIN_NYCKEL`)
 *     .then(response => response.json())
 *
 * @param {string} query - Produktnamn att söka efter
 * @returns {Promise<Object>} JSON-svar med produktdata
 */
function fetchPrices(query) {
    return new Promise((resolve, reject) => {

        /* Simulerar nätverksfördröjning (300–700 ms) */
        const delay = 300 + Math.random() * 400;

        setTimeout(() => {

            /* Normaliserar söktermen: gemener och trimmad whitespace */
            const q = query.trim().toLowerCase();

            /* Hittar en matchande produkt i databasen */
            const product =
                PRICES_DB.find(p => p.name.toLowerCase() === q) ||
                PRICES_DB.find(p => p.name.toLowerCase().includes(q));

            /* Returnerar ett fel-objekt om ingen produkt hittas */
            if (!product) {
                reject({
                    status: 404,
                    message: `Ingen produkt hittades för "${query}". Kontrollera stavningen och försök igen.`
                });
                return;
            }

            /* Sorterar butikerna från billigast till dyrast */
            const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);

            /* Begränsar till de 5 billigaste butikerna */
            const top5 = sortedStores.slice(0, 5);

            /* Returnerar ett JSON-liknande svar – samma struktur som PricesAPI */
            resolve({
                status: 200,
                data: {
                    product_name: product.name,
                    query: query,
                    result_count: top5.length,
                    results: top5.map((store, index) => ({
                        rank: index + 1,
                        store: store.name,
                        price: store.price,
                        currency: "SEK",
                        in_stock: store.inStock,
                        store_url: store.url
                    }))
                }
            });

        }, delay);
    });
}


/* ------------------------------------------------------------
   3. HJÄLPFUNKTIONER
   ------------------------------------------------------------ */

/**
 * Formaterar ett pris som en svensk valutasträng, t.ex. "18 995 kr".
 * @param {number} price - Priset i kronor
 * @returns {string} Formaterat pris
 */
function formatPrice(price) {
    return price.toLocaleString("sv-SE") + " kr";
}

/**
 * Returnerar en HTML-sträng med lagerstatus-badge.
 * @param {boolean} inStock - true om produkten finns i lager
 * @returns {string} HTML-sträng
 */
function renderStockBadge(inStock) {
    if (inStock) {
        return '<span class="pm-badge pm-badge--in-stock">I lager</span>';
    }
    return '<span class="pm-badge pm-badge--out-of-stock">Ej i lager</span>';
}

/**
 * Returnerar rätt rankningsbadge (guld/silver/brons eller siffra).
 * @param {number} rank - Plats i listan (1-indexerad)
 * @returns {string} HTML-sträng
 */
function renderRankBadge(rank) {
    const medals = ["1", "2", "3"];
    if (rank <= 3) {
        return `<span class="pm-rank" aria-label="Plats ${rank}">${medals[rank - 1]}</span>`;
    }
    return `<span class="pm-rank" aria-label="Plats ${rank}">${rank}</span>`;
}

/**
 * Döljer alla resultat-element och återställer sidan till ursprungsläget.
 */
function resetResults() {
    document.getElementById("pm-loading").hidden = true;
    document.getElementById("pm-error").hidden = true;
    document.getElementById("pm-result-content").hidden = true;
}

/**
 * Filtrerar produkter för autocomplete-listan baserat på söktermen.
 * @param {string} query - Det användaren skrivit in
 * @returns {Array<Object>} Matchande produkter
 */
function getProductSuggestions(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return PRICES_DB.filter(p => p.name.toLowerCase().includes(q));
}


/* ------------------------------------------------------------
   4. VISA RESULTAT I TABELLEN
   ------------------------------------------------------------ */

/**
 * Renderar API-svaret i HTML-tabellen.
 * @param {Object} data - API-svarets data-objekt
 */
function renderResults(data) {
    /* Produktrubrik */
    document.getElementById("pm-product-name").textContent = data.product_name;

    /* Metainfo (antal resultat) */
    document.getElementById("pm-result-meta").textContent =
        `Visar de ${data.result_count} billigaste butikerna, sorterade från lägst till högst pris.`;

    /* Bygg upp tabellrader */
    const tbody = document.getElementById("pm-table-body");
    tbody.innerHTML = "";

    data.results.forEach(result => {
        const tr = document.createElement("tr");

        /* Markera billigaste raden */
        if (result.rank === 1) {
            tr.classList.add("pm-row--cheapest");
        }

        tr.innerHTML = `
            <td>${renderRankBadge(result.rank)}</td>
            <td class="pm-store-name">${result.store}</td>
            <td class="pm-price">${formatPrice(result.price)}</td>
            <td>${renderStockBadge(result.in_stock)}</td>
            <td>
                <a href="${result.store_url}" target="_blank" rel="noopener noreferrer"
                   class="btn pm-store-link" aria-label="Gå till ${result.store}">
                    Gå till butik <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </a>
            </td>
        `;

        tbody.appendChild(tr);
    });

    /* Visa resultat-sektionen */
    document.getElementById("pm-result-content").hidden = false;
}


/* ------------------------------------------------------------
   5. SÖKLOGIK – HANTERAR SÖKNING MED fetch()
   ------------------------------------------------------------ */

/**
 * Utför sökningen: visar laddningsindikatorn, anropar fetchPrices()
 * och hanterar både lyckat svar och fel.
 * @param {string} query - Söktermen
 */
async function performSearch(query) {
    if (!query || !query.trim()) return;

    /* Återställ och visa laddningsindikator */
    resetResults();
    document.getElementById("pm-loading").hidden = false;

    /* Dölj dropdown */
    hideSuggestions();

    try {
        /* Anropar den simulerade PricesAPI med fetch()-mönster */
        const response = await fetchPrices(query);

        /* Dölj laddningsindikatorn */
        document.getElementById("pm-loading").hidden = true;

        /* Rendera resultaten i tabellen */
        renderResults(response.data);

    } catch (error) {
        /* Dölj laddningsindikatorn */
        document.getElementById("pm-loading").hidden = true;

        /* Visa felmeddelande */
        document.getElementById("pm-error-text").textContent = error.message;
        document.getElementById("pm-error").hidden = false;
    }
}


/* ------------------------------------------------------------
   6. AUTOCOMPLETE – DROPDOWN MED PRODUKTFÖRSLAG
   ------------------------------------------------------------ */

/** @type {number} - Index för tangentbordsnavigering i dropdown */
let activeSuggestionIndex = -1;

/**
 * Visar autocomplete-förslagen i dropdown-listan.
 * @param {Array<Object>} suggestions - Matchande produkter
 */
function showSuggestions(suggestions) {
    const list = document.getElementById("pm-suggestions");
    list.innerHTML = "";
    activeSuggestionIndex = -1;

    if (suggestions.length === 0) {
        list.hidden = true;
        return;
    }

    suggestions.forEach((product, index) => {
        const li = document.createElement("li");
        li.textContent = product.name;
        li.setAttribute("role", "option");
        li.setAttribute("id", `pm-suggestion-${index}`);
        li.setAttribute("aria-selected", "false");

        /* Klick på förslag: fyll i sökfältet och sök */
        li.addEventListener("click", () => {
            document.getElementById("pm-search-input").value = product.name;
            hideSuggestions();
            performSearch(product.name);
        });

        list.appendChild(li);
    });

    list.hidden = false;
}

/**
 * Döljer autocomplete-dropdown.
 */
function hideSuggestions() {
    const list = document.getElementById("pm-suggestions");
    list.hidden = true;
    list.innerHTML = "";
    activeSuggestionIndex = -1;
}

/**
 * Markerar en rad i dropdown med tangentbordsnavigering.
 * @param {number} newIndex - Det nya aktiva indexet
 * @param {HTMLUListElement} list - Dropdown-listan
 */
function setActiveSuggestion(newIndex, list) {
    const items = list.querySelectorAll("li");

    /* Ta bort markering från tidigare rad */
    items.forEach(item => {
        item.classList.remove("pm-suggestion--active");
        item.setAttribute("aria-selected", "false");
    });

    /* Begränsa indexet till giltigt intervall */
    activeSuggestionIndex = Math.max(-1, Math.min(newIndex, items.length - 1));

    if (activeSuggestionIndex >= 0) {
        items[activeSuggestionIndex].classList.add("pm-suggestion--active");
        items[activeSuggestionIndex].setAttribute("aria-selected", "true");
    }
}


/* ------------------------------------------------------------
   7. HÄNDELSELYSSNARE – KÖRS NÄR SIDAN HAR LADDATS
   ------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("pm-search-input");
    const searchBtn = document.getElementById("pm-search-btn");
    const suggestions = document.getElementById("pm-suggestions");

    /* Finns inte elementen på sidan – avsluta tidigt */
    if (!searchInput || !searchBtn) return;

    /* --- Sökknapp: utför sökning --- */
    searchBtn.addEventListener("click", () => {
        performSearch(searchInput.value);
    });

    /* --- Enter-tangent i sökfältet: utför sökning --- */
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (activeSuggestionIndex >= 0) {
                /* Välj markerat förslag */
                const activeItem = suggestions.querySelector(".pm-suggestion--active");
                if (activeItem) {
                    searchInput.value = activeItem.textContent;
                    hideSuggestions();
                    performSearch(searchInput.value);
                }
            } else {
                /* Sök på det skrivna */
                performSearch(searchInput.value);
            }

        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveSuggestion(activeSuggestionIndex + 1, suggestions);

        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveSuggestion(activeSuggestionIndex - 1, suggestions);

        } else if (event.key === "Escape") {
            hideSuggestions();
        }
    });

    /* --- Tangentbordsinmatning: uppdatera autocomplete --- */
    searchInput.addEventListener("input", () => {
        const matches = getProductSuggestions(searchInput.value);
        showSuggestions(matches);
    });

    /* --- Klick utanför sökfältet: dölj dropdown --- */
    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !suggestions.contains(event.target)) {
            hideSuggestions();
        }
    });

});