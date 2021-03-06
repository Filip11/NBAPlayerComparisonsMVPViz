import csv
from bs4 import BeautifulSoup
import urllib2
import os 

#Return a dict of href name pairs from a /leagues/NBA_2017_per_game.html link
def buildAllPlayersDict(allPlayersURL):
	playerHrefDict = dict()
	urlHTML = urllib2.urlopen(allPlayersURL)
	soupObj = BeautifulSoup(urlHTML,"html.parser")

	playerTable = (soupObj.find('table',id="per_game_stats")).findAll('tr')[1:]
	for row in playerTable:
		if (row.find('td')):
			playerName =row.find('td',{"data-stat":"player"}).getText()
			playerHref = row.findAll('a',href=True)[0]['href']
			playerHrefDict[playerName] = playerHref
	#Special case retired player
	playerHrefDict["Tim Duncan"]="/players/d/duncati01.html"
	parentFolder = (os.path.abspath(os.path.join(os.getcwd(), os.pardir)))
	parentFolder = os.path.join(parentFolder,'Data Store/')

	# with open(parentFolder+"AllPlayers2017.csv","wb") as outputCSV:

	# 	for player in playerHrefDict:
	# 		print(player)
	# 		outputCSV.write(player+",")

	return(playerHrefDict)

if __name__ == "__main__":
	buildAllPlayersDict("https://www.basketball-reference.com/leagues/NBA_2017_per_game.html")