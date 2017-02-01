from __future__ import division
import os
import getpass
import json
import signal
import math
import copy
import sys
import sqlite3 as sql
from shutil import copyfile
from enum import Enum, unique
from watson_developer_cloud import AlchemyLanguageV1, WatsonException


# Definition of globals
alchemy = AlchemyLanguageV1(api_key='42d2c8e84575f2a4ddd0fb0b398cc9dd8aa929a3')

# Definition of constants
QUERY = "SELECT urls.url, urls.visit_count FROM urls ORDER BY last_visit_time"
LIMIT = 1000
THRESHOLD = 0.5

# Definition of classes
@unique
class ROW(Enum):
    URL = 0
    HITS = 1
    DURATION = 2

class Profile:
	def __init__(self):
		self.resultfile = "results/" + target + ".json"
		self.profile = dict()
		self.ranking = dict()
		self.skipped = 0
		self.urls = 0
		self.ranked = 0

		# Load the global website ranking
		self.loadRanking()

	def __str__(self):
		return ("\n" + "Profile saved in " + self.resultfile + "\n" +
		"total urls processed: " + str(self.urls) + "\n" +
		"skipped: " + str(self.skipped) + "\n" +
		"ranked: " + str(self.ranked))

	def normalise(self, profile):
		for field in profile:
			profile[field] /= self.urls

	def build(self, row):
		try:
			taxonomy = alchemy.taxonomy(url=row[ROW.URL.value])["taxonomy"]
			if taxonomy:
				weights = dict()
				mother = 1
				score = float(taxonomy[0]['score'])
				hits = int(row[ROW.HITS.value])

				if score < THRESHOLD:
					self.skipped += 1
					return
				self.urls += 1

				# Strip off http://www.
				tokens = row[0].split('/')
				url = tokens[2]
				url = url[4:]

				weights['hits'] = decay(hits, 0.1)
				if url in self.ranking:
					weights['rank'] = decay(int(self.ranking[url]), 0.05)
					self.ranked += 1
				else :
					weights['rank'] = 1

				for field, weight in weights.iteritems():
					mother *= weight

				label = str(taxonomy[0]['label'].split('/')[1])
				if label in self.profile:
					self.profile[label] += mother * score
				else:
					self.profile[label] = mother * score

				failed = True # assume we failed
				while failed:
					try:
						with open(self.resultfile, "w+") as f:
							profile = copy.deepcopy(self.profile)
							self.normalise(profile)
							f.write(json.dumps(profile))
							failed = False
					except IOError:
						failed = True

		except WatsonException:
			pass

	def loadRanking(self):
		with open("ranking.txt", "r") as f:
			for line in f.readlines():
				line = line.split(' ')
				self.ranking[line[0]] = line[1].rstrip('\n')

class Person:
	def __init__(self, path):
		self.profile = Profile()
		self.age = None
		self.gender = None
		self.db = sql.connect(path)

	def __str__(self):
		return str(self.profile)

	def create(self):
		print "Creating profile..."
		cursor = self.db.cursor()
		for idx, row in enumerate(cursor.execute(QUERY)):
			if idx > LIMIT:
				break
			try:
				self.profile.build(row)
			except RuntimeError as error:
				print error
				break

		self.profile.normalise(self.profile.profile)
		print "Done."


# Declaration of functions
def signal_handler(signal, frame):
	raise RuntimeError("Goodbye")

def decay(x, k):
	return 1 - math.exp(-k * x)

#******************************************************************************
#************************************ MAIN ************************************
#******************************************************************************

if __name__ == "__main__":
	signal.signal(signal.SIGINT, signal_handler)

	target = str(sys.argv[1])
	person = Person("./Histories/" + target)

	person.create()
	print person
