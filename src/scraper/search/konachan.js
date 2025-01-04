import axios from "axios";
import * as cheerio from "cheerio";

async function konachan(chara) {
    return new Promise((resolve, reject) => {
		let text = chara.replace(' ', '_')
		axios.get('https://konachan.net/post?tags=' + text + '+')
			.then(({
				data
			}) => {
				const $$ = cheerio.load(data)
				const no = [];
				$$('div.pagination > a').each(function(c, d) {
					no.push($$(d).text())
				})
				let mat = Math.floor(Math.random() * no.length)
				axios.get('https://konachan.net/post?page=' + mat + '&tags=' + text + '+')
					.then(({
						data
					}) => {
						const $ = cheerio.load(data)
						const result = [];
						$('#post-list > div.content > div:nth-child(4) > ul > li > a.directlink.largeimg').each(function(a, b) {
							result.push($(b).attr('href'))
						})
						resolve(result)
					})
			})
			.catch(reject)
	})
}

export { konachan };