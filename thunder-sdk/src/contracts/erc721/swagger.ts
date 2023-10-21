const fs = require('fs');

const getOwners = async () => {
    const listings = []

    for (let i=0; i<50; i++) {
        let tokenId = 5059 + i
        const listing = {
            "tokenId": tokenId,
            "price": 1,
            "priceType": 0,
            "expireTime": 1696932862
        }
        listings.push(listing)
    }
    let data = JSON.stringify(listings);
    fs.writeFileSync('swagger.json', data)
}

getOwners()
    .then(() => console.log("done"))
    .catch((err) => console.log(err))

// updateIDs()
//     .then(() => console.log("done"))
//     .catch((err) => console.log(err))