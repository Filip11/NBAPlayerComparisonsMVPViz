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

	parentFolder = (os.path.abspath(os.path.join(os.getcwd(), os.pardir)))
	parentFolder = os.path.join(parentFolder,'Data Store/')
	return(playerHrefDict)