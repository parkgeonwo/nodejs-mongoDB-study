const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient;
app.set('view engine','ejs');


// data에 의해 변하지않는 static한 파일은 보통 public 아래에 보관한다 (ex. css)
// css는 요청이랑 응답사이에 있는 미들웨어 자바스크립트를를 적어줘야한다.
app.use('/public',express.static('public')); // 나는 static 파일을 보관하기 위해 public 폴더를 쓸거다.


// 어떤 데이터 베이스에 저장할건지 변수 지정
var db;

// 클라우드 연결

MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.zrt9g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',function(에러,client){
    // 연결되면 할일
    
    // 만약 에러가 난다면
    if(에러) return console.log(에러)

    // todoapp이라는 database(폴더)에 연결좀요 // todoapp이라는 db로 연결
    db = client.db('todoapp');

    // DB에 이름과 나이 저장해보자 // object 형태로 저장
    // post라는 파일에 insertOne{자료}
    // db.collection('post').insertOne({이름:'John',나이:20},function(에러,결과){
    //     console.log('저장완료');
    // })

    // 8080 port 개설
    app.listen(8080,function(){
    console.log('listening on 8080')
    });
})




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
// index.html 파일보내기
app.get('/',function(요청, 응답){
    응답.render('index.ejs');
});

// write.html 보내기
app.get('/write',function(요청, 응답){
    // 응답.sendFile(__dirname + '/write.html');  // html 파일이라면
    응답.render('write.ejs' ); // ejs 파일이라면
});




// 어떤 사람이 /add 경로로 POST 요청을 하면...
// ??를 해주세요~

// app.post('/add',function(요청,응답){
//     응답.send('전송완료');
//     console.log(요청.body.title);
//     console.log(요청.body.date);
// });

// 어떤 사람이 /add 라는 경로로 post 요청을 하면,
// 데이터 2개 (날짜, 제목)을 보내주는데,
// 이때, 'post'라는 이름을 가진 collection에 두개 데이터를 저장하기 // {제목:'어쩌구',날짜:'어쩌구'} // id를 1씩증가시키면서
app.post('/add',function(요청,응답){
    // 화면에 전송완료라고 보여주기
    응답.send('전송완료');

    // todoapp의 counter라는 collection의 "게시물갯수"라는 이름을 가진 데이터의 totalPost를 가져오자.
    // DB.counter 내의 총게시물 갯수 찾음
    db.collection("counter").findOne({name:"게시물갯수"},function(에러,결과){
        console.log(결과.totalPost);
        // 총게시물갯수라는 변수에 결과.totalPost;를 넣어준다.
        var 총게시물갯수 = 결과.totalPost;

        // todoapp이라는 db에 post라는 collection에다가 요청.body.title과 요청.body.date를 넣어주자 , id는 총게시물갯수+1
        // DB.post에 새게시물 기록함
        db.collection('post').insertOne({_id : 총게시물갯수 + 1,제목:요청.body.title,날짜:요청.body.date},function(에러,결과){
            //터미널에 저장완료 띄워주기
            console.log('저장완료');
            // counter라는 콜렉션에 있는 totalPost라는 항목도 1 증가시켜주자.(수정)
            // updateOne 을 써서 한개만 수정할거고, inc이라는(점차증가) operator를 사용해서 바꿔준다. set은 그냥 변경
            db.collection('counter').updateOne({name:"게시물갯수"},{ $inc : {totalPost:1} },function(에러,결과){
                if (에러) return(console.log(에러))
            });
        });

    });
});




// /list로 get 요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 html 을 보여줌
app.get('/list',function(요청,응답){
    // DB에 저장된 post 라는 collection안의 모든 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러,결과){

        // 가져온 결과를 터미널에서 보기
        console.log(결과);

        // 결과를 list.ejs에다가 posts라는 이름을 써서 넣어주세요
        응답.render('list.ejs', {posts:결과} );

    });
});


// 요청.body에 담겨진 게시물번호를 가진 글을 DB에서 찾아서 삭제해주세요
app.delete('/delete',function(요청,응답){
    console.log(요청.body); // 요청.body = {_id :1}
    요청.body._id = parseInt(요청.body._id); // 요청.body._id 가 문자형으로 변경되서 들어왔으므로 숫자형으로 변경
    // post라는 콜렉션에서 요청.body라는 정보를 가진 데이터를 deleteOne으로 삭제
    db.collection('post').deleteOne( 요청.body, function(에러,결과){
        console.log("삭제완료");

        // 2xx : 성공응답코드 2xx를 보내주세요  // 4xx : 실패응답코드 4xx 보내주세요
        // 서버가 list.ejs로 무조건 응답코드 200을 보내주는거임 성공했다~~라고
        응답.status(200).send({message:"성공했습니다."});  // send를 이용해서 메세지 출력
    });
});


// /detail로 접속하면 detail.ejs 보여줌
// /detail2로 접속하면 detai2.ejs 보여줌
// /detail3로 접속하면 detail3.ejs 보여줌....
// 이건 너무 비효율적이니 /detail/1 이런식으로 만들어보자

app.get('/detail/:id', function(요청,응답){        // 'detail/어쩌구' 로 get 요청을하면~ (":" 의 기능) // parameter라고 부름
    db.collection('post').findOne({ _id : parseInt(요청.params.id) },function(에러,결과){   // "id"가 "요청.params.id(:id)"인 데이터를 불러와주세요 = 결과
        // 대신 int형태로 바꿔줘야한다. string이니까

        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });  // 찾은 결과를 data라는 이름으로 detail.ejs로 보냄 
    })
})



