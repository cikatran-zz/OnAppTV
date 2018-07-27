import { NativeModules } from 'react-native'

export function addToBookPvr (epg, lcn) {
  console.log('addToBookPvr')
  console.log(epg)

  let durationInSeconds = Math.round((new Date(epg.endTime).getTime() - new Date(epg.startTime).getTime()) / 1000)

  let jsonString = {
    "record_parameter": {
      "startTime" : this._simpleDataFormat(epg.startTime),
      "recordMode" : 1,
      "recordName" : epg.videoData.title,
      "lCN" : lcn,
      "duration" : durationInSeconds

    },
    "metaData": {
      "endtime": timeFormatter(epg.endTime),
      "starttime": timeFormatter(epg.startTime),
      "title": epg.videoData.title,
      "image": epg.videoData.thumbnails,
      "subTitle": epg.videoData.type
    }
  }

  console.log('JSON String for book')
  console.log(JSON.stringify(jsonString))

  NativeModules.STBManager.addPvrBooKListWithJson(JSON.stringify(jsonString), (error, events) => {
    if (error) console.log('Error when add book %s', error)
    else console.log('Add book list successfully')
  })
}

export function deletePvrBook (epg, lcn) {
  console.log('addToBookPvr')
  console.log(epg)

  let durationInSeconds = Math.round((new Date(epg.endTime).getTime() - new Date(epg.startTime).getTime()) / 1000)

  let jsonString = {
    "record_parameter": {
      "startTime" : this._simpleDataFormat(epg.startTime),
      "recordMode" : 1,
      "recordName" : epg.videoData.title,
      "lCN" : lcn,
      "duration" : durationInSeconds

    },
    "metaData": {
      "endtime": timeFormatter(epg.endTime),
      "starttime": timeFormatter(epg.startTime),
      "title": epg.videoData.title,
      "image": epg.videoData.thumbnails,
      "subTitle": epg.videoData.type
    }
  }

  console.log('JSON String for book')
  console.log(JSON.stringify(jsonString))

  NativeModules.STBManager.deletePvrBookWithJson(JSON.stringify(jsonString), (error, events) => {
    if (error) console.log('Error when delete book %s', error)
    else console.log('Delete book list successfully')
  })
}

export function checkInTime (startTime, duration) {
  let start = new Date(startTime)
  let current = new Date()
  console.log('Check In Time')
  console.log(current.getTime() - start.getTime())
  console.log((current.getTime() - start.getTime()) / 1000)
  console.log(duration)
  return (current.getTime() - start.getTime() > 0) &&
    ((current.getTime() - start.getTime()) / 1000 < duration)
}
