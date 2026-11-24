--Readme document for Natalie McDonald, nmcdona1@uci.edu, 83148972, and Davin Makris, dxmakris@uci.edu, 13625442--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
25 Hours cumulatively. 


3. What online resources did you consult when completing this assignment? (list specific URLs)
We relied heavily on the ionic and chart.js docs for most of the visual elements. We used the following tutorial
alongside the class demo on local storage to implement IndexedDB.

Chart.js:  https://www.chartjs.org/docs/latest/samples/information.html 
IndexedDB: https://blog.carlosrojas.dev/indexeddb-complete-guide-4b691f150f50 ,
           https://www.telerik.com/blogs/beginners-guide-indexeddb
Ionic:     https://ionicframework.com/docs/api/range (why was this website lowkey always down)

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
We did not consult any classmates or other individuals.


5. Is there anything special we need to know in order to run your code?
You will need to run 'npm install', as we installed two modules outside what was recommended for this assignment. 
Packages:   chart.js # Used for the charts in the stats viewer
            luxon chartjs-adapter-luxon #used to render the time series chart for the daily data

Additionally, clearing the data while there is no data loads in 14 days of randomly generated
dates and scores in order to make testing the app easier. 


--Aim for no more than two sentences for each of the following questions.--

6. Did you design your app with a particular type of user in mind? If so, whom?
We designed the app with a younger user in mind and catered toward a peaceful and uncluttered experience. We wanted the style of the app to be very simplistic, as we figured that users would likely be using it right before bedtime, or when waking up, and they would not want a complex screen of many things during those times. 


7. Did you design your app specifically for iOS or Android, or both?
We designed the app for iOS and tried to emulate some of the iOS design patterns, such as toast pop ups and simple UI, as well as the rounded corners on the card components and the filled in icons in the navigation bar. 


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
A person can log their wake up and sleep time in the 'Sweet Dreams' page (0:35). We chose a simple all at once approach with little overhead so users can roughly capture their sleep each day quickly. We chose to support logging the data in this way as this is already used in other industry-standard IOS apps such as Calendar, Reminders, Clock, and more that come pre-installed on every IOS phone. 


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
A person can log their sleepiness during the day in the 'Good Day!' page (1:38). We once again chose a simple approach that lets users quickly log their data without having to spend too much time or effort on the app. 

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
A person can view the data they logged in the app in the 'Your Data" page (1:30, 1:53). We chose to give the user two chart views summarizing their data. We did not want to clutter the page with too much information. 


11. Which feature choose--using a native device resource, backing up logged data, or both?
We chose to back up logged data, with refreshes demonstrated at (2:02). We used IndexedDB to do this. 


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
N/A


13. If you backed up logged data, where does it back up to?
It is backed in local storage using IndexedDB. 

14. How does your app implement or follow principles of good mobile design?
We included Cancel buttons in case the user makes an error and needs to undo their last action, and the homescreen allows the user to quickly navigate to pages to log their data. The colors of the app are not only meant to be calming and reminiscent of night time, but also pass WCAG AAA standards for large text and WCAG AA standards for small text. The placement and style of the buttons are the same on every page, so the user does not have to learn where the buttons are every time.  
