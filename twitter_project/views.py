from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core import serializers
from django.http import HttpResponseForbidden
from django.http import HttpResponse
from datetime import datetime, timedelta

import json, os
from logic.twitterApi import twitterApi

def base(request):
    return render_to_response('base.html')

def index(request):

    model = {}

    model['header_1'] = "Twitter Mood Project"

    model['header_2'] = "Section 2"

    #api = twitterApi()

    return render_to_response('index.html', model, context_instance=RequestContext(request))

def happy(request):

    model = {}

    model['header_1'] = "Twitter Mood Project"

    return render_to_response('happy.html', model, context_instance=RequestContext(request))

def static_happy(request):

    model = {}

    model['header_1'] = "Twitter Mood Project"

    return render_to_response('static_happy.html', model, context_instance=RequestContext(request))

def classifier(request):

    model = {}
    model['header_1'] = "Twitter Mood Project"

    return render_to_response('classifier.html', model, context_instance=RequestContext(request))

def tweets(request):

    model = {}
    model['header_1'] = "Twitter Mood Project"

    return render_to_response('tweets.html', model, context_instance=RequestContext(request))

def post(request):


    import pdb
    import json, numpy as np
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.externals import joblib

    # paramenters are in request.GET

    content = [request.GET['content']]

    # Load vocabulary
    my_vocabulary = None

    #pdb.set_trace()

    from django.conf import settings
    url = settings.STATICFILES_FOLDER + 'data/vocabulary.json'
    print url
    import sys

    #try:
    #  f = open(url, 'rb')
    #  with open(url, 'rb') as outfile:
    #    my_vocabulary = json.load(outfile)
    #  response_data = {}
    #  response_data['vocabulary'] = my_vocabulary
    #  response_data['url'] = url
    #  return HttpResponse(json.dumps(response_data), content_type="application/json")
    #except IOError as e:
    #  error = "I/O error({0}): {1}".format(e.errno, e.strerror)
    #  response_data = {}
    #  response_data['error'] = error
    #  response_data['url'] = url
    #  return HttpResponse(json.dumps(response_data), content_type="application/json")
    #except:
    #  error = "Unexpected error:", sys.exc_info()[0]
    #  response_data['url'] = url
    #  return HttpResponse(json.dumps(response_data), content_type="application/json")

    with open(url, 'rb') as outfile:
      my_vocabulary = json.load(outfile)

    ## Initialize vectorizer
    vectorizer = CountVectorizer(min_df=1, vocabulary=my_vocabulary)

    ## Create bag of words
    X_bow = np.array(vectorizer.fit_transform(content).toarray())

    #print np.sum(X_bow, axis=0)
    #print np.sum(X_bow, axis=1)

    ## Load model
    #model_url = 'twitter_project/static/data/models/bayes_model/bayes_model.pkl'
    model_url = settings.STATICFILES_FOLDER + 'data/models/bayes_model_tuned/bayes_model.pkl'
    clf = joblib.load(model_url)

    ## Predict
    y_hat = clf.predict(X_bow)
    prediction = y_hat[0]
    prediction_proba = clf.predict_proba(X_bow)

    #import time
    #time.sleep(2)

    response_data = {}
    response_data['prediction'] = int(str(prediction))
    response_data['proba_happy'] = float(str(prediction_proba[0][1]))
    response_data['proba_angry'] = float(str(prediction_proba[0][0]))
    response_data['url'] = url
    response_data['model_url'] = model_url
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def tweets_by_message(request):


    import pdb
    import json, numpy as np

    # paramenters are in request.GET

    from django.conf import settings
    #url = settings.STATICFILES_FOLDER + 'data/vocabulary.json'

    #twitterApi
    # Initialize Api object
    api = twitterApi()

    # Tweet message to look for
    message = request.GET['message']

    # New York
    latitude = 40.716667   # latitude in degrees
    longitude = -74.0      # longitude in degrees
    radius    = 20         # radius in km

    today = datetime.now()
    sinceDate = today - timedelta(hours=5)
    #sinceDate = today - timedelta(weeks=1)
    print sinceDate

    # Get tweets
    #tweets = api.tweetsByMessageAndDate(message, latitude, longitude, radius, date)
    tweets = api.tweetsByMessageAndAreaSinceDate(message, latitude, longitude, radius, sinceDate)
    #print 'Found %d matching tweets:' % (len(tweets))
    #print ''

    response_data = {}
    response_data['tweets'] = tweets
    response_data['message'] = message

    return HttpResponse(json.dumps(response_data), content_type="application/json")




def get_trends(request):


    import pdb
    import json, numpy as np

    # paramenters are in request.GET

    from django.conf import settings

    # Initialize Api object
    api = twitterApi()

    print 'abe'
    print api
    print 'abe'

    # New York
    WOE_ID = 2459115

    # Get trends
    trends = api.trendsByArea(WOE_ID)

    response_data = {}
    response_data['trends'] = trends

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def get_limits(request):


    import pdb
    import json, numpy as np

    # paramenters are in request.GET

    from django.conf import settings

    # Initialize Api object
    api = twitterApi()

    # Get trends
    limits = api.getApiLimit()

    response_data = {}
    response_data['limits'] = limits

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def test(request):
    return render_to_response('test.html')

def weekly_events(request):

    model = {}

    model['header_1'] = "Twitter Mood Project"

    return render_to_response('weekly_events.html')

def get_weekly_events(request):

    import pdb
    import json, numpy as np

    from django.conf import settings

    url = settings.STATICFILES_FOLDER + 'data/events.json'
    import sys

    events = []
    with open(url, 'rb') as outfile:
      events = json.load(outfile)

    response_data = {}
    response_data['events'] = events

    return HttpResponse(json.dumps(response_data), content_type="application/json")
