from bs4 import BeautifulSoup
import requests

rank = 1
token = '/siteinfo/'
EMPTY_STR = ''
baseURL = 'http://www.alexa.com/topsites/global;'

with open("ranking.txt", "w") as f:
	for page in range(0, 20):
		r = requests.get(baseURL + str(page))
		soup = BeautifulSoup(r.text, 'html.parser')
		for link in soup.find_all('a'):
			href = link.get('href')
			if href is not None:
				url = href.encode('utf-8')
				if token in url:
					url = url.replace(token, EMPTY_STR)
					if url:
						f.write(url + " " + str(rank) + "\n")
						rank += 1
