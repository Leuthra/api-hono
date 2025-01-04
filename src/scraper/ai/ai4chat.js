async function ai4chat(text, country = 'Asia', userId = 'usersmjb2oaz7y') {
    try {
        const response = await fetch(`https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug?text=${encodeURIComponent(text)}&country=${encodeURIComponent(country)}&user_id=${encodeURIComponent(userId)}`, {
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'id-ID,id;q=0.9',
                'Origin': 'https://www.ai4chat.co',
                'Priority': 'u=1, i',
                'Referer': 'https://www.ai4chat.co/',
                'Sec-CH-UA': '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
                'Sec-CH-UA-Mobile': '?1',
                'Sec-CH-UA-Platform': '"Android"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
            }})
        const data = await response.text()
        let parse = data.replace(/\\n/g, '\n')
        return parse
    } catch (error) {
        throw new Error('Unable to retrieve data');
    }
}

export { ai4chat };