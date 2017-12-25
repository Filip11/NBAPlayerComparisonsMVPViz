'''True Shooting Calculation'''
def TSPct(pts,fga,fta):
	if fga == 0 and fta == 0:
		return 0
	else:
		return pts/(2*(fga+(0.44*fta)))

'''Effective Field Goal Percentage Calculation'''
def eFGPct(fgm,threePtFGM,fga):
	if fga ==0:
		return 0
	else:
		return (fgm + (0.5*threePtFGM))/fga

''' Generic Made / Attempt Percentage '''
def percentMade(makes,attempts):
	if attempts == 0:
		return 0
	else:
		return (makes/attempts)

