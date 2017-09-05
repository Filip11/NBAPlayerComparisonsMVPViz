from bs4 import BeautifulSoup
import pandas
import urllib2
import generatePlayerRef 
import os

seasonHrefDict = dict()
mvpHrefDict = dict()
basketballReferenceURL = "https://www.basketball-reference.com{params}"
allPlayersHrefDict = dict()

def main():
	#Build dict with links for all NBA players
	allPlayersHrefDict.update(generatePlayerRef.buildAllPlayersDict("https://www.basketball-reference.com/leagues/NBA_2017_per_game.html"))
	#get Average MVPs and stats
	averageMVPProcess()

	#Player season data to be retrieved
	playersToStudy=[['Russell Westbrook','2017'],['James Harden','2017'],['Kawhi Leonard','2017'],['LeBron James','2017'],['Isaiah Thomas','2017'],['Stephen Curry','2017'],
	['John Wall','2017'],['Giannis Antetokounmpo','2017'],['Anthony Davis','2017'],['Kevin Durant','2017'],['DeMar DeRozan','2017'],['Stephen Curry','2016'],['Kawhi Leonard','2016'],
	['LeBron James','2016'],['Russell Westbrook','2016'],['Kevin Durant','2016'],['Chris Paul','2016'],['Draymond Green','2016'],['Damian Lillard','2016'],['James Harden','2016'],
	['Kyle Lowry','2016'],['Stephen Curry','2015'],['James Harden','2015'],['LeBron James','2015'],['Russell Westbrook','2015'],['Anthony Davis','2015'],['Chris Paul','2015'],
	['LaMarcus Aldridge','2015'],['Marc Gasol','2015'],['Blake Griffin','2015'],['Tim Duncan','2015'],['Kawhi Leonard','2015'],['Klay Thompson','2015']]
	for playerSeason in playersToStudy:
		player=playerSeason[0]
		season=playerSeason[1]
		#Get player stats per game
		#playerTradDF = getPlayerStatsSeason(player,season) #uncomment to fill out our players files
		

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
	mvpPerGameDF = pandas.DataFrame()

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

		### get players Game by Game stats, add it to a master DF we have for all mvps
		mvpGameStatsDF = analyzeMVPStats(playerUnderStudy,playedYear)
		mvpPerGameDF = pandas.concat([mvpGameStatsDF,mvpPerGameDF],axis=1)
		onlyPointsPG = mvpPerGameDF[['PTS_G']].copy()

	## Convert all the mvps game by game stats to float and get a new column for average of it
	onlyPointsPG.apply(pandas.to_numeric, errors='ignore')
	#We use the index column as Game column, start at 1
	onlyPointsPG.index +=1
	onlyPointsPG.index.name = "Game"
	#Get the mean of all the stats by row
	onlyPointsPG['mean'] = onlyPointsPG.mean(axis = 1);
	#Write stats to csv
	parentFolder = (os.path.abspath(os.path.join(os.getcwd(), os.pardir)))
	parentFolder = os.path.join(parentFolder,'Data Store/MVPAverage/')
	fileName="PPG"
	columnsToCSV = ["mean"]
	onlyPointsPG.to_csv(parentFolder+fileName+'.csv',columns = columnsToCSV)
	####
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

def analyzeMVPStats(playerUnderStudy,playedYear):
	#Stats we want: PPG, MPG, TS%, WIN SHARES,
	#statsDF = ()
	#return (statsDF)
	###### go to players season url and call get player game stats to get a DF of his game:pts_g pairs
	gameStatsURL = basketballReferenceURL.format(params=mvpHrefDict[playerUnderStudy][:-5]+'/gamelog/'+playedYear)
	gameStatsHTML = urllib2.urlopen(gameStatsURL)
	soupObj = BeautifulSoup(gameStatsHTML,"html.parser")
	mvpGameStatsDF= getPlayerGameStatsTrad(soupObj)
	return mvpGameStatsDF

#Get the play href extension and pass the soupObj to getPlayerGameStatsTrad
def getPlayerStatsSeason(playerName,season):
	playerHref = allPlayersHrefDict[playerName]
	gameStatsURL = basketballReferenceURL.format(params=playerHref[:-5]+'/gamelog/'+season)
	gameStatsHTML = urllib2.urlopen(gameStatsURL)
	soupObj = BeautifulSoup(gameStatsHTML,"html.parser")

	playerTradStatsDF = getPlayerGameStatsTrad(soupObj)
	#Write stats to csv
	parentFolder = (os.path.abspath(os.path.join(os.getcwd(), os.pardir)))
	parentFolder = os.path.join(parentFolder,'Data Store/'+season+'/')
	fileName=playerName.replace(" ", "_")
	playerTradStatsDF.to_csv(parentFolder+fileName+"_Stats_"+season+'.csv')

#Return dataframe with players game played and stats in season specified from url
def getPlayerGameStatsTrad(soupObj):
	#Columns
	columnHeaders = ['Game','PTS_G']
	colIdxs = [1,27]
	playerData = []
	#Table rows data
	traditionalTable = soupObj.find('div',id="all_pgl_basic").find('tbody').findAll("tr")
	ptsInGame = []
	#Use game data to build dataframe
	gameData = []

	#Used to apply to DNPS
	lastPPG = 0

	#Maybe have this below in a loop that goes for each stats like [PPG, TS% ...]
	for row in traditionalTable:
		gameNumber = (row.find('th',{"data-stat":"ranker"}))
		ppg = (row.find('td',{"data-stat":"pts"}))
		dnp = (row.find('td',{"data-stat":"reason"}))

		if gameNumber is not None and ppg is not None:
			ptsInGame.append(float(ppg.getText()))
			runningAvgPoints = sum(ptsInGame)/len(ptsInGame)

			gameData.append([gameNumber.getText(),float("%.2f" % runningAvgPoints)])
			#gameData.append([gameNumber.getText(),float(ppg.getText())])
			lastPPG = runningAvgPoints

		#This is for games that player didn't play in 
		elif (dnp is not None and gameNumber is not None):
			gameData.append([gameNumber.getText(),float(lastPPG)])

	return(pandas.DataFrame(gameData,columns=columnHeaders))

if __name__ == "__main__":
	main()