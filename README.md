# Redox Coding Test - Mike Doubintchik

## Quickstart / TL;DR;
Scan this QR code inside the Expo app

![expo](http://oi64.tinypic.com/2pyq837.jpg "Expo App QR Code")

## App Features
- Slide source to the left to show edit/delete buttons
    - Edit source allows you to change encoding and environment
    - Delete source will update the deleted_at field in the database and stop displaying the source
- Press on source to view all messages for a particular source
- Press on a message to view the message status in an overlay

## Initiate the project
- Run `yarn` in both the root folder and inside the `app/` folder

## Frontend
The frontend was built using React Native

### Running the frontend
There are two ways to run the frontend, either locally or using the Expo app
##### Locally
To run the frontend locally you must have either XCODE or an Android Virtual Device installed and the [Expo-cli](https://docs.expo.io/versions/latest/introduction/installation/)

Navigate to the `app` folder and run `yarn start`. This will open a browser window with the Expo dashboard

##### Expo
You can download the [Expo app](https://expo.io) for your [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) or [iOS device](https://itunes.apple.com/app/apple-store/id982107779)

Then inside the Expo app you can load the Expo URL (`exp://exp.host/@allurewebsolutions/app`) or scan the below QR code

![expo](http://oi64.tinypic.com/2pyq837.jpg "Expo App QR Code")

## Backend
The backend was built using Node.js and Express.

### Running the backend
The backend is provided on a server I setup at `http://redox.allureprojects.com:8888/`. If you are using the Expo version of the app, then there is no need to run the backend locally. 

If you want to run the app locally, make sure to update first comment line 7 and uncomment line 6 in this file `./app/src/helpers/api.tsx`

Then you can run the backend using the command `yarn run node-server`

#### Database
The database is the provided sqlite database located at `./server/db.sqlite`

#### API Endpoints
Available testing using Postman Collection: `./server/Redox.postman_collection.json`
- Publicly available API URL: `http://redox.allureprojects.com:8888/`
- Local API URL: `http://localhost:8888/`

##### POST
- Add Source: `/source/add`

##### GET
- Get All Sources (Not Deleted): `source`
- Get Source by ID: `source/SOURCE_ID`
    - Example: `http://redox.allureprojects.com:8888/source/80fe6e1e-6f1b-4b3c-957c-275d12bb3e48`
- Get Message from Source: `source/SOURCE_ID/message`
- Get All Messages: `message`
- Get Message by ID: `message/MESSAGE_ID`
- Get Source Details: `/source/SOURCE_ID/details`

##### PATCH
- Update Source: `source/SOURCE_ID/update`
- Delete Source: `source/SOURCE_ID/delete`
- Restore Source: `source/SOURCE_ID/restore`

--------
# Take-Home - SPA

## Getting things up and running

- Clone or [fork](https://help.github.com/en/articles/fork-a-repo) this repository
  - ```git clone git@github.com:100health/take-home.git```

- Use tools of your choice to interact with the SQLite database (`db.sqlite`)
    - The database consists of only two tables: `source` and `message`

## Take Home Assessment
You are working with a complicated network of nodes that send messages between each other. One common type of node in this network is a source who will generate messages to be transmitted to another node on the network. You need the create a view or series of views that allows a user to view a particular source and its messages. This is a highly simplified version of what the Redox engine dashboard current does.

Your take home assessment will be to create a front end application and supporting backend API to fetch and view the sources and messages in the network. There is a repo that will serve as a starting point that contains all the data to use as mock data for sources and message.

### Backend API 
Given this data create a backend API that will be able to.

1) Fetch all sources and their basic information
2) Fetch a single source’s information in greater details
3) Fetch all messages for a single source
4) Ability to CRUD source information

Here is the basic API backend route structure we want to see:  
```
    localhost:8888/source  
    localhost:8888/source/:id
    localhost:8888/source/:id/message
    localhost:8888/message
    localhost:8888/message/:mid
```

### Given this API create a front end view that…
1) Allow a user to view all sources
2) Allows a user to view a single source 
   - With more details about the source
   - All the messages for that source
   - An element that displays the aggreate status of messages for a particular source (error, enqueued, finished, processing).

The expected time commitment for this activity is around 5-10 hours. If you find yourself getting far beyond this number, stop, commit what you have, and we can pick it up from there. If you have any questions or suggested improvements, reach out!

### Submission 

1) Send us a link to the forked repo on your personal GitHub account.
2) Zip/Tar the contents of your final project directory and send it to us via a Dropbox or Google Drive link.  
