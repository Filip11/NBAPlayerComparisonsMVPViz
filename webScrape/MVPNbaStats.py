from bs4 import BeautifulSoup
import pandas
import urllib2

seasonHrefDict = dict()
mvpHrefDict = dict()
basketballReferenceURL = "https://www.basketball-reference.com{params}"
def main():
	#get Average MVPs and stats
	averageMVPProcess()
	#Get player stats per game
	getPlayerStatsSeason()


def averageMVPProcess():
	#create soup obj on list of seasons html
	seasonsURL = "https://www.basketball-reference.com/leagues/"
	urlHTML = urllib2.urlopen(seasonsURL)
	soupObj = BeautifulSoup(urlHTML,"html.parser")
	#set up a data frame from the seasons page with columns: Season, Mvp
	dataFrame = seasonIndexParse(soupObj)
	#Concat the data frame with the mvp season stats
	dataFrameWithStats = getMVPSeasonStats(dataFrame)
	dataFrameWithStats.apply(pandas.to_numeric, errors='ignore')
	print(dataFrameWithStats)

def seasonIndexParse(soup):
	#get season column Headers
	columnHeaders = []
	seasonData = []
	columnsUnderStudy = [0,3]
	for column in columnsUnderStudy:
		columnHeaders.append(soup.findAll('tr',limit=2)[1].findAll('th')[column].getText())
	
	#set data from table - we're going back to 86-87 season - 3:33
	dataRows = soup.findAll('tr')[3:6]
	#For each table row, extract the text from the data element
	for row in dataRows:
		seasonsTag = row.findAll('a',href=True)[0]
		seasonsText=seasonsTag.getText()
		seasonsHref=seasonsTag['href']
		#Build season dictionaries for later use
		seasonHrefDict[seasonsText] = seasonsHref

		mvpsTag = row.findAll('td')[2]
		mvpsText = mvpsTag.getText()
		mvpsHref = mvpsTag.find('a')['href']
		#Build player href dictionaries for later use
		mvpHrefDict[mvpsText]=mvpsHref
		#Add season,mvp pair for dataFrame
		seasonData.append([seasonsText,mvpsText])
		
	dataFrame = pandas.DataFrame(seasonData,columns=columnHeaders)
	return(dataFrame)


def getMVPSeasonStats(masterDataFrame):
	#Dataframe for all mvp stats
	mvpsStatsDataFrame = pandas.DataFrame()
	for i in range(len(masterDataFrame)):
		#Get player and season from origin data frame
		playerUnderStudy = masterDataFrame.iloc[i]['MVP']
		playedSeason=masterDataFrame.iloc[i]['Season']

		#go to player's url
		mvpURL = basketballReferenceURL.format(params=mvpHrefDict[playerUnderStudy])
		mvpURLHTML = urllib2.urlopen(mvpURL)
		soupObj = BeautifulSoup(mvpURLHTML,"html.parser")

		columnHeaders = ["PPG"]
		playerData = []

		#Get the year, ex 2017 for 2016-17
		playedYear = (getYearFromSeason(seasonHrefDict[playedSeason]))

		#Look at table Per Game
		tablePerGame = soupObj.find('div',id="all_per_game").find('tr',id='per_game.'+playedYear)
		seasonStats = (tablePerGame.findAll('td'))
		for td in seasonStats:
			if(td['data-stat'] == "pts_per_g"):
				playerData.append(td.getText())
		#Temp Dataframe for singe mvps stats single season
		seasonStatsDataFrame = pandas.DataFrame(playerData,columns=columnHeaders)
		#Add column for players name
		seasonStatsDataFrame.insert(0,'MVP',playerUnderStudy)
		#Add the single mvp to all mvps dataframe
		mvpsStatsDataFrame=mvpsStatsDataFrame.append(seasonStatsDataFrame,ignore_index = True)

	#Concat the stats with the info mvp season data frame
	return(pandas.concat([masterDataFrame.set_index('MVP'),mvpsStatsDataFrame.set_index('MVP')],axis=1, join = 'inner').reset_index())

def getYearFromSeason(season):
	#Extract the year from /leagues/NBA_2017.html
	try:
		start = season.index( "_" ) + len( "_" )
		end = season.index(".", start)
		return season[start:end]
	except ValueError:
		return ""

def analyzeMVPStats(dataFrame):
	#Stats we want: PPG, MPG, TS%, WIN SHARES,
	avgPPG = (dataFrameWithStats['PPG'].sum())/len(dataFrame)


def getPlayerStatsSeason():
	gameStatsURL = basketballReferenceURL.format(params='/players/w/westbru01/'+'gamelog/2017')
	gameStatsHTML = urllib2.urlopen(gameStatsURL)
	soupObj = BeautifulSoup(gameStatsHTML,"html.parser")

	#Columns
	columnHeaders = ['Game','PTS_G']
	colIdxs = [1,27]
	playerData = []
	#Table rows data
	traditionalTable = soupObj.find('div',id="all_pgl_basic").find('tbody').findAll("tr")
	#Use game data to build dataframe
	gameData = []

	for row in traditionalTable:

		gameNumber = (row.find('td',{"data-stat":"game_season"}))
		ppg = (row.find('td',{"data-stat":"pts"}))

		if gameNumber is not None and ppg is not None:
			gameData.append([gameNumber.getText(),ppg.getText()])
	
	#Hard coded Russell Westbrook. 
	gameDataDataFrame = pandas.DataFrame(gameData,columns=columnHeaders)
	gameDataDataFrame.insert(0,'Player','R. Westbrook')
	print(gameDataDataFrame)
if __name__ == "__main__":
	main()