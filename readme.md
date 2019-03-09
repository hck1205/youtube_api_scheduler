**This Application is designed to search and rank channels in youtube.
In order to do that, the application should integrate with youtube API.
All functions and features designed based on Youtube Date API v3 document.**

Link: [https://developers.google.com/youtube/?hl=en]

The Application does not require data base to store youtube data, but, it will
save data in json files and store them in local.

The application has below major features:

1. It will gather videos and channels by category. and the category is divided into
large and small. Large category means the categories provided by youtube api
which are popular and major categories. Where as in small category, there are videos and channels
are gathered by user customization and firebase defined IDs
 
2. Gathers channels and rank those channels according to their number of subscribers. And sort them
by categories.

3. It provides most viewed videos information in specific period.

Those three are major features and those features run daily so that, it defines up-to-date
channel information. 