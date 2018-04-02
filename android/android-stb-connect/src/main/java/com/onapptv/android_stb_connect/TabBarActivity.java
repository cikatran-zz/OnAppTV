package com.onapptv.android_stb_connect;

import android.media.MediaPlayer;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

public class TabBarActivity extends AppCompatActivity {
    TextView urlMedia, Zap, RecordStart, RecordStop, BookList, GetStatus, SwitchCodeStream, Standby;
    EditText inputText;
    MediaPlayer mediaPlayer = new MediaPlayer();
    ArrayList<JSONObject> data;
    int currentIndex = 0;
    int selectIndex = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(com.onapptv.android_stb_connect.R.layout.activity_tab_bar);
        urlMedia = findViewById(com.onapptv.android_stb_connect.R.id.urlmedia);
        Zap = findViewById(com.onapptv.android_stb_connect.R.id.zap);
        RecordStart = findViewById(com.onapptv.android_stb_connect.R.id.recordstart);
        RecordStop = findViewById(com.onapptv.android_stb_connect.R.id.recordstop);
        BookList = findViewById(com.onapptv.android_stb_connect.R.id.booklist);
        GetStatus = findViewById(com.onapptv.android_stb_connect.R.id.getstatus);
        SwitchCodeStream = findViewById(com.onapptv.android_stb_connect.R.id.switchcodestream);
        Standby = findViewById(com.onapptv.android_stb_connect.R.id.standby);
        inputText = findViewById(com.onapptv.android_stb_connect.R.id.edittext);
    }

//    public void initButtons() {
//        Zap.setOnClickListener(v -> zap());
//        RecordStart.setOnClickListener(v -> URLMediaButtonAction());
//    }
//
//    public void zap() {
//        Api_Implementation.sharedManager().hIG_SetZap(inputText.getText().toString(), null);
//    }
//
//    public void URLMediaButtonAction() {
//        ArrayList listUrl = new ArrayList();
//        ArrayList listNames = new ArrayList();
//        listNames.add("FIGHTCLUB");
//        listNames.add("ALIEN");
//        listNames.add("AVENGERS");
//        listNames.add("ANTMEN");
//        listNames.add("ARGO");
//        listNames.add("WonderfulLife");
//        listNames.add("RAID2");
//        listNames.add("BREAKINGBAD");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Fight-Club/HLS-2500/Fight-Club.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Alien-Covenant/HLS-2500/Alien-Covenant.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Avengers-Age-of-Ultron/HLS-2500/Avengers-Age-of-Ultron.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Ant-Man-Trialer/HLS-2500/Ant-Man-Trialer.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Argo-Trailer/HLS-2500/Argo-Trailer.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Trailer-Wonderful-Life/HLS-2500/Trailer-Wonderful-Life.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/The-Raid-2-Trailer/HLS-2500/The-Raid-2-Trailer.m3u8");
//        listUrl.add("http://192.168.10.172/hermes/HLS/Breaking-Bad/HLS-2500/Breaking-Bad.m3u8");
//
//        Api.sharedManager().hIG_GetUSBDisks((Api.OnArrayCallbackBlock) null);
//        Api.sharedManager().hIG_GetSTBStatus((Api.OnSTBStatusCallbackBlock) null);
//        Api.sharedManager().hIG_PlayMediaStart(0, listUrl.get(currentIndex).toString(), null);
//
//        inputText.setText(listNames.get(currentIndex).toString());
//        if (currentIndex == listNames.size() - 1) {
//            currentIndex = 0;
//        }
//        else {
//            currentIndex++;
//        }
//
//        Api.sharedManager().hIG_GetMediaInfo((Api.OnMediaInfoCallbackBlock) null);
//        Api.sharedManager().hIG_PlayMediaGetPosition((Api.OnIntValueCallbackBlock) null);
//
//    }
//
//    public void settingButtonAction() {
//        ArrayList arr = new ArrayList();
//        for(int i = 1; i < 10; i++) {
//            BookListModel book = new BookListModel();
//            RecordModel record = new RecordModel();
//            record.lCN = i;
//            record.startTime = Calendar.getInstance().getTime();
//            record.duration = 100;
//            record.recordMode = 1;
//            record.recordName = "Test" + i;
//            book.record = record;
//            book.metaData = "{\n  \"endtime\" : \"22:45\",\n  \"starttime\" : \"20:00\",\n  \"title\" : \"Pearl Harbor\",\n  \"image\" : \"http:\\/\\/192.168.10.172\\/epg\\/Cinemax\\/PearlHarborPosterLong.jpg\",\n  \"subTitle\" : \"Movie\"\n}";
//            arr.add(book);
//        }
//
//        Api.sharedManager().hIG_SetPvrBookList(arr, (aBoolean, s) -> {
//
//        });
//    }
//
//    public void closeStb() {
//        Api.sharedManager().hIG_STBStandby();
//    }
//
//    public void recordStart() {
//        Api.sharedManager().hIG_GetUSBDisks((Api.OnArrayCallbackBlock) arrayList -> {
//            if (arrayList.size() != 0) {
//                DiskModel diskModel = (DiskModel) arrayList.get(arrayList.size() - 1);
//                PartitonModel partitonModel = diskModel.getPartitionArr().get(diskModel.getPartitionArr().size() - 1);
//
//                Api.sharedManager().hIG_SetPvrPath(partitonModel, (aBoolean, s) -> {
//                    if (aBoolean) {
//                        RecordModel record = new RecordModel();
//                        int num = Integer.parseInt(inputText.getText().toString());
//                        record.lCN = num;
//                        record.startTime = Calendar.getInstance().getTime();
//                        record.duration = 0;
//                        record.recordMode = 0;
//                        record.recordName = "TEST" + inputText.getText().toString();
//                        String meta = "{\n  \"endtime\" : \"22:45\",\n  \"starttime\" : \"20:00\",\n  \"title\" : \"Pearl Harbor\",\n  \"image\" : \"http:\\/\\/192.168.10.172\\/epg\\/Cinemax\\/PearlHarborPosterLong.jpg\",\n  \"subTitle\" : \"Movie\"\n}";
//
//                        Api.sharedManager().hIG_RecordPvrStart(record, meta, (aBoolean1, s1) -> {
//                            // TODO:
//                        });
//                    }
//                });
//            }
//        });
//    }
//
//    public void recordStop() {
//        Api.sharedManager().hIG_RecordPvrStop((Api.OnStringCallbackBlock) null);
//    }
//
//    boolean isSwitch = true;
//
//    public void switchCodeStream() {
//        Api.sharedManager().hIG_switchCodeStream(isSwitch, (aBoolean, s) -> {
//
//        });
//
//        isSwitch = !isSwitch;
//    }
//
//    public void asd() {
//        Api.sharedManager().hIG_GetSTBStatus((b, arrayList, i, s) -> {
//
//        });
//    }
//
//    public void pushAVStream() throws JSONException {
//        JSONObject object = new JSONObject();
//        object.put("enable", "1");
//        Api.sharedManager().hIG_STBSetPushAVStreamWithEnable(object.toString(), s -> {
//
//        });
//    }
//
//    public void upgrade() {
//        Api.sharedManager().hIG_STBUpgradeSoftware(Api.sharedManager().getCurrentSTBInfo().softwareVersion + 1,
//                "/upgrade/image.bin");
//    }
//
//    public void upgradeFileDownloadProgress() {
//        Api.sharedManager().hIG_MediaDownloadGetProgress("/data/upgrade",
//                "http://192.168.10.172/image.bin",
//                (aBoolean, s, i) -> {
//                    if (aBoolean) inputText.setText(i);
//                });
//    }
//
//    public void upgradeFileDownload() {
//        Api.sharedManager().hIG_MediaDownloadStart("/data/upgrade",
//                "http://192.168.10.172/image.bin",
//                (aBoolean, s) -> {
//
//                });
//    }
//
//    public void upgradeFileRemove() {
//        Api.sharedManager().hIG_USBRemove("/data/upgrade",
//                (aBoolean, s) -> {
//
//                });
//    }
//
//    void lockScreenSettings() {
//        selectIndex = 0;
//
//    }
//
//    void playStart() throws JSONException {
//        JSONObject currentObj = data.get(selectIndex);
//
//        Api.sharedManager().hIG_PlayMediaStart(0, currentObj.getString("address"), new Api.OnSuccessCallbackBlock() {
//            @Override
//            public void OnSuccessCallback(Boolean aBoolean, String s) {
//                if (aBoolean) {
//                    if (!mediaPlayer.isPlaying()) mediaPlayer.start();
//                }
//            }
//        });
//    }
//
//    void getDisplayMessage(int index) {
//        // TODO :
//    }
//
//    void loadData() throws JSONException {
//        data = new ArrayList<>();
//
//        JSONObject obj1 = new JSONObject("{\"address\":\"http://192.168.10.172/hermes/HLS/Avengers-Age-of-Ultron/HLS-2500/Avengers-Age-of-Ultron.m3u8\",\"Title\":\"Avengers Age of Ultron\",\"Artist\":\"Marvel\",\"AlbumTitle\":\"The Avengers\",\"AlbumArtist\":\"Marvel\",\"Image\":\"http://192.168.10.172/svod/Movies/TheAvengers/TheAvengersPosterSquare.jpg\"}");
//        JSONObject obj2 = new JSONObject("{\"address\":\"http://192.168.10.172/hermes/HLS/Fight-Club/MAINFight-Club.m3u8\",\"Title\":\"Fight-Club\",\"Artist\":\"David Fincher\",\"AlbumTitle\":\"Action\",\"AlbumArtist\":\"David Fincher\",\"Image\":\"http://192.168.10.172/tvod/Movies/FlightClub/FlightClubPosterSquare.jpg\"}");
//        JSONObject obj3 = new JSONObject("{\"address\":\"http://192.168.10.172/hermes/HLS/Alien-Covenant/HLS-2500/Alien-Covenant.m3u8\",\"Title\":\"Alien Convenant\",\"Artist\":\"Ridley Scott\",\"AlbumTitle\":\"Science Fiction\",\"AlbumArtist\":\"Ridley Scott\",\"Image\":\"http://192.168.10.172/tvod/Movies/AlienConvenant/AlienConvenantPosterSquare.jpg\"}");
//        JSONObject obj4 = new JSONObject("{\"address\":\"http://192.168.10.172/hermes/HLS/Argo-Trailer/HLS-2500/Argo-Trailer.m3u8\",\"Title\":\"Argo\",\"Artist\":\"Ben Affleck\",\"AlbumTitle\":\"Drama\",\"AlbumArtist\":\"Ben Affleck\",\"Image\":\"http://192.168.10.172/tvod/Movies/Argo/ArgoPosterSquare.jpg\"}");
//        JSONObject obj5 = new JSONObject("{\"address\":\"http://192.168.10.172/hermes/HLS/The-Raid-2-Trailer/HLS-2500/The-Raid-2-Trailer.m3u8\",\"Title\":\"The Raid 2\",\"Artist\":\"Gareth Evans\",\"AlbumTitle\":\"Action\",\"AlbumArtist\":\"Gareth Evans\",\"Image\":\"http://192.168.10.172/tvod/Movies/TheRaid2/TheRaid2PosterSquare.jpg\"}");
//        data.add(obj1);
//        data.add(obj2);
//        data.add(obj3);
//        data.add(obj4);
//        data.add(obj5);
//    }
}
