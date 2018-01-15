from bs4 import BeautifulSoup
import pandas
import urllib2
import generatePlayerRef 
import os
import advStatCalc
import csv

seasonHrefDict = dict()
mvpHrefDict = dict()
basketballReferenceURL = "https://www.basketball-reference.com{params}"
allPlayersHrefDict = dict()

def main():
	#Build dict with links for all NBA players
	allPlayersHrefDict.update(generatePlayerRef.buildAllPlayersDict("https://www.basketball-reference.com/leagues/NBA_2017_per_game.html"))
	#get Average MVPs and stats
	#averageMVPProcess()

	#Player season data to be retrieved
	playersToStudy=[['LeBron James','2018'],['James Harden','2018'],['Giannis Antetokounmpo','2018'],['Kevin Durant','2018'],['Kyrie Irving','2018'],['Stephen Curry','2018'],['Russell Westbrook','2018'],['DeMar DeRozan','2018'],['Anthony Davis','2018'],
	['Kyle Lowry','2018'],['Karl-Anthony Towns','2018'],['Nikola Jokic','2018'],
	['Russell Westbrook','2017'],['James Harden','2017'],['Kawhi Leonard','2017'],['LeBron James','2017'],['Isaiah Thomas','2017'],['Stephen Curry','2017'],
	['John Wall','2017'],['Giannis Antetokounmpo','2017'],['Anthony Davis','2017'],['Kevin Durant','2017'],['DeMar DeRozan','2017'],['Stephen Curry','2016'],['Kawhi Leonard','2016'],
	['LeBron James','2016'],['Russell Westbrook','2016'],['Kevin Durant','2016'],['Chris Paul','2016'],['Draymond Green','2016'],['Damian Lillard','2016'],['James Harden','2016'],
	['Kyle Lowry','2016'],['Stephen Curry','2015'],['James Harden','2015'],['LeBron James','2015'],['Russell Westbrook','2015'],['Anthony Davis','2015'],['Chris Paul','2015'],
	['LaMarcus Aldridge','2015'],['Marc Gasol','2015'],['Blake Griffin','2015'],['Tim Duncan','2015'],['Kawhi Leonard','2015'],['Klay Thompson','2015']]
	for playerSeason in playersToStudy:
		player=playerSeason[0]
		season=playerSeason[1]
		#Get player stats per game
		playerTradDF = getPlayerStatsSeason(player,season) #uncomment to fill out our players files
		

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
	dataRows = soup.findAll('tr')[3:33]
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
	mvpMeanFinalDF = pandas.DataFrame()

	for i in range(len(masterDataFrame)):
		#Get player and season from origin data frame
		playerUnderStudy = masterDataFrame.iloc[i]['MVP']
		playedSeason=masterDataFrame.iloc[i]['Season']

		#go to player's url
		mvpURL = basketballReferenceURL.format(params=mvpHrefDict[playerUnderStudy])
		mvpURLHTML = urllib2.urlopen(mvpURL)
		soupObj = BeautifulSoup(mvpURLHTML,"html.parser")

		columnHeaders = ["Name","MP_G","FG_G","FGA_G","FG_PCT","3FG_G","3FGA_G","3FG_PCT","eFG_PCT","FT_G","FTA_G","FT_PCT","RBD_G","AST_G","STL_G","PTS_G","TS_G","ASTPCT_G","TOV_PCT_G","USG_PCT_G","OFRTG_G","DFRTG_G"]
		playerData = []

		#Get the year, ex 2017 for 2016-17
		playedYear = (getYearFromSeason(seasonHrefDict[playedSeason]))

		#Look at table Per Game
		tablePerGame = soupObj.find('div',id="all_per_game").find('tr',id='per_game.'+playedYear)
		seasonStats = (tablePerGame.findAll('td'))
		tmpSeasonStats = []

		#Advanced overall table - commented
		#advTablePerGame = soupObj.find('div',id='all_advanced').find('tr',id='advanced.'+playedYear)
		placeholders = soupObj.findAll('div',class_='placeholder')
		for item in placeholders:
			comment=''.join(item.next_siblings)
			soupComment = BeautifulSoup(comment,'html.parser')
			advTablePerGame=soupComment.find('table',id="advanced")
			perPoss =soupComment.find('table',id="per_poss")
			if perPoss:
				per100TablePerGame = perPoss.find('tr',id='per_poss.'+playedYear)
			if advTablePerGame:
				advTablePerGame = (advTablePerGame.find('tr',id='advanced.'+playedYear))
				

				break

		advSeasonStats = advTablePerGame.findAll('td')
		per100SeasonStats = per100TablePerGame.findAll('td')


		#Stats that will be used for both MVP stats and Player stats (are linked)
		mvpStatsDesired = ["mp_per_g","fg_per_g","fga_per_g","fg_pct","fg3_per_g","fg3a_per_g","fg3_pct","efg_pct","ft_per_g","fta_per_g","ft_pct","trb_per_g","ast_per_g","stl_per_g","pts_per_g"]
		mvpAdvStatsDesired = ["ts_pct","ast_pct","tov_pct","usg_pct"]
		mvpPer100StatsDesired = ["off_rtg","def_rtg"]

		#Loop through stats of MVPSTATSDESIRED to build MVP data frame
		for td in seasonStats:
			for statOfInterest in mvpStatsDesired:
				if(td['data-stat'] == statOfInterest):
					tmpSeasonStats.append(td.getText())

				#ADV STAT TABLE
				if len(tmpSeasonStats) == len(mvpStatsDesired):

					for td in advSeasonStats:
						for statOfInterest in mvpAdvStatsDesired:
							if td['data-stat'] == statOfInterest:
								tmpSeasonStats.append(td.getText())

							if len(tmpSeasonStats) == len(mvpStatsDesired) + len(mvpAdvStatsDesired):

								for td in per100SeasonStats:
									for per100StatOfInterest in mvpPer100StatsDesired:
										if td['data-stat'] == per100StatOfInterest:
											tmpSeasonStats.append(td.getText())

										if len(tmpSeasonStats) == len(mvpStatsDesired) + len(mvpAdvStatsDesired) + len(mvpPer100StatsDesired):
											tmpSeasonStats.insert(0,"Average MVP")
											playerData.append(tmpSeasonStats)
											tmpSeasonStats = []
					


		#Temp Dataframe for single mvps stats single season
		seasonStatsDataFrame = pandas.DataFrame(playerData,columns=columnHeaders)
		#Add column for players name
		seasonStatsDataFrame.insert(0,'MVP',playerUnderStudy)
		#Add the single mvp to all mvps dataframe
		mvpsStatsDataFrame=mvpsStatsDataFrame.append(seasonStatsDataFrame,ignore_index = True)
		### get players Game by Game stats, add it to a master DF we have for all mvps
		mvpGameStatsDF = analyzeMVPStats(playerUnderStudy,playedYear)
		mvpPerGameDF = pandas.concat([mvpGameStatsDF,mvpPerGameDF],axis=1)

	#Set our master data frame equal to DF with mean of every stat in column headers
	mvpMeanFinalDF = getMeanMVPStatistic(columnHeaders,mvpPerGameDF)

	mvpMeanFinalDF['Name'] = 'Average MVP'

	#Write stats to csv
	writeMVPAverageStatsToFile(columnHeaders,mvpMeanFinalDF)

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
	###### go to players season url and call get player game stats to get a DF of his game:pts_g pairs
	gameStatsURL = basketballReferenceURL.format(params=mvpHrefDict[playerUnderStudy][:-5]+'/gamelog/'+playedYear)
	gameStatsHTML = urllib2.urlopen(gameStatsURL)
	soupObj = BeautifulSoup(gameStatsHTML,"html.parser")
	#Advanced stats gamelog
	advancedStatsURL = basketballReferenceURL.format(params=mvpHrefDict[playerUnderStudy][:-5]+'/gamelog-advanced/'+playedYear)
	advancedStatsHTML = urllib2.urlopen(advancedStatsURL)
	advSoupObj = BeautifulSoup(advancedStatsHTML,"html.parser")
	
	mvpGameStatsDF= getPlayerGameStatsTrad(soupObj,advSoupObj,playerUnderStudy+" "+playedYear)
	return mvpGameStatsDF

def getMeanMVPStatistic(statsList,gameStatsDF):
	meanMVPDF = pandas.DataFrame()
	for statistic in statsList:
		#Get a DF with only mvp game by game stats for one stat
		tempSingleStatDF = gameStatsDF[[statistic]].copy()	
		## Convert all the mvps game by game stats to float and get a new column for average of it
		tempSingleStatDF.apply(pandas.to_numeric, errors='ignore')
		#We use the index column as Game column, start at 1
		tempSingleStatDF.index +=1
		tempSingleStatDF.index.name = "Game"
		#Get the mean of all the stats by row
		tempSingleStatDF['mean'] = tempSingleStatDF.mean(axis = 1);  
		
		###### The above needs to be temporary below is permanent
		meanMVPDF[statistic] = tempSingleStatDF['mean']
	return meanMVPDF

def writeMVPAverageStatsToFile(columnHeaders,avgDF):
	#Write stats to csv
	parentFolder = (os.path.abspath(os.path.join(os.getcwd(), os.pardir)))
	parentFolder = os.path.join(parentFolder,'Data Store/MVPAverage/')
	fileName="MVPAvgStats"
	avgDF.to_csv(parentFolder+fileName+'.csv',columns = columnHeaders)

#Get the play href extension and pass the soupObj to getPlayerGameStatsTrad
def getPlayerStatsSeason(playerName,season):
	playerHref = allPlayersHrefDict[playerName]
	#Traditional Stats gamelog
	gameStatsURL = basketballReferenceURL.format(params=playerHref[:-5]+'/gamelog/'+season)
	gameStatsHTML = urllib2.urlopen(gameStatsURL)
	#Advanced stats gamelog
	advancedStatsURL = basketballReferenceURL.format(params=playerHref[:-5]+'/gamelog-advanced/'+season)
	advancedStatsHTML = urllib2.urlopen(advancedStatsURL)

	soupObj = BeautifulSoup(gameStatsHTML,"html.parser")
	advSoupObj = BeautifulSoup(advancedStatsHTML,"html.parser")
	playerTradStatsDF = getPlayerGameStatsTrad(soupObj,advSoupObj,playerName+" "+season)

	#Write stats to csv
	parentFolder = (os.path.abspath(os.path.join(os.getcwd(), os.pardir)))
	parentFolder = os.path.join(parentFolder,'Data Store/'+season+'/')
	fileName=playerName.replace(" ", "_")
	playerTradStatsDF.to_csv(parentFolder+fileName+"_Stats_"+season+'.csv')

	#get single game stats
	singleStatURL = basketballReferenceURL.format(params=playerHref)
	singleStatHTML = urllib2.urlopen(singleStatURL)
	soupObj = BeautifulSoup(singleStatHTML,"html.parser")
	singleStats = getAdvancedSinglePoints(soupObj,playerName,season)
	#write array to csv
	with open(parentFolder+fileName+"_AdvStatPoints_"+season+'.csv','wb') as statFile:
		writer = csv.writer(statFile)
		writer.writerow(['Name',"OWS","DWS","WS","WS/48","OBPM","DBPM","BPM","VORP"])
		writer.writerow(singleStats)


#Return dataframe with players game played and stats in season specified from url
def getPlayerGameStatsTrad(soupObj,advSoupObj,id):
	#Columns - THIS ARRAY NEEDS TO MATCH UP WITH MASTER DF COLUMN HEADERS WHEN ADDING DATA

	columnHeaders = ['Name','Game',"MP_G","FG_G","FGA_G","FG_PCT","3FG_G","3FGA_G","3FG_PCT","eFG_PCT","FT_G","FTA_G","FT_PCT","RBD_G","AST_G","STL_G","PTS_G","TS_G"]
	colIdxs = [1,27]
	playerData = []
	#Table rows data
	traditionalTable = soupObj.find('div',id="all_pgl_basic").find('tbody').findAll("tr")

	#An array of a stat for a player in that season used to calc running average
	statItemInGame = []
	
	#Use game data to build dataframe
	tmpGameData = []
	gameData = []

	#Loop through desired stats for a player in season
	statsOfInterest = ["mp","fg","fga","fg3","fg3a","ft","fta","trb","ast","stl","pts"]

	#Dict used to store single stats for a player in a season
	#key: statOfInterest Val: List of stats game by game
	runningStatAvgDict = dict()
	
	#probably make this part below general

	for row in traditionalTable:
		gameNumber = (row.find('th',{"data-stat":"ranker"}))
		dnp = (row.find('td',{"data-stat":"reason"}))

		#For each stat in statsOfInterest
		for statUnderStudy in statsOfInterest:
			statItem = row.find('td',{"data-stat":statUnderStudy})

			if gameNumber is not None: 

				if statItem is not None:

					#For first played game of season start dict
					if statUnderStudy not in runningStatAvgDict:
						#If the table has an empty cell for this stat - just set the value to 0.
						if statItem.getText() == '':
							runningStatAvgDict[statUnderStudy]= [0]
						else:
							if statUnderStudy == "mp":
								minuteVal = statItem.getText()
								minutes = (minuteVal[:minuteVal.find(":")])
								seconds = (minuteVal[minuteVal.find(":")+1:])
								runningStatAvgDict[statUnderStudy] = [float(minutes)+(float(seconds)/60)]
							else:	
								runningStatAvgDict[statUnderStudy]= [float(statItem.getText())]
					#Append game values to dictionary
					else:
						if statItem.getText() == '':
							runningStatAvgDict[statUnderStudy].append(runningStatAvgDict[statUnderStudy])
						else:
							if statUnderStudy == "mp":
								minuteVal = statItem.getText()
								minutes = (minuteVal[:minuteVal.find(":")])
								seconds = (minuteVal[minuteVal.find(":")+1:])
								runningStatAvgDict[statUnderStudy].append(float(minutes)+(float(seconds)/60))
							else:
								runningStatAvgDict[statUnderStudy].append(float(statItem.getText()))

					#Calculate running average by getting the list of stat values for a statUnder study and getting the mean of it
					statItemInGame = runningStatAvgDict[statUnderStudy]
					runningAvgStat = sum(statItemInGame)/len(statItemInGame)
					tmpGameData.append(float(runningAvgStat))

				#For DNPs, append the running average so far
				elif dnp is not None:
					if statUnderStudy in runningStatAvgDict:
						tmpGameData.append(sum(runningStatAvgDict[statUnderStudy])/len(runningStatAvgDict[statUnderStudy]))
					#If they have no stats yet its just 0
					else:
						tmpGameData.append(0) 

				#When theres a stat value for each game, append to game data and reset tmpGameData
				if len(tmpGameData) == len(statsOfInterest):
					tmpGameData.insert(0, gameNumber.getText())
					#FG% calculation 
					tmpGameData.insert(4,advStatCalc.percentMade(tmpGameData[2],tmpGameData[3]))	
					#3FG% calculation
					tmpGameData.insert(7,advStatCalc.percentMade(tmpGameData[5],tmpGameData[6]))
					#eFG% calculation
					tmpGameData.insert(8,advStatCalc.eFGPct(tmpGameData[2],tmpGameData[5],tmpGameData[3]))
					#FT% calculation
					tmpGameData.insert(11,advStatCalc.percentMade(tmpGameData[9],tmpGameData[10]))
					#TS% calculation
					tmpGameData.insert(16,advStatCalc.TSPct(tmpGameData[15],tmpGameData[3],tmpGameData[10]))

					tmpGameData.insert(0,id)

					gameData.append(tmpGameData)
					tmpGameData = []

	tradDF = pandas.DataFrame(gameData,columns=columnHeaders)
	advDF = getPlayerGameStatsAdvanced(tradDF,advSoupObj)

	return(pandas.concat([tradDF.set_index('Game'),advDF.set_index('Game')],axis=1, join = 'inner').reset_index())

def getPlayerGameStatsAdvanced(tradDF,advSoupObj):
	columnHeaders = ['Game',"ASTPCT_G","TOV_PCT_G","USG_PCT_G","OFRTG_G","DFRTG_G"]
	advancedTable = advSoupObj.find('div',id="all_pgl_advanced").find('tbody').findAll("tr")

	#An array of a stat for a player in that season used to calc running average
	statItemInGame = []
	
	#Use game data to build dataframe
	tmpGameData = []
	gameData = []

	#Loop through desired stats for a player in season
	advStatOfInterest = ["ast_pct","tov_pct","usg_pct","off_rtg","def_rtg"]

	#Dict used to store single stats for a player in a season
	#key: statOfInterest Val: List of stats game by game
	runningStatAvgDict = dict()

	for row in advancedTable:
		gameNumber = (row.find('th',{"data-stat":"ranker"}))
		dnp = (row.find('td',{"data-stat":"reason"}))

		#For each stat in statsOfInterest
		for statUnderStudy in advStatOfInterest:
			statItem = row.find('td',{"data-stat":statUnderStudy})

			if gameNumber is not None: 

				if statItem is not None:

					#For first played game of season start dict
					if statUnderStudy not in runningStatAvgDict:
						#If the table has an empty cell for this stat - just set the value to 0.
						if statItem.getText() == '':
							runningStatAvgDict[statUnderStudy]= [0]
						else:
							runningStatAvgDict[statUnderStudy]= [float(statItem.getText())]
					#Append game values to dictionary
					else:
						if statItem.getText() == '':
							runningStatAvgDict[statUnderStudy].append(0)
						else:
							runningStatAvgDict[statUnderStudy].append(float(statItem.getText()))

					#Calculate running average by getting the list of stat values for a statUnder study and getting the mean of it
					statItemInGame = runningStatAvgDict[statUnderStudy]
					runningAvgStat = sum(statItemInGame)/len(statItemInGame)
					tmpGameData.append(float(runningAvgStat))

				#For DNPs, append the running average so far
				elif dnp is not None:
					if statUnderStudy in runningStatAvgDict:
						tmpGameData.append(sum(runningStatAvgDict[statUnderStudy])/len(runningStatAvgDict[statUnderStudy]))
					#If they have no stats yet its just 0
					else:
						tmpGameData.append(0) 

				#When theres a stat value for each game, append to game data and reset tmpGameData
				if len(tmpGameData) == len(advStatOfInterest):
					tmpGameData.insert(0, gameNumber.getText())
					gameData.append(tmpGameData)
					tmpGameData = []

	return(pandas.DataFrame(gameData,columns=columnHeaders))

def getAdvancedSinglePoints(soupObj,playerName,playedYear):
	placeholders = soupObj.findAll('div',class_='placeholder')
	
	#Get advanced table
	for item in placeholders:
		comment=''.join(item.next_siblings)
		soupComment = BeautifulSoup(comment,'html.parser')
		advTablePerGame=soupComment.find('table',id="advanced")

		if advTablePerGame:
			advTablePerGame = (advTablePerGame.find('tr',id='advanced.'+playedYear))
			break

	statPointStats = []
	#fetch and return single point stats
	advStatPoints = advTablePerGame.findAll('td')
	statsDesired = ["ows","dws","ws","ws_per_48","obpm","dbpm","bpm","vorp"]

	for td in advStatPoints:
		for statOfInterest in statsDesired:
			if(td['data-stat'] == statOfInterest):
				statPointStats.append(td.getText())

	statPointStats.insert(0,playerName+playedYear)

	return(statPointStats)		


if __name__ == "__main__":
	main()
