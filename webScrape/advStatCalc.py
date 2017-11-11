'''True Shooting Calculation'''
def TSPct(pts,fga,fta):
	return pts/(2*(fga+(0.44*fta)))

'''Effective Field Goal Percentage Calculation'''
def eFGPct(fgm,threePtFGM,fga):
	return (fgm + (0.5*threePtFGM))/fga
if __name__ == "__main__":
	print(eFGPct(824,200,1941))
