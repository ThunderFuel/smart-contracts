import { Address } from 'fuels';

const main = async (addr: string) => {
    const a = Address.fromString(addr)
    return a.toB256()
}

main("fuel1u889fquj2u7r2ey3vh0u0gmj4wh4jfugpvakcttcpv349xd6ladqud7yt4")
    .then((res) => {
        console.log(res)
    })