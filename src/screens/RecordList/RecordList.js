import React from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    NativeModules
} from 'react-native'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import Modal from '../../components/DeleteBookmarModal'
import VideoThumbnail from '../../components/VideoThumbnail'
import {colors} from '../../utils/themeConfig'
import {secondFormatter, timeFormatter} from '../../utils/timeUtils'
import HeaderLabel from "../../components/HeaderLabel";
import { getImageFromArray } from '../../utils/images'

export default class RecordList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            data: {}
        }
    };

    _setState = (openModal, data, dataArr) => {
        this.setState({
            openModal: openModal,
            data: data,
            dataArr: dataArr
        });
    }

    _toggleModal = (item, callback) => {

        if (item || item === -1) {
            // Open modal & close modal normally
            this.setState({
                openModal: !this.state.openModal,
                data: item
            })
        }
        else {
            // Delete
            const {pvrList, downloaded, downloadedUserKit} = this.props
            const {data} = this.state

            /*
             Record delete zone
              */

            if (!pvrList) {
                let deletedList = [].concat(downloadedUserKit).filter(x => x.contentId !== data.contentId)
                let target = {
                    path: "/C/Downloads/" + data.fileName
                }

                NativeModules.STBManager.usbRemoveWithJson(JSON.stringify(target), (error, events) => {
                    if (JSON.parse(events[0]).return === '1') {
                        NativeModules.RNUserKit.storeProperty("download_list", {dataArr: deletedList}, (e, r) => {
                        })
                        this._setState(false, {}, deletedList);
                    }
                    else {
                        let mess = 'Remove file failure!'
                        if (callback !== null) {
                            callback(mess)
                        }
                    }
                })
            }
            else {
                /*
                Bookmark delete zone
                 */
                let deletedList = [].concat(pvrList).filter(x => x.recordName !== data.title)
                let target = {
                    recordName: data.title
                }
                NativeModules.STBManager.deletePvrWithJsonString(JSON.stringify(target), (error, events) => {
                    if (JSON.parse(events[0]).return === "1") {
                        this._setState(!this.state.openModal, {}, deletedList);
                    }
                    else {
                        console.log('Remove PVR file falure!')
                    }
                })
            }


        }
    }

    _getSubtitle = (item) => {
        if (item.type == null) {
            return "N/A";
        }
        else if (item.type === 'Episode') {
            return 'Season ' + item.seasonIndex + ' - Episode ' + item.episodeIndex
        }
        else if (item.type === undefined) {
            return item.subTitle
        }
        else return item.type
    }

    _playPvr = (item) => {
        this.props.navigation.navigate('LocalVideoModal', {item: item, epg: [item], isLive: false})
    }

    _keyExtractor = (item, index) => index

    _renderItem = ({item}) => {
        let iconUrl = item.image;

        return (
          <TouchableOpacity style={styles.itemContainer}
            // onPress={() => this._playPvr(item)}
           >
            <VideoThumbnail style={styles.thumbnailStyle} imageUrl={iconUrl} marginHorizontal={17}/>
            <View style={{flexDirection: 'column', marginRight: 60}}>
              <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode={'tail'}>{item.title}</Text>
              <Text style={styles.itemType}>{this._getSubtitle(item)}</Text>
              <Text style={styles.itemTime}>{secondFormatter(item.durationInSeconds)}</Text>
            </View>
            <TouchableOpacity style={styles.optionIcon}
                //  onPress={() => this._toggleModal(item, null)}
                 >
              <Image source={require('../../assets/ic_three_dots.png')}/>
            </TouchableOpacity>
            </TouchableOpacity>
        )

    }

    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 20,
            backgroundColor: 'transparent'
        }}/>
    )

    _isInDownloaded = (item, downloadedList) => {
        if (!item || !downloadedList) return false
        // Log & Temp file for checking download complete
        let tempFile = item.fileName + ".tmp"
        let logFile = item.fileName + ".log"
        return downloadedList.some((x) => x.fileName === item.fileName) && downloadedList.every((x) => x.fileName !== tempFile && x.fileName !== logFile)
    }

    _recordTransform = (item) => {
        if (item == null || item === undefined)
            return null;
        let metaData = JSON.parse(item.metaData)
        return {
            title: metaData.title,
            durationInSeconds: item.duration,
            image: metaData.image,
            subTitle: metaData.subTitle
        }
    }

    render() {
        const {header, pvrList, downloaded, downloadedUserKit} = this.props;
        const {data, dataArr} = this.state
        let displayDataArr
        if (pvrList) displayDataArr = pvrList.map(x => this._recordTransform(x))
        else displayDataArr = dataArr ? dataArr : (downloadedUserKit ? downloadedUserKit.filter(x => this._isInDownloaded(x, downloaded)) : [])

        return (
            <View style={styles.container}>
                <Modal animationType={'fade'} transparent={true} visible={this.state.openModal} type={'record'}
                       onClosePress={this._toggleModal} data={data}/>
                <HeaderLabel position={this.props.position} text={this.props.header} keyExtractor={this._keyExtractor} showBackButton={false}/>
                <View style={{width: '100%'}}>
                    <TextInput style={styles.textInput}
                               placeholder={'Search'}
                               inlineImageLeft='ic_search'
                               inlineImagePadding={8}
                               underlineColorAndroid='rgba(0,0,0,0)'
                    />
                </View>
                <FlatList
                    style={styles.list}
                    horizontal={false}
                    keyExtractor={this._keyExtractor}
                    data={displayDataArr}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderListFooter}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: colors.whiteBackground
    },
    list: {
        marginTop: 20,
        width: '100%',
        backgroundColor: colors.whiteBackground
    },
    textInput: {
        height: 29,
        marginLeft: 13,
        marginRight: 13,
        marginTop: 27,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 15,
        borderColor: '#95989A',
        borderWidth: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    headerLabel: {
        textAlign: 'center',
        marginTop: 21,
        borderRadius: 0,
        fontSize: 10
    },
    optionIcon: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '40%',
        right: 15,
        height: '20%',
        width: '10%'
    },
    itemTitle: {
        marginTop: 12,
        marginLeft: 10,
        color: colors.textMainBlack,
        fontWeight: 'bold',
        fontSize: 15,
        width: '80%'
    },
    itemType: {
        marginTop: 2,
        marginLeft: 10,
        color: '#ACACAC',
        fontSize: 12
    },
    itemTime: {
        marginTop: 1,
        marginLeft: 10,
        color: '#ACACAC',
        fontSize: 12
    },
    thumbnailStyle: {
        width: 156,
        height: 74,
        marginLeft: 14,
        marginRight: 15
    }
})
