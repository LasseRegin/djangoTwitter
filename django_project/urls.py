from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_project.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'twitter_project.views.index'),
    url(r'^test/$', 'twitter_project.views.test'),
    url(r'^base/$', 'twitter_project.views.base'),
    url(r'^happy/$', 'twitter_project.views.happy'),
    url(r'^static_happy/$', 'twitter_project.views.static_happy'),
    url(r'^classifier/$', 'twitter_project.views.classifier'),
    url(r'^post/$', 'twitter_project.views.post'),
    url(r'^tweets/$', 'twitter_project.views.tweets'),
    url(r'^tweets_by_message/$', 'twitter_project.views.tweets_by_message'),
    url(r'^get_trends/$', 'twitter_project.views.get_trends'),
    url(r'^get_limits/$', 'twitter_project.views.get_limits'),
    url(r'^weekly_events/$', 'twitter_project.views.weekly_events'),
    url(r'^get_weekly_events/$', 'twitter_project.views.get_weekly_events'),
)
