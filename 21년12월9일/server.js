const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))

app.listen(8080,function(){
    console.log('listening on 8080')
});

// 누군가가 /pet 으로 방문을 하면..
// pet 관련된 안내문을 띄워주자

app.get('/pet',function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

// 누군가가 /beauty 으로 방문하면
// 뷰티용품 사세요 라는 안내문을 띄워주자

app.get('/beauty',function(요청, 응답){
    응답.send('뷰티용품 사세요');
});

// 홈페이지로 접속하면
// 파일보내기

app.get('/',function(요청, 응답){
    응답.sendFile(__dirname + '/index.html');
});

app.get('/write',function(요청, 응답){
    응답.sendFile(__dirname + '/write.html');
});

// 어떤 사람이 /add 경로로 POST 요청을 하면...
// ??를 해주세요~

app.post('/add',function(요청,응답){
    응답.send('전송완료');
    console.log(요청.body.title);
    console.log(요청.body.date);
});

// post했으니 이제 db에 저장해주세요를 해보자~



