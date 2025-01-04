import axios from 'axios';

async function carbonara(text) {
    try {
        const response = await axios.post('https://carbonara.solopov.dev/api/cook', {
            code: text
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        throw new Error('Unable to generate image');
    }
}

export { carbonara };