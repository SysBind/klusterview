// redis.js

const webdis_url = "http://127.0.0.1:7379"

class Redis {
    async GET(key) {
        const response = await fetch(`${webdis_url}/GET/${key}`);
        const value = await response.json();
        return value.GET;
    }

    async MGET(...keys) {
        let query = `${webdis_url}/MGET/`;
        keys.forEach( key => query = query + "/" + key);
        const response = await fetch(query);
        const value = await response.json();
        return value.MGET;
    }    

    async SMEMBERS(key) {
        const response = await fetch(`${webdis_url}/SMEMBERS/${key}`);
        const value = await response.json();
        return value.SMEMBERS;
    }
}
